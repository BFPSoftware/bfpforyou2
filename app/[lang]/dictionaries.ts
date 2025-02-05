import { locales, Locale } from "@/types/locales";
import "server-only";

const dictionaries = {
    en: () => import("@/common/locales/en.json").then((module) => module.default),
    he: () => import("@/common/locales/he.json").then((module) => module.default),
    ru: () => import("@/common/locales/ru.json").then((module) => module.default),
    es: () => import("@/common/locales/es.json").then((module) => module.default),
    fr: () => import("@/common/locales/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
    if (!locales.includes(locale as Locale)) {
        throw new Error(`Unsupported locale: ${locale}`);
    }
    const localeDictionaries = dictionaries[locale as Locale];
    if (typeof localeDictionaries !== "function") {
        throw new Error(`Dictionary loader for namespace in locale ${locale} is not a function`);
    }
    return localeDictionaries();
};
