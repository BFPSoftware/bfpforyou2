"use server";

/**
 * @deprecated Prefer `POST /api/log-error`.
 * Client logging now uses a Route Handler so it cannot trip `error.tsx` via Server Actions.
 */
import logError from "@/common/logError";

export type ClientErrorPayload = {
    message: string;
    name?: string;
    stack?: string;
    records?: unknown;
    functionName?: string;
};

export async function logClientError(payload: ClientErrorPayload): Promise<{ ok: boolean }> {
    const err = new Error(payload.message || "Client error");
    err.name = payload.name || "ClientError";
    if (payload.stack) err.stack = payload.stack;

    await logError(err, payload.records, payload.functionName ?? "client");
    return { ok: true };
}
