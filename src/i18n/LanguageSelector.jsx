import { useI18n } from "./LanguageProvider";
import "./language.css";

const options = [["en", "English"], ["fr", "Français"], ["ar", "العربية"]];

export default function LanguageSelector() {
  const { language, setLanguage, t } = useI18n();
  return (
    <select className="language-selector" aria-label={t("Language")} value={language}
      onChange={(event) => setLanguage(event.target.value)}>
      {options.map(([code, name]) => <option key={code} value={code} lang={code}>{name}</option>)}
    </select>
  );
}
