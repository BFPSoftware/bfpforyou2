import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FachighType } from "@/features/forms/fac/schema/fachighSchema";
import template_fachigh from "@/components/email/template_fachigh";
import { coordinatorEmails } from "@/lib/email-config";
import type { ConfirmationEmailPayload } from "./sendConfirmationEmail_elem";

/** Build confirmation email payload for the FAC submit API (sent server-side after Kintone save). */
export const buildConfirmationEmail_high = (
    formResponse: FachighType,
    t: Dictionary,
    combined: {
        introduction: string;
        aboutSchool: string;
        personalLife: string;
        future: string;
        scholarship: string;
    }
): ConfirmationEmailPayload => ({
    to: coordinatorEmails.highschool,
    subject: "[bfpforyou]New High School Application",
    html: template_fachigh(formResponse, t, combined),
});
