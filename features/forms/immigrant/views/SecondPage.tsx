"use client";

import { Input, Select, Radio } from "../../components/FormComponents";
import ChildrenTable from "../components/ChildrenTable";
import { Birthday } from "../../components/Birthday";
import { Dispatch, SetStateAction, FC } from "react";
import { FieldErrors, UseFormRegister, UseFormTrigger } from "react-hook-form";
import { ImmigrantType } from "../schema/immigrantSchema";
import { IDType, MaritalStatus, YesNo } from "@/common/enums";
import { Dictionary } from "@/common/locales/Dictionary-provider";

type SecondPageProps = {
    setPage: Dispatch<SetStateAction<number>>;
    errors: FieldErrors<ImmigrantType>;
    register: UseFormRegister<ImmigrantType>;
    control: any;
    useWatch: any;
    trigger: UseFormTrigger<ImmigrantType>;
    t: Dictionary;
};
const SecondPage: FC<SecondPageProps> = ({ setPage, errors, register, control, useWatch, trigger, t }) => {
    const fields: (keyof ImmigrantType)[] = ["spouse", "children"];
    const validate = async () => {
        const isValids = await trigger(fields);
        if (isValids) return true;
        else return false;
    };

    const isMarried = useWatch({ control, name: "spouse.maritalStatus" });
    const hasChild = useWatch({ control, name: "children.childStatus" });

    return (
        <>
            <div className="text-2xl font-bold my-10">
                <label>{t.sectionTitle.familyInformation}</label>
            </div>
            <div className="flex flex-wrap mb-6">
                <Select label={t.maritalStatus.title} options={MaritalStatus(t)} register={register("spouse.maritalStatus")} required error={errors.spouse?.maritalStatus || undefined} />
                <div className={"flex flex-wrap md:mb-6 " + (isMarried == "0" || "hidden")}>
                    <Input label={t.spouse.spouseFirstName} register={register("spouse.spouseFirstName")} required error={errors.spouse?.spouseFirstName || undefined} />
                    <Input label={t.spouse.spouseFamilyName} register={register("spouse.spouseFamilyName")} required error={errors.spouse?.spouseFamilyName || undefined} />
                </div>
            </div>
            <div className={"flex flex-wrap mb-6 " + (isMarried == "0" || "hidden")}>
                <Select label={t.spouse.spouseIDType} options={IDType(t)} register={register("spouse.spouseIDType")} required error={errors.spouse?.spouseIDType || undefined} />
                <Input label={t.spouse.spouseIDNumber} register={register("spouse.spouseIDNumber")} required error={errors.spouse?.spouseIDNumber || undefined} />
                <Birthday label={t.spouse.spouseBirthday} register_day={register("spouse.spouseBirthday.day")} register_month={register("spouse.spouseBirthday.month")} register_year={register("spouse.spouseBirthday.year")} error={errors.spouse?.spouseBirthday || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Select label={t.children.title} options={YesNo(t)} register={register("children.childStatus")} required error={errors.children?.childStatus || undefined} />
            </div>
            <div>
                {hasChild == "Yes" && (
                    <>
                        <ChildrenTable register={register} useWatch={useWatch} control={control} errors={errors.children?.childTable} t={t} />
                    </>
                )}
            </div>

            <div className="flex flex-col mt-5">
                <button
                    className="btn-theme"
                    onClick={async () => {
                        if (await validate()) setPage(2);
                    }}
                >
                    {t.button.next}
                </button>
                <button type="button" className="btn-gray" onClick={() => setPage(0)}>
                    {t.button.back}
                </button>
            </div>
        </>
    );
};
export default SecondPage;
