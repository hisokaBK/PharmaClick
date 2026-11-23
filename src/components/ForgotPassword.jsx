import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useI18n } from "../i18n/LanguageProvider";
import LanguageSelector from "../i18n/LanguageSelector";
import { DemoAccountError, publicAccount, readDemo, sameDemoPassword, validAccountEmail } from "../store/demoAccounts";
import { useDemoAuth } from "./DemoAuth";
import { useFeedback } from "./Feedback";
import ValidatedField, { useFieldValidation } from "./ValidatedField";
import useDemoForm, { demoPasswordRules } from "./useDemoForm";

const emailRules = {
  email: (value, input) => (input.validity.typeMismatch || !validAccountEmail(value)) && "Enter a valid email address.",
};

export default function ForgotPassword() {
  const { t } = useI18n();
  const { user } = useDemoAuth();
  const validation = useFieldValidation(emailRules);
  const [selected, setSelected] = useState(null);
  const [lookupError, setLookupError] = useState(false);
  const [email, setEmail] = useState("");
  const emailInput = useRef(null);

  if (user) return <Navigate to="/profile" replace />;

  function findLocalAccount(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validation.validate(form)) return;
    const input = form.elements.namedItem("email");
    const normalizedEmail = input.value.trim().toLowerCase();
    const account = publicAccount(readDemo().accounts.find((entry) => entry.email === normalizedEmail));
    if (account) {
      setSelected(account);
      return;
    }
    flushSync(() => setLookupError(true));
    input.focus();
  }

  function changeEmail() {
    flushSync(() => setSelected(null));
    emailInput.current?.focus();
  }

  return (
    <main className="sign-in-layout">
      <div className="container-fluid px-4 py-5 px-md-5">
        <div className="d-flex justify-content-end mb-3"><LanguageSelector /></div>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7">
            <div className="card">
              <div className="card-body px-4 py-5 px-md-5">
                <h1 className="P_form mb-3">{t("Forgot Password")}</h1>
                <p className="demo-auth-note mb-4">{t("For demonstration purposes only. Password reset is available for local demo accounts without email verification.")}</p>
                {selected ? <NewPasswordForm account={selected} onChangeEmail={changeEmail} /> : <>
                  <p className="mb-4">{t("Enter the email used for your demo account in this browser.")}</p>
                  <form noValidate onSubmit={findLocalAccount} onBlur={validation.onBlur} onChange={(event) => {
                    setLookupError(false);
                    validation.onChange(event);
                  }}>
                    <div className="form-group mb-4">
                      <ValidatedField floating showRequiredMark={false} id="recovery-email" ref={emailInput} value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email" name="email" label="Email address" autoComplete="email" placeholder=" " required
                        error={validation.errors.email || (lookupError && "No demo account with this email was found in this browser.")} />
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                      <button className="demo-primary" type="submit">{t("Continue")}</button>
                      <Link className="demo-secondary" to="/signin">{t("Back to Sign In")}</Link>
                    </div>
                  </form>
                </>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function NewPasswordForm({ account, onChangeEmail }) {
  const { t } = useI18n();
  const { resetPassword } = useDemoAuth();
  const { notify } = useFeedback();
  const navigate = useNavigate();
  const validation = useFieldValidation(demoPasswordRules);
  const passwordInput = useRef(null);
  const [passwordError, setPasswordError] = useState(null);
  const { pending, onSubmit } = useDemoForm(async (fields) => {
    try {
      await resetPassword(account, fields);
    } catch (error) {
      if (!(error instanceof DemoAccountError) || error.message !== sameDemoPassword) throw error;
      if (passwordInput.current?.value === fields.password) {
        flushSync(() => setPasswordError(sameDemoPassword));
        passwordInput.current?.focus();
      }
      return;
    }
    notify("success", "Demo password updated. You can now sign in.");
    navigate("/signin", { replace: true, state: { registeredEmail: account.email } });
  });

  useLayoutEffect(() => {
    passwordInput.current?.focus();
  }, []);

  return <form noValidate aria-busy={pending} onBlur={validation.onBlur}
    onChange={(event) => {
      if (event.target.name === "password") setPasswordError(null);
      validation.onChange(event);
    }}
    onSubmit={(event) => {
      event.preventDefault();
      if (!pending && validation.validate(event.currentTarget) && !passwordError) onSubmit(event);
    }}>
    <p className="mb-4"><bdi>{account.email}</bdi></p>
    <div className="form-group mb-4">
      <ValidatedField floating showRequiredMark={false} id="recovery-password" ref={passwordInput}
        type="password" name="password" label="New Password" autoComplete="new-password" placeholder=" "
        maxLength={128} required describedBy="recovery-password-hint" error={validation.errors.password || passwordError} />
      <p className="small mt-2 mb-0" id="recovery-password-hint">{t("Use 8 to 128 characters.")}</p>
    </div>
    <div className="form-group mb-4">
      <ValidatedField floating showRequiredMark={false} id="recovery-confirmation"
        type="password" name="confirmation" label="Confirm New Password" autoComplete="new-password" placeholder=" "
        maxLength={128} required error={validation.errors.confirmation} />
    </div>
    <div className="d-flex flex-wrap align-items-center gap-3">
      <button className="demo-primary" type="submit" disabled={pending}>{t("Save New Password")}</button>
      <button className="demo-secondary" type="button" disabled={pending} onClick={onChangeEmail}>{t("Use a different email")}</button>
      <Link className="demo-secondary" to="/signin">{t("Back to Sign In")}</Link>
    </div>
  </form>;
}
