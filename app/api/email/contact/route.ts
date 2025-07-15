import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-service";
import template_contactUs from "@/components/email/template_contactUs";
import logError from "@/common/logError";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, email, message } = data;

        const emailHtml = template_contactUs({ name, email, message });

        await sendEmail({
            to: "bencapture@bridgesforpeace.com",
            bcc: "ronaga@bridgesforpeace.com",
            subject: "[bfpforyou] New Message from Contact Us Form",
            html: emailHtml,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        logError(error, { request }, "contact-form-api");
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
