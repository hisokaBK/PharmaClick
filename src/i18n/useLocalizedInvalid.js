import { useFeedback } from "../components/Feedback";

export default function useLocalizedInvalid(message) {
  const { notify } = useFeedback();

  return (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const firstInvalid = Array.from(form.elements).find((field) => field.willValidate && !field.validity.valid);
    if (event.target !== firstInvalid) return;
    form.dataset.validationAttempted = "";
    firstInvalid.focus();
    notify("warning", message);
  };
}
