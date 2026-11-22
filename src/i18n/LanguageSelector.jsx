import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { useI18n } from "./LanguageProvider";
import "./language.css";

const options = [
  { code: "ar", name: "العربية", abbreviation: "ع", flag: "ma" },
  { code: "fr", name: "Français", abbreviation: "FR", flag: "fr" },
  { code: "en", name: "English", abbreviation: "ENG", flag: "gb" },
];

export default function LanguageSelector({ open: controlledOpen, onOpenChange }) {
  const { language, setLanguage, t } = useI18n();
  const [localOpen, setLocalOpen] = useState(false);
  const open = controlledOpen ?? localOpen;
  const setOpen = onOpenChange ?? setLocalOpen;
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const panel = useRef(null);
  const items = useRef([]);
  const initialFocus = useRef(null);
  const selectedIndex = options.findIndex(({ code }) => code === language);
  const selected = options[selectedIndex];

  function openMenu(index) {
    initialFocus.current = index;
    setOpen(true);
  }

  function selectLanguage(code) {
    trigger.current.focus();
    setLanguage(code);
    setOpen(false);
  }

  useLayoutEffect(() => {
    if (!open) return;
    const menu = panel.current;
    const position = () => {
      menu.style.removeProperty("--language-offset");
      const { left, right } = menu.getBoundingClientRect();
      const edge = document.documentElement.clientWidth - 12;
      const offset = left < 12 ? 12 - left : Math.min(0, edge - right);
      menu.style.setProperty("--language-offset", `${offset}px`);
    };
    position();
    items.current[initialFocus.current]?.focus({ preventScroll: true });
    initialFocus.current = null;
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [open, language]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!root.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open, setOpen]);

  function handleKeys(event) {
    if (!open) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openMenu(event.key === "ArrowDown" ? 0 : options.length - 1);
      }
      return;
    }

    const index = items.current.indexOf(document.activeElement);
    let next;
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        trigger.current.focus();
        setOpen(false);
        return;
      case "Home": next = 0; break;
      case "End": next = options.length - 1; break;
      case "ArrowDown": next = (index + 1) % options.length; break;
      case "ArrowUp": next = index <= 0 ? options.length - 1 : index - 1; break;
      default: return;
    }
    event.preventDefault();
    items.current[next].focus();
  }

  return (
    <div className="language-selector" ref={root} onKeyDown={handleKeys}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <button type="button" className="language-trigger" ref={trigger}
        aria-label={`${t("Language")} · ${selected.name}`}
        aria-haspopup="menu" aria-expanded={open} aria-controls={id}
        onClick={() => open ? setOpen(false) : openMenu(selectedIndex)}>
        <span className={`language-flag language-flag--${selected.flag}`} aria-hidden="true" />
        <span lang={language} dir="auto">{selected.abbreviation}</span>
        <FiChevronDown className="language-chevron" aria-hidden="true" />
      </button>
      <div id={id} className="language-panel" ref={panel} role="menu"
        aria-label={t("Language")} aria-hidden={!open} inert={!open} data-open={open}>
        {options.map(({ code, name, flag }, index) => (
          <button type="button" key={code} role="menuitemradio" aria-checked={language === code}
            className="language-option" tabIndex={-1} ref={(element) => { items.current[index] = element; }}
            onClick={() => selectLanguage(code)}>
            <span className={`language-flag language-flag--${flag}`} aria-hidden="true" />
            <span lang={code} dir="auto">{name}</span>
            {language === code && <FiCheck className="language-check" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}
