import { Dictionary } from "@/common/locales/Dictionary-provider";
import { FachighType } from "@/features/forms/fac/schema/fachighSchema";

const template_fachigh = (formResponse: FachighType, t: Dictionary) => {
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
                    ${t.elementary.grade}: ${formResponse.grade}
                </div>
                <div>
                    ${t.originCountry}: ${formResponse.originCountry}
                </div>
                <div>
                    ${t.highschool.school}: ${t.highschool.schools[formResponse.school]}
                </div>
                <div>
                    ${t.elementary.isFirstTime}: ${formResponse.returning}
                </div>
                <div>
                    ${t.highschool.introduction}: ${formResponse.introduction}
                </div>
                <div>
                    ${t.highschool.school}: ${formResponse.school}
                </div>
                <div>
                    ${t.highschool.personalLife}: ${formResponse.personalLife}
                </div>
                <div>
                    ${t.highschool.yourFuture}: ${formResponse.future}
                </div>
                 <div>
                    ${t.highschool.scholarship}: ${formResponse.scholarship}
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
export default template_fachigh;
