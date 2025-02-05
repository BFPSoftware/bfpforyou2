import logError from "@/common/logError";
import template_facelem from "@/components/email/template_facelem";
import { FacelemType } from "@/features/forms/fac/schema/facelemSchema";

export const coordinatorEmail = {
    highschool: "sharona@kerenbshemesh.org.il",
    bshemesh: "sharona@kerenbshemesh.org.il",
    leviEshkol: [{ email: "sharona@kerenbshemesh.org.il" }, { email: "Galitalex@gmail.com" }],
    zalmanAran: "Osnatsteyer@yahoo.com",
    benZvi: "Veredfree3@gmail.com",
    hadekel: "mlakmilhem@gmail.com",
};
const sendConfirmationEmail_elem = async (formResponse: FacelemType, t: any) => {
    const emailTo = () => {
        switch (formResponse.elemSchool) {
            case "Ben Zvi":
                return coordinatorEmail.benZvi;
            case "HaDekel":
                return coordinatorEmail.hadekel;
            case "Levi Eshkol":
                return coordinatorEmail.leviEshkol;
            case "Zalman Aran":
                return coordinatorEmail.zalmanAran;
            case "Jabutinsky":
            case "Uziel":
            case "Orot - Boys":
            case "Orot - Girls":
                return coordinatorEmail.bshemesh;
        }
    };
    const body = template_facelem(formResponse, t);
    const res = await fetch("/api/sendgrid/sendConfirmationEmail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ body, to: [{ email: "onaga.ray@gmail.com" }, { email: "ronaga@bridgesforpeace.com" }] }),
    });
    if (await res.ok) {
        return true;
    } else {
        logError(res, { formResponse }, "sendConfirmationEmail");
        return false;
    }
};
export default sendConfirmationEmail_elem;
