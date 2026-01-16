import logError from "@/common/logError";
import { FacelemType } from "../schema/facelemSchema";
import sendConfirmationEmail_elem from "@/hooks/confirmation/fac/sendConfirmationEmail_elem";
import { checkAndReuploadFile, needsReupload, isFileLost } from "@/lib/utils";

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

const createAddRecord = (formResponse: FacelemType) => {
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
        // photo: { value: formResponse.photo?.fileKey ? [{ fileKey: formResponse.photo.fileKey }] : [] }, // COMMENTED OUT: Photo upload field - can be restored if needed
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
        // COMMENTED OUT: Photo upload validation - can be restored if needed
        // Check photo for expiration or loss, even if file object is missing
        // if (formResponse.photo && needsReupload(formResponse.photo)) {
        //     if (isFileLost(formResponse.photo)) {
        //         // File is lost - user must re-upload
        //         alert("The photo has expired or is missing. Please re-upload the photo before submitting the form.");
        //         return false;
        //     } else if (formResponse.photo.file) {
        //         // File exists but is expired - try to re-upload
        //         const reuploaded = await checkAndReuploadFile(formResponse.photo);
        //         if (reuploaded === null) {
        //             // Re-upload failed - user must re-upload
        //             alert("The photo has expired and could not be automatically re-uploaded. Please re-upload the photo before submitting the form.");
        //             return false;
        //         } else {
        //             // Update with new fileKey
        //             formResponse.photo = reuploaded;
        //         }
        //     } else {
        //         // File is expired and missing - user must re-upload
        //         alert("The photo has expired or is missing. Please re-upload the photo before submitting the form.");
        //         return false;
        //     }
        // }

        const addRecord = createAddRecord(formResponse);
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
            // Check for specific error messages
            try {
                const errorData = await res.json();
                if (errorData.error?.includes("expired")) {
                    alert("One or more files have expired. Please re-upload the files and try again.");
                } else {
                    alert("Something went wrong, please try again. If the problem persists, please contact us.");
                }
            } catch {
                alert("Something went wrong, please try again. If the problem persists, please contact us.");
            }
            return false;
        }
    } catch (e) {
        logError(e, formResponse, "handleSubmit_facelem");
        return false;
    }
};
