import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import handleCatch from "@/common/handleCatch";
import { FacOriginalResponsesAppID } from "@/common/env";
import client from "@/hooks/useKintone";
import { DateTime } from "luxon";
import { CoordinatorsApp } from "@/features/admin/shared/setAdminSessionCookies";

const ElemSchools = ["Jabutinsky", "Levi Eshkol", "Uziel", "HaDekel", "Zalman Aran", "Ben Zvi", "Orot - Boys", "Orot - Girls"];
const Highschools = ["Devir", "Shachar", "Branco Weiss"];

export async function GET() {
    try {
        const cookieStore = await cookies();
        const teacherId = cookieStore.get("teacherId");

        if (!teacherId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const teacherResponse = await client.record.getRecord({
            app: CoordinatorsApp,
            id: teacherId.value,
        });

        const teacherSchool = (teacherResponse.record["school"]?.value as string[]) || [];

        const highSchools = teacherSchool.filter((school) => Highschools.includes(school));
        const elemSchools = teacherSchool.filter((school) => ElemSchools.includes(school));

        let conditions: string = "";

        if (highSchools.length > 0) {
            conditions += `school in ("${highSchools.join('","')}") `;
        }

        if (elemSchools.length > 0) {
            if (conditions.length > 0) conditions += " or ";
            conditions += `elemSchool in ("${elemSchools.join('","')}") `;
        }
        const sixMonthsAgo = DateTime.now().minus({ months: 6 }).toFormat("yyyy-MM-dd");
        if (conditions.length === 0) return NextResponse.json([]);
        const queryCondition = `(${conditions}) and Created_datetime > "${sixMonthsAgo}"`;
        const records = await client.record.getAllRecords({
            app: FacOriginalResponsesAppID || "",
            condition: queryCondition,
        });

        return NextResponse.json(records);
    } catch (error) {
        return handleCatch(error);
    }
}
