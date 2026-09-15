"use client";
import { Button } from "@/components/ui/button";
import { Locale } from "@/types/locales";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ImmigrantAdminLoginFormProps {
    lang: Locale;
    dict: any;
}

export function ImmigrantAdminLoginForm({ lang, dict }: ImmigrantAdminLoginFormProps) {
    const [accessCode, setAccessCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = dict.admin.immigrant;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/admin/immigrant/verify-access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessCode }),
            });

            if (!response.ok) {
                throw new Error("Invalid access code");
            }

            router.push(`/${lang}/admin/immigrant/dashboard`);
            router.refresh();
        } catch {
            setError(t.invalidCode);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="immigrantAccessCode" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.accessCode}
                </label>
                <input
                    type="text"
                    id="immigrantAccessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.enterAccessCode}
                    disabled={isLoading}
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading || !accessCode.trim()}>
                {isLoading ? dict.common.loading : t.login}
            </Button>
        </form>
    );
}
