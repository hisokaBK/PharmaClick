import { webcrypto } from "crypto";
import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";
import { createDemoAccount, authenticateDemo, demoStorageKey, initialsFor, readDemo } from "../store/demoAccounts";

const password = "demo-test-password";
const cryptoWait = { timeout: 5000 };

beforeEach(() => {
  Object.defineProperty(window, "crypto", { configurable: true, value: webcrypto });
  localStorage.clear();
  window.scrollTo = jest.fn();
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

function openPage(path) {
  window.history.replaceState({}, "", path);
  return render(<App />);
}

function fill(label, value) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function register(name, email, confirmation = password) {
  fill("Full name", name);
  fill("Email address", email);
  fill(/^password$/i, password);
  fill("Confirm password", confirmation);
  fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
}

function login(email, enteredPassword = password) {
  fill("Email address", email);
  fill("Password", enteredPassword);
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
}

function accountMenu(name) {
  return screen.getByRole("button", { name: `Account menu for ${name}` });
}

function logout(name) {
  fireEvent.click(accountMenu(name));
  fireEvent.click(screen.getByRole("button", { name: "Logout" }));
}

test.each([["Bakessou Bilal", "BB"], ["John Smith", "JS"], ["Sara", "S"], ["Mohammed Amine El Idrissi", "ME"]])(
  "generates initials for %s",
  (name, expected) => expect(initialsFor(name)).toBe(expected)
);

test("registers, checks credentials, updates a profile, and restores isolated carts and sessions", async () => {
  const { unmount: unmountRegistration } = openPage("/signup");
  register("Bakessou Bilal", "bilal@example.com", "different-password");
  expect((await screen.findAllByText("The passwords do not match.")).length).toBeGreaterThan(0);
  expect(readDemo().accounts).toHaveLength(0);

  register("Bakessou Bilal", "bilal@example.com");
  await screen.findByRole("button", { name: "Sign in" }, cryptoWait);
  expect(screen.getByLabelText("Email address")).toHaveValue("bilal@example.com");
  expect(localStorage.getItem(demoStorageKey)).not.toContain(password);
  expect(readDemo().accounts[0]).toMatchObject({ salt: expect.stringMatching(/^[a-f0-9]{32}$/), verifier: expect.stringMatching(/^[a-f0-9]{64}$/) });

  fireEvent.click(screen.getByRole("link", { name: "Sign Up" }));
  register("Other user", "BILAL@example.com");
  expect((await screen.findAllByText("A demo account already uses that email address.")).length).toBeGreaterThan(0);
  expect(readDemo().accounts).toHaveLength(1);

  fireEvent.click(screen.getByRole("link", { name: "Sign in" }));
  login("bilal@example.com", "invalid-password");
  expect((await screen.findAllByText("The email address or password is incorrect.", {}, cryptoWait)).length).toBeGreaterThan(0);
  expect(readDemo().sessionId).toBeNull();
  login("BILAL@example.com");
  await screen.findByRole("heading", { name: "Bakessou Bilal" }, cryptoWait);
  expect(within(accountMenu("Bakessou Bilal")).getByText("BB")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("link", { name: "Edit Profile" }));
  fill("Full name", "Mohammed Amine El Idrissi");
  fill("Email address", "updated@example.com");
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  await screen.findByRole("heading", { name: "Mohammed Amine El Idrissi" });
  expect(within(accountMenu("Mohammed Amine El Idrissi")).getByText("ME")).toBeInTheDocument();
  expect(readDemo().accounts[0].email).toBe("updated@example.com");

  unmountRegistration();
  const { unmount: unmountProduct } = openPage("/Produit/1");
  expect(accountMenu("Mohammed Amine El Idrissi")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /add to bag/i }));
  expect(readDemo().accounts[0].cart).toEqual([{ id: 1, times: 1 }]);
  logout("Mohammed Amine El Idrissi");
  expect(readDemo().sessionId).toBeNull();
  expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  unmountProduct();

  await createDemoAccount({ name: "Sara", email: "sara@example.com", password, confirmation: password });
  expect(readDemo().accounts[0].salt).not.toBe(readDemo().accounts[1].salt);
  const { unmount: unmountSecondAccount } = openPage("/signin");
  login("sara@example.com");
  await screen.findByRole("heading", { name: "Sara" }, cryptoWait);
  expect(readDemo().accounts.find((account) => account.email === "sara@example.com").cart).toEqual([]);
  logout("Sara");
  unmountSecondAccount();

  openPage("/profile?tab=orders");
  await screen.findByRole("button", { name: "Sign in" });
  login("updated@example.com");
  await screen.findByRole("heading", { name: "My Orders" }, cryptoWait);
  expect(screen.getByText(/No orders yet/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Shopping cart, 1 products" })).toBeInTheDocument();
}, 20000);

test("account deletion is confirmed and preserves other accounts", async () => {
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  await createDemoAccount({ name: "Sara", email: "sara@example.com", password, confirmation: password });
  await createDemoAccount({ name: "John Smith", email: "john@example.com", password, confirmation: password });
  await authenticateDemo("sara@example.com", password);
  openPage("/profile?tab=settings");
  const remove = screen.getByRole("button", { name: "Delete demo account" });
  fireEvent.click(remove);
  const dialog = screen.getByRole("dialog", { name: "Delete demo account?" });
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  expect(readDemo().accounts).toHaveLength(2);
  fireEvent.click(remove);
  fireEvent.click(within(dialog).getByRole("button", { name: "Delete account" }));
  await screen.findByRole("link", { name: "Sign in" });
  expect(readDemo().sessionId).toBeNull();
  expect(readDemo().accounts.map(({ email }) => email)).toEqual(["john@example.com"]);
});
