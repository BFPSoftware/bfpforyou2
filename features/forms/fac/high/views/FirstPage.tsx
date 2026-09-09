"use client";

import { Input, Select, Textarea } from "../../../components/FormComponents";
import { Birthday } from "../../../components/Birthday";
import { FC } from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { HighGrades, Highschools, YesNo } from "@/common/enums";
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
    const showSiblingsFollowup = introHasSiblings === "Yes";
    const showFutureBecome = futureHasPlans === "Yes";
    const showFutureDesire = futureHasPlans === "No";

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
            <Row>
                <Input label={t.elementary.age} register={register("age")} required error={errors.age || undefined} />
                <div className="flex flex-wrap mb-6">
                    <Select label={t.elementary.grade} options={HighGrades(t)} register={register("grade")} required error={errors.grade || undefined} />
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
            <Row>
                <Textarea label={q.introFamilyAndLiving} register={register("introFamilyAndLiving")} required watch={watch} error={errors.introFamilyAndLiving || undefined} minLength={1} />
            </Row>
            <Row>
                <Textarea label={q.introLiveWith} register={register("introLiveWith")} required watch={watch} error={errors.introLiveWith || undefined} minLength={1} />
            </Row>
            <Row>
                <Select
                    label={q.introHasSiblings}
                    options={YesNo(t)}
                    register={register("introHasSiblings")}
                    required
                    error={errors.introHasSiblings || undefined}
                />
            </Row>
            <div key="intro-siblings-followup" hidden={!showSiblingsFollowup} aria-hidden={!showSiblingsFollowup}>
                <Row>
                    <Textarea label={q.introHowManySiblings} register={register("introHowManySiblings")} required={showSiblingsFollowup} watch={watch} error={errors.introHowManySiblings || undefined} minLength={1} />
                </Row>
            </div>
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
                <Select
                    label={q.futureHasPlans}
                    options={YesNo(t)}
                    register={register("futureHasPlans")}
                    required
                    error={errors.futureHasPlans || undefined}
                />
            </Row>
            <div key="future-become" hidden={!showFutureBecome} aria-hidden={!showFutureBecome}>
                <Row>
                    <Textarea label={q.futureBecome} register={register("futureBecome")} required={showFutureBecome} watch={watch} error={errors.futureBecome || undefined} minLength={1} />
                </Row>
            </div>
            <div key="future-desire" hidden={!showFutureDesire} aria-hidden={!showFutureDesire}>
                <Row>
                    <Textarea label={q.futureDesire} register={register("futureDesire")} required={showFutureDesire} watch={watch} error={errors.futureDesire || undefined} minLength={1} />
                </Row>
            </div>
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
                <div className="hover:opacity-80 text-xl m-2">
                    <label htmlFor="check1" className="flex items-start gap-2 cursor-pointer">
                        <input id="check1" type="checkbox" className="mt-1" {...register("check1")} />
                        <span>{t.elementary.check1}</span>
                    </label>
                    {errors.check1 && <div className="text-sm text-red-500">{errors.check1.message}</div>}
                </div>
                <div className="hover:opacity-80 text-xl m-2">
                    <label htmlFor="check2" className="flex items-start gap-2 cursor-pointer">
                        <input id="check2" type="checkbox" className="mt-1" {...register("check2")} />
                        <span>{t.elementary.check2}</span>
                    </label>
                    {errors.check2 && <div className="text-sm text-red-500">{errors.check2.message}</div>}
                </div>
            </Row>
        </>
    );
};
export default FirstPage;
