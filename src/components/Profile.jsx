import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AccountAvatar, accountLinks } from "./AccountMenu";
import { useDemoAuth } from "./DemoAuth";
import { useFeedback } from "./Feedback";
import Footer from "./Footer";
import ProfilePhoto from "./ProfilePhoto";
import useDemoForm from "./useDemoForm";
import { demoAccountNotice } from "../store/demoAccounts";

function PersonalInformation({ user, editing, setEditing }) {
  const { updateProfile } = useDemoAuth();
  const { notify } = useFeedback();
  const { pending, onSubmit } = useDemoForm(({ name, email }) => {
    updateProfile(name, email);
    setEditing(false);
    notify("success", "Your profile was updated.");
  });

  return (
    <section className="demo-profile-section" aria-labelledby="personal-title">
      <h2 id="personal-title">Personal information</h2>
      {editing ? (
        <form onSubmit={onSubmit} aria-busy={pending} className="demo-profile-form"
          onInvalid={() => notify("warning", "Enter your full name and a valid email address.")}>
          <label>Full name<input name="name" className="form-control" required maxLength={100}
            autoComplete="name" defaultValue={user.name} /></label>
          <label>Email address<input name="email" type="email" className="form-control" required
            autoComplete="email" maxLength={254} defaultValue={user.email} /></label>
          <div className="demo-profile-actions">
            <button type="submit" className="demo-primary" disabled={pending}>Save changes</button>
            <button type="button" className="demo-secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <dl className="demo-profile-details">
          <div><dt>Full name</dt><dd>{user.name}</dd></div>
          <div><dt>Email address</dt><dd>{user.email}</dd></div>
        </dl>
      )}
    </section>
  );
}

export default function Profile() {
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
          <div className="demo-profile-heading"><h1>{user.name}</h1><p>{user.email}</p></div>
          <Link className="demo-secondary" to="/profile" onClick={() => setEditing(true)}>Edit Profile</Link>
        </header>
        <nav className="demo-profile-tabs" aria-label="Profile sections">
          {accountLinks.map(([label, target], index) => (
            <Link key={target} to={target} aria-current={tab === tabs[index] ? "page" : undefined}
              onClick={() => setEditing(false)}>{label}</Link>
          ))}
        </nav>
        {tab === "profile" && (
          <div className="demo-profile-content" key={user.id}>
            <PersonalInformation user={user} editing={editing} setEditing={setEditing} />
            <ProfilePhoto />
          </div>
        )}
        {tab === "orders" && (
          <section className="demo-profile-section">
            <h2>My Orders</h2>
            <p>No orders yet. Checkout previews invoices, and this demo does not submit orders.</p>
            <Link to="/Products">Browse products</Link>
          </section>
        )}
        {tab === "settings" && (
          <section className="demo-profile-section">
            <h2>Account Settings</h2>
            <p>Account email <strong>{user.email}</strong></p>
            <p>{demoAccountNotice}</p>
            <button type="button" className="demo-danger" onClick={(event) => requestConfirmation({
              title: "Delete demo account?",
              description: "This permanently removes this demo account, its photo, and its saved cart from this browser.",
              confirmLabel: "Delete account",
              trigger: event.currentTarget,
              onConfirm: async () => {
                await deleteAccount();
                notify("success", "Your demo account was deleted.");
              },
            })}>Delete demo account</button>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
