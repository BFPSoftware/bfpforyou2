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
        if (!file || !(file.size > 0)) return { failure: "No file found" };
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
        logError(e, { file: JSON.stringify(file) }, "uploadFile");
        return { failure: "Server error" };
    }
});
