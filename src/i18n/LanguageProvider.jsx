import { createContext, useContext, useLayoutEffect, useMemo, useState } from "react";
import en from "./en.json";
import fr from "./fr.json";
import ar from "./ar.json";

const languages = { en, fr, ar };
const key = "pharmaclick.language";
const LanguageContext = createContext({
  language: "en", setLanguage: () => {}, t: (message, values, options) => formatMessage("en", message, values, options),
});

function initialLanguage() {
  try {
    const saved = localStorage.getItem(key);
    return Object.hasOwn(languages, saved) ? saved : "en";
  } catch {
    return "en";
  }
}

export function formatMessage(language, message, values = [], { fallbackToEnglish = true } = {}) {
  if (typeof message !== "string") return message;
  const locale = Object.hasOwn(languages, language) ? language : "en";
  const catalog = languages[locale];
  const normalized = message.replace(/\s+/g, " ").trim();
  let translation = Object.hasOwn(catalog, normalized) ? catalog[normalized]
    : fallbackToEnglish && Object.hasOwn(en, normalized) ? en[normalized] : message;
  if (typeof translation === "object") {
    const category = new Intl.PluralRules(locale).select(values[0]);
    translation = translation[category] ?? translation.other;
  }
  return translation.replace(/\{(\d+)\}/g, (token, index) => values[index] ?? token);
}

export function useI18n() {
  return useContext(LanguageContext);
}

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage);
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(key, language);
    } catch {
      // Language selection still works for the current visit.
    }
  }, [language]);
  const value = useMemo(() => ({
    language, setLanguage, t: (message, values, options) => formatMessage(language, message, values, options),
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
