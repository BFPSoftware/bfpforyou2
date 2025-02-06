import sendConfirmationEmail from "@/hooks/confirmation/immigrant/sendConfirmationEmail";
import { ImmigrantType } from "../schema/immigrantSchema";
import logError from "@/common/logError";

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
        Attachment1: { value: [{ fileKey: formResponse.attachment1?.fileKey }] },
        Attachment2: { value: [{ fileKey: formResponse.attachment2?.fileKey }] },
        Attachment3: { value: [{ fileKey: formResponse.attachment3?.fileKey }] },
        birthday: { value: `${formResponse.birthday.year}-${convertMonthShortToNumber(formResponse.birthday.month)}-${formResponse.birthday.day}` },
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
            value: `${convertMonthShortToNumber(formResponse.spouse.spouseBirthday?.month || "")}/${formResponse.spouse.spouseBirthday?.day}/${formResponse.spouse.spouseBirthday?.year}`,
        },
        spouseIDType: { value: formResponse.spouse.spouseIDType },
        spouseID: { value: formResponse.spouse.spouseIDNumber },
        children: {
            value:
                formResponse.children.childStatus == "No"
                    ? []
                    : formResponse.children.childTable &&
                      formResponse.children.childTable.map((child) => {
                          if (!child) return;
                          const childBirthday = `${child.childBirthday?.year}-${convertMonthShortToNumber(child.childBirthday?.month || "")}-${child.childBirthday?.day}`;
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
        aliyahDate: { value: formResponse.aliyahDate },
        whereHeardOfUs: { value: formResponse.whereHeardOfUs },
    };
};

export const handleSubmit_newImmigrant = async (formResponse: ImmigrantType, t: any) => {
    try {
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
            alert("Something went wrong, please try again. If the problem persists, please contact us.");
            return false;
        }
    } catch (e) {
        logError(e, formResponse, "handleSubmit_newImmigrant");
    }
};
