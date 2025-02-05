"use server";

import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { KintoneUserName, KintonePassword } from "@/common/env";
import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import logError from "@/common/logError";

// This schema is used to validate input from client.
const schema = z.object({
    file: z.instanceof(File),
});

export const uploadFile = actionClient.schema(schema).action(async ({ parsedInput: { file } }) => {
    try {
        if (!file || !(file.size > 0)) return { failure: "No file found" };
        const client = new KintoneRestAPIClient({
            baseUrl: "https://bfp.kintone.com",
            auth: {
                username: KintoneUserName,
                password: KintonePassword,
            },
        });
        const data = await file.arrayBuffer();
        const buffer = Buffer.from(data);
        const { fileKey } = await client.file.uploadFile({
            file: {
                name: file.name,
                data: buffer,
            },
        });

        console.log("fileKey", fileKey);
        return { success: fileKey };
    } catch (e) {
        logError(e, { file: JSON.stringify(file) }, "uploadFile");
        return { failure: "Server error" };
    }
});
