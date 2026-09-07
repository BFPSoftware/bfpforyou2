"use server";

import logError from "@/common/logError";

export type ClientErrorPayload = {
    message: string;
    name?: string;
    stack?: string;
    records?: unknown;
    functionName?: string;
};

/** Persist a browser-side error to the Kintone error log (credentials only exist on the server). */
export async function logClientError(payload: ClientErrorPayload): Promise<{ ok: boolean }> {
    const err = new Error(payload.message || "Client error");
    err.name = payload.name || "ClientError";
    if (payload.stack) err.stack = payload.stack;

    await logError(err, payload.records, payload.functionName ?? "client");
    return { ok: true };
}
