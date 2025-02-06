"use client";
import { FC, useState } from "react";
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
        if (!window.confirm(t.common.wantToSubmit)) return;
        setIsLoading(true);
        try {
            const validate = async () => {
                const isValids = await trigger();
                if (isValids) return true;
                else {
                    return false;
                }
            };
            if (!(await validate())) return;
            const res = await handleSubmit_facelem(data, t);
            if (res) location.href = "/facelem/thank-you";
            else alert("Something went wrong. Please try again later.");
        } catch (e) {
            logError(e, { data }, "handleSubmit_fachigh");
        } finally {
            setIsLoading(false);
        }
    };
    const onError = () => {
        window.scrollTo(0, 0); // scroll to top
    };

    const {
        handleSubmit,
        formState: { errors: formatError, isValid, isDirty, isSubmitting },
        trigger,
        watch,
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

    setValue("submitLang", (t.lang as (typeof submitLangsShort)[number]) || "en");
    return (
        <div className="w-full max-w-[1095px] h-full bg-white rounded-md ">
            {isLoading && <Spinner isLoading={isLoading} />}
            <form
                method="post"
                onSubmit={(event) => {
                    void handleSubmit(handleOnSubmit, onError)(event);
                }}
                className={`flex flex-col p-[5%] md:p-[10%] pt-[5%] ${t.lang == "he" ? "flex-row-reverse rtl" : "ltr"}`}
            >
                <div className="font-bold text-3xl font-serif my-5 text-center">{t.fac.title}</div>
                <FirstPage errors={formatError} register={register} setValue={setValue} t={t} watch={watch} />
                <button className="btn-theme" type="submit">
                    {t.button.submit}
                </button>
            </form>
        </div>
    );
};

export default FacelemForm;
