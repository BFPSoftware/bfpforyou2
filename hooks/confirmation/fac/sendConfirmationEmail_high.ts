import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FachighType } from "@/features/forms/fac/schema/fachighSchema";
import template_fachigh from "@/components/email/template_fachigh";
import logError from "@/common/logError";
import { coordinatorEmails } from "@/lib/email-config";

const sendConfirmationEmail_high = async (formResponse: FachighType, t: Dictionary) => {
    try {
        const html = template_fachigh(formResponse, t);

        const res = await fetch("/api/email/confirmation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: coordinatorEmails.highschool,
                subject: "[bfpforyou]New High School Application",
                html: html,
            }),
        });

        if (!res.ok) {
            throw new Error("Failed to send confirmation email");
        }
    } catch (e) {
        logError(e, formResponse, "sendConfirmationEmail_high");
    }
};
export default sendConfirmationEmail_high;
