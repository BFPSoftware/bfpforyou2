import React, { useState } from "react";
import { Button } from "@/components/ui/button";

/*
Required Environment Variables (.env):
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_EMAIL=your.email@gmail.com

OAuth2 Setup Instructions:
1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the Gmail API
4. Configure OAuth consent screen:
   - Set application type to "Web application"
   - Add authorized redirect URI: https://developers.google.com/oauthplayground
5. Create OAuth2 credentials:
   - Create a new OAuth client ID
   - Application type: Web application
   - Add authorized redirect URI: https://developers.google.com/oauthplayground
6. Get refresh token:
   - Go to https://developers.google.com/oauthplayground
   - Click the gear icon (settings)
   - Check "Use your own OAuth credentials"
   - Enter your client ID and secret
   - Select Gmail API v1 scope: https://mail.google.com/
   - Click "Authorize APIs"
   - Exchange authorization code for tokens
   - Save the refresh token
*/

const TestButton = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string>("");

    const handleSendTestEmail = async () => {
        try {
            setLoading(true);
            setResult("");

            const response = await fetch("/api/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: "ronaga@bridgesforpeace.com",
                    subject: "Test Email from Nodemailer (OAuth2)",
                    html: `
                        <h1>Test Email</h1>
                        <p>This is a test email sent from Nodemailer using OAuth2 at ${new Date().toLocaleString()}</p>
                        <p>If you're seeing this, the OAuth2 email configuration is working correctly!</p>
                    `,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setResult("✅ Email sent successfully!");
            } else {
                throw new Error(data.error || "Failed to send email");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setResult(`❌ Error: ${error instanceof Error ? error.message : "Failed to send email"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Email Test (OAuth2)</h2>
                <p className="text-sm text-gray-600">Make sure you have set up the required OAuth2 credentials in your environment variables before testing.</p>
                <p className="text-sm text-gray-600">Required: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, and GOOGLE_EMAIL</p>
            </div>

            <Button onClick={handleSendTestEmail} disabled={loading}>
                {loading ? "Sending..." : "Send Test Email"}
            </Button>

            {result && <div className={`mt-4 p-3 rounded ${result.startsWith("✅") ? "bg-green-100" : "bg-red-100"}`}>{result}</div>}
        </div>
    );
};

export default TestButton;
