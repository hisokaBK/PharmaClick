import { useEffect, useId, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { initialsFor } from "../store/demoAccounts";
import { useDemoAuth } from "./DemoAuth";
import { useFeedback } from "./Feedback";
import "../css/DemoAccount.css";
import { useI18n } from "../i18n/LanguageProvider";

export const accountLinks = [
  ["My Profile", "/profile"],
  ["My Orders", "/profile?tab=orders"],
  ["Account Settings", "/profile?tab=settings"],
];

export function AccountAvatar({ name, photoUrl }) {
  return (
    <span className="demo-avatar" aria-hidden="true">
      {photoUrl ? <img src={photoUrl} alt="" /> : initialsFor(name)}
    </span>
  );
}

const closeAccount = (current) => current?.name === "account" ? null : current;

export default function AccountMenu({ active, setActive }) {
  const { t } = useI18n();
  const { user, signOut, photoUrl } = useDemoAuth();
  const { notify } = useFeedback();
  const navigate = useNavigate();
  const open = active?.name === "account";
  const root = useRef(null);
  const trigger = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!root.current?.contains(event.target)) setActive(closeAccount);
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setActive(closeAccount);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, setActive]);

  if (!user) {
    return (
      <ul className="ul2 demo-nav-guest">
        <li><Link className="listA" id="SignIn" to="/signin">{t("Sign in")}</Link></li>
        <li><Link className="listA" id="SignUp" to="/signup">{t("Sign up")}</Link></li>
      </ul>
    );
  }

  return (
    <div className="demo-account-menu" ref={root} onBlur={(event) => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setActive(closeAccount);
    }}>
      <button type="button" className="demo-account-trigger" ref={trigger}
        aria-label={t("Account menu for {0}", [user.name])} aria-expanded={open} aria-controls={id}
        onClick={() => setActive((current) => current?.name === "account" ? null : { name: "account" })}>
        <AccountAvatar name={user.name} photoUrl={photoUrl} />
        <span className="demo-account-name">{user.name}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      <div id={id} className="demo-account-panel" data-open={open} inert={!open} aria-hidden={!open}>
        <div className="demo-account-identity"><strong><bdi>{user.name}</bdi></strong><span><bdi dir="ltr">{user.email}</bdi></span></div>
        {accountLinks.map(([label, target]) => (
          <Link key={target} to={target} onClick={() => setActive(closeAccount)}>{t(label)}</Link>
        ))}
        <button type="button" onClick={() => {
          try {
            signOut();
            setActive(closeAccount);
            notify("success", "You signed out of your demo account.");
            navigate("/", { replace: true });
          } catch {
            notify("error", "Your session could not be updated in this browser.");
          }
        }}>{t("Logout")}</button>
      </div>
    </div>
  );
}
