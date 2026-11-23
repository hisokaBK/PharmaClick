import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import App from "../App";
import FeedbackProvider, { useFeedback } from "./Feedback";

beforeEach(() => {
  window.scrollTo = jest.fn();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
});

function renderPage(route) {
  window.history.replaceState({}, "", route);
  render(<App />);
}

function addProductAndOpenCart() {
  renderPage("/Produit/1");
  fireEvent.click(screen.getByRole("button", { name: /add to bag/i }));
  fireEvent.click(screen.getByRole("link", { name: "Shopping cart, 1 products" }));
}

test("product detail warns about stock and adds an available quantity", () => {
  renderPage("/Produit/1");
  const quantity = screen.getByRole("spinbutton");
  const add = screen.getByRole("button", { name: /add to bag/i });
  fireEvent.change(quantity, { target: { value: "101" } });
  fireEvent.click(add);
  fireEvent.click(add);
  const warning = "There is not enough stock for that quantity.";
  expect(screen.getAllByText(warning)).toHaveLength(2); // One visual toast and one live announcement.
  expect(screen.getByRole("link", { name: "Shopping cart, 0 products" })).toBeInTheDocument();

  fireEvent.change(quantity, { target: { value: "1" } });
  fireEvent.click(add);
  expect(screen.getAllByText("Doliprane 757mg added to your cart.")).toHaveLength(2);
  expect(screen.getByRole("link", { name: "Shopping cart, 1 products" })).toBeInTheDocument();
});

test("cart removal waits for confirmation and restores focus after cancellation", async () => {
  addProductAndOpenCart();
  const remove = screen.getByRole("button", { name: "Remove" });
  fireEvent.click(remove);
  const dialog = screen.getByRole("dialog", { name: "Remove item?" });
  const cancel = within(dialog).getByRole("button", { name: "Cancel" });
  expect(cancel).toHaveFocus();
  expect(screen.getByRole("heading", { name: "Doliprane 757mg" })).toBeInTheDocument();
  fireEvent.click(cancel);
  expect(screen.getByRole("heading", { name: "Doliprane 757mg" })).toBeInTheDocument();
  await waitFor(() => expect(remove).toHaveFocus());

  fireEvent.click(remove);
  fireEvent.click(within(dialog).getByRole("button", { name: "Remove item" }));
  expect(await screen.findByRole("heading", { name: "Your cart is empty" })).toBeInTheDocument();
  expect(screen.getAllByText("Item removed from your cart.")).toHaveLength(2);
  await waitFor(() => expect(screen.getByRole("main", { name: "Shopping cart" })).toHaveFocus());
});

test("clear cart supports Escape and empties the cart only after confirmation", async () => {
  addProductAndOpenCart();
  const clear = screen.getByRole("button", { name: "Clear cart" });
  fireEvent.click(clear);
  const dialog = screen.getByRole("dialog", { name: "Clear your cart?" });
  fireEvent(dialog, new Event("cancel", { bubbles: true, cancelable: true }));
  expect(screen.queryByRole("dialog", { name: "Clear your cart?" })).toBeNull();
  expect(screen.getByRole("heading", { name: "Doliprane 757mg" })).toBeInTheDocument();

  fireEvent.click(clear);
  fireEvent.click(within(dialog).getByRole("button", { name: "Clear cart" }));
  expect(await screen.findByRole("heading", { name: "Your cart is empty" })).toBeInTheDocument();
  expect(screen.getAllByText("Your cart was cleared.")).toHaveLength(2);
});

test("inventory deletion leaves the row in place when canceled", async () => {
  renderPage("/Dashboard");
  const [remove] = screen.getAllByRole("button", { name: "Delete Doliprane 757mg" });
  fireEvent.click(remove);
  const dialog = screen.getByRole("dialog", { name: "Delete medication?" });
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  expect(remove).toBeInTheDocument();

  fireEvent.click(remove);
  fireEvent.click(within(dialog).getByRole("button", { name: "Delete medication" }));
  await waitFor(() => expect(remove).not.toBeInTheDocument());
  expect(screen.getAllByText("Medication deleted.")).toHaveLength(2);
  await waitFor(() => expect(screen.getByRole("button", { name: "Add Medicament" })).toHaveFocus());
}, 12000);

test("checkout opens the delivery step and explains the demo workflow", () => {
  addProductAndOpenCart();
  fireEvent.click(screen.getByRole("link", { name: /proceed to checkout/i }));
  expect(screen.getByRole("heading", { name: "Choose your delivery location" })).toBeInTheDocument();
  expect(screen.getByText("This is a demo. No payment is collected and no delivery is arranged.")).toBeInTheDocument();
});

function AsyncAction({ onConfirm }) {
  const { requestConfirmation } = useFeedback();
  return (
    <button onClick={() => requestConfirmation({
      title: "Remove saved item?",
      description: "This removes the saved item.",
      confirmLabel: "Remove saved item",
      onConfirm,
    })}>
      Open confirmation
    </button>
  );
}

test("async confirmation blocks repeat submissions and keeps technical errors private", async () => {
  let rejectAction;
  const action = jest.fn(() => new Promise((resolve, reject) => { rejectAction = reject; }));
  render(<FeedbackProvider><AsyncAction onConfirm={action} /></FeedbackProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Open confirmation" }));
  const dialog = screen.getByRole("dialog", { name: "Remove saved item?" });
  const confirmButton = within(dialog).getByRole("button", { name: "Remove saved item" });
  fireEvent.click(confirmButton);
  fireEvent.click(confirmButton);
  fireEvent(dialog, new Event("cancel", { bubbles: true, cancelable: true }));
  expect(action).toHaveBeenCalledTimes(1);
  expect(dialog).toHaveAttribute("aria-busy", "true");
  expect(within(dialog).getByRole("button", { name: "Cancel" })).toBeDisabled();

  await act(async () => rejectAction(new Error("internal failure detail")));
  expect(screen.queryByRole("dialog", { name: "Remove saved item?" })).toBeNull();
  expect(screen.getAllByText("The action could not be completed. Please try again.")).toHaveLength(2);
  expect(screen.queryByText(/internal failure detail/)).toBeNull();
});
