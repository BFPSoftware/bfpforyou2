import type { NextApiRequest, NextApiResponse } from "next";
import logError from "@/common/logError";
import { sendEmail } from "@/lib/email-service";

type Data = any;
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "POST") {
        try {
            const reqs = req.body;
            await sendEmail({
                to: "bencapture@bridgesforpeace.com",
                bcc: "ronaga@bridgesforpeace.com",
                subject: "[bfpforyou]New Message from Contact Us Form",
                html: reqs.body,
            });
            res.status(200).json({ success: true });
        } catch (e: any) {
            console.log(e);
            logError(e, { req: req.body }, "sendContactUs");
            res.status(500).json({ error: "Server error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
