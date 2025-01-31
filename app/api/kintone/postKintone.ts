import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import logError from '@/common/logError';
import { KintonePassword, KintoneUserName } from '@/common/env';

type Data = any;
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        try {
            const reqs = req.body;
            const client = new KintoneRestAPIClient({
                baseUrl: 'https://bfp.kintone.com',
                auth: {
                    username: KintoneUserName,
                    password: KintonePassword
                }
            });
            const resp = await client.record.addRecord({
                app: 145, // dev
                record: reqs
            });
            if (!resp) {
                res.status(501);
                res.json({
                    res: 'Failed to add record'
                });
                res.end();
                return;
            } else {
                res.json(resp);
                res.end();
                return;
            }
        } catch (e: any) {
            console.log(e);
            logError(e, { req: req.body }, 'postKintone');
            res.status(505);
        }
    } else {
        res.status(405);
        return;
    }
}
