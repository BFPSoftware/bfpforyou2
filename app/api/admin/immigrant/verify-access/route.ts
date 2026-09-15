import { NextResponse } from "next/server";
import handleCatch from "@/common/handleCatch";
import client from "@/hooks/useKintone";
import { parseGiftCodes } from "@/features/admin/immigrant/utils/giftCodes";
import { CoordinatorsApp, setAdminSessionCookies } from "@/features/admin/shared/setAdminSessionCookies";

export async function POST(request: Request) {
    try {
        const { accessCode } = await request.json();

        if (!accessCode || typeof accessCode !== "string") {
            return new NextResponse("Invalid access code", { status: 401 });
        }

        const { records } = await client.record.getRecords({
            app: CoordinatorsApp,
            query: `accessCode = "${accessCode.trim()}"`,
            fields: ["$id", "accessCode", "name", "school", "giftCodes"],
        });

        if (records.length === 0) {
            return new NextResponse("Invalid access code", { status: 401 });
        }

        const record = records[0];
        const giftCodes = parseGiftCodes(record.giftCodes?.value);

        if (giftCodes.length === 0) {
            return new NextResponse("Invalid access code", { status: 401 });
        }

        // Immigrant login also grants FAC session when the same record has schools
        await setAdminSessionCookies(record as any);

        return NextResponse.json({ ok: true, role: "immigrant", giftCodeCount: giftCodes.length });
    } catch (error) {
        return handleCatch(error);
    }
}
