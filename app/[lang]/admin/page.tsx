import { getDictionary } from "../dictionaries";
import { Locale } from "@/types/locales";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/admin/components/AdminLoginForm";

export default async function AdminPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const lang = (await params).lang;
    const dict = await getDictionary(lang);
    const cookieStore = await cookies();
    const teacherId = cookieStore.get("teacherId");

    // If already logged in, redirect to dashboard (we'll create this later)
    if (teacherId) {
        redirect(`/${lang}/admin/dashboard`);
    }

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">{dict.admin.loginTitle}</h1>
            <AdminLoginForm lang={lang} dict={dict} />
        </div>
    );
}
