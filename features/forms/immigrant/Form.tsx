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
import FormSectionErrorBoundary from "@/components/FormSectionErrorBoundary";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type NewImmigrantFormProps = { ticket: string };

const NewImmigrantFormInner: FC<NewImmigrantFormProps> = ({ ticket }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [page, setPage] = useState(0);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<ImmigrantType | null>(null);
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
            spouse: {
                maritalStatus: "1",
            },
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

    const handleOnSubmit: SubmitHandler<ImmigrantType> = (data) => {
        setPendingData(data);
        setConfirmOpen(true);
    };

    const confirmSubmit = async () => {
        if (!pendingData) return;
        setSubmitError("");
        setIsLoading(true);
        setConfirmOpen(false);
        try {
            const res = await handleSubmit_newImmigrant(pendingData, t);
            if (res) location.href = "/immigrant/thank-you";
            else setSubmitError("Something went wrong. Please try again later.");
        } catch (e) {
            void logError(e, { data: pendingData }, "handleSubmit_newImmigrant");
            setSubmitError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
            setPendingData(null);
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
                translate="no"
                className={`notranslate flex flex-col p-[5%] md:p-[10%] pt-[5%] ${t.lang == "he" ? "flex-row-reverse rtl" : "ltr"}`}
            >
                <div className="font-bold text-3xl font-serif my-5 text-center">{t.immigrant.title}</div>
                <div hidden={page !== 0} aria-hidden={page !== 0}>
                    <FormSectionErrorBoundary routeName="immigrant-page1">
                        <FirstPage
                            setPage={setPage}
                            errors={formatError}
                            register={register}
                            setValue={setValue}
                            trigger={trigger}
                            t={t}
                            watch={watch}
                        />
                    </FormSectionErrorBoundary>
                </div>
                <div hidden={page !== 1} aria-hidden={page !== 1}>
                    <FormSectionErrorBoundary routeName="immigrant-page2">
                        <SecondPage
                            setPage={setPage}
                            errors={formatError}
                            register={register}
                            trigger={trigger}
                            useWatch={useWatch}
                            control={control}
                            t={t}
                        />
                    </FormSectionErrorBoundary>
                </div>
                <div hidden={page !== 2} aria-hidden={page !== 2}>
                    <FormSectionErrorBoundary routeName="immigrant-page3">
                        <ThirdPage
                            setPage={setPage}
                            errors={formatError}
                            register={register}
                            t={t}
                            submitError={submitError}
                            isSubmitDisabled={isLoading || isAnyUploading}
                        />
                    </FormSectionErrorBoundary>
                </div>
            </form>

            <AlertDialog
                open={confirmOpen}
                onOpenChange={(open) => {
                    setConfirmOpen(open);
                    if (!open && !isLoading) setPendingData(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t.common.wantToSubmit}</AlertDialogTitle>
                        <AlertDialogDescription className="sr-only">{t.common.wantToSubmit}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t.select.No}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(event) => {
                                event.preventDefault();
                                void confirmSubmit();
                            }}
                        >
                            {t.button.submit}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const NewImmigrantForm: FC<NewImmigrantFormProps> = (props) => (
    <UploadFormProvider>
        <NewImmigrantFormInner {...props} />
    </UploadFormProvider>
);

export default NewImmigrantForm;
