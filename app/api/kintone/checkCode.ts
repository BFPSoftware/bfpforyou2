import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import logError from '@/common/logError';
import { BeneficiaryApplicationFormAppID, BfpforyouMasterAPPID, KintonePassword, KintoneUserName } from '@/common/env';

type Data = any;
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        try {
            const reqs = req.body;
            const code = reqs.code;
            const client = new KintoneRestAPIClient({
                baseUrl: 'https://bfp.kintone.com',
                auth: {
                    username: KintoneUserName,
                    password: KintonePassword
                }
            });
            const query1 = `status in ("Active")`;
            const settings = await client.record.getAllRecords({
                app: BfpforyouMasterAPPID as string,
                condition: query1
            });
            const query2 = `ticket="${code}"`;
            const records = await client.record.getAllRecords({
                app: BeneficiaryApplicationFormAppID as string,
                condition: query2
            });
            const countUsedCode = (code: string) => {
                return records.filter((record) => record['ticket'].value === code).length;
            };
            const setting = settings.find((setting) => {
                if (setting['expiry'].value && new Date(setting['expiry'].value as string) < new Date()) {
                    return false;
                }
                if (setting['maxValue'].value) {
                    if (countUsedCode(code) > 0) return false;
                    if (parseInt(setting['maxValue'].value as string) < parseInt(code)) return false;
                    if (parseInt(setting['code'].value as string) > parseInt(code)) return false;
                }
                // else if here, when maxValue is not set
                else if (setting['code'].value != code) return false;
                if (setting['limit'].value && countUsedCode(code) > parseInt(setting['limit'].value as string)) return false;
                return true;
            });
            if (!setting) {
                console.log('no setting');
                res.status(501);
                res.json({
                    res: 'No setting found for this code'
                });
                res.end();
                return;
            } else {
                console.log('hassettings');
                res.json({
                    setting: setting,
                    program: setting['program'].value
                });
                res.end();
                return;
            }
        } catch (e: any) {
            console.log(e);
            logError(e, { req: req.body }, 'checkCode');
            res.status(505);
        }
    } else {
        res.status(405);
    }
}
