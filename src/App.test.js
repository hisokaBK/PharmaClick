import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.scrollTo = jest.fn();
});

test("shows the service and global navigation on a Services route", () => {
  window.history.replaceState({}, "", "/Professional");
  render(<App />);
  expect(screen.getByRole("heading", { name: "Professional Guidelines" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open navigation menu" })).toBeInTheDocument();
  const menu = screen.getByRole("button", { name: "Services" });
  fireEvent.click(menu);
  expect(menu).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("link", { name: "Health Quizzes" })).toHaveAttribute("href", "/Health_Quizzes");
  fireEvent.keyDown(menu, { key: "Escape" });
  expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("excludes the global navigation from sign in", () => {
  window.history.replaceState({}, "", "/signin");
  render(<App />);
  expect(screen.queryByRole("button", { name: "Open navigation menu" })).not.toBeInTheDocument();
});

test("scores and restarts the health quiz", () => {
  window.history.replaceState({}, "", "/Health_Quizzes");
  render(<App />);
  const quiz = screen.getByRole("main");
  fireEvent.click(within(quiz).getByRole("radio", { name: "Its issuing authority, location and latest update" }));
  fireEvent.click(within(quiz).getByRole("radio", { name: "A list of your questions and medicines" }));
  fireEvent.click(within(quiz).getByRole("radio", { name: "How people have used it over time" }));
  fireEvent.click(within(quiz).getByRole("button", { name: "Check answers" }));
  expect(within(quiz).getByRole("heading", { name: "Score 3 out of 3" })).toBeInTheDocument();
  fireEvent.click(within(quiz).getByRole("button", { name: "Restart quiz" }));
  expect(within(quiz).queryByRole("heading", { name: "Score 3 out of 3" })).not.toBeInTheDocument();
  expect(within(quiz).getByRole("button", { name: "Check answers" })).toBeInTheDocument();
});

test("opens the Contact page from the global navigation", () => {
  window.history.replaceState({}, "", "/Professional");
  render(<App />);
  // Include the closed dialog so the test can model its native controls in jsdom.
  const drawer = screen.getByRole("dialog", { hidden: true });
  drawer.showModal = () => { drawer.open = true; };
  drawer.close = () => { drawer.open = false; };

  fireEvent.click(screen.getByRole("button", { name: "Open navigation menu" }));
  // Compact layouts depend on the drawer for both top-level links and medication categories.
  expect(within(drawer).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  expect(within(drawer).getByRole("link", { name: "Browse Medicines" })).toHaveAttribute("href", "/Medications");
  expect(within(drawer).getByRole("link", { name: "Multivitamins" })).toHaveAttribute("href", "/Products/multivitamins");
  fireEvent.click(within(drawer).getByRole("link", { name: "Contact" }));

  expect(window.location.pathname).toBe("/contact");
  expect(screen.getByRole("heading", { name: "Contact Us" })).toBeInTheDocument();
  expect(drawer.open).toBe(false);
});
