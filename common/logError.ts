import { ErrorLogsAppID } from "./env";
import client from "@/hooks/useKintone";

const logError = (e: any, records?: any, functionName?: string) => {
    console.log(e);
    const app = "bfpforyou";
    const err = `Fn: ${functionName} \n` + (e.stack ? e.stack.toString() : e) + `\nRecord:${JSON.stringify(records)}`;
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
