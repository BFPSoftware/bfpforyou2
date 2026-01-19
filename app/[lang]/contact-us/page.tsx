import { redirect } from "next/navigation";
import type { Locale } from "@/types/locales";

type Props = {
    params: { lang: Locale };
};

/**
 * TEMPORARY: Contact Us page disabled for now.
 *
 * Restore later by replacing this redirect with:
 *   `return <ContactUsClient />;`
 * and importing `ContactUsClient` from `./ContactUsClient`.
 */
export default async function ContactUsPage({ params: { lang } }: Props) {
    redirect(`/${lang}`);
}
