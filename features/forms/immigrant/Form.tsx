"use client";
import { FC, useEffect } from "react";
import { defaultData, ImmigrantSchema, ImmigrantType } from "./schema/immigrantSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useState } from "react";

import FirstPage from "./views/FirstPage";
import SecondPage from "./views/SecondPage";
import ThirdPage from "./views/ThirdPage";

import { useTranslation } from "react-i18next";

import { customErrorMap } from "./schema/immigrantSchema";
import { z } from "zod";
import { handleSubmit_newImmigrant } from "./hooks/handleSubmit_immigrant";
import { useDictionary } from "@/common/locales/Dictionary-provider";

type NewImmigrantFormProps = { ticket: string };

const NewImmigrantForm: FC<NewImmigrantFormProps> = ({ ticket }) => {
    // confirm before leaving page
    const onBeforeUnload = (ev: Event) => {
        if (isSubmitting) {
            window.removeEventListener("beforeunload", onBeforeUnload);
            return true;
        }
        if (isDirty) {
            ev.preventDefault();
        }
        ev.returnValue = isDirty;
        return isDirty;
    };
    useEffect(() => {
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const t = useDictionary();
    // zod error with custom language
    z.setErrorMap(customErrorMap(t));

    const handleOnSubmit: SubmitHandler<ImmigrantType> = async (data) => {
        // remove
        window.removeEventListener("beforeunload", onBeforeUnload);
        if (!window.confirm("Do you want to submit?")) return;
        // validation on third page
        const fields: (keyof ImmigrantType)[] = ["aliyahDate", "whereHeardOfUs"];
        const validate = async () => {
            const isValids = await trigger(fields);
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
        const res = await handleSubmit_newImmigrant(data, t);
        if (res) location.href = "/immigrant/thank-you";
        else console.log("error");
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

    // useFieldArray for Children table

    console.log("erros: " + Object.keys(formatError));
    console.log("validAll: " + isValid);
    console.log(getValues());
    //console.log(`watch: ${Object.keys(Object.values(getValues('childRows')))}`)
    const [page, setPage] = useState(0);

    console.log(page);
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
