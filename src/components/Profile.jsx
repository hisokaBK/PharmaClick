import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AccountAvatar, accountLinks } from "./AccountMenu";
import { useDemoAuth } from "./DemoAuth";
import { useFeedback } from "./Feedback";
import Footer from "./Footer";
import ProfilePhoto from "./ProfilePhoto";
import useDemoForm from "./useDemoForm";
import { demoAccountNotice } from "../store/demoAccounts";
import { useI18n } from "../i18n/LanguageProvider";
import useLocalizedInvalid from "../i18n/useLocalizedInvalid";
import { OrderHistory } from "../checkout/OrderHistory";

function PersonalInformation({ user, editing, setEditing }) {
  const { t } = useI18n();
  const onInvalid = useLocalizedInvalid("Enter your full name and a valid email address.");
  const { updateProfile } = useDemoAuth();
  const { notify } = useFeedback();
  const { pending, onSubmit } = useDemoForm(({ name, email }) => {
    updateProfile(name, email);
    setEditing(false);
    notify("success", "Your profile was updated.");
  });

  return (
    <section className="demo-profile-section" aria-labelledby="personal-title">
      <h2 id="personal-title">{t("Personal information")}</h2>
      {editing ? (
        <form onSubmit={onSubmit} aria-busy={pending} className="demo-profile-form"
          onInvalid={onInvalid}>
          <label>{t("Full name")}<input name="name" className="form-control" required maxLength={100}
            autoComplete="name" defaultValue={user.name} /></label>
          <label>{t("Email address")}<input name="email" type="email" className="form-control" required
            autoComplete="email" maxLength={254} defaultValue={user.email} /></label>
          <div className="demo-profile-actions">
            <button type="submit" className="demo-primary" disabled={pending}>{t("Save changes")}</button>
            <button type="button" className="demo-secondary" onClick={() => setEditing(false)}>{t("Cancel")}</button>
          </div>
        </form>
      ) : (
        <dl className="demo-profile-details">
          <div><dt>{t("Full name")}</dt><dd>{user.name}</dd></div>
          <div><dt>{t("Email address")}</dt><dd><bdi dir="ltr">{user.email}</bdi></dd></div>
        </dl>
      )}
    </section>
  );
}

export default function Profile() {
  const { t } = useI18n();
  const { user, deleteAccount, photoUrl } = useDemoAuth();
  const { notify, requestConfirmation } = useFeedback();
  const [params] = useSearchParams();
  const value = params.get("tab");
  const tab = value === "orders" || value === "settings" ? value : "profile";
  const [editing, setEditing] = useState(false);
  const tabs = ["profile", "orders", "settings"];

  return (
    <>
      <main className="demo-profile">
        <header className="demo-profile-header">
          <AccountAvatar name={user.name} photoUrl={photoUrl} />
          <div className="demo-profile-heading"><h1><bdi>{user.name}</bdi></h1><p><bdi dir="ltr">{user.email}</bdi></p></div>
          <Link className="demo-secondary" to="/profile" onClick={() => setEditing(true)}>{t("Edit Profile")}</Link>
        </header>
        <nav className="demo-profile-tabs" aria-label={t("Profile sections")}>
          {accountLinks.map(([label, target], index) => (
            <Link key={target} to={target} aria-current={tab === tabs[index] ? "page" : undefined}
              onClick={() => setEditing(false)}>{t(label)}</Link>
          ))}
        </nav>
        {tab === "profile" && (
          <div className="demo-profile-content" key={user.id}>
            <PersonalInformation user={user} editing={editing} setEditing={setEditing} />
            <ProfilePhoto />
          </div>
        )}
        {tab === "orders" && <OrderHistory key={user.id} userId={user.id} />}
        {tab === "settings" && (
          <section className="demo-profile-section">
            <h2>{t("Account Settings")}</h2>
            <p>{t("Account email")} <strong>{user.email}</strong></p>
            <p>{t(demoAccountNotice)}</p>
            <button type="button" className="demo-danger" onClick={(event) => requestConfirmation({
              title: "Delete demo account?",
              description: "This permanently removes this demo account, its photo, saved cart and demo orders from this browser.",
              confirmLabel: "Delete account",
              trigger: event.currentTarget,
              onConfirm: async () => {
                await deleteAccount();
                notify("success", "Your demo account was deleted.");
              },
            })}>{t("Delete demo account")}</button>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
