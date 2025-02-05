import logError from "@/common/logError";
import sgMail from "@sendgrid/mail";
import { sendgridApiKey } from "@/common/env";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const reqs = await req.json();
        sgMail.setApiKey(sendgridApiKey!);
        const msg = {
            to: reqs.to, // Change to your recipient
            from: "noreply@bridgesforpeace.com", // Change to your verified sender
            bcc: "ronaga@bridgesforpeace.com",
            subject: "Thank you for contacting Bridges for Peace",
            html: reqs.body,
        };
        await sgMail
            .send(msg)
            .then((e) => {
                return NextResponse.json({ res: e }, { status: 200 });
            })
            .catch((error) => {
                return NextResponse.json({ res: "Failed to add record" }, { status: 501 });
            });
        return NextResponse.json({ res: "Failed to add record" }, { status: 501 });
    } catch (e: any) {
        console.log(e);
        logError(e, { req: req.body }, "sendConfirmationEmail");
        return NextResponse.json({ error: "Server error" }, { status: 505 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
