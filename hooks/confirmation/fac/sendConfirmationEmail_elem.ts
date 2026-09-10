import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FacelemType } from "@/features/forms/fac/schema/facelemSchema";
import template_facelem from "@/components/email/template_facelem";
import { getSchoolCoordinatorEmail } from "@/lib/email-config";

export type ConfirmationEmailPayload = {
    to: string;
    subject: string;
    html: string;
};

/** Build confirmation email payload for the FAC submit API (sent server-side after Kintone save). */
export const buildConfirmationEmail_elem = (
    formResponse: FacelemType,
    t: Dictionary
): ConfirmationEmailPayload => ({
    to: getSchoolCoordinatorEmail(formResponse.elemSchool),
    subject: "[bfpforyou]New Elementary School Application",
    html: template_facelem(formResponse, t),
});
