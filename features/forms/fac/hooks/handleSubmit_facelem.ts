import logError from "@/common/logError";
import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FacelemType } from "../schema/facelemSchema";
import sendConfirmationEmail_elem from "@/hooks/confirmation/fac/sendConfirmationEmail_elem";
import { needsReupload, isFileLost, FileWithMeta } from "@/lib/utils";

/** Photo is optional — drop expired or unusable metadata instead of blocking submit. */
const normalizeOptionalPhoto = (photo: FileWithMeta): FileWithMeta => {
    if (!photo?.fileKey) return null;
    if (needsReupload(photo) || isFileLost(photo)) return null;
    return photo;
};

type LiveWithKey = FacelemType["liveWith"][number];
const LIVE_WITH_ORDER: LiveWithKey[] = ["Father", "Mother", "Brother", "Sister", "Grandparents", "Other"];

const liveWithOptionLabel = (key: LiveWithKey, t: Dictionary): string => {
    switch (key) {
        case "Father":
            return t.elementary.liveWithFather;
        case "Mother":
            return t.elementary.liveWithMother;
        case "Brother":
            return t.elementary.liveWithBrother;
        case "Sister":
            return t.elementary.liveWithSister;
        case "Grandparents":
            return t.elementary.liveWithGrandparents;
        case "Other":
            return t.elementary.liveWithOtherOption;
    }
};

const countPhrase = (raw: string, oneLabel: string, manyTemplate: string): string => {
    const n = raw.trim();
    if (!n) return "";
    const num = Number.parseInt(n, 10);
    if (Number.isFinite(num) && String(num) === n) {
        return num === 1 ? oneLabel : manyTemplate.replace("{n}", n);
    }
    return n;
};

/** Single-line summary for Kintone `whoDoYouLiveWith`, e.g. `Father, 2 brothers, step-mother`. Omits unchecked options. */
export const buildWhoDoYouLiveWithSummary = (data: FacelemType, t: Dictionary): string => {
    const lw = data.liveWith ?? [];
    if (lw.length === 0) return "";

    const parts: string[] = [];
    for (const key of LIVE_WITH_ORDER) {
        if (!lw.includes(key)) continue;

        if (key === "Brother") {
            const phrase = countPhrase(data.brothers ?? "", t.elementary.liveWithSummaryOneBrother, t.elementary.liveWithSummaryBrothers);
            parts.push(phrase || liveWithOptionLabel(key, t));
            continue;
        }
        if (key === "Sister") {
            const phrase = countPhrase(data.sisters ?? "", t.elementary.liveWithSummaryOneSister, t.elementary.liveWithSummarySisters);
            parts.push(phrase || liveWithOptionLabel(key, t));
            continue;
        }
        if (key === "Other") {
            const o = data.liveWithOther?.trim();
            if (o) parts.push(o);
            continue;
        }
        parts.push(liveWithOptionLabel(key, t));
    }
    return parts.join(", ");
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

const createAddRecord = (formResponse: FacelemType, t: Dictionary) => {
    const whoDoYouLiveWithSummary = buildWhoDoYouLiveWithSummary(formResponse, t).trim();

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
        elemSchool: { value: formResponse.elemSchool },
        returning: { value: formResponse.returning },
        madeAliyah: { value: formResponse.madeAliyah },
        // Section 2
        familyMembers: { value: formResponse.familyMembers },
        liveWith: { value: formResponse.liveWith },
        ...(whoDoYouLiveWithSummary ? { whoDoYouLiveWith: { value: whoDoYouLiveWithSummary } } : {}),
        brothers: { value: formResponse.brothers ?? "" },
        sisters: { value: formResponse.sisters ?? "" },
        liveWithOther: { value: formResponse.liveWithOther ?? "" },
        isfrom: { value: formResponse.isfrom },
        languageAtHome: { value: formResponse.languageAtHome },
        aboutFamily: { value: formResponse.aboutFamily },
        // Section 3
        favoriteSubject: { value: formResponse.favoriteSubject },
        challengingSubject: { value: formResponse.challengingSubject },
        aboutMyTeacher: { value: formResponse.aboutMyTeacher ?? "" },
        aboutMeFromTeacher: { value: formResponse.aboutMeFromTeacher },
        enjoySchoolWhy: { value: formResponse.enjoySchoolWhy },
        // Section 4
        favoriteColor: { value: formResponse.favoriteColor },
        favoriteFood: { value: formResponse.favoriteFood },
        hobbies: { value: formResponse.hobbies },
        makesMeHappy: { value: formResponse.makesMeHappy },
        makesMeSad: { value: formResponse.makesMeSad },
        loveMost: { value: formResponse.loveMost },
        futureDreams: { value: formResponse.futureDreams },
        // Section 5
        familysituation: { value: formResponse.familysituation },
        schoolsituation: { value: formResponse.schoolsituation },
        // Section 6
        submittedBy: { value: formResponse.submittedBy },
        relationship: { value: formResponse.relationship },
        check1: { value: formResponse.check1 },
        check2: { value: formResponse.check2 },
    };
};

export const handleSubmit_facelem = async (formResponse: FacelemType, t: any) => {
    try {
        formResponse.photo = normalizeOptionalPhoto(formResponse.photo ?? null);

        const addRecord = createAddRecord(formResponse, t);
        const res = await fetch("/api/kintone/postKintone_fac", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(addRecord),
        });
        if (await res.ok) {
            // Send email asynchronously (non-blocking) to avoid Vercel 10s timeout
            // Don't await - let it run in background
            sendConfirmationEmail_elem(formResponse, t).catch((error) => {
                console.error("[handleSubmit_facelem] Email sending failed (non-blocking):", error);
                // Email failure is logged but doesn't affect form submission success
            });
            return true;
        } else {
            return false;
        }
    } catch (e) {
        void logError(e, formResponse, "handleSubmit_facelem");
        return false;
    }
};
