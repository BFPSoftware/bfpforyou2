import { ErrorLogsAppID } from "./env";
import client from "@/hooks/useKintone";

function serializeRecords(records: unknown): string {
    try {
        return JSON.stringify(records, (_key, value) => {
            if (typeof File !== "undefined" && value instanceof File) {
                return { name: value.name, size: value.size, type: value.type };
            }
            return value;
        });
    } catch (stringifyError: unknown) {
        const msg = stringifyError instanceof Error ? stringifyError.message : "serialization failed";
        return `[Unable to serialize records: ${msg}]`;
    }
}

function toErrorParts(e: unknown): { message: string; name: string; stack: string } {
    if (e instanceof Error) {
        return {
            message: e.message || e.name || "Error",
            name: e.name || "Error",
            stack: e.stack || e.message,
        };
    }
    return {
        message: String(e),
        name: "NonError",
        stack: String(e),
    };
}

async function persistToKintone(e: unknown, records?: unknown, functionName?: string): Promise<void> {
    const app = "bfpforyou";
    const recordsString = serializeRecords(records);
    const { stack } = toErrorParts(e);
    const err = `Fn: ${functionName ?? "unknown"} \n${stack}\nRecord:${recordsString}`;

    await client.record.addRecord({
        app: ErrorLogsAppID as string,
        record: {
            app: { value: app },
            log: { value: err },
        },
    });
}

/** Logs to Kintone error app. Never throws — safe to call from catch blocks and error boundaries. */
const logError = async (e: unknown, records?: unknown, functionName?: string): Promise<void> => {
    try {
        console.error(e);
        if (e && typeof e === "object" && "errors" in e) {
            console.error((e as { errors: unknown }).errors);
        }

        // Browser: credentials are not available — POST to Route Handler (not a Server Action).
        if (typeof window !== "undefined") {
            const { message, name, stack } = toErrorParts(e);
            let safeRecords: unknown = undefined;
            if (records !== undefined) {
                try {
                    safeRecords = JSON.parse(serializeRecords(records));
                } catch {
                    safeRecords = { note: "records omitted (unserializable)" };
                }
            }

            await fetch("/api/log-error", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, name, stack, records: safeRecords, functionName }),
            });
            return;
        }

        await persistToKintone(e, records, functionName);
    } catch (loggingFailure) {
        console.error("[logError] Failed to persist error log:", loggingFailure);
    }
};

export default logError;
