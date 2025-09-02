import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import handleCatch from "@/common/handleCatch";
import client from "@/hooks/useKintone";

export async function POST(request: Request) {
    try {
        const { accessCode } = await request.json();

        // Query Kintone for the access code
        const { records } = await client.record.getRecords({
            app: 257, // TODO: change to env
            query: `accessCode = "${accessCode}"`,
            fields: ["$id", "accessCode", "name"],
        }); // TODO: change to env

        if (records.length === 0) {
            return new NextResponse("Invalid access code", { status: 401 });
        }

        const teacherId = records[0].$id.value as string;
        const name = records[0].name.value as string;

        // Set cookie with 30-day expiry
        const cookieStore = await cookies();
        cookieStore.set("teacherId", teacherId, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });
        cookieStore.set("teacherName", name, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        });

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        return handleCatch(error);
    }
}
