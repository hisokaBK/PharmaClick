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

test("filters the catalog by name and category and clears search without resetting the cart", () => {
  window.history.replaceState({}, "", "/Products?search=vitamine+d+974mg");
  render(<App />);
  const search = screen.getByRole("searchbox", { name: "Search products by name" });
  const category = screen.getByLabelText("Category");

  expect(within(screen.getByRole("navigation")).queryByRole("searchbox")).toBeNull();
  expect(screen.getAllByRole("heading", { name: "Vitamine D 974mg" }).length).toBeGreaterThan(0);
  fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
  fireEvent.change(category, { target: { value: "multivitamins" } });
  fireEvent.change(search, { target: { value: "  dOLIPrane 757mg  " } });
  expect(screen.getByRole("heading", { name: "No products found" })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Clear product search" }));
  expect(search).toHaveValue("");
  expect(search).toHaveFocus();
  expect(category).toHaveValue("multivitamins");
  expect(screen.getByRole("link", { name: "Shopping cart, 1 products" })).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { name: "Vitamine D 974mg" }).length).toBeGreaterThan(0);
  expect(screen.queryByRole("heading", { name: "Doliprane 757mg" })).toBeNull();
});

test.each([
  ["/Products/multivitamins", "Vitamine D 974mg", "Doliprane 757mg"],
  ["/Products2/yes", "Doliprane 757mg", "Vitamine D 974mg"],
])("keeps search scoped to the selected listing at %s", (route, included, excluded) => {
  window.history.replaceState({}, "", `${route}?search=${encodeURIComponent(included.toUpperCase())}`);
  render(<App />);
  const search = screen.getByRole("searchbox");
  expect(screen.getAllByRole("heading", { name: included }).length).toBeGreaterThan(0);

  fireEvent.change(search, { target: { value: excluded } });
  expect(screen.getByRole("status")).toHaveTextContent("No products found");
  expect(screen.queryByRole("heading", { name: excluded })).toBeNull();
});
