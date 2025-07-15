import logError from "@/common/logError";
import { google } from "googleapis";
import nodemailer from "nodemailer";

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "https://developers.google.com/oauthplayground");

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export type EmailOptions = {
    to: string | { email: string }[] | undefined;
    subject: string;
    html: string;
    bcc?: string;
};

export async function sendEmail(options: EmailOptions) {
    try {
        const { to, subject, html, bcc } = options;

        // Get access token
        const accessToken = await oauth2Client.getAccessToken();

        // Create transporter with OAuth2
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GOOGLE_EMAIL,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken?.token || undefined,
            },
        });

        // Handle array of email objects
        const toEmails = Array.isArray(to) ? to.map((t) => t.email).join(", ") : to;

        // Send email
        await transporter.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: toEmails,
            bcc,
            subject,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        logError(error, options, "sendEmail");
        throw error;
    }
}
