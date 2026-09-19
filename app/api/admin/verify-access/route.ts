import { NextResponse } from "next/server";
import handleCatch from "@/common/handleCatch";
import { requireBFPForYouAdminsAppID } from "@/common/env";
import client from "@/hooks/useKintone";
import { setAdminSessionCookies } from "@/features/admin/shared/setAdminSessionCookies";

export async function POST(request: Request) {
    try {
        const { accessCode } = await request.json();

        if (!accessCode || typeof accessCode !== "string") {
            return new NextResponse("Invalid access code", { status: 401 });
        }

        const { records } = await client.record.getRecords({
            app: requireBFPForYouAdminsAppID(),
            query: `accessCode = "${accessCode.trim()}"`,
            fields: ["$id", "accessCode", "name", "school", "giftCodes"],
        });

        if (records.length === 0) {
            return new NextResponse("Invalid access code", { status: 401 });
        }

        // FAC login: any matching access code (teachers may also have giftCodes)
        await setAdminSessionCookies(records[0] as any);

        return NextResponse.json({ ok: true, role: "fac" });
    } catch (error) {
        return handleCatch(error);
    }
}
