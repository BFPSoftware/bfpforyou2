import { Dictionary } from "@/common/locales/Dictionary-provider";
import { z } from "zod";

const validateRadio = (value: string | null) => value !== null;

const error_required = {
    message: "This field is required",
};

// common
const yesNo: z.ZodEffects<z.ZodNullable<z.ZodString>> = z.string().nullable().refine(validateRadio, error_required);
const file = z
    .object({
        file: z.any(),
        fileKey: z.string().min(1).max(50, "File could not be uploaded"),
    })
    .nullable()
    .refine((data) => {
        if (data == null) return false;
        return true;
    }, "This field is required");

const ticket: z.ZodString = z.string().min(1).max(9);
const formLang: z.ZodString = z.string().min(1).max(20);
// Page 1
const firstName: z.ZodString = z.string().min(1).max(50);
const lastName: z.ZodString = z.string().min(1).max(50);
const fullNameEnglish: z.ZodOptional<z.ZodString> = z.string().min(1).max(50).optional();
const idType: z.ZodString = z.string().min(1).max(30);
const idNumber: z.ZodString = z.string().min(1).max(30);
const gender = z
    .string()
    .nullable()
    .transform((value, ctx): string => {
        if (value == null) {
            ctx.addIssue({
                code: "custom",
                message: "This field is required",
            });
            return "";
        }
        return value;
    });
const birthday = z.object({
    day: z.string().max(5, { message: "Required" }),
    month: z.string().max(5, { message: "Required" }),
    year: z.string().max(5, { message: "Required" }),
});
// attachment 1-3 contains file key
const attachment1 = file;
const attachment2 = file;
const attachment3 = file;
const originCity: z.ZodString = z.string().min(1).max(50);
const originCountry: z.ZodString = z.string().min(1).max(50);
const nativeLanguage: z.ZodString = z.string().min(1).max(50);
const phone: z.ZodString = z.string({ required_error: "This field is required" }).min(6, { message: "Invalid phone number" }).max(20, { message: "The value length exceeds the limit" });
const email: z.ZodString = z.string().min(1).max(100).email({ message: "Invalid email format" });
const address1: z.ZodString = z.string().min(1).max(100);
const address2: z.ZodOptional<z.ZodString> = z.string().optional();
const city: z.ZodString = z.string().min(1).max(50);
const zip: z.ZodOptional<z.ZodString> = z.string().optional();

// Page 2
const spouse = z
    .discriminatedUnion("maritalStatus", [
        z.object({
            maritalStatus: z.literal("0"),
            spouseFirstName: z.string().min(1).max(50),
            spouseFamilyName: z.string().min(1).max(50),
            spouseIDType: z.string().min(1).max(30),
            spouseIDNumber: z.string().min(1).max(50),
            spouseBirthday: z.object({
                day: z.string().max(5, { message: "Required" }),
                month: z.string().max(5, { message: "Required" }),
                year: z.string().max(5, { message: "Required" }),
            }),
        }),
        z.object({
            maritalStatus: z.enum(["1", "2", "3", ""]),
            spouseFirstName: z.string().optional(),
            spouseFamilyName: z.string().optional(),
            spouseIDType: z.string().optional(),
            spouseIDNumber: z.string().optional(),
            spouseBirthday: z
                .object({
                    day: z.string().optional(),
                    month: z.string().optional(),
                    year: z.string().optional(),
                })
                .optional(),
        }),
    ])
    .refine(
        (data) => {
            if (data.maritalStatus == "") return false;
            else return true;
        },
        {
            message: "This field is required",
            path: ["maritalStatus"],
        }
    );
const children = z
    .discriminatedUnion("childStatus", [
        z.object({
            childStatus: z.literal("Yes"),
            childTable: z.array(
                z.object({
                    childFirstName: z.string().min(1).max(50),
                    childLastName: z.string().min(1).max(50),
                    childGender: z.string().min(1).max(50).nullable().refine(validateRadio, error_required),
                    childAccompanied: z.string().min(2).max(30),
                    childBirthday: z.object({
                        day: z.string().max(5, { message: "Required" }),
                        month: z.string().max(5, { message: "Required" }),
                        year: z.string().max(5, { message: "Required" }),
                    }),
                })
            ),
        }),
        z.object({
            childStatus: z.enum(["No", ""]),
            childTable: z.array(
                z.object({
                    childFirstName: z.string().optional(),
                    childLastName: z.string().optional(),
                    childGender: z.string().optional(),
                    childAccompanied: z.string().optional(),
                    childBirthday: z
                        .object({
                            day: z.string().optional(),
                            month: z.string().optional(),
                            year: z.string().optional(),
                        })
                        .optional(),
                })
            ),
        }),
    ])
    .refine(
        (data) => {
            if (data.childStatus == "") return false;
            else return true;
        },
        {
            message: "This field is required",
            path: ["childStatus"],
        }
    );
// Page 3
const aliyahDate: z.ZodString = z.string().min(1).max(50);
const whereHeardOfUs: z.ZodString = z.string().min(1).max(50);

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

export const ImmigrantSchema = z.object({
    ticket: ticket,
    formLang: formLang,
    // Page 1
    firstName: firstName,
    lastName: lastName,
    fullNameEnglish: fullNameEnglish,
    idType: idType,
    idNumber: idNumber,
    attachment1: attachment1,
    attachment2: attachment2,
    attachment3: attachment3,
    birthday: birthday,
    gender: gender,
    originCity: originCity,
    originCountry: originCountry,
    nativeLanguage: nativeLanguage,
    phone: phone,
    email: email,
    address1: address1,
    address2: address2,
    city: city,
    zip: zip,
    // Page 2
    spouse: spouse,
    children: children,
    // Page 3
    aliyahDate: aliyahDate,
    whereHeardOfUs: whereHeardOfUs,
});
export type ImmigrantType = z.infer<typeof ImmigrantSchema>;
export type ImmigrantFormType = keyof ImmigrantType;

// export test default data for form
export const defaultData: ImmigrantType = {
    ticket: "123456789",
    formLang: "en",
    firstName: "John",
    lastName: "Doe",
    fullNameEnglish: "John Doe",
    idType: "1",
    idNumber: "123456789",
    attachment1: { file: "file1", fileKey: "fileKey1" },
    attachment2: { file: "file1", fileKey: "fileKey1" },
    attachment3: { file: "file1", fileKey: "fileKey1" },
    birthday: {
        day: "1",
        month: "Jan",
        year: "2000",
    },
    gender: "1",
    originCity: "originCity",
    originCountry: "originCountry",
    nativeLanguage: "nativeLanguage",
    phone: "phoneno",
    email: "email@a.aa",
    address1: "address1",
    address2: "address2",
    city: "city",
    zip: "zip",
    // Page 2
    spouse: { maritalStatus: "1" },
    children: { childStatus: "No", childTable: [] },
    // Page 3
    aliyahDate: "aliyahDate",
    whereHeardOfUs: "whereHeardOfUs",
};
