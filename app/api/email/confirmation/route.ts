import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-service";
import logError from "@/common/logError";

export async function POST(request: Request) {
    try {
        // Check if request has a body
        const contentType = request.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("[confirmation-email-api] Invalid content-type:", contentType);
            return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 });
        }

        // Get the raw body text first to check if it's empty
        const text = await request.text();
        if (!text || text.trim().length === 0) {
            console.error("[confirmation-email-api] Empty request body");
            return NextResponse.json({ error: "Request body is empty" }, { status: 400 });
        }

        // Parse JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            console.error("[confirmation-email-api] JSON parse error:", {
                error: parseError,
                bodyText: text.substring(0, 200), // Log first 200 chars for debugging
            });
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
        }

        // Validate required fields
        const { to, subject, html } = data;
        if (!to || !subject || !html) {
            console.error("[confirmation-email-api] Missing required fields:", {
                hasTo: !!to,
                hasSubject: !!subject,
                hasHtml: !!html,
                dataKeys: Object.keys(data || {}),
            });
            return NextResponse.json({ error: "Missing required fields: to, subject, and html are required" }, { status: 400 });
        }

        console.log("[confirmation-email-api] Sending email:", {
            to: to,
            subject: subject,
            htmlLength: html?.length || 0,
        });

        await sendEmail({
            to,
            subject,
            html,
        });

        console.log("[confirmation-email-api] Email sent successfully");
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[confirmation-email-api] Error:", {
            error: error,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
        });
        logError(error, { request }, "confirmation-email-api");
        return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 500 });
    }
}
