"use client";
import { FC, useEffect } from "react";
import { ImmigrantSchema, ImmigrantType } from "./schema/immigrantSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useState } from "react";

import FirstPage from "./views/FirstPage";
import SecondPage from "./views/SecondPage";
import ThirdPage from "./views/ThirdPage";

import { customErrorMap } from "./schema/immigrantSchema";
import { z } from "zod";
import { handleSubmit_newImmigrant } from "./hooks/handleSubmit_immigrant";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import logError from "@/common/logError";

type NewImmigrantFormProps = { ticket: string };

const NewImmigrantForm: FC<NewImmigrantFormProps> = ({ ticket }) => {
    const [isLoading, setIsLoading] = useState(false);
    const t = useDictionary();
    // zod error with custom language
    z.setErrorMap(customErrorMap(t));

    const handleOnSubmit: SubmitHandler<ImmigrantType> = async (data) => {
        if (!window.confirm(t.common.wantToSubmit)) return;
        setIsLoading(true);
        try {
            // validation on third page
            const fields: (keyof ImmigrantType)[] = ["aliyahDate", "whereHeardOfUs"];
            const validate = async () => {
                const isValids = await trigger(fields);

                if (isValids) return true;
                else {
                    const firstErrorField = Object.keys(formatError)[0];
                    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
                    if (errorElement) {
                        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                    return false;
                }
            };
            if (!(await validate())) return;
            const res = await handleSubmit_newImmigrant(data, t);
            if (res) location.href = "/immigrant/thank-you";
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
        control,
        register,
    } = useForm<ImmigrantType>({
        mode: "onChange",
        resolver: zodResolver(ImmigrantSchema),
        // defaultValues: defaultData,
        defaultValues: {
            formLang: "en",
            ticket: ticket as string,
            children: {
                childStatus: undefined,
                childTable: [
                    {
                        childFirstName: "",
                        childLastName: "",
                        childGender: "d",
                        childBirthday: {},
                        childAccompanied: "d",
                    },
                ],
            },
        },
    });

    const [page, setPage] = useState(0);
    setValue("formLang", t.lang || "en");
    return (
        <div className="w-full max-w-[1095px] h-full bg-white rounded-md ">
            <form
                method="post"
                onSubmit={(event) => {
                    void handleSubmit(handleOnSubmit)(event);
                }}
                className={`flex flex-col p-[10%] pt-[5%] ${t.lang == "he" ? "flex-row-reverse rtl" : "ltr"}`}
            >
                <div className="font-bold text-3xl font-serif my-5 text-center">{t.immigrant.title}</div>
                {page === 0 && <FirstPage setPage={setPage} errors={formatError} register={register} setValue={setValue} trigger={trigger} t={t} />}
                {page === 1 && <SecondPage setPage={setPage} errors={formatError} register={register} trigger={trigger} useWatch={useWatch} control={control} t={t} />}
                {page === 2 && <ThirdPage setPage={setPage} errors={formatError} register={register} t={t} />}
            </form>
        </div>
    );
};

export default NewImmigrantForm;
