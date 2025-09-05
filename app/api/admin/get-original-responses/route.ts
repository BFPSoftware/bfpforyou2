import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import handleCatch from "@/common/handleCatch";
import { TeachersAppID, FacApplicationAppID, FacOriginalResponsesAppID } from "@/common/env";
import client from "@/hooks/useKintone";
import { DateTime } from "luxon";

const ElemSchools = ["Jabutinsky", "Levi Eshkol", "Uziel", "HaDekel", "Zalman Aran", "Ben Zvi", "Orot - Boys", "Orot - Girls"];
const Highschools = ["Devir", "Shachar", "Branco Weiss"];

export async function GET() {
    try {
        const cookieStore = await cookies();
        const teacherId = cookieStore.get("teacherId");

        if (!teacherId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        // Get teacher's school from teachers app
        const teacherResponse = await client.record.getRecord({
            app: 257, // TODO: change to env
            id: teacherId.value,
        });

        const teacherSchool = teacherResponse.record["school"].value as string[];

        // Separate high schools and elementary schools based on enums
        const highSchools = teacherSchool.filter((school) => Highschools.includes(school));
        const elemSchools = teacherSchool.filter((school) => ElemSchools.includes(school));

        // Build the query condition
        let conditions: string = "";

        if (highSchools.length > 0) {
            conditions += `school in ("${highSchools.join('","')}") `;
        }

        if (elemSchools.length > 0) {
            if (conditions.length > 0) conditions += " or ";
            conditions += `elemSchool in ("${elemSchools.join('","')}") `;
        }
        // const queryCondition = conditions.length > 0 ? `(${conditions + " or "}) order by Created_datetime desc` : "order by Created_datetime desc";
        // Get students from FAC application app
        const sixMonthsAgo = DateTime.now().minus({ months: 6 }).toFormat("yyyy-MM-dd");
        if (conditions.length === 0) return NextResponse.json([]);
        const queryCondition = `(${conditions}) and Created_datetime > "${sixMonthsAgo}"`;
        console.log("first", queryCondition);
        const records = await client.record.getAllRecords({
            app: FacOriginalResponsesAppID || "",
            condition: queryCondition,
            //fields: ["$id", "firstName", "lastName", "school", "elemSchool", "grade", "Created_datetime"],
        });

        return NextResponse.json(records);
    } catch (error) {
        return handleCatch(error);
    }
}
