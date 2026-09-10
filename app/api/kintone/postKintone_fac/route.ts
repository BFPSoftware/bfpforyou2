import { NextRequest, NextResponse } from "next/server";
import logError from "@/common/logError";
import { FacApplicationAppID, FacApplicationOriginalResponsesAppID } from "@/common/env";
import client from "@/hooks/useKintone";
import { translateFacRecord } from "@/lib/fac/azureTranslation";
import { sendEmail } from "@/lib/email-service";

type ConfirmationEmailPayload = {
    to?: string;
    subject?: string;
    html?: string;
};

function parseFacPostBody(body: unknown): {
    record: Record<string, { value: unknown }>;
    confirmationEmail?: ConfirmationEmailPayload;
} {
    if (!body || typeof body !== "object") {
        return { record: {} };
    }
    const obj = body as Record<string, unknown>;
    // New shape: { record, confirmationEmail }
    if (obj.record && typeof obj.record === "object") {
        return {
            record: obj.record as Record<string, { value: unknown }>,
            confirmationEmail: obj.confirmationEmail as ConfirmationEmailPayload | undefined,
        };
    }
    // Legacy shape: body is the Kintone record itself
    return { record: obj as Record<string, { value: unknown }> };
}

export async function POST(req: NextRequest) {
    try {
        const raw = await req.json();
        const { record: reqs, confirmationEmail } = parseFacPostBody(raw);

        // upload id can be used only once, so not using it here
        const reqsNoPhoto = { ...reqs };
        delete reqsNoPhoto.photo;
        const resp = await client.record.addRecord({
            app: FacApplicationOriginalResponsesAppID!,
            record: reqsNoPhoto,
        });
        const originalResponseRecordID = resp.id;
        const translatedReqs = await translateFacRecord(reqs);
        await client.record.addRecord({
            app: FacApplicationAppID!,
            record: { ref: { value: originalResponseRecordID }, ...translatedReqs },
        });
        if (!resp) {
            return NextResponse.json({ res: "Failed to add record" }, { status: 501 });
        }

        // Send confirmation on the server after save so client navigation cannot abort it.
        if (confirmationEmail?.to && confirmationEmail?.subject && confirmationEmail?.html) {
            try {
                await sendEmail({
                    to: confirmationEmail.to,
                    subject: confirmationEmail.subject,
                    html: confirmationEmail.html,
                });
            } catch (emailError) {
                void logError(
                    emailError,
                    {
                        to: confirmationEmail.to,
                        subject: confirmationEmail.subject,
                        ticket: (reqs.ticket as { value?: string } | undefined)?.value,
                    },
                    "postKintone_fac.confirmationEmail"
                );
                // Record already saved — do not fail the submit response.
            }
        }

        return NextResponse.json(resp);
    } catch (e: any) {
        console.log(e);
        console.log("e.errors", e.errors);

        // Check for expired file key errors
        if (e.errors && Array.isArray(e.errors)) {
            const expiredFileError = e.errors.find(
                (error: any) =>
                    error.message?.includes("fileKey") ||
                    error.message?.includes("expired") ||
                    error.message?.includes("invalid") ||
                    error.code === "CB_FV01" // Kintone file validation error code
            );

            if (expiredFileError) {
                logError(e, { expiredFileError }, "postKintone_fac");
                return NextResponse.json(
                    { error: "One or more files have expired. Please re-upload the files and try again." },
                    { status: 400 }
                );
            }
        }

        logError(e, {}, "postKintone_fac");
        return NextResponse.json({ error: "Server error" }, { status: 505 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
