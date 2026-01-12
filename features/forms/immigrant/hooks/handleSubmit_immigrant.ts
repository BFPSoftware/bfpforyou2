import logError from "@/common/logError";
import { ImmigrantType } from "../schema/immigrantSchema";
import sendConfirmationEmail from "@/hooks/confirmation/immigrant/sendConfirmationEmail";
import { checkAndReuploadFile, needsReupload, isFileLost } from "@/lib/utils";
import { DateTime } from "luxon";

const convertMonthShortToNumber = (month: string) => {
    switch (month) {
        case "Jan":
            return "01";
        case "Feb":
            return "02";
        case "Mar":
            return "03";
        case "Apr":
            return "04";
        case "May":
            return "05";
        case "Jun":
            return "06";
        case "Jul":
            return "07";
        case "Aug":
            return "08";
        case "Sep":
            return "09";
        case "Oct":
            return "10";
        case "Nov":
            return "11";
        case "Dec":
            return "12";
        default:
            return "01";
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

const createAddRecord = (formResponse: ImmigrantType) => {
    return {
        formLang: { value: convertLanguage(formResponse.formLang) },
        ticket: { value: formResponse.ticket },
        firstName: { value: formResponse.firstName },
        lastName: { value: formResponse.lastName },
        IDType: { value: formResponse.idType },
        IDNumber: { value: formResponse.idNumber },
        Attachment1: { value: formResponse.attachment1?.fileKey ? [{ fileKey: formResponse.attachment1.fileKey }] : [] },
        Attachment2: { value: formResponse.attachment2?.fileKey ? [{ fileKey: formResponse.attachment2.fileKey }] : [] },
        Attachment3: { value: formResponse.attachment3?.fileKey ? [{ fileKey: formResponse.attachment3.fileKey }] : [] },
        birthday: { value: `${zeroPad(formResponse.birthday.day)}/${convertMonthShortToNumber(formResponse.birthday.month)}/${formResponse.birthday.year}` },
        gender: { value: formResponse.gender },
        originCity: { value: formResponse.originCity },
        originCountry: { value: formResponse.originCountry },
        language: { value: formResponse.nativeLanguage },
        Phone_Number: { value: formResponse.phone },
        email: { value: formResponse.email },
        address1: { value: formResponse.address1 },
        address2: { value: formResponse.address2 },
        addressCity: { value: formResponse.city },
        addressZip: { value: formResponse.zip },
        MaritalStatus: { value: formResponse.spouse.maritalStatus },
        spouseFirstName: { value: formResponse.spouse.spouseFirstName },
        spouseLastName: { value: formResponse.spouse.spouseFamilyName },
        Spouse_Birthday: {
            value: formResponse.spouse.maritalStatus == "0" ? (formResponse.spouse.spouseBirthday ? `${zeroPad(formResponse.spouse.spouseBirthday.day)}/${convertMonthShortToNumber(formResponse.spouse.spouseBirthday.month)}/${formResponse.spouse.spouseBirthday.year}` : "") : "",
        },
        spouseIDType: { value: formResponse.spouse.spouseIDType },
        spouseID: { value: formResponse.spouse.spouseIDNumber },
        children: {
            value:
                formResponse.children.childStatus == "No"
                    ? []
                    : formResponse.children.childTable &&
                      formResponse.children.childTable.map((child) => {
                          if (!child || !child.childBirthday || !child.childBirthday.month || !child.childBirthday.day) return;
                          const childBirthday = `${zeroPad(child.childBirthday.day)}/${convertMonthShortToNumber(child.childBirthday.month)}/${child.childBirthday.year}`;
                          return {
                              value: {
                                  childFirstName: { value: child.childFirstName },
                                  childLastName: { value: child.childLastName },
                                  childGender: { value: child.childGender },
                                  childDoB: { value: childBirthday },
                                  accompaniedInIsrael: { value: child.childAccompanied },
                              },
                          };
                      }),
        },
        aliyahDate: { value: DateTime.fromISO(formResponse.aliyahDate).toFormat("dd/MM/yyyy") },
        whereHeardOfUs: { value: formResponse.whereHeardOfUs },
    };
};

export const handleSubmit_newImmigrant = async (formResponse: ImmigrantType, t: any) => {
    try {
        // Check all attachments for expiration or loss, even if file object is missing
        const attachments = [
            { field: "attachment1", value: formResponse.attachment1 },
            { field: "attachment2", value: formResponse.attachment2 },
            { field: "attachment3", value: formResponse.attachment3 },
        ];

        const expiredOrLostAttachments: string[] = [];

        for (const attachment of attachments) {
            if (attachment.value) {
                // Check if file needs re-upload (expired or lost)
                if (needsReupload(attachment.value)) {
                    if (isFileLost(attachment.value)) {
                        // File is lost - user must re-upload
                        expiredOrLostAttachments.push(attachment.field);
                    } else if (attachment.value.file) {
                        // File exists but is expired - try to re-upload
                        const reuploaded = await checkAndReuploadFile(attachment.value);
                        if (reuploaded === null) {
                            // Re-upload failed - user must re-upload
                            expiredOrLostAttachments.push(attachment.field);
                        } else {
                            // Update with new fileKey
                            if (attachment.field === "attachment1") {
                                formResponse.attachment1 = reuploaded;
                            } else if (attachment.field === "attachment2") {
                                formResponse.attachment2 = reuploaded;
                            } else if (attachment.field === "attachment3") {
                                formResponse.attachment3 = reuploaded;
                            }
                        }
                    } else {
                        // File is expired and missing - user must re-upload
                        expiredOrLostAttachments.push(attachment.field);
                    }
                }
            }
        }

        // Prevent submission if any files are expired or lost
        if (expiredOrLostAttachments.length > 0) {
            const fieldNames = expiredOrLostAttachments
                .map((field) => {
                    if (field === "attachment1") return "Attachment 1";
                    if (field === "attachment2") return "Attachment 2";
                    if (field === "attachment3") return "Attachment 3";
                    return field;
                })
                .join(", ");
            alert(
                `The following file(s) have expired or are missing: ${fieldNames}. Please re-upload these files before submitting the form.`
            );
            return false;
        }

        const addRecord = createAddRecord(formResponse);
        const res = await fetch("/api/kintone/postKintone", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(addRecord),
        });
        if (await res.ok) {
            sendConfirmationEmail(formResponse, t);
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
        logError(e, formResponse, "handleSubmit_newImmigrant");
        return false;
    }
};
