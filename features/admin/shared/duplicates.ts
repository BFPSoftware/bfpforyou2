import { REST_SavedFACApplication } from "@/types/FACApplication";
import { ImmigrantApplication } from "@/features/admin/immigrant/utils/sorting";

function norm(value?: string | null): string {
    return (value || "").trim().toLowerCase().replace(/[\s\-]/g, "");
}

/** Returns record IDs that appear to duplicate another submission. */
export function findFacDuplicateIds(records: REST_SavedFACApplication[]): Set<string> {
    const byTz = new Map<string, string[]>();
    for (const r of records) {
        const tz = norm(r.tz?.value);
        if (!tz || tz.length < 5) continue;
        const id = r.$id.value;
        byTz.set(tz, [...(byTz.get(tz) || []), id]);
    }
    const dupes = new Set<string>();
    for (const ids of byTz.values()) {
        if (ids.length > 1) ids.forEach((id) => dupes.add(id));
    }
    return dupes;
}

export function findImmigrantDuplicateIds(records: ImmigrantApplication[]): Set<string> {
    const buckets = new Map<string, string[]>();

    const add = (key: string | null, id: string) => {
        if (!key) return;
        buckets.set(key, [...(buckets.get(key) || []), id]);
    };

    for (const r of records) {
        const id = r.$id.value;
        const idNumber = norm(r.IDNumber?.value);
        const phone = norm(r.Phone_Number?.value);
        const email = (r.email?.value || "").trim().toLowerCase();
        if (idNumber && idNumber.length >= 5) add(`id:${idNumber}`, id);
        if (phone && phone.length >= 8) add(`phone:${phone}`, id);
        if (email && email.includes("@")) add(`email:${email}`, id);
    }

    const dupes = new Set<string>();
    for (const ids of buckets.values()) {
        if (ids.length > 1) ids.forEach((id) => dupes.add(id));
    }
    return dupes;
}
