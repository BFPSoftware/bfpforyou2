export type ReviewStatus = "Pending" | "Needs Fix" | "Approved" | "Rejected";

export const REVIEW_STATUSES: ReviewStatus[] = ["Pending", "Needs Fix", "Approved", "Rejected"];

export type IssueCode =
    | "missing_photo"
    | "missing_attachment_1"
    | "missing_attachment_2"
    | "missing_attachment_3"
    | "empty_essay"
    | "missing_id"
    | "missing_phone"
    | "missing_email"
    | "incomplete_spouse"
    | "duplicate";

export type AttentionFilter = "all" | "unseen" | "needsAttention" | "duplicates" | "missingFiles";

export type AdminProgram = "fac" | "immigrant";

export function normalizeReviewStatus(value?: string | null): ReviewStatus {
    if (!value) return "Pending";
    const match = REVIEW_STATUSES.find((s) => s.toLowerCase() === value.toLowerCase());
    return match || "Pending";
}

export function isEmpty(value?: string | null | string[]): boolean {
    if (value == null) return true;
    if (Array.isArray(value)) return value.length === 0;
    return String(value).trim() === "";
}

export function hasFiles(fileField?: { value?: Array<{ fileKey?: string }> } | null): boolean {
    return Boolean(fileField?.value?.some((f) => Boolean(f.fileKey)));
}
