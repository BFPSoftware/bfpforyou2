import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FacelemType } from "@/features/forms/fac/schema/facelemSchema";

const liveWithLabels = (t: Dictionary): Record<FacelemType["liveWith"][number], string> => ({
    Father: t.elementary.liveWithFather,
    Mother: t.elementary.liveWithMother,
    Brother: t.elementary.liveWithBrother,
    Sister: t.elementary.liveWithSister,
    Grandparents: t.elementary.liveWithGrandparents,
    Other: t.elementary.liveWithOtherOption,
});

const template_facelem = (formResponse: FacelemType, t: Dictionary) => {
    const lw = liveWithLabels(t);
    const liveWithText = formResponse.liveWith.map((k) => lw[k]).join(", ");
    const calendarYear = new Date().getFullYear();
    const gradeLabel = t.elementary.gradeWithSchoolYear.replace("{year}", `${calendarYear}-${calendarYear + 1}`);

    return `<div className="font-sans">
            <h2>Thank you for contacting Bridges for Peace.</h2>
            <h2>Below is a copy of the form you submitted.</h2>
            <br />
            <section>
                <div>
                    ${t.confirmation.type}: ${t.fac.title}
                </div>
                <div>
                    ${t.confirmation.code}: ${formResponse.ticket}
                </div>
                <div>
                    ${t.firstName}: ${formResponse.firstName}
                </div>
                <div>
                    ${t.lastName}: ${formResponse.lastName}
                </div>
                <div>
                    ${t.elementary.tz}: ${formResponse.tz}
                </div>
                <div>
                    ${t.birthday}: ${`${formResponse.birthday.day} ${formResponse.birthday.month}, ${formResponse.birthday.year}`}
                </div>
                <div>
                    ${t.elementary.age}: ${formResponse.age}
                </div>
                <div>
                    ${gradeLabel}: ${formResponse.grade}
                </div>
                <div>
                    ${t.elementary.school}: ${t.elementary.schools[formResponse.elemSchool as keyof typeof t.elementary.schools]}
                </div>
                <div>
                    ${t.elementary.wereInProgramBefore}: ${formResponse.returning}
                </div>
                <div>
                    ${t.elementary.q1}: ${formResponse.familyMembers}
                </div>
                <div>
                    ${t.elementary.liveWith}: ${liveWithText}
                </div>
                <div>
                    ${t.elementary.liveWithBrotherCount}: ${formResponse.brothers ?? ""}
                </div>
                <div>
                    ${t.elementary.liveWithSisterCount}: ${formResponse.sisters ?? ""}
                </div>
                <div>
                    ${t.elementary.liveWithOtherDetail}: ${formResponse.liveWithOther ?? ""}
                </div>
                <div>
                    ${t.elementary.q4}: ${formResponse.isfrom}
                </div>
                <div>
                    ${t.elementary.q5}: ${formResponse.languageAtHome}
                </div>
                <div>
                    ${t.elementary.q7}: ${formResponse.aboutFamily}
                </div>
                <div>
                    ${t.elementary.q8}: ${formResponse.favoriteSubject}
                </div>
                <div>
                    ${t.elementary.q9}: ${formResponse.challengingSubject}
                </div>
                <div>
                    ${t.elementary.q11}: ${formResponse.aboutMeFromTeacher}
                </div>
                <div>
                    ${t.elementary.enjoySchoolWhy}: ${formResponse.enjoySchoolWhy}
                </div>
                <div>
                    ${t.elementary.favoriteColor}: ${formResponse.favoriteColor}
                </div>
                <div>
                    ${t.elementary.favoriteFood}: ${formResponse.favoriteFood}
                </div>
                <div>
                    ${t.elementary.hobbies}: ${formResponse.hobbies}
                </div>
                <div>
                    ${t.elementary.makesMeHappy}: ${formResponse.makesMeHappy}
                </div>
                <div>
                    ${t.elementary.makesMeSad}: ${formResponse.makesMeSad}
                </div>
                <div>
                    ${t.elementary.loveMost}: ${formResponse.loveMost}
                </div>
                <div>
                    ${t.elementary.futureDreams}: ${formResponse.futureDreams}
                </div>
                <div>
                    ${t.elementary.forTeacher1}: ${formResponse.familysituation}
                </div>
                <div>
                    ${t.elementary.forTeacher2}: ${formResponse.schoolsituation}
                </div>
                <div>
                    ${t.elementary.submittedBy}: ${formResponse.submittedBy}
                </div>
                <div>
                    ${t.elementary.relationship}: ${formResponse.relationship}
                </div>
            </section>
            <br />
            <h3>If any of these details are incorrect, please click on the link below to send us more information.</h3>
            <Link href="https://bfpforyou.com/contact-us">https://bfpforyou.com/contact-us</Link>
        </div>
    `;
};
export default template_facelem;
