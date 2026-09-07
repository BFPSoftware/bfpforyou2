import { NextRequest, NextResponse } from "next/server";
import logError from "@/common/logError";

export const runtime = "nodejs";

type ClientErrorBody = {
    message?: string;
    name?: string;
    stack?: string;
    records?: unknown;
    functionName?: string;
};

/**
 * Persist browser-side errors to Kintone.
 * Uses a Route Handler (not a Server Action) so logging never trips error.tsx.
 */
export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as ClientErrorBody;
        const err = new Error(body.message || "Client error");
        err.name = body.name || "ClientError";
        if (body.stack) err.stack = body.stack;

        await logError(err, body.records, body.functionName ?? "client");
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("[api/log-error] Failed:", e);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}
