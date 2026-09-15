import { getDictionary } from "../../dictionaries";
import { Locale } from "@/types/locales";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ImmigrantAdminLoginForm } from "@/features/admin/immigrant/components/ImmigrantAdminLoginForm";

export default async function ImmigrantAdminPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const lang = (await params).lang;
    const dict = await getDictionary(lang);
    const cookieStore = await cookies();
    const immigrantAdminId = cookieStore.get("immigrantAdminId");

    if (immigrantAdminId) {
        redirect(`/${lang}/admin/immigrant/dashboard`);
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">{dict.admin.immigrant.loginTitle}</h1>
            <ImmigrantAdminLoginForm lang={lang} dict={dict} />
        </div>
    );
}
