import logError from "@/common/logError";
import template_immigrant from "@/components/email/template_immigrant";
import { ImmigrantType } from "@/features/forms/immigrant/schema/immigrantSchema";

const sendConfirmationEmail = async (formResponse: ImmigrantType, t: any) => {
    const body = template_immigrant(formResponse, t);
    const res = await fetch("/api/sendgrid/sendConfirmationEmail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ body, to: formResponse.email }),
    });
    if (await res.ok) {
        return true;
    } else {
        logError(res, { formResponse }, "sendConfirmationEmail");
        return false;
    }
};
export default sendConfirmationEmail;
