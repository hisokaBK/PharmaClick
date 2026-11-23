import { flushSync } from "react-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useI18n } from "../i18n/LanguageProvider";
import "../css/form-validation.css";

export function useFieldValidation(rules) {
  const [errors, setErrors] = useState({});

  function getError(form, name) {
    const input = form.elements.namedItem(name);
    const value = input.hasAttribute("data-password-field") ? input.value : input.value.trim();
    if (!value) return "This field is required.";
    return rules[name]?.(value, input, form);
  }

  function onBlur({ target }) {
    if (!Object.hasOwn(rules, target.name) || !target.value) return;
    const error = getError(target.form, target.name);
    setErrors((current) => ({ ...current, [target.name]: error }));
  }

  function onChange({ target }) {
    if (!Object.hasOwn(rules, target.name)) return;
    const next = Object.fromEntries(Object.keys(errors)
      .map((name) => [name, getError(target.form, name)]));
    setErrors(next);
  }

  function validate(form) {
    const next = Object.fromEntries(Object.keys(rules).map((name) => [name, getError(form, name)]));
    const firstInvalid = Object.keys(next).find((name) => next[name]);
    if (!firstInvalid) {
      setErrors({});
      return true;
    }
    flushSync(() => setErrors(next));
    form.elements.namedItem(firstInvalid).focus();
    return false;
  }

  return { errors, onBlur, onChange, validate, reset: () => setErrors({}) };
}

export default function ValidatedField({
  id, label, required, error, floating = false, showRequiredMark = true, describedBy, type, ...inputProps
}) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const errorId = error ? `${id}-error` : undefined;
  const caption = <label className={floating ? "form-label" : undefined} htmlFor={id}>
    {t(label)}{required && showRequiredMark && <> <span className="required-mark" aria-hidden="true" /></>}
  </label>;
  const input = <input {...inputProps} className="form-control" id={id} required={required}
    type={isPassword && visible ? "text" : type}
    data-password-field={isPassword ? "" : undefined}
    autoCapitalize={isPassword ? "none" : undefined}
    spellCheck={isPassword ? false : undefined}
    aria-invalid={error ? true : undefined}
    aria-describedby={[describedBy, errorId].filter(Boolean).join(" ") || undefined} />;
  const Icon = visible ? EyeOff : Eye;
  const passwordLabel = inputProps.name === "confirmation"
    ? (visible ? "Hide password confirmation" : "Show password confirmation")
    : (visible ? "Hide password" : "Show password");
  const togglePassword = () => setVisible((previous) => !previous);

  function activatePasswordFromKeyboard(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (!event.repeat) togglePassword();
  }

  return <>
    {!floating && caption}
    {isPassword ? <div className="password-field">
      {input}
      {floating && caption}
      <button type="button" className="password-visibility" aria-label={t(passwordLabel)}
        aria-pressed={visible} aria-controls={id}
        onClick={togglePassword} onKeyDown={activatePasswordFromKeyboard}>
        <Icon size={18} aria-hidden="true" />
      </button>
    </div> : <>{input}{floating && caption}</>}
    {error && <p className="field-error" id={errorId}>{t(error)}</p>}
  </>;
}
