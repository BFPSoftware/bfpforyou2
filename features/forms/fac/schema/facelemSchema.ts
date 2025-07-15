import { Dictionary } from "@/common/locales/Dictionary-provider";
import { DateTime } from "luxon";
import { z } from "zod";

export const applicationType_facelem = "Elementary";
export const submitLangs = ["English", "Hebrew", "Russian", "Spanish", "French"] as const;
export const submitLangsShort = ["en", "he", "ru", "es", "fr"] as const;
export const grades = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;
export const elemSchools = ["Jabutinsky", "Levi Eshkol", "Uziel", "HaDekel", "Zalman Aran", "Ben Zvi", "Orot - Boys", "Orot - Girls"] as const;

const validateRadio = (value: string | null) => value !== null;
const validateDate = (value: string | undefined) => {
    if (!value) return true;
    if (!DateTime.fromFormat(value, "dd/MM/yyyy").isValid) return false;
    else if (DateTime.fromFormat(value, "dd/MM/yyyy") >= DateTime.now().plus({ years: 100 })) return false;
    else if (DateTime.fromFormat(value, "dd/MM/yyyy") <= DateTime.now().minus({ years: 100 })) return false;
    return true;
};
const error_required = {
    message: "This field is required",
};
const error_invalidDate = {
    message: "Invalid date",
};
const error_maxLength = {
    message: "Text is too long",
};
// common
const yesNo: z.ZodEffects<z.ZodNullable<z.ZodString>> = z.string().nullable().refine(validateRadio, error_required);
const date: z.ZodEffects<z.ZodString> = z.string().min(1).max(50).refine(validateDate, error_invalidDate);
const date_optional: z.ZodEffects<z.ZodOptional<z.ZodString>> = z.string().optional().refine(validateDate, error_invalidDate);
const string50: z.ZodString = z.string().min(1).max(50, error_maxLength);
const string300: z.ZodString = z.string().min(1).max(300, error_maxLength);
const string2000: z.ZodString = z.string().min(1).max(2000, error_maxLength);
const string4000: z.ZodString = z.string().min(1).max(4000, error_maxLength);
const string_optional: z.ZodOptional<z.ZodString> = z.string().optional();
const file = z
    .object({
        file: z.instanceof(File).optional(),
        fileKey: z.string().min(1).max(50, "File could not be uploaded"),
        uploadedAt: z.date().optional(),
    })
    .nullable()
    .refine((data) => {
        if (data == null) return false;
        // If we have a fileKey but no file, check if it's expired (3 days)
        if (data.fileKey && !data.file && data.uploadedAt) {
            const expirationDate = new Date(data.uploadedAt);
            expirationDate.setDate(expirationDate.getDate() + 3);
            if (new Date() > expirationDate) {
                return false;
            }
        }
        return true;
    }, "This field is required or the uploaded file has expired");

// system
const ticket = string50;
const applicationType = z.enum([applicationType_facelem]);
const submitLang = z.enum(submitLangsShort);

// Section 1
const firstName: z.ZodString = z.string().min(1).max(50);
const lastName: z.ZodString = z.string().min(1).max(50);
const tz = string50;
const birthday = z.object({
    day: z.string().max(5, { message: "Required" }),
    month: z.string().max(5, { message: "Required" }),
    year: z.string().max(5, { message: "Required" }),
});
const age = string50;
const photo = file;
const grade = string50;
const originCountry = string50;
const elemSchool = string50;
const returning = string50;

// Section 2
const familyMembers = string300;
const brothers = string300;
const sisters = string300;
const isfrom = string300;
const languageAtHome = string300;
const aboutFamily = string300;

// Section 3
const favoriteSubject = string300;
const challengingSubject = string300;
const aboutMyTeacher = string300;
const aboutMeFromTeacher = string300;

// Section 4
const nickname = string300;
const favoriteColor = string300;
const favoriteFood = string300;
const hobbies = string300;
const interests = string300;
const makesMeSad = string300;
const loveMost = string300;
const futureDreams = string300;

// Section 5
const familysituation = string2000;
const schoolsituation = string2000;

// Section 6
const submittedBy = string300;
const relationship = string300;

// check
const check1 = z.boolean().refine((v) => v === true, { message: "Please check the box" });
const check2 = z.boolean().refine((v) => v === true, { message: "Please check the box" });

export const customErrorMap =
    (t: Dictionary): z.ZodErrorMap =>
    (error, ctx) => {
        switch (error.code) {
            case z.ZodIssueCode.too_small:
                return { message: t.error.required };
            case z.ZodIssueCode.too_big:
                return { message: t.error.too_big };

            case z.ZodIssueCode.custom:
                // produce a custom message using error.params
                // error.params won't be set unless you passed
                // a `params` arguments into a custom validator
                const params = error.params || {};
                if (params.myField) {
                    return { message: `Bad input: ${params.myField}` };
                }
                break;
        }

        // fall back to default message!
        return { message: ctx.defaultError };
    };

export const facelemSchema = z.object({
    ticket: ticket,
    applicationType: applicationType,
    submitLang: submitLang,
    firstName: firstName,
    lastName: lastName,
    tz: tz,
    birthday: birthday,
    age: age,
    photo,
    grade: grade,
    originCountry: originCountry,
    elemSchool: elemSchool,
    returning: returning,
    familyMembers: familyMembers,
    brothers: brothers,
    sisters: sisters,
    isfrom: isfrom,
    languageAtHome: languageAtHome,
    aboutFamily: aboutFamily,
    favoriteSubject: favoriteSubject,
    challengingSubject: challengingSubject,
    aboutMyTeacher: aboutMyTeacher,
    aboutMeFromTeacher: aboutMeFromTeacher,
    nickname: nickname,
    favoriteColor: favoriteColor,
    favoriteFood: favoriteFood,
    hobbies: hobbies,
    interests: interests,
    makesMeSad: makesMeSad,
    loveMost: loveMost,
    futureDreams: futureDreams,
    familysituation: familysituation,
    schoolsituation: schoolsituation,
    submittedBy: submittedBy,
    relationship: relationship,
    check1,
    check2,
});
export type FacelemType = z.infer<typeof facelemSchema>;
export type FacelemFormType = keyof FacelemType;

// export test default data for form
export const defaultData: z.infer<typeof facelemSchema> = {
    ticket: "123456789",
    applicationType: "Elementary",
    submitLang: "en",
    firstName: "John",
    lastName: "Doe",
    tz: "123456789",
    birthday: {
        day: "01",
        month: "01",
        year: "2000",
    },
    age: "10",
    photo: null,
    grade: "5",
    originCountry: "Country",
    elemSchool: "HaDekel",
    returning: "No",
    familyMembers: "4",
    brothers: "1",
    sisters: "1",
    isfrom: "City",
    languageAtHome: "English",
    aboutFamily: "We are a happy family.",
    favoriteSubject: "Math",
    challengingSubject: "History",
    aboutMyTeacher: "My teacher is very supportive.",
    aboutMeFromTeacher: "John is a diligent student.",
    nickname: "Johnny",
    favoriteColor: "Blue",
    favoriteFood: "Pizza",
    hobbies: "Reading, Swimming",
    interests: "Science, Technology",
    makesMeSad: "Bullying",
    loveMost: "Family",
    futureDreams: "Scientist",
    familysituation: "We live in a small town.",
    schoolsituation: "The school is supportive.",
    submittedBy: "Parent",
    relationship: "Father",
    check1: false,
    check2: false,
};
