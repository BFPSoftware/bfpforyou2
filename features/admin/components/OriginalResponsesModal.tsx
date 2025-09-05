"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { REST_SavedFACApplication } from "@/types/FACApplication";
import { DateTime } from "luxon";

interface OriginalResponseDetailModalProps {
    response: REST_SavedFACApplication | null;
    isOpen: boolean;
    onClose: () => void;
    dict: any;
}

export function OriginalResponseDetailModal({ response, isOpen, onClose, dict }: OriginalResponseDetailModalProps) {
    if (!response) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[70svh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{dict.admin.dashboard.details.title}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-4 overflow-y-auto pr-2">
                    {/* Common Fields for Both Types */}
                    <div className="col-span-2 mt-4">
                        <h2 className="text-xl font-bold mb-4">{dict.sectionTitle.personalInformation}</h2>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.firstName}</h3>
                        <p>{response.firstName.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.lastName}</h3>
                        <p>{response.lastName.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.elementary.tz}</h3>
                        <p>{response.tz.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.birthday}</h3>
                        <p>{response.birthday.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.elementary.age}</h3>
                        <p>{response.age.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.elementary.grade}</h3>
                        <p>{response.grade.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.originCountry}</h3>
                        <p>{response.originCountry.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.elementary.isFirstTime}</h3>
                        <p>{response.returning.value}</p>
                    </div>

                    {/* System Information */}
                    <div>
                        <h3 className="font-semibold mb-2">{dict.confirmation.type}</h3>
                        <p>{response.applicationType.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.nativeLanguage.title}</h3>
                        <p>{response.submitLang.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.elementary.submittedBy}</h3>
                        <p>{response.submittedBy.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.elementary.relationship}</h3>
                        <p>{response.relationship.value}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">{dict.admin.dashboard.details.submissionDate}</h3>
                        <p>{DateTime.fromISO(response.Created_datetime.value).toFormat("dd LLL, yyyy")}</p>
                    </div>

                    {/* Elementary School Specific Fields */}
                    {response.applicationType.value === "Elementary" && (
                        <>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.school}</h3>
                                <p>{response.elemSchool?.value}</p>
                            </div>

                            {/* Me and My Family Section */}
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.elementary.sectionTitle.meAndMyFamily}</h2>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q1}</h3>
                                <p>{response.familyMembers?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q2}</h3>
                                <p>{response.brothers?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q3}</h3>
                                <p>{response.sisters?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q4}</h3>
                                <p>{response.isfrom?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q5}</h3>
                                <p>{response.languageAtHome?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q7}</h3>
                                <p>{response.aboutFamily?.value}</p>
                            </div>

                            {/* Me and School Section */}
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.elementary.sectionTitle.meAndSchool}</h2>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q8}</h3>
                                <p>{response.favoriteSubject?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q9}</h3>
                                <p>{response.challengingSubject?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q10}</h3>
                                <p>{response.aboutMyTeacher?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.q11}</h3>
                                <p>{response.aboutMeFromTeacher?.value}</p>
                            </div>

                            {/* Fun Facts Section */}
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.elementary.sectionTitle.funFacts}</h2>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.nickname}</h3>
                                <p>{response.nickname?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.favoriteColor}</h3>
                                <p>{response.favoriteColor?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.favoriteFood}</h3>
                                <p>{response.favoriteFood?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.hobbies}</h3>
                                <p>{response.hobbies?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.interests}</h3>
                                <p>{response.interests?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.makesMeSad}</h3>
                                <p>{response.makesMeSad?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.loveMost}</h3>
                                <p>{response.loveMost?.value}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.futureDreams}</h3>
                                <p>{response.futureDreams?.value}</p>
                            </div>

                            {/* Teacher's Notes Section */}
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">Teacher's Notes</h2>
                            </div>
                            <div className="col-span-2">
                                <h3 className="font-semibold mb-2">{dict.elementary.forTeacher1}</h3>
                                <p>{response.familysituation?.value}</p>
                            </div>
                            <div className="col-span-2">
                                <h3 className="font-semibold mb-2">{dict.elementary.forTeacher2}</h3>
                                <p>{response.schoolsituation?.value}</p>
                            </div>
                        </>
                    )}

                    {/* High School Specific Fields */}
                    {response.applicationType.value === "Highschool" && (
                        <>
                            <div>
                                <h3 className="font-semibold mb-2">{dict.elementary.school}</h3>
                                <p>{response.school?.value}</p>
                            </div>

                            {/* Introduction Section */}
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.introduction}</h2>
                                <h3 className="font-semibold mb-2">{dict.highschool.introduction}</h3>
                                <p>{response.introduction?.value}</p>
                            </div>

                            {/* School Section */}
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.school}</h2>
                                <h3 className="font-semibold mb-2">{dict.highschool.school}</h3>
                                <p>{response.aboutSchool?.value}</p>
                            </div>

                            {/* Personal Life Section */}
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.personalLife}</h2>
                                <h3 className="font-semibold mb-2">{dict.highschool.personalLife}</h3>
                                <p>{response.personalLife?.value}</p>
                            </div>

                            {/* Future Section */}
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.yourFuture}</h2>
                                <h3 className="font-semibold mb-2">{dict.highschool.yourFuture}</h3>
                                <p>{response.future?.value}</p>
                            </div>

                            {/* Scholarship Section */}
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.scholarship}</h2>
                                <h3 className="font-semibold mb-2">{dict.highschool.scholarship}</h3>
                                <p>{response.scholarship?.value}</p>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
