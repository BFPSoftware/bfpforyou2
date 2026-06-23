import { ErrorLogsAppID } from "./env";
import client from "@/hooks/useKintone";

/** Logs to Kintone error app. Never throws — safe to call from catch blocks and error boundaries. */
const logError = async (e: unknown, records?: unknown, functionName?: string): Promise<void> => {
    try {
        console.error(e);
        if (e && typeof e === "object" && "errors" in e) {
            console.error((e as { errors: unknown }).errors);
        }

        const app = "bfpforyou";
        let recordsString = "";
        try {
            recordsString = JSON.stringify(records);
        } catch (stringifyError: unknown) {
            const msg = stringifyError instanceof Error ? stringifyError.message : "serialization failed";
            recordsString = `[Unable to serialize records: ${msg}]`;
        }

        const stack =
            e instanceof Error && e.stack
                ? e.stack
                : e instanceof Error
                  ? e.message
                  : String(e);
        const err = `Fn: ${functionName ?? "unknown"} \n${stack}\nRecord:${recordsString}`;

        await client.record.addRecord({
            app: ErrorLogsAppID as string,
            record: {
                app: { value: app },
                log: { value: err },
            },
        });
    } catch (loggingFailure) {
        console.error("[logError] Failed to persist error log:", loggingFailure);
    }
};

export default logError;
