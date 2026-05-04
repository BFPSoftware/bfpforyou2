import { NextRequest, NextResponse } from "next/server";
import logError from "@/common/logError";
import { FacApplicationAppID, FacApplicationOriginalResponsesAppID } from "@/common/env";
import client from "@/hooks/useKintone";

export async function POST(req: NextRequest) {
    try {
        const reqs = await req.json();
        // upload id can be used only once, so not using it here
        const reqsNoPhoto = { ...reqs };
        delete reqsNoPhoto.photo;
        const resp = await client.record.addRecord({
            app: FacApplicationOriginalResponsesAppID!,
            record: reqsNoPhoto,
        });
        const originalResponseRecordID = resp.id;
        const resp2 = await client.record.addRecord({
            app: FacApplicationAppID!,
            record: { ref: { value: originalResponseRecordID }, ...reqs },
        });
        if (!resp) {
            return NextResponse.json({ res: "Failed to add record" }, { status: 501 });
        } else {
            return NextResponse.json(resp);
        }
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
                logError(e, { req: req.body, expiredFileError }, "postKintone_fac");
                return NextResponse.json(
                    { error: "One or more files have expired. Please re-upload the files and try again." },
                    { status: 400 }
                );
            }
        }
        
        logError(e, { req: req.body }, "postKintone");
        return NextResponse.json({ error: "Server error" }, { status: 505 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
