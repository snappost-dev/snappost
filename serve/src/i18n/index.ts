import en from "./en.json";
import fi from "./fi.json";
import sv from "./sv.json";
import tr from "./tr.json";

const translationMap = {
  en,
  tr,
  fi,
  sv
} as const;

type SupportedLang = keyof typeof translationMap;

export function normalizeLanguage(lang: string | undefined | null): SupportedLang {
  const normalized = (lang || "en").trim().toLowerCase();
  if (normalized in translationMap) return normalized as SupportedLang;
  return "en";
}

export function loadTranslations(lang: string): Record<string, string> {
  const normalized = normalizeLanguage(lang);
  return translationMap[normalized];
}

export function getDateLocale(lang: string): string {
  const normalized = normalizeLanguage(lang);
  const localeMap: Record<SupportedLang, string> = {
    en: "en-US",
    tr: "tr-TR",
    fi: "fi-FI",
    sv: "sv-SE"
  };
  return localeMap[normalized];
}
