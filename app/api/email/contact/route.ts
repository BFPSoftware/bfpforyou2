import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-service";
import template_contactUs from "@/components/email/template_contactUs";
import logError from "@/common/logError";
import { z } from "zod";

const contactPayloadSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(1),
    // Honeypot fields (bots often fill these)
    company: z.string().optional(),
    website: z.string().optional(),
});

function hasHoneypotValue(value: unknown) {
    return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        const parsed = contactPayloadSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const { name, email, message, company, website } = parsed.data;

        // If honeypot fields are filled, silently succeed but do not email (bot submission)
        if (hasHoneypotValue(company) || hasHoneypotValue(website)) {
            return NextResponse.json({ success: true });
        }

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
