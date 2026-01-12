import { NextRequest, NextResponse } from "next/server";
import logError from "@/common/logError";
import { BeneficiaryApplicationFormAppID } from "@/common/env";
import client from "@/hooks/useKintone";

export async function POST(req: NextRequest) {
    try {
        const reqs = await req.json();
        const resp = await client.record.addRecord({
            app: BeneficiaryApplicationFormAppID!,
            record: reqs,
        });
        console.log("resp", resp);
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
                logError(e, { req: req.body, expiredFileError }, "postKintone");
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
