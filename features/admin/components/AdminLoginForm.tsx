"use client";
import { Button } from "@/components/ui/button";
import { Locale } from "@/types/locales";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminLoginFormProps {
    lang: Locale;
    dict: any;
}

export function AdminLoginForm({ lang, dict }: AdminLoginFormProps) {
    const [accessCode, setAccessCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/admin/verify-access", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ accessCode }),
            });

            if (!response.ok) {
                throw new Error("Invalid access code");
            }

            // Successful login will set the cookie on the server side
            router.push(`/${lang}/admin/dashboard`);
            router.refresh();
        } catch (error) {
            setError(dict.admin.invalidCode);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
                    {dict.admin.accessCode}
                </label>
                <input type="text" id="accessCode" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={dict.admin.enterAccessCode} disabled={isLoading} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading || !accessCode.trim()}>
                {isLoading ? dict.common.loading : dict.admin.login}
            </Button>
        </form>
    );
}
