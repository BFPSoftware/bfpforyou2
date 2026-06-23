import logError from "@/common/logError";
import { FachighType } from "../schema/fachighSchema";
import sendConfirmationEmail_high from "@/hooks/confirmation/fac/sendConfirmationEmail_high";
import { needsReupload, isFileLost, FileWithMeta } from "@/lib/utils";

const normalizeOptionalPhoto = (photo: FileWithMeta): FileWithMeta => {
    if (!photo?.fileKey) return null;
    if (needsReupload(photo) || isFileLost(photo)) return null;
    return photo;
};

const joinNonEmpty = (...parts: (string | undefined | null | false)[]) =>
    parts
        .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
        .join("\n");

export const combineFachighAnswers = (f: FachighType) => {
    return {
        introduction: joinNonEmpty(
            f.introLiveWith,
            f.introHasSiblings === "Yes" ? "Yes, I have…" : "No, I do not have any siblings.",
            f.introHasSiblings === "Yes" ? f.introHowManySiblings : undefined
        ),
        aboutSchool: joinNonEmpty(f.schoolLikeFor, f.schoolGoodChallenging),
        personalLife: joinNonEmpty(f.personalFreeTime, f.personalHobbies),
        future: joinNonEmpty(
            f.futureHasPlans === "Yes" ? "Yes, I do." : "No, I don't.",
            f.futureHasPlans === "Yes" ? f.futureBecome : f.futureDesire,
            f.futureTenYears
        ),
        scholarship: joinNonEmpty(f.scholarshipReason),
    };
};

const convertMonthShortToMonthLong = (month: string) => {
    switch (month) {
        case "Jan":
            return "January";
        case "Feb":
            return "February";
        case "Mar":
            return "March";
        case "Apr":
            return "April";
        case "May":
            return "May";
        case "Jun":
            return "June";
        case "Jul":
            return "July";
        case "Aug":
            return "August";
        case "Sep":
            return "September";
        case "Oct":
            return "October";
        case "Nov":
            return "November";
        case "Dec":
            return "December";
        default:
            return "unknown";
    }
};

const zeroPad = (num: string) => {
    return num.padStart(2, "0");
};

const convertLanguage = (language: string) => {
    switch (language) {
        case "en":
            return "English";
        case "he":
            return "Hebrew";
        case "ru":
            return "Russian";
        case "es":
            return "Spanish";
        case "fr":
            return "French";
    }
};

const createAddRecord = (formResponse: FachighType) => {
    const combined = combineFachighAnswers(formResponse);
    return {
        // Section 1
        ticket: { value: formResponse.ticket },
        applicationType: { value: formResponse.applicationType },
        submitLang: { value: convertLanguage(formResponse.submitLang) },
        firstName: { value: formResponse.firstName },
        lastName: { value: formResponse.lastName },
        tz: { value: formResponse.tz },
        birthday: { value: `${convertMonthShortToMonthLong(formResponse.birthday.month)} ${zeroPad(formResponse.birthday.day)}, ${formResponse.birthday.year}` },
        age: { value: formResponse.age },
        photo: { value: formResponse.photo?.fileKey ? [{ fileKey: formResponse.photo.fileKey }] : [] },
        grade: { value: formResponse.grade },
        originCountry: { value: formResponse.originCountry },
        school: { value: formResponse.school },
        returning: { value: formResponse.returning },
        madeAliyah: { value: formResponse.madeAliyah },
        // Section 2
        introduction: { value: combined.introduction },
        aboutSchool: { value: combined.aboutSchool },
        personalLife: { value: combined.personalLife },
        future: { value: combined.future },
        scholarship: { value: combined.scholarship },
        // Section 3
        submittedBy: { value: formResponse.submittedBy },
        relationship: { value: formResponse.relationship },
        check1: { value: formResponse.check1 },
        check2: { value: formResponse.check2 },
    };
};

export const handleSubmit_fachigh = async (formResponse: FachighType, t: any) => {
    try {
        formResponse.photo = normalizeOptionalPhoto(formResponse.photo ?? null);

        const addRecord = createAddRecord(formResponse);
        const res = await fetch("/api/kintone/postKintone_fac", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(addRecord),
        });
        if (await res.ok) {
            const combined = combineFachighAnswers(formResponse);
            // Send email asynchronously (non-blocking) to avoid Vercel 10s timeout
            // Don't await - let it run in background
            sendConfirmationEmail_high(formResponse, t, combined).catch((error) => {
                console.error("[handleSubmit_fachigh] Email sending failed (non-blocking):", error);
                // Email failure is logged but doesn't affect form submission success
            });
            return true;
        } else {
            return false;
        }
    } catch (e) {
        void logError(e, formResponse, "handleSubmit_fachigh");
        return false;
    }
};
