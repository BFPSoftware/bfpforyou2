import { z } from 'zod';

const ticket: z.ZodString = z.string().min(1).max(9);
const formLang: z.ZodString = z.string().min(1).max(20);
// Section
const photo: z.ZodString = z.string().min(1).max(200);
const firstName: z.ZodString = z.string().min(1).max(50);
const lastName: z.ZodString = z.string().min(1).max(50);
const tz: z.ZodString = z.string().min(1).max(50);
const birthday = z.object({
    day: z.string().max(5, { message: 'Required' }),
    month: z.string().max(5, { message: 'Required' }),
    year: z.string().max(5, { message: 'Required' })
});
const age = z.string().min(1).max(50);
const school = z.string().min(1).max(50);
const grade = z.string().min(1).max(50);
const isFirstTime: z.ZodString = z.string().min(1).max(50);

// Section
const introduction: z.ZodString = z.string().min(1).max(500);
const aboutSchool: z.ZodString = z.string().min(1).max(500);
const personalLife: z.ZodString = z.string().min(1).max(500);
const yourFuture: z.ZodString = z.string().min(1).max(500);

// Section
const verify1: z.ZodEffects<z.ZodBoolean> = z.boolean().refine((value) => value === true, {
    message: 'Please check the box'
});
const verify2: z.ZodEffects<z.ZodBoolean> = z.boolean().refine((value) => value === true, {
    message: 'Please check the box'
});

export const customErrorMap =
    (t: any): z.ZodErrorMap =>
    (error, ctx) => {
        switch (error.code) {
            case z.ZodIssueCode.too_small:
                return { message: t('error.required') };
            case z.ZodIssueCode.too_big:
                return { message: t('error.too_big') };

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

export const ElementarySchema = z.object({
    ticket: ticket,
    formLang: formLang,
    // Section
    photo: photo,
    firstName: firstName,
    lastName: lastName,
    tz: tz,
    birthday: birthday,
    age: age,
    school: school,
    grade: grade,
    isFirstTime: isFirstTime,
    // Section
    introduction: introduction,
    aboutSchool: aboutSchool,
    personalLife: personalLife,
    yourFuture: yourFuture,
    // Section
    verify1: verify1,
    verify2: verify2
});
export type ElementaryType = z.infer<typeof ElementarySchema>;
export type ElementaryFormType = keyof ElementaryType;
