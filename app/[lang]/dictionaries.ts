import "server-only";

const locales = ["en", "he", "ru", "es", "fr"] as const;
export type Locale = (typeof locales)[number];
const namespaces = ["common", "immigrant"] as const;
export type Namespace = (typeof namespaces)[number];
const dictionaries = {
    en: {
        common: () => import("@/common/locales/en/common.json").then((module) => module.default),
        immigrant: () => import("@/common/locales/en/immigrant.json").then((module) => module.default),
    },
    he: {
        common: () => import("@/common/locales/he/common.json").then((module) => module.default),
        immigrant: () => import("@/common/locales/he/immigrant.json").then((module) => module.default),
    },
    ru: {
        common: () => import("@/common/locales/ru/common.json").then((module) => module.default),
        immigrant: () => import("@/common/locales/ru/immigrant.json").then((module) => module.default),
    },
    es: {
        common: () => import("@/common/locales/es/common.json").then((module) => module.default),
        immigrant: () => import("@/common/locales/es/immigrant.json").then((module) => module.default),
    },
    fr: {
        common: () => import("@/common/locales/fr/common.json").then((module) => module.default),
        immigrant: () => import("@/common/locales/fr/immigrant.json").then((module) => module.default),
    },
};

export const getDictionary = async (locale: Locale, namespace: Namespace) => {
    if (!locales.includes(locale as Locale)) {
        throw new Error(`Unsupported locale: ${locale}`);
    }
    const localeDictionaries = dictionaries[locale as Locale];
    const dictionaryLoader = localeDictionaries[namespace];
    if (typeof dictionaryLoader !== "function") {
        throw new Error(`Dictionary loader for namespace ${namespace} in locale ${locale} is not a function`);
    }
    return dictionaryLoader();
};
