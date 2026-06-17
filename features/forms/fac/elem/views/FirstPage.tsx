"use client";

import { Input, Select, Textarea } from "../../../components/FormComponents";
import { Birthday } from "../../../components/Birthday";
import { FC } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ElemSchools, Grades, YesNo } from "@/common/enums";
import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FacelemType } from "../../schema/facelemSchema";

import Row from "@/features/forms/components/Row";
import FileUpload from "../../../components/FileUpload";

type LiveWithKey = "Father" | "Mother" | "Brother" | "Sister" | "Grandparents" | "Other";

type FirstPageProps = {
    errors: FieldErrors<FacelemType>;
    register: UseFormRegister<FacelemType>;
    setValue: UseFormSetValue<FacelemType>;
    t: Dictionary;
    watch: UseFormWatch<FacelemType>;
};

const liveWithLabels = (t: Dictionary): Record<LiveWithKey, string> => ({
    Father: t.elementary.liveWithFather,
    Mother: t.elementary.liveWithMother,
    Brother: t.elementary.liveWithBrother,
    Sister: t.elementary.liveWithSister,
    Grandparents: t.elementary.liveWithGrandparents,
    Other: t.elementary.liveWithOtherOption,
});

const FirstPage: FC<FirstPageProps> = ({ errors, register, setValue, t, watch }) => {
    const photo = watch("photo") ?? null;
    const liveWith = watch("liveWith") ?? [];
    const lwLabels = liveWithLabels(t);
    const calendarYear = new Date().getFullYear();
    const gradeLabel = t.elementary.gradeWithSchoolYear.replace("{year}", `${calendarYear}-${calendarYear + 1}`);

    const toggleLiveWith = (key: LiveWithKey) => {
        const next = liveWith.includes(key) ? liveWith.filter((x) => x !== key) : [...liveWith, key];
        setValue("liveWith", next, { shouldValidate: true, shouldDirty: true });
        if (!next.includes("Brother")) setValue("brothers", "", { shouldValidate: true });
        if (!next.includes("Sister")) setValue("sisters", "", { shouldValidate: true });
        if (!next.includes("Other")) setValue("liveWithOther", "", { shouldValidate: true });
    };

    const liveWithInlineInputClass =
        "text-gray-800 rounded-md border border-gray-300 py-2 px-3 text-base focus:outline focus:outline-sky-500 focus:ring-2 focus:ring-sky-500/30 min-w-[6rem] max-w-[12rem]";
    const liveWithOtherInputClass =
        "text-gray-800 rounded-md border border-gray-300 py-2 px-3 text-base focus:outline focus:outline-sky-500 focus:ring-2 focus:ring-sky-500/30 min-w-[10rem] flex-1 max-w-md";

    return (
        <>
            <div className="italic text-xl font-serif my-5 text-center">{t.fac.subtitle}</div>
            <div className="text-2xl font-bold my-10">
                <label>{t.elementary.sectionTitle.funFacts}</label>
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.firstName} register={register("firstName")} required error={errors.firstName || undefined} />
                <Input label={t.lastName} register={register("lastName")} required error={errors.lastName || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.elementary.tz} register={register("tz")} required error={errors.tz || undefined} />
            </div>
            <Row>
                <Birthday
                    label={t.birthday}
                    register_day={register("birthday.day")}
                    register_month={register("birthday.month")}
                    register_year={register("birthday.year")}
                    error={errors.birthday || undefined}
                    required
                />
                <Input label={t.elementary.age} register={register("age")} required error={errors.age || undefined} />
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
                        title: "Photo requirements (headshot)",
                        description: "Please upload a clear, well-lit headshot where your face is fully visible.",
                        imageSrc: "/images/image-example.png",
                    }}
                />
            </div>
            <div className="flex flex-wrap mb-6">
                <Select label={gradeLabel} options={Grades(t)} register={register("grade")} required error={errors.grade || undefined} />
            </div>
            <Row>
                <Select label={t.elementary.school} options={ElemSchools(t)} register={register("elemSchool")} required error={errors.elemSchool || undefined} />
                <Select label={t.elementary.wereInProgramBefore} options={YesNo(t)} register={register("returning")} required error={errors.returning || undefined} />
            </Row>

            <div className="flex flex-wrap mb-6">
                <Input
                    label={t.elementary.madeAliyah}
                    placeholder={t.common.enterHere}
                    register={register("madeAliyah")}
                    required
                    error={errors.madeAliyah || undefined}
                />
            </div>

            <div className="text-2xl font-bold my-10">
                <label>{t.elementary.sectionTitle.meAndMyFamily}</label>
            </div>
            <Row>
                <Input label={t.elementary.q1} placeholder={t.common.enterHere} register={register("familyMembers")} required error={errors.familyMembers || undefined} />
            </Row>
            <div className="flex flex-col gap-3 mb-6 w-full max-w-3xl">
                <div className="font-semibold mb-1">
                    {t.elementary.liveWith}
                    <span className="text-red-500">*</span>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-lg">
                    <input type="checkbox" checked={liveWith.includes("Father")} onChange={() => toggleLiveWith("Father")} />
                    <span>{lwLabels.Father}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-lg">
                    <input type="checkbox" checked={liveWith.includes("Mother")} onChange={() => toggleLiveWith("Mother")} />
                    <span>{lwLabels.Mother}</span>
                </label>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-lg shrink-0">
                            <input type="checkbox" checked={liveWith.includes("Brother")} onChange={() => toggleLiveWith("Brother")} />
                            <span>{lwLabels.Brother}</span>
                        </label>
                        {liveWith.includes("Brother") && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-red-500 font-semibold leading-none select-none" title={t.error.required} aria-hidden>
                                    *
                                </span>
                                <input
                                    type="text"
                                    className={liveWithInlineInputClass + (errors.brothers ? " border-red-500" : "")}
                                    placeholder={t.elementary.liveWithHowManyPlaceholder}
                                    aria-label={t.elementary.liveWithBrotherCount}
                                    aria-required="true"
                                    {...register("brothers")}
                                />
                            </div>
                        )}
                    </div>
                    {errors.brothers?.message && <div className="text-red-500 text-xs pl-1">{errors.brothers.message}</div>}
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-lg shrink-0">
                            <input type="checkbox" checked={liveWith.includes("Sister")} onChange={() => toggleLiveWith("Sister")} />
                            <span>{lwLabels.Sister}</span>
                        </label>
                        {liveWith.includes("Sister") && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-red-500 font-semibold leading-none select-none" title={t.error.required} aria-hidden>
                                    *
                                </span>
                                <input
                                    type="text"
                                    className={liveWithInlineInputClass + (errors.sisters ? " border-red-500" : "")}
                                    placeholder={t.elementary.liveWithHowManyPlaceholder}
                                    aria-label={t.elementary.liveWithSisterCount}
                                    aria-required="true"
                                    {...register("sisters")}
                                />
                            </div>
                        )}
                    </div>
                    {errors.sisters?.message && <div className="text-red-500 text-xs pl-1">{errors.sisters.message}</div>}
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-lg">
                    <input type="checkbox" checked={liveWith.includes("Grandparents")} onChange={() => toggleLiveWith("Grandparents")} />
                    <span>{lwLabels.Grandparents}</span>
                </label>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-lg shrink-0">
                            <input type="checkbox" checked={liveWith.includes("Other")} onChange={() => toggleLiveWith("Other")} />
                            <span>{lwLabels.Other}</span>
                        </label>
                        {liveWith.includes("Other") && (
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <span className="text-red-500 font-semibold leading-none select-none shrink-0" title={t.error.required} aria-hidden>
                                    *
                                </span>
                                <input
                                    type="text"
                                    className={liveWithOtherInputClass + (errors.liveWithOther ? " border-red-500" : "")}
                                    placeholder={t.elementary.liveWithOtherInlinePlaceholder}
                                    aria-label={t.elementary.liveWithOtherDetail}
                                    aria-required="true"
                                    {...register("liveWithOther")}
                                />
                            </div>
                        )}
                    </div>
                    {errors.liveWithOther?.message && <div className="text-red-500 text-xs pl-1">{errors.liveWithOther.message}</div>}
                </div>

                {errors.liveWith && <div className="text-red-500 text-sm">{(errors.liveWith as { message?: string }).message}</div>}
            </div>
            <Row>
                <Input label={t.elementary.q4} placeholder={t.common.enterHere} register={register("isfrom")} required error={errors.isfrom || undefined} />
                <Input label={t.elementary.q5} placeholder={t.common.enterHere} register={register("languageAtHome")} required error={errors.languageAtHome || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.q7} placeholder={t.common.enterHere} register={register("aboutFamily")} required error={errors.aboutFamily || undefined} />
            </Row>

            <div className="text-2xl font-bold my-10">
                <label>{t.elementary.sectionTitle.meAndSchool}</label>
            </div>
            <Row>
                <Input label={t.elementary.q8} placeholder={t.common.enterHere} register={register("favoriteSubject")} required error={errors.favoriteSubject || undefined} />
                <Input label={t.elementary.q9} placeholder={t.common.enterHere} register={register("challengingSubject")} required error={errors.challengingSubject || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.q11} placeholder={t.common.enterHere} register={register("aboutMeFromTeacher")} required error={errors.aboutMeFromTeacher || undefined} />
            </Row>
            <Row>
                <Textarea
                    label={t.elementary.enjoySchoolWhy}
                    placeholder={t.common.enterHere}
                    register={register("enjoySchoolWhy")}
                    required
                    watch={watch}
                    error={errors.enjoySchoolWhy || undefined}
                    minLength={1}
                />
            </Row>

            <div className="text-2xl font-bold my-10">
                <label>{t.elementary.sectionTitle.littleMoreAboutMyself}</label>
            </div>
            <Row>
                <Input label={t.elementary.favoriteColor} placeholder={t.common.enterHere} register={register("favoriteColor")} required error={errors.favoriteColor || undefined} />
                <Input label={t.elementary.favoriteFood} placeholder={t.common.enterHere} register={register("favoriteFood")} required error={errors.favoriteFood || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.hobbies} placeholder={t.common.enterHere} register={register("hobbies")} required error={errors.hobbies || undefined} />
                <Input label={t.elementary.makesMeHappy} placeholder={t.common.enterHere} register={register("makesMeHappy")} required error={errors.makesMeHappy || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.makesMeSad} placeholder={t.common.enterHere} register={register("makesMeSad")} required error={errors.makesMeSad || undefined} />
                <Input label={t.elementary.loveMost} placeholder={t.common.enterHere} register={register("loveMost")} required error={errors.loveMost || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.futureDreams} placeholder={t.common.enterHere} register={register("futureDreams")} required error={errors.futureDreams || undefined} />
            </Row>

            <div className="my-5"></div>
            <Row>
                <Input label={t.elementary.forTeacher1} placeholder={t.common.enterHere} register={register("familysituation")} required error={errors.familysituation || undefined} />
                <Input label={t.elementary.forTeacher2} placeholder={t.common.enterHere} register={register("schoolsituation")} required error={errors.schoolsituation || undefined} />
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
