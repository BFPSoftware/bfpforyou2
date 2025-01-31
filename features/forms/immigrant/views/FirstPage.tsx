"use client";

import { Input, Select, Radio } from "../components/FormComponents";
import { Birthday } from "../components/Birthday";
import { Dispatch, FC, SetStateAction } from "react";
import { FieldErrors, UseFormRegister, UseFormTrigger } from "react-hook-form";
import { ContactType } from "../schema/contact";
import FileUpload from "../components/FileUpload";
import { Gender, IDType, Language } from "@/common/enums";
import { Dictionary } from "@/common/locales/Dictionary-provider";

type FirstPageProps = {
    setPage: Dispatch<SetStateAction<number>>;
    errors: FieldErrors<ContactType>;
    register: UseFormRegister<ContactType>;
    setValue: any;
    trigger: UseFormTrigger<ContactType>;
    t: Dictionary;
};
const FirstPage: FC<FirstPageProps> = ({ setPage, errors, register, setValue, trigger, t }) => {
    const fields: (keyof ContactType)[] = ["firstName", "lastName", "idType", "idNumber", "birthday", "attachment1", "attachment2", "attachment3", "gender", "originCity", "originCountry", "nativeLanguage", "phone", "email", "address1", "address2", "city", "zip"];
    const validate = async () => {
        const isValids = await trigger(fields);
        console.log("isValid FirstPage: " + isValids);
        if (isValids) return true;
        else return false;
    };

    return (
        <>
            <div className="italic text-xl font-serif my-5 text-center">{t.immigrant.subtitle}</div>
            <div className="text-2xl font-bold my-10">
                <label>{t.sectionTitle.personalInformation}</label>
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.firstName} register={register("firstName")} required error={errors.firstName || undefined} />
                <Input label={t.lastName} register={register("lastName")} error={errors.lastName || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Select label={t.idType.title} options={IDType(t)} register={register("idType")} error={errors.idType || undefined} />
                <Input label={t.idNumber} register={register("idNumber")} error={errors.idNumber || undefined} />
            </div>
            <div className="font-bold">{t.attachmentLabel}</div>
            <div className="flex flex-wrap mb-6">
                <FileUpload label={t.attachment1} setValue={setValue} field="attachment1" error={errors.attachment1 || undefined} />
                <FileUpload label={t.attachment2} setValue={setValue} field="attachment2" error={errors.attachment2 || undefined} />
                <FileUpload label={t.attachment3} setValue={setValue} field="attachment3" error={errors.attachment3 || undefined} />
            </div>
            <label className="flex space-y-1 mb-6">
                <Birthday label={t.birthday} register_day={register("birthday.day")} register_month={register("birthday.month")} register_year={register("birthday.year")} error={errors.birthday || undefined} />
            </label>
            <div className="flex flex-wrap mb-6">
                <Radio label={t.gender.title} options={Gender(t)} register={register("gender")} error={errors.gender || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.originCity} register={register("originCity")} error={errors.originCity || undefined} />
                <Input label={t.originCountry} register={register("originCountry")} error={errors.originCountry || undefined} />
                <Select label={t.nativeLanguage.title} options={Language(t)} register={register("nativeLanguage")} error={errors.nativeLanguage || undefined} />
            </div>

            <div className="text-2xl font-bold my-10">
                <label>{t.sectionTitle.contactInformation}</label>
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.phone.title} placeholder={t.phone.placeholder} register={register("phone")} error={errors.phone || undefined} />
                <Input label={t.email.title} placeholder={t.email.placeholder} register={register("email")} error={errors.email || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.address1.title} placeholder={t.address1.placeholder} register={register("address1")} error={errors.address1 || undefined} />
                <Input label={t.address2.title} placeholder={t.address2.placeholder} register={register("address2")} error={errors.address2 || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.city} register={register("city")} error={errors.city || undefined} />
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
