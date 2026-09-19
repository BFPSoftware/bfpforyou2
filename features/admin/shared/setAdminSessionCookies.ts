import { cookies } from "next/headers";
import { parseGiftCodes } from "@/features/admin/immigrant/utils/giftCodes";

const cookieOpts = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
};

function asStringArray(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(String).filter(Boolean);
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
}

/** Set FAC and/or immigrant cookies from one coordinator record (dual-role admins). */
export async function setAdminSessionCookies(record: {
    $id: { value: string };
    name?: { value?: string };
    school?: { value?: unknown };
    giftCodes?: { value?: unknown };
}) {
    const cookieStore = await cookies();
    const adminId = record.$id.value as string;
    const name = (record.name?.value as string) || "";
    const schools = asStringArray(record.school?.value);
    const giftCodes = parseGiftCodes(record.giftCodes?.value);

    const isFac = schools.length > 0;
    const isImmigrant = giftCodes.length > 0;

    // Dual-role: grant every role the record qualifies for. If neither field is
    // filled (legacy FAC-only teacher with empty school read), still set teacher.
    if (isFac || !isImmigrant) {
        cookieStore.set("teacherId", adminId, cookieOpts);
        cookieStore.set("teacherName", name, cookieOpts);
    }
    if (isImmigrant) {
        cookieStore.set("immigrantAdminId", adminId, cookieOpts);
        cookieStore.set("immigrantAdminName", name, cookieOpts);
    }

    return { adminId, name, isFac: isFac || !isImmigrant, isImmigrant, giftCodes, schools };
}
