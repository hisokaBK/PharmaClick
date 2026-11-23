import { fireEvent, render, screen, within } from "@testing-library/react";
import { webcrypto } from "crypto";
import App from "../App";
import geometry from "./morocco-boundary.json";
import { coverageWarning, deliveryProblem, parseCoordinate, uncertainLocation } from "./coverage";
import { cartProblem, deleteDeliveryData, readOrders, saveOrder } from "./demoOrders";
import { readDemo, writeDemo } from "../store/demoAccounts";

const casablanca = { lat: 33.5731, lng: -7.5898 };
const paris = { lat: 48.8566, lng: 2.3522 };
const address = { name: "Demo Customer", phone: "+212 600000000", city: "Casablanca",
  street: "18 Rue Exemple", instructions: "Demo instructions" };
const item = { id: 1, title: "Doliprane 757mg", price: 15, times: 2, stock: 10 };
const cart = [{ id: 1, times: 2 }];
const request = { userId: "a", reference: "PC-test", items: [item], delivery: { point: casablanca, address }, payment: "card" };
const geoDescriptor = Object.getOwnPropertyDescriptor(navigator, "geolocation");
const cryptoDescriptor = Object.getOwnPropertyDescriptor(window, "crypto");

function open(route) {
  window.history.replaceState({}, "", route);
  return render(<App />);
}

function enterPoint({ lat, lng }) {
  fireEvent.change(screen.getByLabelText("Latitude"), { target: { value: String(lat) } });
  fireEvent.change(screen.getByLabelText("Longitude"), { target: { value: String(lng) } });
  fireEvent.click(screen.getByRole("button", { name: "Use these coordinates" }));
}

beforeEach(() => {
  localStorage.clear();
  window.scrollTo = jest.fn();
  Object.defineProperty(window, "crypto", { configurable: true, value: webcrypto });
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  writeDemo({ sessionId: "a", accounts: [{ id: "a", name: address.name, cart }, { id: "b", name: "Second", cart }] });
});

afterEach(() => {
  if (cryptoDescriptor) Object.defineProperty(window, "crypto", cryptoDescriptor);
  else delete window.crypto;
  if (geoDescriptor) Object.defineProperty(navigator, "geolocation", geoDescriptor);
  else delete navigator.geolocation;
});

test.each([
  ["Casablanca", 33.5731, -7.5898],
  ["Rabat", 34.0209, -6.8416],
  ["Marrakech", 31.6295, -7.9811],
  ["Laayoune", 27.1536, -13.2033],
])("%s is covered", (_, lat, lng) => expect(deliveryProblem({ lat, lng })).toBeNull());

test.each([
  ["Paris", 48.8566, 2.3522],
  ["Madrid", 40.4168, -3.7038],
  ["New York", 40.7128, -74.0060],
  ["Ceuta", 35.8894, -5.3213],
  ["Bir Lehlou", 26.347, -9.575],
])("%s is outside the demo boundary", (_, lat, lng) => {
  expect(deliveryProblem({ lat, lng })).toBe(coverageWarning);
});

test("invalid GPS, poor accuracy and a point on the dataset edge fail closed", () => {
  const [lng, lat] = geometry.coordinates[0][0];
  for (const point of [{ lat: NaN, lng }, { lat: 91, lng }, { lat, lng },
    { ...casablanca, accuracy: 1001 }, { ...casablanca, accuracy: -1 }]) {
    expect(deliveryProblem(point)).toBe(uncertainLocation);
  }
  expect(parseCoordinate("−٧٫٥٨٩٨")).toBe(-7.5898);
  expect(parseCoordinate("۳۳,۵۷۳۱")).toBe(33.5731);
  expect(parseCoordinate("0x20")).toBeNaN();
});

test("persistence revalidates delivery, payment, address and cart before an atomic write", () => {
  expect(() => saveOrder({ ...request, delivery: { address, point: paris } })).toThrow(coverageWarning);
  expect(() => saveOrder({ ...request, delivery: { point: casablanca, address: { ...address, city: "Paris" } } })).toThrow(coverageWarning);
  expect(() => saveOrder({ ...request, delivery: { point: casablanca, address: { ...address, city: "Marrakech" } } })).toThrow(/city does not match/);
  expect(() => saveOrder({ ...request, items: [{ ...item, times: 0 }] })).toThrow(cartProblem);
  expect(() => saveOrder({ ...request, payment: "" })).toThrow("Choose a demo payment method.");
  expect(() => saveOrder({ ...request, delivery: { point: casablanca, address: { ...address, phone: "" } } })).toThrow(/complete delivery address/);
  expect(readDemo().accounts[0].cart).toEqual(cart);
  const setItem = jest.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => { throw new Error("quota"); });
  expect(() => saveOrder(request)).toThrow("quota");
  setItem.mockRestore();
  expect(readDemo().accounts[0].cart).toEqual(cart);
  const order = saveOrder(request);
  expect(order).toMatchObject({ subtotal: 30, shipping: 30, total: 60 });
  expect(order.address).not.toHaveProperty("phone");
  expect(order.address).not.toHaveProperty("instructions");
  expect(order.location).toEqual({ lat: 33.573, lng: -7.590 });
  expect(saveOrder(request)).toEqual(order);
  expect(readOrders("a")).toHaveLength(1);
  expect(readDemo().accounts[0].cart).toEqual([]);
  const saved = readDemo();
  writeDemo({ ...saved, sessionId: "b" });
  expect(readOrders("a")).toEqual([]);
  expect(readOrders("b")).toEqual([]);
  expect(() => deleteDeliveryData("a")).toThrow(/session changed/);
  writeDemo(saved);
  deleteDeliveryData("a");
  expect(readOrders("a")[0]).toMatchObject({ address: null, location: null, total: 60 });
});

test("checkout validates selections, confirms the address, saves and reopens a printable demo invoice", async () => {
  const print = jest.spyOn(window, "print").mockImplementation(() => {});
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition: jest.fn().mockImplementationOnce((_, fail) => fail({ code: 1 }))
      .mockImplementationOnce((success) => success({ coords: { latitude: 95, longitude: 0, accuracy: 5 } })) },
  });
  const { unmount } = open("/Medications/Shop");
  fireEvent.click(screen.getByRole("link", { name: /proceed to checkout/i }));
  const progress = within(screen.getByRole("navigation", { name: "Checkout progress" }));
  const [cartStep, , paymentStep, reviewStep] = progress.getAllByRole("listitem");
  expect(progress.getByRole("link", { name: "Cart" })).toHaveAttribute("href", "/Medications/Shop");
  expect(cartStep).toHaveAttribute("data-state", "completed");
  expect(progress.getByRole("listitem", { current: "step" })).toHaveTextContent("Delivery Location");
  expect(paymentStep).toHaveAttribute("data-state", "upcoming");
  expect(reviewStep).toHaveAttribute("data-state", "upcoming");
  expect(progress.queryByRole("button")).not.toBeInTheDocument();
  const next = screen.getByRole("button", { name: "Continue to delivery address" });
  expect(next).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Use my location" }));
  expect(screen.getAllByText(/Location permission was denied/)).not.toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: "Use my location" }));
  expect(screen.getAllByText(uncertainLocation)).not.toHaveLength(0);
  fireEvent.change(screen.getByLabelText("Find a city on the map"), { target: { value: "Paris" } });
  fireEvent.click(screen.getByRole("button", { name: "Paris" }));
  expect(screen.getAllByText(coverageWarning)).not.toHaveLength(0);
  expect(next).toBeDisabled();
  fireEvent.click(screen.getByText("Enter coordinates"));
  enterPoint(paris);
  expect(screen.getAllByText(coverageWarning)).not.toHaveLength(0);
  expect(next).toBeDisabled();
  enterPoint(casablanca);
  enterPoint(paris);
  expect(next).toBeEnabled();
  expect(screen.getByText("33.57310, -7.58980")).toBeInTheDocument();
  fireEvent.click(next);

  const confirmLocation = screen.getByRole("button", { name: "Confirm Location" });
  const requiredFields = ["Full name", "Phone number", "City", "Street address"].map((label) => screen.getByLabelText(label));
  expect(requiredFields[0]).toHaveValue(address.name);
  expect(screen.getByLabelText(/Delivery instructions/)).not.toBeRequired();
  for (const input of requiredFields) fireEvent.change(input, { target: { value: "" } });
  fireEvent.click(confirmLocation);
  expect(requiredFields[0]).toHaveFocus();
  for (const input of requiredFields) {
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("This field is required.");
  }
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.change(requiredFields[0], { target: { value: address.name } });
  fireEvent.change(requiredFields[1], { target: { value: "abc123" } });
  expect(requiredFields[1]).toHaveAccessibleDescription("Enter a valid phone number.");
  fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: address.phone } });
  fireEvent.change(screen.getByLabelText("City"), { target: { value: address.city } });
  fireEvent.click(confirmLocation);
  expect(requiredFields[3]).toHaveFocus();
  expect(requiredFields.slice(0, 3).every((input) => !input.hasAttribute("aria-invalid"))).toBe(true);
  fireEvent.change(screen.getByLabelText("Street address"), { target: { value: address.street } });
  expect(requiredFields[3]).not.toHaveAttribute("aria-invalid");
  fireEvent.click(confirmLocation);
  const dialog = screen.getByRole("dialog", { name: "Confirm delivery location?" });
  fireEvent.click(within(dialog).getByRole("button", { name: "Confirm Location" }));
  const card = await screen.findByRole("radio", { name: /Bank Card/ });
  expect(progress.getByRole("listitem", { current: "step" })).toHaveTextContent("Payment");
  expect(progress.queryByRole("button", { name: "Review & Confirmation" })).not.toBeInTheDocument();
  fireEvent.click(card);
  fireEvent.click(screen.getByRole("button", { name: "Review demo order" }));
  expect(progress.getByRole("listitem", { current: "step" })).toHaveTextContent("Review & Confirmation");
  fireEvent.click(progress.getByRole("button", { name: "Payment" }));
  expect(screen.getByRole("radio", { name: /Bank Card/ })).toBeChecked();
  fireEvent.click(progress.getByRole("button", { name: "Delivery Location" }));
  const street = screen.getByLabelText("Street address");
  expect(street).toHaveValue(address.street);
  fireEvent.change(street, { target: { value: "" } });
  fireEvent.click(screen.getByRole("button", { name: "Confirm Location" }));
  expect(street).toHaveAttribute("aria-invalid", "true");
  expect(progress.queryByRole("button", { name: "Payment" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Confirm Demo Order" })).not.toBeInTheDocument();
  fireEvent.change(street, { target: { value: address.street } });
  fireEvent.click(screen.getByRole("button", { name: "Confirm Location" }));
  fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Confirm Location" }));
  expect(await screen.findByRole("radio", { name: /Bank Card/ })).toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Review demo order" }));
  fireEvent.click(screen.getByRole("button", { name: "Confirm Demo Order" }));

  expect(await screen.findByRole("heading", { name: "Demo invoice" })).toBeInTheDocument();
  expect(print).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Print Invoice" }));
  expect(print).toHaveBeenCalledTimes(1);
  expect(readDemo().accounts[0].cart).toEqual([]);
  expect(readOrders("a")).toHaveLength(1);
  fireEvent.click(screen.getByRole("link", { name: "View My Orders" }));
  unmount();
  open("/profile?tab=orders");
  fireEvent.click(screen.getByRole("link", { name: "View demo invoice" }));
  expect(screen.getByRole("heading", { name: "Demo invoice" })).toBeInTheDocument();
  print.mockRestore();
});

test("direct checkout routes cannot submit without a confirmed location", () => {
  open("/checkout?step=review");
  expect(screen.getByRole("heading", { name: "Choose your delivery location" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Confirm Demo Order" })).toBeNull();
});
