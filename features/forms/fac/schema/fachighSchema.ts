import { Dictionary } from "@/common/locales/Dictionary-provider";
import { DateTime } from "luxon";
import { z } from "zod";

export const applicationType_fachigh = "Highschool";
export const submitLangs = ["English", "Hebrew", "Russian", "Spanish", "French"] as const;
export const submitLangsShort = ["en", "he", "ru", "es", "fr"] as const;
export const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;
export const schools = ["Devir", "Shachar", "Branco Weiss"] as const;

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
const uploadedPhoto = z
    .object({
        file: z.instanceof(File).optional(),
        fileKey: z.string().min(1).max(50, "File could not be uploaded"),
        uploadedAt: z.date().optional(),
    })
    .refine((data) => {
        if (data.fileKey && !data.file && data.uploadedAt) {
            const expirationDate = new Date(data.uploadedAt);
            expirationDate.setDate(expirationDate.getDate() + 3);
            if (new Date() > expirationDate) {
                return false;
            }
        }
        return true;
    }, "The uploaded file has expired. Please re-upload the file.");

/** Photo is optional in validation; UI still encourages upload with a red asterisk. */
const photoOptional = z.union([z.null(), uploadedPhoto]).optional();

// system
const ticket = string50;
const applicationType = z.enum([applicationType_fachigh]);
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
const grade = string50;
const originCountry = string50;
const school = string50;
const returning = string50;
const madeAliyah = string300;

// Section 2
// TODO: min characters and show counter
const introLiveWith = string2000;
const introHasSiblings = z.enum(["Yes", "No"]);
const introHowManySiblings = z.string().max(2000, error_maxLength).optional();

const schoolLikeFor = string2000;
const schoolGoodChallenging = string2000;

const personalFreeTime = string2000;
const personalHobbies = string2000;

const futureHasPlans = z.enum(["Yes", "No"]);
const futureBecome = z.string().max(2000, error_maxLength).optional();
const futureDesire = z.string().max(2000, error_maxLength).optional();
const futureTenYears = string2000;

const scholarshipReason = string2000;

// Section 3
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

export const fachighSchema = z
    .object({
        ticket: ticket,
        applicationType: applicationType,
        submitLang: submitLang,
        firstName: firstName,
        lastName: lastName,
        tz: tz,
        birthday: birthday,
        age: age,
        photo: photoOptional,
        grade: grade,
        originCountry: originCountry,
        school,
        returning: returning,
        madeAliyah: madeAliyah,

        // Section 2 (split questions)
        introLiveWith,
        introHasSiblings,
        introHowManySiblings,

        schoolLikeFor,
        schoolGoodChallenging,

        personalFreeTime,
        personalHobbies,

        futureHasPlans,
        futureBecome,
        futureDesire,
        futureTenYears,

        scholarshipReason,

        submittedBy: submittedBy,
        relationship: relationship,
        check1,
        check2,
    })
    .superRefine((data, ctx) => {
        if (data.introHasSiblings === "Yes" && !data.introHowManySiblings?.trim()) {
            ctx.addIssue({
                path: ["introHowManySiblings"],
                code: z.ZodIssueCode.custom,
                message: "This field is required",
            });
        }

        if (data.futureHasPlans === "Yes" && !data.futureBecome?.trim()) {
            ctx.addIssue({
                path: ["futureBecome"],
                code: z.ZodIssueCode.custom,
                message: "This field is required",
            });
        }

        if (data.futureHasPlans === "No" && !data.futureDesire?.trim()) {
            ctx.addIssue({
                path: ["futureDesire"],
                code: z.ZodIssueCode.custom,
                message: "This field is required",
            });
        }
    });
export type FachighType = z.infer<typeof fachighSchema>;
export type FachighFormType = keyof FachighType;

// export test default data for form
export const defaultData: z.infer<typeof fachighSchema> = {
    ticket: "123456789",
    applicationType: "Highschool",
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
    school: "HaDekel",
    returning: "No",
    madeAliyah: "",
    introLiveWith: "I live with…",
    introHasSiblings: "Yes",
    introHowManySiblings: "I have…",
    schoolLikeFor: "For me, my school is like…",
    // keep defaultData concise; the form itself provides multi-line prefill
    schoolGoodChallenging: "What are you good at and what is challenging for you in school?",
    personalFreeTime: "When I have my free time, I enjoy…",
    personalHobbies: "My favorite activities are…",
    futureHasPlans: "Yes",
    futureBecome: "My future dream is to become/start…",
    futureDesire: "I desire to …",
    futureTenYears: "In ten years, I see myself…",
    scholarshipReason: "I really want this scholarship because…",
    submittedBy: "Parent",
    relationship: "Father",
    check1: false,
    check2: false,
};
