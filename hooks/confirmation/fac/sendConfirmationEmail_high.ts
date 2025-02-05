import logError from "@/common/logError";
import template_fachigh from "@/components/email/template_fachigh";
import { FachighType } from "@/features/forms/fac/schema/fachighSchema";

export const coordinatorEmail = {
    highschool: "sharona@kerenbshemesh.org.il",
    bshemesh: "sharona@kerenbshemesh.org.il",
    leviEshkol: [{ email: "sharona@kerenbshemesh.org.il" }, { email: "Galitalex@gmail.com" }],
    zalmanAran: "Osnatsteyer@yahoo.com",
    benZvi: "Veredfree3@gmail.com",
    hadekel: "mlakmilhem@gmail.com",
};
const sendConfirmationEmail_high = async (formResponse: FachighType, t: any) => {
    const emailTo = () => {
        return coordinatorEmail.highschool;
    };
    const body = template_fachigh(formResponse, t);
    const res = await fetch("/api/sendgrid/sendConfirmationEmail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ body, to: [{ email: "onaga.ray@gmail.com" }] }),
    });
    if (await res.ok) {
        return true;
    } else {
        logError(res, { formResponse }, "sendConfirmationEmail");
        return false;
    }
};
export default sendConfirmationEmail_high;
