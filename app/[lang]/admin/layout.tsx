import HeaderNoSelectLang from "@/components/general/header menu/HeaderNoSelectLang";
import { getDictionary } from "../dictionaries";
import { Locale } from "@/types/locales";
import Footer from "@/components/general/footer/Footer";
import Header from "@/components/general/header menu/Header";

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
    const lang = (await params).lang;
    const dict = await getDictionary(lang);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <Footer />
        </div>
    );
}
