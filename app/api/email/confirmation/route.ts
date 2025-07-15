import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-service";
import logError from "@/common/logError";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { to, subject, html } = data;

        await sendEmail({
            to,
            subject,
            html,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        logError(error, { request }, "confirmation-email-api");
        return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 500 });
    }
}
