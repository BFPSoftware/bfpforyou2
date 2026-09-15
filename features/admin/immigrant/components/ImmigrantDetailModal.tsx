"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateTime } from "luxon";
import { ImmigrantApplication } from "../utils/sorting";
import { DetailField } from "@/features/admin/shared/components/DetailField";
import { FileAttachments } from "@/features/admin/shared/components/FileAttachments";
import { ReviewPanel } from "@/features/admin/shared/components/ReviewPanel";
import { IssueChips } from "@/features/admin/shared/components/IssueChips";
import { detectImmigrantIssues } from "@/features/admin/shared/issues";
import { Button } from "@/components/ui/button";
import { IssueCode, ReviewStatus } from "@/features/admin/shared/reviewTypes";
import { LocalReviewEntry } from "@/features/admin/shared/localReviewStorage";

interface ImmigrantDetailModalProps {
    application: (ImmigrantApplication & { issues?: IssueCode[] }) | null;
    isOpen: boolean;
    onClose: () => void;
    dict: any;
    onPrev?: () => void;
    onNext?: () => void;
    positionLabel?: string;
    localReview?: LocalReviewEntry | null;
    onSaveLocalReview?: (status: ReviewStatus, notes: string) => void;
}

export function ImmigrantDetailModal({
    application,
    isOpen,
    onClose,
    dict,
    onPrev,
    onNext,
    positionLabel,
    localReview,
    onSaveLocalReview,
}: ImmigrantDetailModalProps) {
    if (!application) return null;

    const t = dict.admin.immigrant.dashboard.details;
    const review = dict.admin.review;
    const children = application.children?.value || [];
    const issues = application.issues || detectImmigrantIssues(application);
    const marital = (application.MaritalStatus?.value || "").toLowerCase();
    const isMarried = marital.includes("married");

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[85svh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex flex-wrap items-start justify-between gap-2 pr-6">
                        <div>
                            <DialogTitle>{t.title}</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                {application.firstName?.value} {application.lastName?.value}
                                {application.ticket?.value ? ` · ${application.ticket.value}` : ""}
                                {" · "}
                                {application.Created_datetime?.value
                                    ? DateTime.fromISO(application.Created_datetime.value).toFormat("dd LLL, yyyy")
                                    : "—"}
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
                            recordId={application.$id.value}
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
                        label={dict.attachment1}
                        files={application.Attachment1?.value}
                        missingLabel={review.issueLabels.missing_attachment_1}
                    />
                    <FileAttachments
                        label={dict.attachment2}
                        files={application.Attachment2?.value}
                        missingLabel={review.issueLabels.missing_attachment_2}
                    />
                    <FileAttachments
                        label={dict.attachment3}
                        files={application.Attachment3?.value}
                        missingLabel={review.issueLabels.missing_attachment_3}
                    />

                    <div className="col-span-2 mt-2">
                        <h2 className="text-xl font-bold mb-4">{dict.sectionTitle.personalInformation}</h2>
                    </div>
                    <DetailField label={dict.firstName} value={application.firstName?.value} />
                    <DetailField label={dict.lastName} value={application.lastName?.value} />
                    <DetailField label={dict.idType.title} value={application.IDType?.value} />
                    <DetailField label={dict.idNumber} value={application.IDNumber?.value} />
                    <DetailField label={dict.birthday} value={application.birthday?.value} />
                    <DetailField label={dict.gender.title} value={application.gender?.value} />
                    <DetailField label={dict.originCity} value={application.originCity?.value} />
                    <DetailField label={dict.originCountry} value={application.originCountry?.value} />
                    <DetailField label={dict.nativeLanguage.title} value={application.language?.value} />
                    <DetailField label={t.giftCode} value={application.ticket?.value} />
                    <DetailField label={t.formLanguage} value={application.formLang?.value} />
                    <DetailField
                        label={t.submissionDate}
                        value={
                            application.Created_datetime?.value
                                ? DateTime.fromISO(application.Created_datetime.value).toFormat("dd LLL, yyyy")
                                : undefined
                        }
                    />
                    <DetailField label="Record ID" value={application.$id.value} missing={false} />

                    <div className="col-span-2 mt-4">
                        <h2 className="text-xl font-bold mb-4">{dict.sectionTitle.contactInformation}</h2>
                    </div>
                    <DetailField label={dict.phone.title} value={application.Phone_Number?.value} />
                    <DetailField label={dict.email.title} value={application.email?.value} />
                    <DetailField label={dict.address1.title} value={application.address1?.value} />
                    <DetailField label={dict.address2.title} value={application.address2?.value} missing={false} />
                    <DetailField label={dict.city} value={application.addressCity?.value} />
                    <DetailField label={dict.zip} value={application.addressZip?.value} />

                    <div className="col-span-2 mt-4">
                        <h2 className="text-xl font-bold mb-4">{dict.sectionTitle.familyInformation}</h2>
                    </div>
                    <DetailField label={dict.maritalStatus.title} value={application.MaritalStatus?.value} />
                    {isMarried && (
                        <>
                            <DetailField label={dict.spouse.spouseFirstName} value={application.spouseFirstName?.value} />
                            <DetailField label={dict.spouse.spouseFamilyName} value={application.spouseLastName?.value} />
                            <DetailField label={dict.spouse.spouseBirthday} value={application.Spouse_Birthday?.value} />
                            <DetailField label={dict.spouse.spouseIDType} value={application.spouseIDType?.value} />
                            <DetailField label={dict.spouse.spouseIDNumber} value={application.spouseID?.value} />
                        </>
                    )}

                    {children.length > 0 && (
                        <>
                            <div className="col-span-2 mt-4">
                                <h2 className="text-xl font-bold mb-4">{dict.children.title}</h2>
                            </div>
                            {children.map((row, index) => (
                                <div key={row.id || index} className="col-span-2 border rounded-md p-3 mb-2">
                                    <p className="font-medium mb-2">
                                        {row.value.childFirstName?.value} {row.value.childLastName?.value}
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <DetailField label={dict.children.childGender} value={row.value.childGender?.value} />
                                        <DetailField label={dict.children.childBirthday} value={row.value.childDoB?.value} />
                                        <DetailField
                                            label={dict.children.childAccompanied}
                                            value={row.value.accompaniedInIsrael?.value}
                                        />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    <div className="col-span-2 mt-4">
                        <h2 className="text-xl font-bold mb-4">{dict.sectionTitle.questionnarie}</h2>
                    </div>
                    <DetailField label={dict.aliyahDate} value={application.aliyahDate?.value} />
                    <DetailField label={dict.whereHeardOfUs.title} value={application.whereHeardOfUs?.value} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
