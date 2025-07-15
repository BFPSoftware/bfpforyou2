import { Dictionary } from "@/common/locales/Dictionary-provider";
import { ImmigrantType } from "@/features/forms/immigrant/schema/immigrantSchema";
import template_immigrant from "@/components/email/template_immigrant";
import logError from "@/common/logError";

const sendConfirmationEmail = async (formResponse: ImmigrantType, t: Dictionary) => {
    try {
        const html = template_immigrant(formResponse, t);

        const res = await fetch("/api/email/confirmation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: formResponse.email,
                subject: "[bfpforyou]Thank you for your application",
                html: html,
            }),
        });

        if (!res.ok) {
            throw new Error("Failed to send confirmation email");
        }
    } catch (e) {
        logError(e, formResponse, "sendConfirmationEmail_immigrant");
    }
};
export default sendConfirmationEmail;
