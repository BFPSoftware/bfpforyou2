import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import logError from '@/common/logError';
import { KintonePassword, KintoneUserName } from '@/common/env';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false
    }
};

type Data = any;
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    console.log('req.body', req.method);
    if (req.method === 'POST') {
        try {
            const client = new KintoneRestAPIClient({
                baseUrl: 'https://bfp.kintone.com',
                auth: {
                    username: KintoneUserName,
                    password: KintonePassword
                }
            });
            const form = formidable({});
            console.log('form', form);
            console.log('kokokara');
            form.parse(req, async function (err, fields, files) {
                console.log('kokomade');
                if (err) {
                    res.statusCode = 500;
                    res.json({
                        res: req.method
                    });
                    res.end();
                    return;
                }
                const file = files.file;
                if (file == undefined) {
                    res.json({
                        res: 'No file found'
                    });
                    res.end();
                    return;
                }
                const { fileKey } = await client.file.uploadFile({
                    file: {
                        name: file[0].originalFilename || 'unknown file',
                        data: fs.createReadStream(file[0].filepath)
                    }
                });
                console.log('fileKey', fileKey);
                res.status(200).json({
                    res: fileKey
                });
                res.end();
            });
            console.log('kokoha?');
            return;
        } catch (e: any) {
            console.log(e);
            logError(e, { req: req }, 'postKintone');
            res.status(505);
        }
    } else {
        res.status(405);
    }
}
