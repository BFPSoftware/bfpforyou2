"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { REST_SavedFACApplication } from "@/types/FACApplication";
import { DateTime } from "luxon";
import { DetailField } from "@/features/admin/shared/components/DetailField";
import { FileAttachments } from "@/features/admin/shared/components/FileAttachments";
import { ReviewPanel } from "@/features/admin/shared/components/ReviewPanel";
import { IssueChips } from "@/features/admin/shared/components/IssueChips";
import { detectFacIssues } from "@/features/admin/shared/issues";
import { Button } from "@/components/ui/button";
import { IssueCode, ReviewStatus } from "@/features/admin/shared/reviewTypes";
import { LocalReviewEntry } from "@/features/admin/shared/localReviewStorage";

interface OriginalResponseDetailModalProps {
    response: (REST_SavedFACApplication & { issues?: IssueCode[] }) | null;
    isOpen: boolean;
    onClose: () => void;
    dict: any;
    onPrev?: () => void;
    onNext?: () => void;
    positionLabel?: string;
    localReview?: LocalReviewEntry | null;
    onSaveLocalReview?: (status: ReviewStatus, notes: string) => void;
}

export function OriginalResponseDetailModal({
    response,
    isOpen,
    onClose,
    dict,
    onPrev,
    onNext,
    positionLabel,
    localReview,
    onSaveLocalReview,
}: OriginalResponseDetailModalProps) {
    if (!response) return null;

    const review = dict.admin.review;
    const issues = response.issues || detectFacIssues(response);
    const school =
        response.applicationType.value === "Highschool" ? response.school?.value : response.elemSchool?.value;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[85svh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex flex-wrap items-start justify-between gap-2 pr-6">
                        <div>
                            <DialogTitle>{dict.admin.dashboard.details.title}</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                {response.firstName.value} {response.lastName.value}
                                {school ? ` · ${school}` : ""}
                                {" · "}
                                {DateTime.fromISO(response.Created_datetime.value).toFormat("dd LLL, yyyy")}
                            </p>
                            <div className="mt-2">
                                <IssueChips issues={issues} labels={review.issueLabels} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {positionLabel && <span className="text-xs text-gray-500">{positionLabel}</span>}
                            <Button type="button" variant="outline" size="sm" onClick={onPrev} disabled={!onPrev}>
                                {review.prev}
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={onNext} disabled={!onNext}>
                                {review.next}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-4 overflow-y-auto pr-2">
                    {localReview && onSaveLocalReview && (
                        <ReviewPanel
                            recordId={response.$id.value}
                            status={localReview.status}
                            notes={localReview.notes}
                            seen={localReview.seen}
                            labels={{
                                status: review.status,
                                notes: review.notes,
                                notesPlaceholder: review.notesPlaceholder,
                                save: review.save,
                                saved: review.saved,
                                localOnly: review.localOnly,
                                markSeen: review.markSeen,
                                unseen: review.tabs.unseen,
                                seen: review.seenLabel,
                            }}
                            onSave={onSaveLocalReview}
                        />
                    )}

                    <FileAttachments
                        label={dict.elementary.photo}
                        files={response.photo?.value}
                        missingLabel={review.issueLabels.missing_photo}
                    />

                    <div className="col-span-2 mt-2">
                        <h2 className="text-xl font-bold mb-4">{dict.sectionTitle.personalInformation}</h2>
                    </div>
                    <DetailField label={dict.firstName} value={response.firstName.value} />
                    <DetailField label={dict.lastName} value={response.lastName.value} />
                    <DetailField label={dict.elementary.tz} value={response.tz.value} />
                    <DetailField label={dict.birthday} value={response.birthday.value} />
                    <DetailField label={dict.elementary.age} value={response.age.value} />
                    <DetailField label={dict.elementary.grade} value={response.grade.value} />
                    <DetailField label={dict.originCountry} value={response.originCountry.value} />
                    <DetailField label={dict.elementary.isFirstTime} value={response.returning.value} />
                    <DetailField label={dict.confirmation.type} value={response.applicationType.value} />
                    <DetailField label={dict.nativeLanguage.title} value={response.submitLang.value} />
                    <DetailField label={dict.elementary.submittedBy} value={response.submittedBy.value} />
                    <DetailField label={dict.elementary.relationship} value={response.relationship.value} />
                    <DetailField
                        label={dict.admin.dashboard.details.submissionDate}
                        value={DateTime.fromISO(response.Created_datetime.value).toFormat("dd LLL, yyyy")}
                    />
                    <DetailField label="Record ID" value={response.$id.value} missing={false} />

                    {response.applicationType.value === "Elementary" && (
                        <>
                            <DetailField label={dict.elementary.school} value={response.elemSchool?.value} />

                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.elementary.sectionTitle.meAndMyFamily}</h2>
                            </div>
                            <DetailField label={dict.elementary.q1} value={response.familyMembers?.value} />
                            <DetailField label={dict.elementary.q2} value={response.brothers?.value} />
                            <DetailField label={dict.elementary.q3} value={response.sisters?.value} />
                            <DetailField label={dict.elementary.q4} value={response.isfrom?.value} />
                            <DetailField label={dict.elementary.q5} value={response.languageAtHome?.value} />
                            <DetailField className="col-span-2" label={dict.elementary.q7} value={response.aboutFamily?.value} />

                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.elementary.sectionTitle.meAndSchool}</h2>
                            </div>
                            <DetailField label={dict.elementary.q8} value={response.favoriteSubject?.value} />
                            <DetailField label={dict.elementary.q9} value={response.challengingSubject?.value} />
                            <DetailField className="col-span-2" label={dict.elementary.q10} value={response.aboutMyTeacher?.value} />
                            <DetailField className="col-span-2" label={dict.elementary.q11} value={response.aboutMeFromTeacher?.value} />

                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.elementary.sectionTitle.funFacts}</h2>
                            </div>
                            <DetailField label={dict.elementary.nickname} value={response.nickname?.value} />
                            <DetailField label={dict.elementary.favoriteColor} value={response.favoriteColor?.value} />
                            <DetailField label={dict.elementary.favoriteFood} value={response.favoriteFood?.value} />
                            <DetailField label={dict.elementary.hobbies} value={response.hobbies?.value} />
                            <DetailField label={dict.elementary.interests} value={response.interests?.value} />
                            <DetailField label={dict.elementary.makesMeSad} value={response.makesMeSad?.value} />
                            <DetailField label={dict.elementary.loveMost} value={response.loveMost?.value} />
                            <DetailField label={dict.elementary.futureDreams} value={response.futureDreams?.value} />

                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">Teacher&apos;s Notes</h2>
                            </div>
                            <DetailField className="col-span-2" label={dict.elementary.forTeacher1} value={response.familysituation?.value} />
                            <DetailField className="col-span-2" label={dict.elementary.forTeacher2} value={response.schoolsituation?.value} />
                        </>
                    )}

                    {response.applicationType.value === "Highschool" && (
                        <>
                            <DetailField label={dict.elementary.school} value={response.school?.value} />

                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.introduction}</h2>
                                <DetailField label={dict.highschool.introduction} value={response.introduction?.value} />
                            </div>
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.school}</h2>
                                <DetailField label={dict.highschool.school} value={response.aboutSchool?.value} />
                            </div>
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.personalLife}</h2>
                                <DetailField label={dict.highschool.personalLife} value={response.personalLife?.value} />
                            </div>
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.yourFuture}</h2>
                                <DetailField label={dict.highschool.yourFuture} value={response.future?.value} />
                            </div>
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.highschool.sectionTitle.scholarship}</h2>
                                <DetailField label={dict.highschool.scholarship} value={response.scholarship?.value} />
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
