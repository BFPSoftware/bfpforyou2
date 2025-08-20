import { Dictionary } from "@/common/locales/Dictionary-provider";
import { ImmigrantType } from "@/features/forms/immigrant/schema/immigrantSchema";
import { DateTime } from "luxon";

const template_immigrant = (formResponse: ImmigrantType, t: Dictionary) => {
    const aliyahDateLuxon = DateTime.fromISO(formResponse.aliyahDate).toFormat("dd-LLL-yyyy");
    return `<div className="font-sans">
            <h2>Thank you for contacting Bridges for Peace.</h2>
            <h2>We’ve successfully received your registration. Please be aware that our team is currently out of the office and will be back on October 6th. We will review your application and get back to you as soon as possible after our return.</h2>
            <br />
            <h2>Below is a copy of the form you submitted.</h2>
            <br />
            <section>
                <div>
                    ${t.confirmation.type}: ${t.immigrant.title}
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
                    ${t.idType.title}: ${t.idType.options[formResponse.idType as keyof typeof t.idType.options]} 
                </div>
                <div>
                    ${t.idNumber}: ${formResponse.idNumber}
                </div>
                <div>
                    ${t.birthday}: ${`${formResponse.birthday.day}-${formResponse.birthday.month}-${formResponse.birthday.year}`}
                </div>
                <div>
                    ${t.gender.title}: ${t.gender.options[formResponse.gender as keyof typeof t.gender.options]}
                </div>
                <div>
                    ${t.originCity}: ${formResponse.originCity}
                </div>
                <div>
                    ${t.originCountry}: ${formResponse.originCountry}
                </div>
                <div>
                    ${t.nativeLanguage.title}: ${t.nativeLanguage.options[formResponse.nativeLanguage as keyof typeof t.nativeLanguage.options]}
                </div>
                <div>
                    ${t.phone.title}: ${formResponse.phone}
                </div>
                <div>
                    ${t.email.title}: ${formResponse.email}
                </div>
                <div>
                    ${t.address1.title}: ${formResponse.address1}
                </div>
                ${
                    formResponse.address2
                        ? `<div>
                            ${t.address2.title}: ${formResponse.address2}
                        </div>`
                        : ""
                }
                <div>
                    ${t.city}: ${formResponse.city}
                </div>
                <div>
                    ${t.zip}: ${formResponse.zip}
                </div>
                <div>
                    ${t.maritalStatus.title}: ${t.maritalStatus.options[formResponse.spouse.maritalStatus as keyof typeof t.maritalStatus.options]}
                </div>
                ${
                    formResponse.spouse.maritalStatus == "0"
                        ? `
                            <div>
                                ${t.spouse.spouseFirstName}: ${formResponse.spouse.spouseFirstName}
                            </div>
                            <div>
                                ${t.spouse.spouseFamilyName}: ${formResponse.spouse.spouseFamilyName}
                            </div>
                            <div>
                                ${t.spouse.spouseBirthday}: ${formResponse.spouse.spouseBirthday.day}-${formResponse.spouse.spouseBirthday.month}-${formResponse.spouse.spouseBirthday.year}
                            </div>
                            <div>
                                ${t.spouse.spouseIDType}: ${t.idType.options[formResponse.spouse.spouseIDType as keyof typeof t.idType.options]}
                            </div>
                            <div>
                                ${t.spouse.spouseIDNumber}: ${formResponse.spouse.spouseIDNumber}
                            </div>
                        `
                        : ""
                }
                <div>
                    ${t.children.title}: ${t.select[formResponse.children.childStatus as keyof typeof t.select]}
                </div>
                ${
                    formResponse.children.childStatus == "Yes"
                        ? `
                            ${formResponse.children.childTable.map(
                                (child, index) =>
                                    `
                                    <div>
                                        ${t.children.childFirstName}: ${child.childFirstName}
                                    </div>
                                    <div>
                                        ${t.children.childLastName}: ${child.childLastName}
                                    </div>
                                    <div>
                                        ${t.children.childGender}: ${t.gender.options[child.childGender as keyof typeof t.gender.options]}
                                    </div>
                                    <div>
                                        ${t.children.childBirthday}: ${child.childBirthday.day}-${child.childBirthday.month}-${child.childBirthday.year}
                                    </div>
                                    <div>
                                        ${t.children.childAccompanied}: ${t.select[child.childAccompanied as keyof typeof t.select]}
                                    </div>
                                    <br />
                                `
                            )}
                        `
                        : ""
                }

                <div>
                    ${t.aliyahDate}: ${aliyahDateLuxon}
                </div>
                <div>
                    ${t.whereHeardOfUs.title}: ${t.whereHeardOfUs.options[formResponse.whereHeardOfUs as keyof typeof t.whereHeardOfUs.options]}
                </div>
            </section>
            <br />
            <h3>If any of these details are incorrect, please click on the link below to send us more information.</h3>
            <Link href="https://bfpforyou.com/contact-us">https://bfpforyou.com/contact-us</Link>
        </div>
    `;
};
export default template_immigrant;
