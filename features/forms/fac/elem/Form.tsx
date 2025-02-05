"use client";
import { FC, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import FirstPage from "./views/FirstPage";

import { z } from "zod";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import { customErrorMap, facelemSchema, FacelemType, submitLangsShort } from "../schema/facelemSchema";
import { handleSubmit_facelem } from "../hooks/handleSubmit_facelem";
import logError from "@/common/logError";
import Spinner from "@/components/spinner/Spinner";

type FacelemFormProps = { ticket: string };

const FacelemForm: FC<FacelemFormProps> = ({ ticket }) => {
    const [isLoading, setIsLoading] = useState(false);

    const t = useDictionary();
    // zod error with custom language
    z.setErrorMap(customErrorMap(t));

    const handleOnSubmit: SubmitHandler<FacelemType> = async (data) => {
        setIsLoading(true);
        try {
            // validation on third page
            const validate = async () => {
                const isValids = await trigger();
                console.log("isValid All: " + isValids);
                if (isValids) return true;
                else {
                    const firstErrorField = Object.keys(formatError)[0];
                    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
                    console.log("errorElement", firstErrorField);
                    if (errorElement) {
                        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                    return false;
                }
            };
            if (!(await validate())) return;
            const res = await handleSubmit_facelem(data, t);
            if (res) location.href = "/facelem/thank-you";
            else console.log("error");
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
        control,
        register,
    } = useForm<FacelemType>({
        mode: "onChange",
        resolver: zodResolver(facelemSchema),
        // defaultValues: defaultData,
        defaultValues: {
            submitLang: "en",
            applicationType: "Elementary",
            ticket: ticket,
        },
    });

    // useFieldArray for Children table

    console.log("erros: " + Object.keys(formatError));
    console.log("validAll: " + isValid);
    console.log(getValues());

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
                <FirstPage errors={formatError} register={register} setValue={setValue} t={t} />
                <button className="btn-theme" type="submit">
                    {t.button.submit}
                </button>
            </form>
        </div>
    );
};

export default FacelemForm;
