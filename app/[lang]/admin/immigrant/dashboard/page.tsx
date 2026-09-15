import { Suspense } from "react";
import { getDictionary } from "../../../dictionaries";
import { Locale } from "@/types/locales";
import { ImmigrantDashboardClient } from "@/features/admin/immigrant/components/ImmigrantDashboardClient";

interface PageProps {
    params: Promise<{ lang: Locale }>;
}

export default async function ImmigrantAdminDashboardPage({ params }: PageProps) {
    const lang = (await params).lang;
    const dict = await getDictionary(lang);

    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
            <ImmigrantDashboardClient lang={lang} dict={dict} />
        </Suspense>
    );
}
