import { NextRequest, NextResponse } from "next/server";
import logError from "@/common/logError";
import client from "@/hooks/useKintone";

export const runtime = "nodejs";

/**
 * Multipart file upload to Kintone.
 * Prefer this over a Server Action so failures return JSON and do not trip route error.tsx.
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            void logError(new Error("No file found"), { fileType: typeof file }, "api.uploadFile.noFile");
            return NextResponse.json({ failure: "No file found" }, { status: 400 });
        }

        if (!(file.size > 0)) {
            void logError(
                new Error("Empty file (0 bytes)"),
                { fileName: file.name, fileSize: file.size, fileType: file.type },
                "api.uploadFile.emptyFile"
            );
            return NextResponse.json({ failure: "Empty file" }, { status: 400 });
        }

        const data = await file.arrayBuffer();
        if (!data || data.byteLength === 0) {
            void logError(
                new Error("Empty file buffer"),
                { fileName: file.name, fileSize: file.size, fileType: file.type },
                "api.uploadFile.emptyBuffer"
            );
            return NextResponse.json({ failure: "Empty file" }, { status: 400 });
        }

        const buffer = Buffer.from(data);

        const { fileKey } = await client.file.uploadFile({
            file: {
                name: file.name || "upload.jpg",
                data: buffer,
            },
        });

        return NextResponse.json({ success: fileKey });
    } catch (e) {
        void logError(e, {}, "api.uploadFile");
        return NextResponse.json({ failure: "Server error" }, { status: 500 });
    }
}
