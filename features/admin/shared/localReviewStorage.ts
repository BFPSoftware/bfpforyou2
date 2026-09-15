import { AdminProgram, normalizeReviewStatus, ReviewStatus } from "./reviewTypes";

export type LocalReviewEntry = {
    /** Marked when the user opened the detail at least once */
    seen: boolean;
    status: ReviewStatus;
    notes: string;
    updatedAt: string;
};

export type LocalReviewMap = Record<string, LocalReviewEntry>;

function storageKey(program: AdminProgram, adminId: string) {
    return `bfp-admin-review:${program}:${adminId}`;
}

export function loadLocalReviews(program: AdminProgram, adminId: string): LocalReviewMap {
    if (typeof window === "undefined" || !adminId) return {};
    try {
        const raw = localStorage.getItem(storageKey(program, adminId));
        if (!raw) return {};
        const parsed = JSON.parse(raw) as LocalReviewMap;
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        return {};
    }
}

export function saveLocalReviews(program: AdminProgram, adminId: string, map: LocalReviewMap) {
    if (typeof window === "undefined" || !adminId) return;
    localStorage.setItem(storageKey(program, adminId), JSON.stringify(map));
}

export function getLocalReview(
    map: LocalReviewMap,
    recordId: string
): LocalReviewEntry {
    return (
        map[recordId] || {
            seen: false,
            status: "Pending",
            notes: "",
            updatedAt: "",
        }
    );
}

export function upsertLocalReview(
    program: AdminProgram,
    adminId: string,
    recordId: string,
    patch: Partial<LocalReviewEntry>
): LocalReviewMap {
    const map = loadLocalReviews(program, adminId);
    const prev = getLocalReview(map, recordId);
    const next: LocalReviewEntry = {
        seen: patch.seen ?? prev.seen,
        status: patch.status ? normalizeReviewStatus(patch.status) : prev.status,
        notes: patch.notes !== undefined ? patch.notes : prev.notes,
        updatedAt: new Date().toISOString(),
    };
    const updated = { ...map, [recordId]: next };
    saveLocalReviews(program, adminId, updated);
    return updated;
}

export function markSeen(program: AdminProgram, adminId: string, recordId: string): LocalReviewMap {
    return upsertLocalReview(program, adminId, recordId, { seen: true });
}

export function bulkMarkSeen(
    program: AdminProgram,
    adminId: string,
    recordIds: string[]
): LocalReviewMap {
    const map = loadLocalReviews(program, adminId);
    const now = new Date().toISOString();
    const updated = { ...map };
    for (const id of recordIds) {
        const prev = getLocalReview(updated, id);
        updated[id] = { ...prev, seen: true, updatedAt: now };
    }
    saveLocalReviews(program, adminId, updated);
    return updated;
}
