import { useRef, useState } from "react";
import { DemoAccountError, validAccountPassword } from "../store/demoAccounts";
import { useFeedback } from "./Feedback";

export const demoPasswordRules = {
  password: (value) => !validAccountPassword(value) && "Use a password with 8 to 128 characters.",
  confirmation: (value, input, form) => value !== form.elements.namedItem("password").value && "The passwords do not match.",
};

export default function useDemoForm(submit) {
  const { notify } = useFeedback();
  const inProgress = useRef(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    if (inProgress.current) return;
    inProgress.current = true;
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setPending(true);
    try {
      await submit(fields);
    } catch (error) {
      notify("error", error instanceof DemoAccountError ? error.message : "The account change could not be saved in this browser.");
    } finally {
      inProgress.current = false;
      setPending(false);
    }
  }

  return { pending, onSubmit };
}
