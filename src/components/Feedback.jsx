import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Trash2, X } from "lucide-react";
import "../css/Feedback.css";
import { useI18n } from "../i18n/LanguageProvider";

const FeedbackContext = createContext(null);
const icons = { success: CheckCircle2, error: AlertCircle, warning: AlertTriangle, info: Info };
const toastDuration = 5000;
const isUrgent = ({ type }) => type === "error" || type === "warning";

export function useFeedback() {
  return useContext(FeedbackContext);
}

function Toast({ toast, dismiss }) {
  const { t } = useI18n();
  const card = useRef(null);
  const remaining = useRef(toastDuration);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion();
  const Icon = icons[toast.type];

  useEffect(() => {
    // Track hover without intercepting clicks on the page behind the toast.
    const trackHover = (event) => {
      if (event.pointerType === "touch") return;
      const { left, right, top, bottom } = card.current.getBoundingClientRect();
      setHovered(event.clientX >= left && event.clientX <= right && event.clientY >= top && event.clientY <= bottom);
    };
    const stopHover = () => setHovered(false);
    window.addEventListener("pointermove", trackHover, { passive: true });
    document.documentElement.addEventListener("pointerleave", stopHover);
    return () => {
      window.removeEventListener("pointermove", trackHover);
      document.documentElement.removeEventListener("pointerleave", stopHover);
    };
  }, []);

  useEffect(() => {
    if (hovered || focused) return;
    const started = performance.now();
    const timer = setTimeout(() => dismiss(toast.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - started));
    };
  }, [dismiss, focused, hovered, toast.id]);

  return (
    <motion.div
      ref={card}
      className={`feedback-toast feedback-${toast.type}`}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? undefined : { opacity: 0, y: 8 }}
      transition={{ duration: 0.16 }}
    >
      <Icon size={21} aria-hidden="true" />
      <p aria-hidden="true">{t(toast.message, toast.values)}</p>
      <button
        type="button"
        aria-label={t("Dismiss notification")}
        onClick={() => dismiss(toast.id)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <X size={18} aria-hidden="true" />
      </button>
    </motion.div>
  );
}

function ConfirmationDialog({ request, onComplete, notify }) {
  const { t } = useI18n();
  const dialog = useRef(null);
  const cancelButton = useRef(null);
  const inProgress = useRef(false);
  const [pending, setPending] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!dialog.current.open) dialog.current.showModal();
    cancelButton.current.focus();
  }, [request]);

  const close = () => {
    dialog.current?.close();
    onComplete();
    requestAnimationFrame(() => {
      if (dialog.current?.open) return;
      const target = request.trigger?.isConnected ? request.trigger : request.fallbackFocus?.();
      target?.focus({ preventScroll: true });
    });
  };

  const runAction = async () => {
    if (inProgress.current) return;
    inProgress.current = true;
    setPending(true);
    try {
      await request.onConfirm();
    } catch {
      notify("error", "The action could not be completed. Please try again.");
    } finally {
      setPending(false);
      close();
      inProgress.current = false;
    }
  };

  return (
    <dialog
      ref={dialog}
      className="feedback-dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-busy={pending}
      onCancel={(event) => {
        event.preventDefault();
        if (!inProgress.current) close();
      }}
    >
      <Trash2 className="feedback-dialog-icon" size={24} aria-hidden="true" />
      <h2 id={titleId}>{t(request.title)}</h2>
      <p id={descriptionId}>{t(request.description, request.descriptionValues)}</p>
      <div className="feedback-dialog-actions">
        <button type="button" ref={cancelButton} disabled={pending} onClick={() => {
          if (!inProgress.current) close();
        }}>{t("Cancel")}</button>
        <button type="button" className="feedback-confirm-button" disabled={pending} onClick={runAction}>
          {pending ? t("Working…") : t(request.confirmLabel)}
        </button>
      </div>
    </dialog>
  );
}

export default function FeedbackProvider({ children }) {
  const { t } = useI18n();
  const [toasts, setToasts] = useState([]);
  const [request, setRequest] = useState(null);
  const sequence = useRef(0);
  const confirmationOpen = useRef(false);

  const notify = useCallback((type, message, values) => {
    const id = ++sequence.current;
    const key = JSON.stringify([type, message, values]);
    setToasts((current) => {
      if (current.some((toast) => toast.key === key)) return current;
      return [...current.slice(-1), { id, type, message, values, key }];
    });
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const requestConfirmation = useCallback((options) => {
    if (confirmationOpen.current) return;
    confirmationOpen.current = true;
    setRequest({ trigger: document.activeElement, ...options });
  }, []);
  const feedback = useMemo(() => ({ notify, requestConfirmation }), [notify, requestConfirmation]);

  const latestNotice = toasts.filter((toast) => !isUrgent(toast)).pop();
  const latestAlert = toasts.filter(isUrgent).pop();
  return (
    <FeedbackContext.Provider value={feedback}>
      {children}
      <div className="visually-hidden" aria-live="polite" aria-atomic="true">
        {t(latestNotice?.message, latestNotice?.values)}
      </div>
      <div className="visually-hidden" aria-live="assertive" aria-atomic="true">
        {t(latestAlert?.message, latestAlert?.values)}
      </div>
      <div className="feedback-toasts">
        <AnimatePresence>
          {toasts.map((toast) => <Toast key={toast.id} toast={toast} dismiss={dismiss} />)}
        </AnimatePresence>
      </div>
      {request && (
        <ConfirmationDialog request={request} onComplete={() => { confirmationOpen.current = false; }} notify={notify} />
      )}
    </FeedbackContext.Provider>
  );
}
