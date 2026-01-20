import { redirect } from "next/navigation";
import type { Locale } from "@/types/locales";

type Params = Promise<{ lang: Locale }>;

type Props = {
    params: Params;
};

/**
 * TEMPORARY: Contact Us page disabled for now.
 *
 * Restore later by replacing this redirect with:
 *   `return <ContactUsClient />;`
 * and importing `ContactUsClient` from `./ContactUsClient`.
 */
export default async function ContactUsPage({ params }: Props) {
    const { lang } = await params;
    redirect(`/${lang}`);
}
