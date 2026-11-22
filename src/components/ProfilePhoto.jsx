import { useEffect, useRef, useState } from "react";
import { ProfilePhotoError, prepareProfilePhoto } from "../store/profilePhotos";
import { useDemoAuth } from "./DemoAuth";
import { useFeedback } from "./Feedback";
import { useI18n } from "../i18n/LanguageProvider";

export default function ProfilePhoto() {
  const { t } = useI18n();
  const { photoUrl, updatePhoto } = useDemoAuth();
  const { notify, requestConfirmation } = useFeedback();
  const picker = useRef(null);
  const uploadButton = useRef(null);
  const [draft, setDraft] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const working = useRef(false);

  useEffect(() => {
    if (!draft) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(draft);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [draft]);

  async function run(operation, errorMessage) {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    try {
      await operation();
    } catch (error) {
      notify("error", error instanceof ProfilePhotoError ? error.message : errorMessage);
    } finally {
      working.current = false;
      setBusy(false);
    }
  }

  function choose(event) {
    const file = event.currentTarget.files[0];
    event.currentTarget.value = "";
    if (!file) return;
    run(async () => {
      setDraft(null);
      setDraft(await prepareProfilePhoto(file));
    }, "This image could not be opened. Try a different JPEG, PNG, or WebP photo.");
  }

  return (
    <section className="demo-profile-section demo-photo-section" aria-labelledby="profile-photo-title" aria-busy={busy}>
      <h2 id="profile-photo-title">{t("Profile photo")}</h2>
      <p id="profile-photo-formats">{t("JPEG, PNG, or WebP, up to 8 MB.")}</p>
      <input ref={picker} type="file" accept="image/jpeg,image/png,image/webp" aria-label={t("Choose profile photo")}
        hidden disabled={busy} onChange={choose} />
      {draft && preview && <img className="demo-photo-preview" src={preview} alt={t("Preview of your avatar")} />}
      <div className="demo-profile-actions">
        {draft ? (
          <>
            <button type="button" className="demo-primary" disabled={busy} onClick={() => run(async () => {
              await updatePhoto(draft);
              setDraft(null);
              notify("success", "Your profile photo was saved.");
            }, "Your profile photo could not be saved in this browser.")}>{t("Save photo")}</button>
            <button type="button" className="demo-secondary" disabled={busy} onClick={() => setDraft(null)}>{t("Cancel preview")}</button>
          </>
        ) : (
          <>
            <button type="button" className="demo-secondary" disabled={busy} ref={uploadButton} aria-describedby="profile-photo-formats"
              onClick={() => picker.current.click()}>{photoUrl ? t("Change photo") : t("Upload photo")}</button>
            {photoUrl && (
              <button type="button" className="demo-danger" disabled={busy} onClick={(event) => requestConfirmation({
                title: "Remove profile photo?",
                description: "Your avatar will show your initials again.",
                confirmLabel: "Remove photo",
                trigger: event.currentTarget,
                fallbackFocus: () => uploadButton.current,
                onConfirm: () => run(async () => {
                  await updatePhoto(null);
                  notify("success", "Your profile photo was removed.");
                }, "Your profile photo could not be removed in this browser."),
              })}>{t("Remove photo")}</button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
