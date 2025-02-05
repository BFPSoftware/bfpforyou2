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
        logError(e, { req: req.body }, "postKintone");
        return NextResponse.json({ error: "Server error" }, { status: 505 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
