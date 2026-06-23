"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import logError from "@/common/logError";
import client from "@/hooks/useKintone";

// NOTE: Primary upload path.
// Images are optionally compressed client-side (see `lib/kintone-client-upload.ts`) to stay under Vercel request body limits.

// This schema is used to validate input from client.
const schema = z.object({
    file: z.instanceof(File),
});

export const uploadFile = actionClient.schema(schema).action(async ({ parsedInput: { file } }) => {
    try {
        console.log("[uploadFile] Starting upload:", {
            fileName: file?.name,
            fileType: file?.type,
            fileSize: file?.size,
            fileSizeMB: file ? (file.size / (1024 * 1024)).toFixed(2) : "N/A",
        });

        if (!file || !(file.size > 0)) {
            console.error("[uploadFile] Invalid file:", { file: file, hasFile: !!file, size: file?.size });
            return { failure: "No file found" };
        }

        console.log("[uploadFile] Converting file to buffer...");
        const data = await file.arrayBuffer();
        const buffer = Buffer.from(data);
        console.log("[uploadFile] Buffer created:", {
            bufferLength: buffer.length,
            bufferLengthMB: (buffer.length / (1024 * 1024)).toFixed(2),
        });

        console.log("[uploadFile] Uploading to Kintone...");
        const { fileKey } = await client.file.uploadFile({
            file: {
                name: file.name,
                data: buffer,
            },
        });
        console.log("[uploadFile] Upload successful. FileKey:", fileKey);
        return { success: fileKey };
    } catch (e) {
        console.error("[uploadFile] Error during upload:", e instanceof Error ? e.message : e);
        void logError(e, { fileName: file?.name, fileSize: file?.size, fileType: file?.type }, "uploadFile");
        return { failure: "Server error" };
    }
});
