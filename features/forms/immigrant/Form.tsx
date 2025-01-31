"use client";
import { FC, useEffect } from "react";
import { ContactSchema, ContactType } from "./schema/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { useState } from "react";

import FirstPage from "./views/FirstPage";
import SecondPage from "./views/SecondPage";
import ThirdPage from "./views/ThirdPage";

import { useTranslation } from "react-i18next";

import { customErrorMap } from "./schema/contact";
import { z } from "zod";
import { handleSubmit_newImmigrant } from "./hooks/handleSubmit_newImmigrant";
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
    //const { t, i18n } = useTranslation('immigrant');
    // change form direction based on language
    if (typeof window !== "undefined") {
        if (t.lang == "he") {
            document.getElementsByTagName("form")[0].dir = "rtl";
        } else {
            document.getElementsByTagName("form")[0].dir = "ltr";
        }
    }
    // zod error with custom language
    z.setErrorMap(customErrorMap(t));

    const handleOnSubmit: SubmitHandler<ContactType> = async (data) => {
        // remove
        window.removeEventListener("beforeunload", onBeforeUnload);
        if (!window.confirm("Do you want to submit?")) return;
        // validation on third page
        const fields: (keyof ContactType)[] = ["aliyahDate", "whereHeardOfUs"];
        const validate = async () => {
            const isValids = await trigger(fields);
            console.log("isValid FirstPage: " + isValids);
            if (isValids) return true;
            else return false;
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
    } = useForm<ContactType>({
        mode: "onChange",
        resolver: zodResolver(ContactSchema),
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
        <>
            <form
                method="post"
                onSubmit={(event) => {
                    void handleSubmit(handleOnSubmit)(event);
                }}
                className={`flex flex-col px-[10%] pb-[10%] ${t.lang == "he" ? "flex-row-reverse rtl" : "ltr"}`}
            >
                <div className="font-bold text-3xl font-serif my-5 text-center">{t.immigrant.title}</div>
                {page === 0 && <FirstPage setPage={setPage} errors={formatError} register={register} setValue={setValue} trigger={trigger} t={t} />}
                {page === 1 && <SecondPage setPage={setPage} errors={formatError} register={register} trigger={trigger} useWatch={useWatch} control={control} t={t} />}
                {page === 2 && <ThirdPage setPage={setPage} errors={formatError} register={register} t={t} />}
            </form>
        </>
    );
};

export default NewImmigrantForm;
