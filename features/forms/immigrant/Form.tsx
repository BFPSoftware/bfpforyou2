"use client";
import { FC, useEffect, useState } from "react";
import { ImmigrantSchema, ImmigrantType } from "./schema/immigrantSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm, useWatch } from "react-hook-form";

import FirstPage from "./views/FirstPage";
import SecondPage from "./views/SecondPage";
import ThirdPage from "./views/ThirdPage";

import { customErrorMap } from "./schema/immigrantSchema";
import { z } from "zod";
import { handleSubmit_newImmigrant } from "./hooks/handleSubmit_immigrant";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import logError from "@/common/logError";
import Spinner from "@/components/spinner/Spinner";
import { immigrantPageForErrorPath, findFirstErrorPath, scrollToFormError } from "@/lib/form-scroll";
import { UploadFormProvider, useUploadFormContext } from "../components/UploadFormContext";

type NewImmigrantFormProps = { ticket: string };

const NewImmigrantFormInner: FC<NewImmigrantFormProps> = ({ ticket }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [page, setPage] = useState(0);
    const { isAnyUploading } = useUploadFormContext();
    const t = useDictionary();

    useEffect(() => {
        z.setErrorMap(customErrorMap(t));
    }, [t]);

    const {
        handleSubmit,
        formState: { errors: formatError },
        trigger,
        setValue,
        control,
        watch,
        register,
    } = useForm<ImmigrantType>({
        mode: "onChange",
        resolver: zodResolver(ImmigrantSchema),
        defaultValues: {
            formLang: "en",
            ticket: ticket,
            attachment1: null,
            attachment2: null,
            attachment3: null,
            children: {
                childStatus: "",
                childTable: [
                    {
                        childFirstName: "",
                        childLastName: "",
                        childGender: "",
                        childBirthday: {},
                        childAccompanied: "",
                    },
                ],
            },
        },
    });

    useEffect(() => {
        setValue("formLang", t.lang || "en");
    }, [t.lang, setValue]);

    const handleOnSubmit: SubmitHandler<ImmigrantType> = async (data) => {
        if (!window.confirm(t.common.wantToSubmit)) return;
        setSubmitError("");
        setIsLoading(true);
        try {
            const res = await handleSubmit_newImmigrant(data, t);
            if (res) location.href = "/immigrant/thank-you";
            else setSubmitError("Something went wrong. Please try again later.");
        } catch (e) {
            void logError(e, { data }, "handleSubmit_newImmigrant");
            setSubmitError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const onError = (errors: FieldErrors<ImmigrantType>) => {
        const path = findFirstErrorPath(errors as Record<string, unknown>);
        if (!path) return;
        const targetPage = immigrantPageForErrorPath(path);
        if (targetPage !== page) {
            setPage(targetPage);
            setTimeout(() => scrollToFormError(errors as FieldErrors<Record<string, unknown>>), 150);
        } else {
            scrollToFormError(errors as FieldErrors<Record<string, unknown>>);
        }
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
                <div className="font-bold text-3xl font-serif my-5 text-center">{t.immigrant.title}</div>
                {page === 0 && (
                    <FirstPage
                        setPage={setPage}
                        errors={formatError}
                        register={register}
                        setValue={setValue}
                        trigger={trigger}
                        t={t}
                        watch={watch}
                    />
                )}
                {page === 1 && (
                    <SecondPage
                        setPage={setPage}
                        errors={formatError}
                        register={register}
                        trigger={trigger}
                        useWatch={useWatch}
                        control={control}
                        t={t}
                    />
                )}
                {page === 2 && (
                    <ThirdPage
                        setPage={setPage}
                        errors={formatError}
                        register={register}
                        t={t}
                        submitError={submitError}
                        isSubmitDisabled={isLoading || isAnyUploading}
                    />
                )}
            </form>
        </div>
    );
};

const NewImmigrantForm: FC<NewImmigrantFormProps> = (props) => (
    <UploadFormProvider>
        <NewImmigrantFormInner {...props} />
    </UploadFormProvider>
);

export default NewImmigrantForm;
