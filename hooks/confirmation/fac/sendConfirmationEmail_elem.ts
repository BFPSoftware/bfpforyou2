import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FacelemType } from "@/features/forms/fac/schema/facelemSchema";
import template_facelem from "@/components/email/template_facelem";
import logError from "@/common/logError";
import { getSchoolCoordinatorEmail } from "@/lib/email-config";

const sendConfirmationEmail_elem = async (formResponse: FacelemType, t: Dictionary) => {
    try {
        const html = template_facelem(formResponse, t);
        const coordinatorEmail = getSchoolCoordinatorEmail(formResponse.elemSchool);

        const res = await fetch("/api/email/confirmation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to: coordinatorEmail,
                subject: "[bfpforyou]New Elementary School Application",
                html: html,
            }),
        });

        if (!res.ok) {
            throw new Error("Failed to send confirmation email");
        }
    } catch (e) {
        logError(e, formResponse, "sendConfirmationEmail_elem");
    }
};
export default sendConfirmationEmail_elem;
