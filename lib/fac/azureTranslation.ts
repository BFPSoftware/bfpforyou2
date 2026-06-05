import logError from "@/common/logError";
import {
    AzureTranslatorClientTraceId,
    AzureTranslatorRegion,
    AzureTranslatorSubscriptionKey,
} from "@/common/env";
import { buildElementaryProfileFields, isElementaryApplication } from "@/lib/fac/elementaryProfiles";

const AZURE_TRANSLATE_URL = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";
const AZURE_TRANSLITERATE_URL = "https://api.cognitive.microsofttranslator.com/transliterate?api-version=3.0";

const SCRIPT_RUSSIAN = "cyrl";
const SCRIPT_HEBREW = "hebr";
const SCRIPT_ENGLISH = "latn";
const LANG_RUSSIAN = "ru";
const LANG_HEBREW = "he";
const LANG_ENGLISH = "en";

export const TRANSLITERATE_FIELDS = ["firstName", "lastName", "submittedBy"] as const;

export const TRANSLATE_FIELDS = [
    "returning",
    "madeAliyah",
    "introduction",
    "aboutSchool",
    "personalLife",
    "future",
    "scholarship",
    "family",
    "brothers",
    "sisters",
    "isfrom",
    "languageAtHome",
    "aboutFamily",
    "favoriteSubject",
    "challengingSubject",
    "aboutMyTeacher",
    "aboutMeFromTeacher",
    "nickname",
    "favoriteColor",
    "favoriteFood",
    "hobbies",
    "interests",
    "makesMeSad",
    "loveMost",
    "futureDreams",
    "familysituation",
    "schoolsituation",
    "relationship",
    "enjoySchoolWhy",
    "makesMeHappy",
    "liveWithOther",
    "whoDoYouLiveWith",
] as const;

type FacKintoneRecord = Record<string, { value: unknown }>;

type ScriptConfig = { fromScript: string; language: string } | null;

const isAzureConfigured = () =>
    Boolean(AzureTranslatorSubscriptionKey && AzureTranslatorRegion);

const getAzureHeaders = (): Record<string, string> => ({
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": AzureTranslatorSubscriptionKey!,
    "Ocp-Apim-Subscription-Region": AzureTranslatorRegion!,
    "ClientTraceId": AzureTranslatorClientTraceId ?? crypto.randomUUID(),
});

const getScriptConfig = (submitLang: string): ScriptConfig => {
    if (submitLang === "Hebrew") {
        return { fromScript: SCRIPT_HEBREW, language: LANG_HEBREW };
    }
    if (submitLang === "Russian") {
        return { fromScript: SCRIPT_RUSSIAN, language: LANG_RUSSIAN };
    }
    return null;
};

const getStringFieldValue = (record: FacKintoneRecord, field: string): string | null => {
    const fieldData = record[field];
    if (!fieldData || typeof fieldData.value !== "string") return null;
    const value = fieldData.value.trim();
    return value.length > 0 ? fieldData.value : null;
};

const setStringFieldValue = (record: FacKintoneRecord, field: string, value: string) => {
    record[field] = { value };
};

const deepCloneRecord = (record: FacKintoneRecord): FacKintoneRecord =>
    JSON.parse(JSON.stringify(record));

export async function transliterateText(
    text: string,
    fromScript: string,
    language: string
): Promise<string> {
    const url = `${AZURE_TRANSLITERATE_URL}&fromScript=${fromScript}&language=${language}&toScript=${SCRIPT_ENGLISH}`;
    const response = await fetch(url, {
        method: "POST",
        headers: getAzureHeaders(),
        body: JSON.stringify([{ text }]),
    });

    if (!response.ok) {
        throw new Error(`Azure transliterate failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { text: string }[];
    return data[0]?.text ?? text;
}

type TranslateApiResult = {
    detectedLanguage?: { language: string };
    translations: { text: string }[];
};

export async function translateTexts(texts: string[]): Promise<string[]> {
    if (texts.length === 0) return [];

    const url = `${AZURE_TRANSLATE_URL}&to=${LANG_ENGLISH}`;
    const response = await fetch(url, {
        method: "POST",
        headers: getAzureHeaders(),
        body: JSON.stringify(texts.map((text) => ({ text }))),
    });

    if (!response.ok) {
        throw new Error(`Azure translate failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as TranslateApiResult[];
    return data.map((item, index) => {
        if (item.detectedLanguage?.language === LANG_ENGLISH) {
            return texts[index];
        }
        return item.translations[0]?.text ?? texts[index];
    });
}

export async function translateFacRecord(record: FacKintoneRecord): Promise<FacKintoneRecord> {
    const cloned = deepCloneRecord(record);
    const submitLang =
        typeof cloned.submitLang?.value === "string" ? cloned.submitLang.value : "";
    const scriptConfig = getScriptConfig(submitLang);

    try {
        if (!isAzureConfigured()) {
            console.warn("[translateFacRecord] Azure Translator env vars missing; saving copy without translation.");
        } else if (scriptConfig) {
            await Promise.all(
                TRANSLITERATE_FIELDS.map(async (field) => {
                    const original = getStringFieldValue(cloned, field);
                    if (!original) return;
                    try {
                        const result = await transliterateText(
                            original,
                            scriptConfig.fromScript,
                            scriptConfig.language
                        );
                        setStringFieldValue(cloned, field, result);
                    } catch (error) {
                        console.error(`[translateFacRecord] transliterate failed for ${field}:`, error);
                        logError(error, { field, submitLang }, "translateFacRecord.transliterate");
                    }
                })
            );
        }

        if (isAzureConfigured()) {
            const fieldsToTranslate: string[] = [];
            const originalTexts: string[] = [];

            for (const field of TRANSLATE_FIELDS) {
                const original = getStringFieldValue(cloned, field);
                if (original) {
                    fieldsToTranslate.push(field);
                    originalTexts.push(original);
                }
            }

            if (fieldsToTranslate.length > 0) {
                try {
                    const translatedTexts = await translateTexts(originalTexts);
                    fieldsToTranslate.forEach((field, index) => {
                        setStringFieldValue(cloned, field, translatedTexts[index]);
                    });
                } catch (error) {
                    console.error("[translateFacRecord] batch translate failed:", error);
                    logError(error, { fields: fieldsToTranslate, submitLang }, "translateFacRecord.translate");
                }
            }
        }
    } catch (error) {
        console.error("[translateFacRecord] unexpected error:", error);
        logError(error, { submitLang }, "translateFacRecord");
    }

    if (isElementaryApplication(cloned)) {
        buildElementaryProfileFields(cloned);
    }

    return cloned;
}
