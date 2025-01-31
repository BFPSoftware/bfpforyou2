import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { ErrorLogsAppID, KintonePassword, KintoneUserName } from './env';

const logError = (e: any, records?: any, functionName?: string) => {
    console.log(e);
    const app = 'bfpforyou';
    const client = new KintoneRestAPIClient({
        baseUrl: 'https://bfp.kintone.com',
        // Use password authentication
        auth: {
            username: KintoneUserName,
            password: KintonePassword
        }
    });
    const err = `Fn: ${functionName} \n` + (e.stack ? e.stack.toString() : e) + `\nRecord:${JSON.stringify(records)}`;
    return client.record.addRecord({
        app: ErrorLogsAppID as string,
        record: {
            app: {
                value: app
            },
            log: {
                value: err
            }
        }
    });
};
export default logError;
