"use client";

import { Input, Select } from "../../../components/FormComponents";
import { Birthday } from "../../../components/Birthday";
import { FC } from "react";
import { FieldErrors, UseFormRegister, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { ElemSchools, Grades, YesNo } from "@/common/enums";
import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FacelemType } from "../../schema/facelemSchema";

import Row from "@/features/forms/components/Row";
import FileUpload from "../../../components/FileUpload";

type FirstPageProps = {
    errors: FieldErrors<FacelemType>;
    register: UseFormRegister<FacelemType>;
    setValue: any;
    t: Dictionary;
    watch: UseFormWatch<FacelemType>;
};
const FirstPage: FC<FirstPageProps> = ({ errors, register, setValue, t, watch }) => {
    const photo = watch("photo");
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
            <label className="flex space-y-1 mb-6">
                <Birthday label={t.birthday} register_day={register("birthday.day")} register_month={register("birthday.month")} register_year={register("birthday.year")} error={errors.birthday || undefined} />
            </label>
            <div className="flex flex-wrap mb-6">
                <Input label={t.elementary.age} register={register("age")} required error={errors.age || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <FileUpload label={t.elementary.photo} setValue={setValue} watch={photo} field="photo" error={errors.photo || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Select label={t.elementary.grade} options={Grades(t)} register={register("grade")} required error={errors.grade || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Input label={t.elementary.birthCountry} register={register("originCountry")} required error={errors.originCountry || undefined} />
            </div>
            <div className="flex flex-wrap mb-6">
                <Select label={t.elementary.school} options={ElemSchools(t)} register={register("elemSchool")} required error={errors.elemSchool || undefined} />
            </div>
            <Select label={t.elementary.isFirstTime} options={YesNo(t)} register={register("returning")} required error={errors.returning || undefined} />
            {/* Section 2 */}
            <div className="text-2xl font-bold my-10">
                <label>{t.elementary.sectionTitle.meAndMyFamily}</label>
            </div>
            <Row>
                <Input label={t.elementary.q1} placeholder={t.common.enterHere} register={register("familyMembers")} required error={errors.familyMembers || undefined} />
                <Input label={t.elementary.q2} placeholder={t.common.enterHere} register={register("brothers")} required error={errors.brothers || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.q3} placeholder={t.common.enterHere} register={register("sisters")} required error={errors.sisters || undefined} />
                <Input label={t.elementary.q4} placeholder={t.common.enterHere} register={register("isfrom")} required error={errors.isfrom || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.q5} placeholder={t.common.enterHere} register={register("languageAtHome")} required error={errors.languageAtHome || undefined} />
                <Input label={t.elementary.q7} placeholder={t.common.enterHere} register={register("aboutFamily")} required error={errors.aboutFamily || undefined} />
            </Row>
            {/* Section 3 */}
            <div className="text-2xl font-bold my-10">
                <label>{t.elementary.sectionTitle.meAndSchool}</label>
            </div>
            <Row>
                <Input label={t.elementary.q8} placeholder={t.common.enterHere} register={register("favoriteSubject")} required error={errors.favoriteSubject || undefined} />
                <Input label={t.elementary.q9} placeholder={t.common.enterHere} register={register("challengingSubject")} required error={errors.challengingSubject || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.q10} placeholder={t.common.enterHere} register={register("aboutMyTeacher")} required error={errors.aboutMyTeacher || undefined} />
                <Input label={t.elementary.q11} placeholder={t.common.enterHere} register={register("aboutMeFromTeacher")} required error={errors.aboutMeFromTeacher || undefined} />
            </Row>
            {/* Section 4 */}
            <div className="text-2xl font-bold my-10">
                <label>{t.elementary.sectionTitle.littleMoreAboutMyself}</label>
            </div>
            <Row>
                <Input label={t.elementary.nickname} placeholder={t.common.enterHere} register={register("nickname")} required error={errors.nickname || undefined} />
                <Input label={t.elementary.favoriteColor} placeholder={t.common.enterHere} register={register("favoriteColor")} required error={errors.favoriteColor || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.favoriteFood} placeholder={t.common.enterHere} register={register("favoriteFood")} required error={errors.favoriteFood || undefined} />
                <Input label={t.elementary.hobbies} placeholder={t.common.enterHere} register={register("hobbies")} required error={errors.hobbies || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.interests} placeholder={t.common.enterHere} register={register("interests")} required error={errors.interests || undefined} />
                <Input label={t.elementary.makesMeSad} placeholder={t.common.enterHere} register={register("makesMeSad")} required error={errors.makesMeSad || undefined} />
            </Row>
            <Row>
                <Input label={t.elementary.loveMost} placeholder={t.common.enterHere} register={register("loveMost")} required error={errors.loveMost || undefined} />
                <Input label={t.elementary.futureDreams} placeholder={t.common.enterHere} register={register("futureDreams")} required error={errors.futureDreams || undefined} />
            </Row>
            {/* Section 5 */}
            <div className="my-5"></div>
            <Row>
                <Input label={t.elementary.forTeacher1} placeholder={t.common.enterHere} register={register("familysituation")} required error={errors.familysituation || undefined} />
                <Input label={t.elementary.forTeacher2} placeholder={t.common.enterHere} register={register("schoolsituation")} required error={errors.schoolsituation || undefined} />
            </Row>
            {/* Section 6 */}
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
