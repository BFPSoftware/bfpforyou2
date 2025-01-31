// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { KintonePassword, KintoneUserName, VolunteerApplicationAppID } from '@/common/env';
import logError from '@/common/logError';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = any;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const resa = {
        p: KintonePassword,
        u: KintoneUserName,
        a: VolunteerApplicationAppID
    };
    logError('Hello', resa);
    res.status(200).json(resa);
}
