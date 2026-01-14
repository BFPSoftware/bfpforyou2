import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FachighType } from "@/features/forms/fac/schema/fachighSchema";
import template_fachigh from "@/components/email/template_fachigh";
import logError from "@/common/logError";
import { coordinatorEmails } from "@/lib/email-config";

const sendConfirmationEmail_high = async (formResponse: FachighType, t: Dictionary) => {
    try {
        console.log("[sendConfirmationEmail_high] Starting email send");
        const html = template_fachigh(formResponse, t);

        const emailData = {
            to: coordinatorEmails.highschool,
            subject: "[bfpforyou]New High School Application",
            html: html,
        };

        console.log("[sendConfirmationEmail_high] Email data:", {
            to: emailData.to,
            subject: emailData.subject,
            htmlLength: emailData.html?.length || 0,
            hasHtml: !!emailData.html,
        });

        const body = JSON.stringify(emailData);
        console.log("[sendConfirmationEmail_high] Request body length:", body.length);

        const res = await fetch("/api/email/confirmation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body,
        });

        console.log("[sendConfirmationEmail_high] Response status:", res.status, res.statusText);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("[sendConfirmationEmail_high] Error response:", {
                status: res.status,
                statusText: res.statusText,
                errorText: errorText,
            });
            throw new Error(`Failed to send confirmation email: ${res.status} ${res.statusText}`);
        }

        const responseData = await res.json();
        console.log("[sendConfirmationEmail_high] Email sent successfully:", responseData);
    } catch (e) {
        console.error("[sendConfirmationEmail_high] Exception:", {
            error: e,
            errorMessage: e instanceof Error ? e.message : String(e),
            errorStack: e instanceof Error ? e.stack : undefined,
        });
        logError(e, formResponse, "sendConfirmationEmail_high");
    }
};
export default sendConfirmationEmail_high;
