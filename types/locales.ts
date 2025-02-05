export const locales = ["en", "he", "ru", "es", "fr"] as const;
export type Locale = (typeof locales)[number];
