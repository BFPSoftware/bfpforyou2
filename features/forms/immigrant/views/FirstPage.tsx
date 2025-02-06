"use client";

import { Input, Select, Radio } from "../../components/FormComponents";
import { Birthday } from "../../components/Birthday";
import { Dispatch, FC, SetStateAction } from "react";
import { FieldErrors, UseFormRegister, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { ImmigrantType } from "../schema/immigrantSchema";
import FileUpload from "../../components/FileUpload";
import { Gender, IDType, Language } from "@/common/enums";
import { Dictionary } from "@/common/locales/Dictionary-provider";

type FirstPageProps = {
    setPage: Dispatch<SetStateAction<number>>;
    errors: FieldErrors<ImmigrantType>;
    register: UseFormRegister<ImmigrantType>;
    setValue: any;
    trigger: UseFormTrigger<ImmigrantType>;
    t: Dictionary;
    watch: UseFormWatch<ImmigrantType>;
};
const FirstPage: FC<FirstPageProps> = ({ setPage, errors, register, setValue, trigger, t, watch }) => {
    const fields: (keyof ImmigrantType)[] = ["firstName", "lastName", "idType", "idNumber", "birthday", "attachment1", "attachment2", "attachment3", "gender", "originCity", "originCountry", "nativeLanguage", "phone", "email", "address1", "address2", "city", "zip"];
    const validate = async () => {
        const isValids = await trigger(fields);
        if (isValids) return true;
        else {
            const firstErrorField = Object.keys(errors).filter((key: any) => fields.includes(key))[0];
            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return false;
        }
    };

    const attachment1 = watch("attachment1");
    const attachment2 = watch("attachment2");
    const attachment3 = watch("attachment3");

    return (
        <>
            <div className="italic text-xl font-serif my-5 text-center">{t.immigrant.subtitle}</div>
            <div className="text-2xl font-bold my-10">
                <label>{t.sectionTitle.personalInformation}</label>
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.firstName} register={register("firstName")} required error={errors.firstName || undefined} />
                <Input label={t.lastName} register={register("lastName")} required error={errors.lastName || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Select label={t.idType.title} options={IDType(t)} register={register("idType")} required error={errors.idType || undefined} />
                <Input label={t.idNumber} register={register("idNumber")} required error={errors.idNumber || undefined} />
            </div>
            <div className="font-bold">
                {t.attachmentLabel}
                <span className="text-red-500">*</span>
            </div>
            <div className="flex flex-wrap mb-6">
                <FileUpload label={t.attachment1} setValue={setValue} field="attachment1" watch={attachment1} error={errors.attachment1 || undefined} />
                <FileUpload label={t.attachment2} setValue={setValue} field="attachment2" watch={attachment2} error={errors.attachment2 || undefined} />
                <FileUpload label={t.attachment3} setValue={setValue} field="attachment3" watch={attachment3} error={errors.attachment3 || undefined} />
            </div>
            <label className="flex space-y-1 mb-6">
                <Birthday label={t.birthday} register_day={register("birthday.day")} register_month={register("birthday.month")} register_year={register("birthday.year")} error={errors.birthday || undefined} />
            </label>
            <div className="flex flex-wrap mb-6">
                <Radio label={t.gender.title} options={Gender(t)} register={register("gender")} required error={errors.gender || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.originCity} register={register("originCity")} required error={errors.originCity || undefined} />
                <Input label={t.originCountry} register={register("originCountry")} required error={errors.originCountry || undefined} />
                <Select label={t.nativeLanguage.title} options={Language(t)} register={register("nativeLanguage")} required error={errors.nativeLanguage || undefined} />
            </div>

            <div className="text-2xl font-bold my-10">
                <label>{t.sectionTitle.contactInformation}</label>
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.phone.title} placeholder={t.phone.placeholder} register={register("phone")} required error={errors.phone || undefined} />
                <Input label={t.email.title} placeholder={t.email.placeholder} register={register("email")} required error={errors.email || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.address1.title} placeholder={t.address1.placeholder} register={register("address1")} required error={errors.address1 || undefined} />
                <Input label={t.address2.title} placeholder={t.address2.placeholder} register={register("address2")} error={errors.address2 || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.city} register={register("city")} required error={errors.city || undefined} />
                <Input label={t.zip} register={register("zip")} error={errors.zip || undefined} />
            </div>

            <div className="flex mt-5">
                <button
                    onClick={async () => {
                        const valid = await validate();
                        if (valid) setPage(1);
                    }}
                    className="btn-theme"
                >
                    {t.button.next}
                </button>
            </div>
        </>
    );
};
export default FirstPage;
