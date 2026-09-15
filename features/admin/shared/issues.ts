import { REST_SavedFACApplication } from "@/types/FACApplication";
import { ImmigrantApplication } from "@/features/admin/immigrant/utils/sorting";
import { hasFiles, isEmpty, IssueCode } from "./reviewTypes";

export function detectFacIssues(record: REST_SavedFACApplication): IssueCode[] {
    const issues: IssueCode[] = [];

    if (!hasFiles(record.photo)) {
        issues.push("missing_photo");
    }

    if (isEmpty(record.tz?.value)) {
        issues.push("missing_id");
    }

    const isHigh = record.applicationType?.value === "Highschool";
    if (isHigh) {
        const essays = [
            record.introduction?.value,
            record.aboutSchool?.value,
            record.personalLife?.value,
            record.future?.value,
            record.scholarship?.value,
        ];
        if (essays.some((v) => isEmpty(v))) {
            issues.push("empty_essay");
        }
    } else {
        const keyFields = [
            record.aboutFamily?.value,
            record.favoriteSubject?.value,
            record.familysituation?.value,
            record.schoolsituation?.value,
        ];
        if (keyFields.some((v) => isEmpty(v))) {
            issues.push("empty_essay");
        }
    }

    return issues;
}

export function detectImmigrantIssues(record: ImmigrantApplication): IssueCode[] {
    const issues: IssueCode[] = [];

    if (!hasFiles(record.Attachment1)) issues.push("missing_attachment_1");
    if (!hasFiles(record.Attachment2)) issues.push("missing_attachment_2");
    if (!hasFiles(record.Attachment3)) issues.push("missing_attachment_3");
    if (isEmpty(record.IDNumber?.value)) issues.push("missing_id");
    if (isEmpty(record.Phone_Number?.value)) issues.push("missing_phone");
    if (isEmpty(record.email?.value)) issues.push("missing_email");

    const marital = (record.MaritalStatus?.value || "").toLowerCase();
    if (marital.includes("married")) {
        if (
            isEmpty(record.spouseFirstName?.value) ||
            isEmpty(record.spouseLastName?.value) ||
            isEmpty(record.spouseID?.value)
        ) {
            issues.push("incomplete_spouse");
        }
    }

    return issues;
}

export function hasMissingFiles(issues: IssueCode[]): boolean {
    return issues.some(
        (i) =>
            i === "missing_photo" ||
            i === "missing_attachment_1" ||
            i === "missing_attachment_2" ||
            i === "missing_attachment_3"
    );
}

export function hasNeedsAttention(issues: IssueCode[]): boolean {
    return issues.some((i) => i !== "duplicate");
}
