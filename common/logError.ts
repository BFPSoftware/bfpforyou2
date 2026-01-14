import { ErrorLogsAppID } from "./env";
import client from "@/hooks/useKintone";

const logError = (e: any, records?: any, functionName?: string) => {
    console.log(e);
    if (e.errors) console.log(e.errors);
    const app = "bfpforyou";
    
    // Try to stringify records, but catch errors (e.g., when request body is already consumed)
    let recordsString = "";
    try {
        recordsString = JSON.stringify(records);
    } catch (stringifyError: any) {
        // If stringify fails (e.g., request body already consumed), log a fallback message
        recordsString = `[Unable to serialize records: ${stringifyError?.message || "Request body may have been consumed"}]`;
    }
    
    const err = `Fn: ${functionName} \n` + (e.stack ? e.stack.toString() : e) + `\nRecord:${recordsString}`;
    return client.record.addRecord({
        app: ErrorLogsAppID as string,
        record: {
            app: {
                value: app,
            },
            log: {
                value: err,
            },
        },
    });
};
export default logError;
