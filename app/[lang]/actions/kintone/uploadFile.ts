"use server";

/**
 * @deprecated Prefer `POST /api/kintone/uploadFile`.
 * Kept only so older imports do not break; primary client path no longer uses this Server Action
 * because Action/Flight failures can trip route `error.tsx` even when the client has try/catch.
 */
import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import logError from "@/common/logError";
import client from "@/hooks/useKintone";

const schema = z.object({
    file: z.instanceof(File),
});

export const uploadFile = actionClient.schema(schema).action(async ({ parsedInput: { file } }) => {
    try {
        if (!file || !(file.size > 0)) {
            void logError(
                new Error("No file found"),
                { fileName: file?.name, fileSize: file?.size, fileType: file?.type },
                "uploadFile.noFile"
            );
            return { failure: "No file found" };
        }

        const data = await file.arrayBuffer();
        const buffer = Buffer.from(data);
        const { fileKey } = await client.file.uploadFile({
            file: {
                name: file.name,
                data: buffer,
            },
        });
        return { success: fileKey };
    } catch (e) {
        void logError(e, { fileName: file?.name, fileSize: file?.size, fileType: file?.type }, "uploadFile");
        return { failure: "Server error" };
    }
});
