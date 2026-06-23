"use client";
import { FC, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";

import FirstPage from "./views/FirstPage";

import { z } from "zod";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import { customErrorMap, facelemSchema, FacelemType, submitLangsShort } from "../schema/facelemSchema";
import { handleSubmit_facelem } from "../hooks/handleSubmit_facelem";
import logError from "@/common/logError";
import Spinner from "@/components/spinner/Spinner";
import { scrollToFormError } from "@/lib/form-scroll";
import { UploadFormProvider, useUploadFormContext } from "../../components/UploadFormContext";

type FacelemFormProps = { ticket: string };

const FacelemFormInner: FC<FacelemFormProps> = ({ ticket }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const { isAnyUploading } = useUploadFormContext();
    const t = useDictionary();

    useEffect(() => {
        z.setErrorMap(customErrorMap(t));
    }, [t]);

    const {
        handleSubmit,
        formState: { errors: formatError },
        watch,
        setValue,
        register,
    } = useForm<FacelemType>({
        mode: "onChange",
        resolver: zodResolver(facelemSchema),
        defaultValues: {
            submitLang: "en",
            applicationType: "Elementary",
            ticket: ticket,
            liveWith: [],
            brothers: "",
            sisters: "",
            liveWithOther: "",
            aboutMyTeacher: "",
            photo: null,
        },
    });

    useEffect(() => {
        setValue("submitLang", (t.lang as (typeof submitLangsShort)[number]) || "en");
    }, [t.lang, setValue]);

    const handleOnSubmit: SubmitHandler<FacelemType> = async (data) => {
        if (!window.confirm(t.common.wantToSubmit)) return;
        setSubmitError("");
        setIsLoading(true);
        try {
            const res = await handleSubmit_facelem(data, t);
            if (res) location.href = "/facelem/thank-you";
            else setSubmitError("Something went wrong. Please try again later.");
        } catch (e) {
            void logError(e, { data }, "handleSubmit_facelem");
            setSubmitError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const onError = (errors: FieldErrors<FacelemType>) => {
        scrollToFormError(errors as FieldErrors<Record<string, unknown>>);
    };

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
                {submitError && <div className="text-red-500 text-sm mb-4">{submitError}</div>}
                <button className="btn-theme" type="submit" disabled={isLoading || isAnyUploading}>
                    {t.button.submit}
                </button>
            </form>
        </div>
    );
};

const FacelemForm: FC<FacelemFormProps> = (props) => (
    <UploadFormProvider>
        <FacelemFormInner {...props} />
    </UploadFormProvider>
);

export default FacelemForm;
