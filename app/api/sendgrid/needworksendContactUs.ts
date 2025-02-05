import type { NextApiRequest, NextApiResponse } from "next";
import logError from "@/common/logError";
import sgMail from "@sendgrid/mail";
import { sendgridApiKey } from "@/common/env";

type Data = any;
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === "POST") {
        try {
            const reqs = req.body;
            sgMail.setApiKey(sendgridApiKey!);
            const msg = {
                to: "ronaga@bridgesforpeace.com", // Change to your recipient
                from: "noreply@bridgesforpeace.com", // Change to your verified sender
                cc: "",
                subject: "[bfpforyou]New Message from Contact Us Form",
                html: reqs.body,
            };
            await sgMail
                .send(msg)
                .then((e) => {
                    res.status(200).json({ name: e });
                })
                .catch((error) => {
                    res.status(200).json({ name: error });
                });
            res.status(200);
            return;
        } catch (e: any) {
            console.log(e);
            logError(e, { req: req.body }, "sendContactUs");
            res.status(505);
        }
    } else {
        res.status(405);
    }
}
