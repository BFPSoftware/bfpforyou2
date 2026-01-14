"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import logError from "@/common/logError";
import client from "@/hooks/useKintone";

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
        console.error("[uploadFile] Error during upload:", {
            error: e,
            errorMessage: e instanceof Error ? e.message : String(e),
            errorStack: e instanceof Error ? e.stack : undefined,
            errorName: e instanceof Error ? e.name : undefined,
            fileName: file?.name,
            fileSize: file?.size,
            fullError: JSON.stringify(e, Object.getOwnPropertyNames(e)),
        });
        logError(e, { file: JSON.stringify(file) }, "uploadFile");
        return { failure: "Server error" };
    }
});
