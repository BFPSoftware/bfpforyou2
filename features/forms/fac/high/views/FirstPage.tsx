"use client";

import { Input, Select, Textarea } from "../../../components/FormComponents";
import { Birthday } from "../../../components/Birthday";
import { FC } from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { ElemSchools, Grades, Highschools, YesNo } from "@/common/enums";
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
    return (
        <>
            <div className="italic text-xl font-serif my-5 text-center">{t.fac.subtitle}</div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.firstName} register={register("firstName")} required error={errors.firstName || undefined} />
                <Input label={t.lastName} register={register("lastName")} required error={errors.lastName || undefined} />
            </div>
            <Row>
                <Input label={t.elementary.tz} register={register("tz")} required error={errors.tz || undefined} />
                <Birthday
                    label={t.birthday}
                    register_day={register("birthday.day")}
                    register_month={register("birthday.month")}
                    register_year={register("birthday.year")}
                    error={errors.birthday || undefined}
                    required
                />
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
                    showRequiredAsterisk
                    info={{
                        title: "Photo requirements (headshot)",
                        description: "Please upload a clear, well-lit headshot where your face is fully visible.",
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
            {/* Section 2 */}
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.introduction}</label>
            </div>
            <div className="text-sm text-gray-600 -mt-6 mb-6">
                {/* TODO: i18n */}
                Introduce yourself and describe your family and living situation.
            </div>
            <Row>
                {/* TODO: i18n */}
                <Textarea label="Do you live with your parents?" register={register("introLiveWith")} required watch={watch} error={errors.introLiveWith || undefined} minLength={1} />
            </Row>
            <Row>
                <label className="flex flex-col space-y-1 w-auto me-5 grow md:max-w-xl">
                    <div className="font-semibold mb-1">
                        {/* TODO: i18n */}
                        Do you have siblings?
                        <span className="text-red-500">*</span>
                    </div>
                    <div className="mt-4 flex gap-6">
                        <label className="cursor-pointer">
                            <input className="mx-2" type="radio" value="Yes" {...register("introHasSiblings")} />
                            Yes
                        </label>
                        <label className="cursor-pointer">
                            <input className="mx-2" type="radio" value="No" {...register("introHasSiblings")} />
                            No
                        </label>
                    </div>
                    {errors.introHasSiblings && <div className="text-red-500 pl-1 pt-1 text-xs">{errors.introHasSiblings.message}</div>}
                </label>
            </Row>
            {introHasSiblings === "Yes" && (
                <Row>
                    {/* TODO: i18n */}
                    <Textarea
                        label="If so, how many brothers or sisters?"
                        register={register("introHowManySiblings")}
                        required
                        watch={watch}
                        error={errors.introHowManySiblings || undefined}
                        minLength={1}
                    />
                </Row>
            )}
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.school}</label>
            </div>
            <Row>
                {/* TODO: i18n */}
                <Textarea label="What is school like for you?" register={register("schoolLikeFor")} required watch={watch} error={errors.schoolLikeFor || undefined} minLength={1} />
            </Row>
            <Row>
                {/* TODO: i18n */}
                <Textarea
                    label={t.highschool.schoolGoodChallengingLabel}
                    labelPreLine
                    register={register("schoolGoodChallenging")}
                    required
                    watch={watch}
                    error={errors.schoolGoodChallenging || undefined}
                    minLength={1}
                />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.personalLife}</label>
            </div>
            <Row>
                {/* TODO: i18n */}
                <Textarea
                    label="What do you like to do in your free time?"
                    register={register("personalFreeTime")}
                    required
                    watch={watch}
                    error={errors.personalFreeTime || undefined}
                    minLength={1}
                />
            </Row>
            <Row>
                {/* TODO: i18n */}
                <Textarea
                    label="What are some of your favorite hobbies, activities, or things to do?"
                    register={register("personalHobbies")}
                    required
                    watch={watch}
                    error={errors.personalHobbies || undefined}
                    minLength={1}
                />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.yourFuture}</label>
            </div>
            <Row>
                <label className="flex flex-col space-y-1 w-auto me-5 grow md:max-w-xl">
                    <div className="font-semibold mb-1">
                        {/* TODO: i18n */}
                        Do you have plans for your future?
                        <span className="text-red-500">*</span>
                    </div>
                    <div className="mt-4 flex gap-6">
                        <label className="cursor-pointer">
                            <input className="mx-2" type="radio" value="Yes" {...register("futureHasPlans")} />
                            Yes
                        </label>
                        <label className="cursor-pointer">
                            <input className="mx-2" type="radio" value="No" {...register("futureHasPlans")} />
                            No
                        </label>
                    </div>
                    {errors.futureHasPlans && <div className="text-red-500 pl-1 pt-1 text-xs">{errors.futureHasPlans.message}</div>}
                </label>
            </Row>
            {futureHasPlans === "Yes" && (
                <Row>
                    {/* TODO: i18n */}
                    <Textarea
                        label="If so, what would you like to become and what dreams do you have?"
                        register={register("futureBecome")}
                        required
                        watch={watch}
                        error={errors.futureBecome || undefined}
                        minLength={1}
                    />
                </Row>
            )}
            {futureHasPlans === "No" && (
                <Row>
                    {/* TODO: i18n */}
                    <Textarea
                        label="If not, what would you desire to do?"
                        register={register("futureDesire")}
                        required
                        watch={watch}
                        error={errors.futureDesire || undefined}
                        minLength={1}
                    />
                </Row>
            )}
            <Row>
                {/* TODO: i18n */}
                <Textarea
                    label="How do you see yourself in 10 years as far as career or family?"
                    register={register("futureTenYears")}
                    required
                    watch={watch}
                    error={errors.futureTenYears || undefined}
                    minLength={1}
                />
            </Row>
            <div className="text-2xl font-bold my-10">
                <label>{t.highschool.sectionTitle.scholarship}</label>
            </div>
            <Row>
                {/* TODO: i18n */}
                <Textarea
                    label="What are the reasons you want this scholarship?"
                    register={register("scholarshipReason")}
                    required
                    watch={watch}
                    error={errors.scholarshipReason || undefined}
                    minLength={1}
                />
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
