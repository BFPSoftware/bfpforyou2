"use client";

import { Input, Select, Textarea } from "../../../components/FormComponents";
import { Birthday } from "../../../components/Birthday";
import { FC } from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Grades, Highschools, YesNo } from "@/common/enums";
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
    const photo = watch("photo") ?? null;
    const introHasSiblings = watch("introHasSiblings");
    const futureHasPlans = watch("futureHasPlans");
    const q = t.highschool.questions;

    return (
        <>
            <div className="italic text-xl font-serif my-5 text-center">{t.fac.subtitle}</div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.firstName} register={register("firstName")} required error={errors.firstName || undefined} />
                <Input label={t.lastName} register={register("lastName")} required error={errors.lastName || undefined} />
            </div>
            <Row>
                <Input label={t.elementary.tz} register={register("tz")} required error={errors.tz || undefined} />
                <Birthday label={t.birthday} register_day={register("birthday.day")} register_month={register("birthday.month")} register_year={register("birthday.year")} error={errors.birthday || undefined} required />
            </Row>
            <label className="flex space-y-1 mb-6"></label>
            <Row>
                <Input label={t.elementary.age} register={register("age")} required error={errors.age || undefined} />
                <div className="flex flex-wrap mb-6">
                    <Select label={t.elementary.grade} options={Grades(t)} register={register("grade")} required error={errors.grade || undefined} />
                </div>
            </Row>
            <div className="flex flex-wrap mb-6">
                <FileUpload
                    label={t.elementary.photo}
                    setValue={setValue}
                    watch={photo}
                    field="photo"
                    error={errors.photo || undefined}
                    photoOptional
                    showRequiredAsterisk
                    info={{
                        title: t.highschool.photoInfoTitle,
                        description: t.highschool.photoInfoDescription,
                        imageSrc: "/images/image-example.png",
                    }}
                />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.elementary.birthCountry} register={register("originCountry")} required error={errors.originCountry || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Select label={t.elementary.school} options={Highschools(t)} register={register("school")} required error={errors.school || undefined} />
                <Select label={t.elementary.wereInProgramBefore} options={YesNo(t)} register={register("returning")} required error={errors.returning || undefined} />
            </div>

            <div className="flex flex-wrap mb-6">
                <Input label={t.elementary.madeAliyah} placeholder={t.common.enterHere} register={register("madeAliyah")} required error={errors.madeAliyah || undefined} />
            </div>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.introduction}</label>
            </div>
            <div className="text-sm text-gray-600 -mt-6 mb-6">{t.highschool.introductionHint}</div>
            <Row>
                <Textarea label={q.introLiveWith} register={register("introLiveWith")} required watch={watch} error={errors.introLiveWith || undefined} minLength={1} />
            </Row>
            <Row>
                <label className="flex flex-col space-y-1 w-auto me-5 grow md:max-w-xl">
                    <div className="font-semibold mb-1">
                        {q.introHasSiblings}
                        <span className="text-red-500">*</span>
                    </div>
                    <div className="mt-4 flex gap-6">
                        <label className="cursor-pointer">
                            <input className="mx-2" type="radio" value="Yes" {...register("introHasSiblings")} />
                            {t.select.Yes}
                        </label>
                        <label className="cursor-pointer">
                            <input className="mx-2" type="radio" value="No" {...register("introHasSiblings")} />
                            {t.select.No}
                        </label>
                    </div>
                    {errors.introHasSiblings && <div className="text-red-500 pl-1 pt-1 text-xs">{errors.introHasSiblings.message}</div>}
                </label>
            </Row>
            {introHasSiblings === "Yes" && (
                <Row>
                    <Textarea label={q.introHowManySiblings} register={register("introHowManySiblings")} required watch={watch} error={errors.introHowManySiblings || undefined} minLength={1} />
                </Row>
            )}
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.school}</label>
            </div>
            <Row>
                <Textarea label={q.schoolLikeFor} register={register("schoolLikeFor")} required watch={watch} error={errors.schoolLikeFor || undefined} minLength={1} />
            </Row>
            <Row>
                <Textarea label={t.highschool.schoolGoodChallengingLabel} register={register("schoolGoodChallenging")} required watch={watch} error={errors.schoolGoodChallenging || undefined} minLength={1} />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.personalLife}</label>
            </div>
            <Row>
                <Textarea label={q.personalFreeTime} register={register("personalFreeTime")} required watch={watch} error={errors.personalFreeTime || undefined} minLength={1} />
            </Row>
            <Row>
                <Textarea label={q.personalHobbies} register={register("personalHobbies")} required watch={watch} error={errors.personalHobbies || undefined} minLength={1} />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.yourFuture}</label>
            </div>
            <Row>
                <label className="flex flex-col space-y-1 w-auto me-5 grow md:max-w-xl">
                    <div className="font-semibold mb-1">
                        {q.futureHasPlans}
                        <span className="text-red-500">*</span>
                    </div>
                    <div className="mt-4 flex gap-6">
                        <label className="cursor-pointer">
                            <input className="mx-2" type="radio" value="Yes" {...register("futureHasPlans")} />
                            {t.select.Yes}
                        </label>
                        <label className="cursor-pointer">
                            <input className="mx-2" type="radio" value="No" {...register("futureHasPlans")} />
                            {t.select.No}
                        </label>
                    </div>
                    {errors.futureHasPlans && <div className="text-red-500 pl-1 pt-1 text-xs">{errors.futureHasPlans.message}</div>}
                </label>
            </Row>
            {futureHasPlans === "Yes" && (
                <Row>
                    <Textarea label={q.futureBecome} register={register("futureBecome")} required watch={watch} error={errors.futureBecome || undefined} minLength={1} />
                </Row>
            )}
            {futureHasPlans === "No" && (
                <Row>
                    <Textarea label={q.futureDesire} register={register("futureDesire")} required watch={watch} error={errors.futureDesire || undefined} minLength={1} />
                </Row>
            )}
            <Row>
                <Textarea label={q.futureTenYears} register={register("futureTenYears")} required watch={watch} error={errors.futureTenYears || undefined} minLength={1} />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.scholarship}</label>
            </div>
            <Row>
                <Textarea label={q.scholarshipReason} register={register("scholarshipReason")} required watch={watch} error={errors.scholarshipReason || undefined} minLength={1} />
            </Row>
            <div className="my-5"></div>
            <Row>
                <Input label={t.elementary.submittedBy} placeholder={t.common.enterHere} register={register("submittedBy")} required error={errors.submittedBy || undefined} />
                <Input label={t.elementary.relationship} placeholder={t.elementary.relationship_helper} register={register("relationship")} required error={errors.relationship || undefined} />
            </Row>
            <Row>
                <label className="hover:opacity-80 text-xl m-2 cursor-pointer">
                    <input id="check1" type="checkbox" {...register("check1")} />
                    <label className="m-2 cursor-pointer" htmlFor="check1">
                        {t.elementary.check1}
                    </label>
                    {errors.check1 && <div className="text-sm text-red-500">{errors.check1.message}</div>}
                </label>
                <label className="hover:opacity-80 text-xl m-2 cursor-pointer">
                    <input id="check2" type="checkbox" {...register("check2")} />
                    <label className="m-2 cursor-pointer" htmlFor="check2">
                        {t.elementary.check2}
                    </label>
                    {errors.check2 && <div className="text-sm text-red-500">{errors.check2.message}</div>}
                </label>
            </Row>
        </>
    );
};
export default FirstPage;
