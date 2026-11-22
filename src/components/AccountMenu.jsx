import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { initialsFor } from "../store/demoAccounts";
import { useDemoAuth } from "./DemoAuth";
import { useFeedback } from "./Feedback";
import "../css/DemoAccount.css";

export const accountLinks = [
  ["My Profile", "/profile"],
  ["My Orders", "/profile?tab=orders"],
  ["Account Settings", "/profile?tab=settings"],
];

export function AccountAvatar({ name }) {
  return <span className="demo-avatar" aria-hidden="true">{initialsFor(name)}</span>;
}

export default function AccountMenu() {
  const { user, signOut } = useDemoAuth();
  const { notify } = useFeedback();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!user) {
    return (
      <ul className="ul2 demo-nav-guest">
        <li><Link className="listA" id="SignIn" to="/signin">Sign in</Link></li>
        <li><Link className="listA" id="SignUp" to="/signup">Sign up</Link></li>
      </ul>
    );
  }

  return (
    <div className="demo-account-menu" ref={root} onBlur={(event) => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
    }}>
      <button type="button" className="demo-account-trigger" ref={trigger}
        aria-label={`Account menu for ${user.name}`} aria-expanded={open} aria-controls={id}
        onClick={() => setOpen((current) => !current)}>
        <AccountAvatar name={user.name} />
        <span className="demo-account-name">{user.name}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      <div id={id} className="demo-account-panel" data-open={open} inert={!open} aria-hidden={!open}>
        <div className="demo-account-identity"><strong>{user.name}</strong><span>{user.email}</span></div>
        {accountLinks.map(([label, target]) => (
          <Link key={target} to={target} onClick={() => setOpen(false)}>{label}</Link>
        ))}
        <button type="button" onClick={() => {
          try {
            signOut();
            setOpen(false);
            notify("success", "You signed out of your demo account.");
            navigate("/", { replace: true });
          } catch {
            notify("error", "Your session could not be updated in this browser.");
          }
        }}>Logout</button>
      </div>
    </div>
  );
}
