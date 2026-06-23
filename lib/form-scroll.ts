import { FieldErrors } from "react-hook-form";

type ErrorTree = Record<string, unknown>;

/** Depth-first search for the first field path with a validation message. */
export function findFirstErrorPath(errors: ErrorTree, prefix = ""): string | null {
    for (const key of Object.keys(errors)) {
        const val = errors[key];
        const path = prefix ? `${prefix}.${key}` : key;

        if (val && typeof val === "object" && "message" in val && typeof (val as { message?: unknown }).message === "string") {
            return path;
        }
        if (val && typeof val === "object" && !Array.isArray(val)) {
            const nested = findFirstErrorPath(val as ErrorTree, path);
            if (nested) return nested;
        }
    }
    return null;
}

const SCROLL_SELECTOR_OVERRIDES: Record<string, string> = {
    birthday: '[name="birthday.day"]',
    liveWith: "#live-with-section",
    photo: '[name="photo"]',
    attachment1: '[name="attachment1"]',
    attachment2: '[name="attachment2"]',
    attachment3: '[name="attachment3"]',
    "spouse.maritalStatus": '[name="spouse.maritalStatus"]',
    "spouse.spouseBirthday": '[name="spouse.spouseBirthday.day"]',
    introHasSiblings: '[name="introHasSiblings"]',
    futureHasPlans: '[name="futureHasPlans"]',
    check1: "#check1",
    check2: "#check2",
};

function selectorForPath(path: string): string {
    if (SCROLL_SELECTOR_OVERRIDES[path]) return SCROLL_SELECTOR_OVERRIDES[path];
    const topLevel = path.split(".")[0];
    if (topLevel && SCROLL_SELECTOR_OVERRIDES[topLevel]) return SCROLL_SELECTOR_OVERRIDES[topLevel];
    return `[name="${path}"]`;
}

export function scrollToFormError(errors: FieldErrors<Record<string, unknown>>): string | null {
    const path = findFirstErrorPath(errors as ErrorTree);
    if (!path) return null;

    const el = document.querySelector(selectorForPath(path));
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    return path;
}

/** Immigrant multi-page: which page index (0–2) contains the first error path. */
export function immigrantPageForErrorPath(path: string): number {
    if (path.startsWith("spouse") || path.startsWith("children")) return 1;
    if (path === "aliyahDate" || path === "whereHeardOfUs") return 2;
    return 0;
}
