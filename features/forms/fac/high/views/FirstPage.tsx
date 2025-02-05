"use client";

import { Input, Select, Textarea } from "../../../components/FormComponents";
import { Birthday } from "../../../components/Birthday";
import { FC } from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { ElemSchools, Highschools, YesNo } from "@/common/enums";
import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FachighType } from "../../schema/fachighSchema";

import Row from "@/features/forms/components/Row";
import FileUpload from "../../../components/FileUpload";

type FirstPageProps = {
    errors: FieldErrors<FachighType>;
    register: UseFormRegister<FachighType>;
    setValue: any;
    t: Dictionary;
    watch: UseFormWatch<FachighType>;
};
const FirstPage: FC<FirstPageProps> = ({ errors, register, setValue, t, watch }) => {
    return (
        <>
            <div className="italic text-xl font-serif my-5 text-center">{t.fac.subtitle}</div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.firstName} register={register("firstName")} required error={errors.firstName || undefined} />
                <Input label={t.lastName} register={register("lastName")} required error={errors.lastName || undefined} />
            </div>
            <Row>
                <Input label={t.elementary.tz} register={register("tz")} required error={errors.tz || undefined} />
                <Birthday label={t.birthday} register_day={register("birthday.day")} register_month={register("birthday.month")} register_year={register("birthday.year")} error={errors.birthday || undefined} />
            </Row>
            <label className="flex space-y-1 mb-6"></label>
            <Row>
                <Input label={t.elementary.age} register={register("age")} required error={errors.age || undefined} />
                <div className="flex flex-wrap mb-6">
                    <Select label={t.elementary.grade} options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]} register={register("grade")} required error={errors.grade || undefined} />
                </div>
            </Row>
            <div className="flex flex-wrap mb-6">
                <FileUpload label={t.elementary.photo} setValue={setValue} field="photo" error={errors.photo || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.elementary.birthCountry} register={register("originCountry")} required error={errors.originCountry || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Select label={t.elementary.school} options={Highschools(t)} register={register("school")} required error={errors.school || undefined} />
                <Select label={t.elementary.isFirstTime} options={YesNo(t)} register={register("returning")} required error={errors.returning || undefined} />
            </div>
            {/* Section 2 */}
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.introduction}</label>
            </div>
            <Row>
                <Textarea label={t.highschool.introduction} placeholder={t.highschool.enter100} register={register("introduction")} required watch={watch} error={errors.introduction || undefined} />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.school}</label>
            </div>
            <Row>
                <Textarea label={t.highschool.school} placeholder={t.highschool.enter100} register={register("aboutSchool")} required watch={watch} error={errors.aboutSchool || undefined} />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.personalLife}</label>
            </div>
            <Row>
                <Textarea label={t.highschool.personalLife} placeholder={t.highschool.enter100} register={register("personalLife")} required watch={watch} error={errors.personalLife || undefined} />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.yourFuture}</label>
            </div>
            <Row>
                <Textarea label={t.highschool.yourFuture} placeholder={t.highschool.enter100} register={register("future")} required watch={watch} error={errors.future || undefined} />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.scholarship}</label>
            </div>
            <Row>
                <Textarea label={t.highschool.scholarship} placeholder={t.highschool.enter100} register={register("scholarship")} required watch={watch} error={errors.scholarship || undefined} />
            </Row>
            {/* Section 3 */}
            <div className="my-5"></div>
            <Row>
                <Input label={t.elementary.submittedBy} placeholder={t.common.enterHere} register={register("submittedBy")} required error={errors.submittedBy || undefined} />
                <Input label={t.elementary.relationship} placeholder={t.elementary.relationship_helper} register={register("relationship")} required error={errors.relationship || undefined} />
            </Row>
            <Row>
                <label className="hover:opacity-80 text-xl m-2 cursor-pointer">
                    <input id="check1" type="checkbox" {...register("check1")} />
                    <label className="cursor-pointer" htmlFor="check1">
                        {t.elementary.check1}
                    </label>
                    {errors.check1 && <div className="text-sm text-red-500">{errors.check1.message}</div>}
                </label>
                <label className="hover:opacity-80 text-xl m-2 cursor-pointer">
                    <input id="check2" type="checkbox" {...register("check2")} />
                    <label className="cursor-pointer" htmlFor="check2">
                        {t.elementary.check2}
                    </label>
                    {errors.check2 && <div className="text-sm text-red-500">{errors.check2.message}</div>}
                </label>
            </Row>
        </>
    );
};
export default FirstPage;
