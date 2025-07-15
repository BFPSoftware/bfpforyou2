import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "https://developers.google.com/oauthplayground");

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { to, subject, html } = body;

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

        // Send email
        await transporter.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to,
            subject,
            html,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to send email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
