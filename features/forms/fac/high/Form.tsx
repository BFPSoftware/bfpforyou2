"use client";
import { FC, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import FirstPage from "./views/FirstPage";

import { z } from "zod";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import { customErrorMap, fachighSchema, FachighType, submitLangsShort } from "../schema/fachighSchema";
import { handleSubmit_fachigh } from "../hooks/handleSubmit_fachigh";
import Spinner from "@/components/spinner/Spinner";
import logError from "@/common/logError";
// import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";

type FachighFormProps = { ticket: string };

const FachighForm: FC<FachighFormProps> = ({ ticket }) => {
    const [isLoading, setIsLoading] = useState(false);
    const t = useDictionary();
    // zod error with custom language
    z.setErrorMap(customErrorMap(t));

    const handleOnSubmit: SubmitHandler<FachighType> = async (data) => {
        if (!window.confirm(t.common.wantToSubmit)) return;
        setIsLoading(true);
        try {
            const validate = async () => {
                const isValids = await trigger();
                if (isValids) return true;
                else {
                    console.log("formatError", formatError);
                    const firstErrorField = Object.keys(formatError)[0];
                    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
                    if (errorElement) {
                        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                    return false;
                }
            };
            if (!(await validate())) return;
            const res = await handleSubmit_fachigh(data, t);
            if (res) location.href = "/fachigh/thank-you";
            else alert("Something went wrong. Please try again later.");
        } catch (e) {
            logError(e, { data }, "handleSubmit_fachigh");
        } finally {
            setIsLoading(false);
        }
    };

    const {
        handleSubmit,
        formState: { errors: formatError, isValid, isDirty, isSubmitting },
        trigger,
        getValues,
        setValue,
        watch,
        control,
        register,
    } = useForm<FachighType>({
        mode: "onChange",
        resolver: zodResolver(fachighSchema),
        // defaultValues: defaultData,
        defaultValues: {
            submitLang: "en",
            applicationType: "Highschool",
            ticket: ticket,
        },
    });
    setValue("submitLang", (t.lang as (typeof submitLangsShort)[number]) || "en");

    return (
        <div className="w-full max-w-[1095px] h-full bg-white rounded-md ">
            {isLoading && <Spinner isLoading={isLoading} />}
            <form
                method="post"
                onSubmit={(event) => {
                    void handleSubmit(handleOnSubmit)(event);
                }}
                className={`flex flex-col p-[10%] pt-[5%] ${t.lang == "he" ? "flex-row-reverse rtl" : "ltr"}`}
            >
                <div className="font-bold text-3xl font-serif my-5 text-center">{t.fac.title}</div>
                <FirstPage errors={formatError} register={register} setValue={setValue} t={t} watch={watch} />
                <button className="btn-theme" type="submit">
                    {t.button.submit}
                </button>
                {/* TODO: come back for this
                <div className="mt-8">
                    <AlertDialog>
                        <AlertDialogTrigger className="btn-theme">{t.button.submit}</AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle className="mt-4 text-2xl">{t.common.wantToSubmit}</AlertDialogTitle>
                                <AlertDialogDescription hidden className="text-lg">
                                    {t.common.wantToSubmit}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-10 flex-col md:justify-end">
                                <AlertDialogCancel>{t.button.back}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => submitButtonRef.current?.click()}>{t.button.submit}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <button hidden type="submit" ref={submitButtonRef} />
                </div> */}
            </form>
        </div>
    );
};

export default FachighForm;
