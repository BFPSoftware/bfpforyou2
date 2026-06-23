"use client";
import { FC, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";

import FirstPage from "./views/FirstPage";

import { z } from "zod";
import { useDictionary } from "@/common/locales/Dictionary-provider";
import { customErrorMap, fachighSchema, FachighType, submitLangsShort } from "../schema/fachighSchema";
import { handleSubmit_fachigh } from "../hooks/handleSubmit_fachigh";
import Spinner from "@/components/spinner/Spinner";
import logError from "@/common/logError";
import { scrollToFormError } from "@/lib/form-scroll";
import { UploadFormProvider } from "../../components/UploadFormContext";
import FacFormSubmitFooter from "../../components/FacFormSubmitFooter";
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

type FachighFormProps = { ticket: string };

const FachighFormInner: FC<FachighFormProps> = ({ ticket }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [validationError, setValidationError] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<FachighType | null>(null);
    const t = useDictionary();

    useEffect(() => {
        z.setErrorMap(customErrorMap(t));
    }, [t]);

    const {
        handleSubmit,
        formState: { errors: formatError },
        setValue,
        watch,
        register,
    } = useForm<FachighType>({
        mode: "onChange",
        resolver: zodResolver(fachighSchema),
        defaultValues: {
            submitLang: "en",
            applicationType: "Highschool",
            ticket: ticket,
            photo: null,
            introLiveWith: t.highschool.defaults.introLiveWith,
            introHowManySiblings: t.highschool.defaults.introHowManySiblings,
            schoolLikeFor: t.highschool.defaults.schoolLikeFor,
            schoolGoodChallenging: t.highschool.defaults.schoolGoodChallenging,
            personalFreeTime: t.highschool.defaults.personalFreeTime,
            personalHobbies: t.highschool.defaults.personalHobbies,
            futureBecome: t.highschool.defaults.futureBecome,
            futureDesire: t.highschool.defaults.futureDesire,
            futureTenYears: t.highschool.defaults.futureTenYears,
            scholarshipReason: t.highschool.defaults.scholarshipReason,
        },
    });

    useEffect(() => {
        setValue("submitLang", (t.lang as (typeof submitLangsShort)[number]) || "en");
    }, [t.lang, setValue]);

    const handleOnSubmit: SubmitHandler<FachighType> = (data) => {
        setValidationError("");
        setPendingData(data);
        setConfirmOpen(true);
    };

    const confirmSubmit = async () => {
        if (!pendingData) return;
        setConfirmOpen(false);
        setSubmitError("");
        setIsLoading(true);
        try {
            const res = await handleSubmit_fachigh(pendingData, t);
            if (res) location.href = "/fachigh/thank-you";
            else setSubmitError("Something went wrong. Please try again later.");
        } catch (e) {
            void logError(e, { data: pendingData }, "handleSubmit_fachigh");
            setSubmitError("Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
            setPendingData(null);
        }
    };

    const onError = (errors: FieldErrors<FachighType>) => {
        setValidationError("Please complete the required fields above.");
        scrollToFormError(errors as FieldErrors<Record<string, unknown>>);
    };

    return (
        <div className="w-full max-w-[1095px] h-full bg-white rounded-md ">
            {isLoading && <Spinner isLoading={isLoading} />}
            <form
                method="post"
                onSubmit={(event) => {
                    setValidationError("");
                    void handleSubmit(handleOnSubmit, onError)(event);
                }}
                className={`flex flex-col p-[5%] md:p-[10%] pt-[5%] ${t.lang == "he" ? "rtl" : "ltr"}`}
            >
                <div className="font-bold text-3xl font-serif my-5 text-center">{t.fac.title}</div>
                <FirstPage errors={formatError} register={register} setValue={setValue} t={t} watch={watch} />
                <FacFormSubmitFooter
                    submitLabel={t.button.submit}
                    isLoading={isLoading}
                    submitError={submitError}
                    validationError={validationError}
                />
            </form>

            <AlertDialog
                open={confirmOpen}
                onOpenChange={(open) => {
                    setConfirmOpen(open);
                    if (!open) setPendingData(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t.common.wantToSubmit}</AlertDialogTitle>
                        <AlertDialogDescription className="sr-only">{t.common.wantToSubmit}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t.select.No}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => void confirmSubmit()}>{t.button.submit}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const FachighForm: FC<FachighFormProps> = (props) => (
    <UploadFormProvider>
        <FachighFormInner {...props} />
    </UploadFormProvider>
);

export default FachighForm;
