import sendConfirmationEmail_elem from "@/hooks/confirmation/fac/sendConfirmationEmail_elem";
import { FacelemType } from "../schema/facelemSchema";
import logError from "@/common/logError";

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

const createAddRecord = (formResponse: FacelemType) => {
    return {
        // Section 1
        ticket: { value: formResponse.ticket },
        applicationType: { value: formResponse.applicationType },
        submitLang: { value: convertLanguage(formResponse.submitLang) },
        firstName: { value: formResponse.firstName },
        lastName: { value: formResponse.lastName },
        tz: { value: formResponse.tz },
        birthday: { value: `${convertMonthShortToMonthLong(formResponse.birthday.month)} ${formResponse.birthday.day}, ${formResponse.birthday.year}` },
        age: { value: formResponse.age },
        photo: { value: [{ fileKey: formResponse.photo?.fileKey }] },
        grade: { value: formResponse.grade },
        originCountry: { value: formResponse.originCountry },
        elemSchool: { value: formResponse.elemSchool },
        returning: { value: formResponse.returning },
        // Section 2
        familyMembers: { value: formResponse.familyMembers },
        brothers: { value: formResponse.brothers },
        sisters: { value: formResponse.sisters },
        isfrom: { value: formResponse.isfrom },
        languageAtHome: { value: formResponse.languageAtHome },
        aboutFamily: { value: formResponse.aboutFamily },
        // Section 3
        favoriteSubject: { value: formResponse.favoriteSubject },
        challengingSubject: { value: formResponse.challengingSubject },
        aboutMyTeacher: { value: formResponse.aboutMyTeacher },
        aboutMeFromTeacher: { value: formResponse.aboutMeFromTeacher },
        // Section 4
        nickname: { value: formResponse.nickname },
        favoriteColor: { value: formResponse.favoriteColor },
        favoriteFood: { value: formResponse.favoriteFood },
        hobbies: { value: formResponse.hobbies },
        interests: { value: formResponse.interests },
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
        const addRecord = createAddRecord(formResponse);
        const res = await fetch("/api/kintone/postKintone_fac", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(addRecord),
        });
        if (await res.ok) {
            sendConfirmationEmail_elem(formResponse, t);
            return true;
        } else {
            alert("Something went wrong, please try again. If the problem persists, please contact us.");
            return false;
        }
    } catch (e) {
        logError(e, formResponse, "handleSubmit_facelem");
    }
};
