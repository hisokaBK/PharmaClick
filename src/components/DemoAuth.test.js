import { webcrypto } from "crypto";
import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "../App";
import { createDemoAccount, authenticateDemo, demoStorageKey, initialsFor, readDemo, writeDemo } from "../store/demoAccounts";

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

test("sign-in reveals passwords without changing their value or submitting", () => {
  openPage("/signin");
  const input = screen.getByLabelText("Password");
  expect(input).toBeRequired();
  expect(input).toHaveAttribute("type", "password");
  fill("Password", "  example password  ");
  const toggle = screen.getByRole("button", { name: "Show password" });
  expect(toggle).toHaveAttribute("type", "button");
  toggle.focus();
  fireEvent.click(toggle);
  expect(toggle).toHaveFocus();
  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(toggle).toHaveAccessibleName("Hide password");
  expect(input).toHaveAttribute("type", "text");
  expect(input).toHaveValue("  example password  ");
  expect(screen.getByLabelText("Email address")).not.toHaveAttribute("aria-invalid");
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(input).toHaveAttribute("type", "password");
  expect(input).toHaveValue("  example password  ");
});

test("forgot password updates only credentials and allows sign-in with the new password", async () => {
  const emailAddress = "reset@example.com";
  const newPassword = "new-demo-password";
  await createDemoAccount({ name: "Reset Demo", email: emailAddress, password, confirmation: password });
  const account = {
    ...readDemo().accounts[0],
    cart: [{ id: 1, times: 1 }],
    orders: [{ reference: "PC-reset" }],
    preferences: { delivery: "local" },
  };
  const other = { id: "keep", email: "keep@example.com", cart: [{ id: 2, times: 1 }], orders: [{ reference: "PC-keep" }] };
  writeDemo({ accounts: [account, other], sessionId: null });
  openPage("/signin");
  fireEvent.click(screen.getByRole("link", { name: "Forgot Password?" }));
  expect(screen.getByRole("heading", { name: "Forgot Password" })).toBeVisible();
  expect(screen.getByText(/without email verification/)).toBeVisible();
  expect(screen.getByRole("link", { name: "Back to Sign In" })).toHaveAttribute("href", "/signin");
  const email = screen.getByLabelText("Email address");
  const proceed = screen.getByRole("button", { name: "Continue" });
  expect(email).not.toHaveAttribute("aria-invalid");
  fireEvent.click(proceed);
  expect(email).toHaveFocus();
  expect(email).toHaveAccessibleDescription("This field is required.");
  fill("Email address", "invalid");
  expect(email).toHaveAccessibleDescription("Enter a valid email address.");
  fill("Email address", "unknown@example.com");
  expect(email).not.toHaveAttribute("aria-invalid");
  fireEvent.click(proceed);
  expect(email).toHaveAccessibleDescription("No demo account with this email was found in this browser.");
  expect(email).toHaveValue("unknown@example.com");
  expect(screen.queryByLabelText("New Password")).not.toBeInTheDocument();

  fill("Email address", "RESET@example.com");
  fireEvent.click(proceed);
  const nextPassword = screen.getByLabelText("New Password");
  const confirmation = screen.getByLabelText("Confirm New Password");
  const save = screen.getByRole("button", { name: "Save New Password" });
  expect(nextPassword).toHaveFocus();
  expect(nextPassword).toHaveAttribute("type", "password");
  expect(confirmation).toHaveAttribute("type", "password");
  fireEvent.click(save);
  expect(screen.getAllByText("This field is required.")).toHaveLength(2);
  fill("New Password", "short");
  expect(nextPassword).toHaveAccessibleDescription(/Use a password with 8 to 128 characters/);
  fill("New Password", newPassword);
  fill("Confirm New Password", "mismatch-password");
  expect(confirmation).toHaveAccessibleDescription("The passwords do not match.");
  fireEvent.click(screen.getByRole("button", { name: "Show password", exact: true }));
  expect(nextPassword).toHaveAttribute("type", "text");
  expect(confirmation).toHaveAttribute("type", "password");
  fireEvent.click(screen.getByRole("button", { name: "Show password confirmation" }));
  expect(confirmation).toHaveAttribute("type", "text");
  expect(nextPassword).toHaveValue(newPassword);
  expect(confirmation).toHaveValue("mismatch-password");
  expect(readDemo().accounts).toEqual([account, other]);

  fill("New Password", password);
  fill("Confirm New Password", password);
  fireEvent.click(save);
  await screen.findByText("Choose a password different from your current demo password.", {}, cryptoWait);
  expect(nextPassword).toHaveFocus();
  expect(readDemo().accounts).toEqual([account, other]);
  fill("New Password", newPassword);
  fill("Confirm New Password", newPassword);
  expect(confirmation).not.toHaveAttribute("aria-invalid");
  writeDemo({ ...readDemo(), sessionId: account.id });
  fireEvent.click(save);
  await screen.findByRole("button", { name: "Sign in" }, cryptoWait);
  expect(screen.getByLabelText("Email address")).toHaveValue(emailAddress);
  const { salt, verifier, ...preserved } = readDemo().accounts[0];
  const { salt: oldSalt, verifier: oldVerifier, ...existing } = account;
  expect(preserved).toEqual(existing);
  expect(salt).not.toBe(oldSalt);
  expect(verifier).not.toBe(oldVerifier);
  expect(localStorage.getItem(demoStorageKey)).not.toContain(newPassword);
  expect(readDemo().sessionId).toBeNull();
  expect(readDemo().accounts[1]).toEqual(other);

  login(emailAddress, password);
  expect(await screen.findAllByText("The email address or password is incorrect.", {}, cryptoWait)).not.toHaveLength(0);
  login(emailAddress, newPassword);
  await screen.findByRole("heading", { name: "Reset Demo" }, cryptoWait);
  expect(readDemo().sessionId).toBe(account.id);
}, 30000);

test("registers, checks credentials, updates a profile, and restores isolated carts and sessions", async () => {
  const { unmount: unmountRegistration } = openPage("/signup");
  fireEvent.click(screen.getByRole("button", { name: "Sign up" }));
  expect(screen.getByLabelText("Full name")).toHaveFocus();
  expect(screen.getAllByText("This field is required.")).toHaveLength(4);
  expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleDescription(
    "Use 8 to 128 characters. This field is required."
  );
  fill(/^password$/i, "short");
  expect(screen.getByLabelText(/^password$/i)).toHaveAccessibleDescription(
    "Use 8 to 128 characters. Use a password with 8 to 128 characters."
  );
  const passwordInput = screen.getByLabelText(/^password$/i);
  const confirmationInput = screen.getByLabelText("Confirm password");
  fireEvent.click(screen.getByRole("button", { name: "Show password" }));
  expect(passwordInput).toHaveAttribute("type", "text");
  expect(passwordInput).toHaveValue("short");
  expect(passwordInput).toHaveAttribute("aria-invalid", "true");
  expect(confirmationInput).toHaveAttribute("type", "password");
  fireEvent.click(screen.getByRole("button", { name: "Show password confirmation" }));
  fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
  expect(passwordInput).toHaveAttribute("type", "password");
  expect(confirmationInput).toHaveAttribute("type", "text");
  register("Bakessou Bilal", "bilal@example.com", "different-password");
  expect(screen.getByLabelText("Confirm password")).toHaveFocus();
  expect(screen.getByLabelText("Confirm password")).toHaveAccessibleDescription("The passwords do not match.");
  fill("Confirm password", password);
  expect(screen.getByLabelText("Confirm password")).not.toHaveAttribute("aria-invalid");
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

  const accountState = readDemo();
  const languageTrigger = screen.getByRole("button", { name: /Language.*English/ });
  for (const language of ["Français", "العربية", "English"]) {
    fireEvent.click(languageTrigger);
    fireEvent.click(screen.getByRole("menuitemradio", { name: language }));
    expect(readDemo()).toEqual(accountState);
    expect(window.location.pathname + window.location.search).toBe("/profile?tab=orders");
    expect(screen.getByRole("button", { name: /Mohammed Amine El Idrissi/ })).toBeInTheDocument();
  }
}, 45000);

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
