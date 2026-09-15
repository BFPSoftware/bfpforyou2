import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import handleCatch from "@/common/handleCatch";
import client from "@/hooks/useKintone";

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const teacherId = cookieStore.get("teacherId");
        const immigrantAdminId = cookieStore.get("immigrantAdminId");

        if (!teacherId && !immigrantAdminId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const fileKey = request.nextUrl.searchParams.get("fileKey");
        const fileName = request.nextUrl.searchParams.get("name") || "file";
        const contentType = request.nextUrl.searchParams.get("contentType") || "application/octet-stream";

        if (!fileKey) {
            return new NextResponse("Missing fileKey", { status: 400 });
        }

        const data = await client.file.downloadFile({ fileKey });
        const body = data instanceof Blob ? data : new Blob([data]);

        return new NextResponse(body, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `inline; filename="${encodeURIComponent(fileName)}"`,
                "Cache-Control": "private, max-age=300",
            },
        });
    } catch (error) {
        return handleCatch(error);
    }
}
