import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import handleCatch from "@/common/handleCatch";
import { BeneficiaryApplicationFormAppID, requireBFPForYouAdminsAppID } from "@/common/env";
import client from "@/hooks/useKintone";
import { DateTime } from "luxon";
import { parseGiftCodes } from "@/features/admin/immigrant/utils/giftCodes";

const CODE_CHUNK_SIZE = 50;

export async function GET() {
    try {
        const cookieStore = await cookies();
        const immigrantAdminId = cookieStore.get("immigrantAdminId");

        if (!immigrantAdminId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const adminResponse = await client.record.getRecord({
            app: requireBFPForYouAdminsAppID(),
            id: immigrantAdminId.value,
        });

        const giftCodes = parseGiftCodes(adminResponse.record["giftCodes"]?.value);

        if (giftCodes.length === 0) {
            return NextResponse.json([]);
        }

        const sixMonthsAgo = DateTime.now().minus({ months: 6 }).toFormat("yyyy-MM-dd");
        const records: unknown[] = [];
        const seenIds = new Set<string>();

        for (let i = 0; i < giftCodes.length; i += CODE_CHUNK_SIZE) {
            const chunk = giftCodes.slice(i, i + CODE_CHUNK_SIZE);
            const codesList = chunk.map((c) => `"${c.replace(/"/g, '\\"')}"`).join(",");
            const queryCondition = `ticket in (${codesList}) and Created_datetime > "${sixMonthsAgo}"`;
            const batch = await client.record.getAllRecords({
                app: BeneficiaryApplicationFormAppID || "",
                condition: queryCondition,
            });
            for (const record of batch) {
                const id = String((record as { $id?: { value?: string } }).$id?.value || "");
                if (id && seenIds.has(id)) continue;
                if (id) seenIds.add(id);
                records.push(record);
            }
        }

        return NextResponse.json(records);
    } catch (error) {
        return handleCatch(error);
    }
}
