import { useRef, useState } from "react";
import { DemoAccountError } from "../store/demoAccounts";
import { useFeedback } from "./Feedback";

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
