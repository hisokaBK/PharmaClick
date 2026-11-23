import { addressLocationProblem, deliveryProblem } from "./coverage";
import { findSession, readDemo, writeDemo } from "../store/demoAccounts";

export const paymentLabels = {
  cash: "Cash on Delivery",
  card: "Bank Card (Demo)",
};
export const cartProblem = "Your cart is empty or has invalid quantities. Review your cart.";
export const addressProblem = "Enter a complete delivery address and a valid phone number.";
const sessionProblem = "Your session changed. Sign in again.";
const guestKey = "pharmaclick.demo.guest-orders.v1";

export function cartTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.times, 0);
  const shipping = 30;
  return { subtotal, shipping, total: subtotal + shipping };
}

export function validCart(items) {
  return items.length > 0 && new Set(items.map(({ id }) => id)).size === items.length &&
    items.every(({ price, times, stock }) => Number.isSafeInteger(times) && times > 0 &&
      Number.isFinite(price) && price >= 0 && Number.isFinite(stock) && stock >= 0) &&
    Number.isFinite(cartTotals(items).total);
}

export function validDeliveryPhone(phone) {
  const digits = phone.replace(/[^0-9٠-٩۰-۹]/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^[+0-9٠-٩۰-۹ ().-]+$/.test(phone);
}

export function cleanAddress(fields) {
  const address = Object.fromEntries(["name", "phone", "city", "street", "instructions"]
    .map((key) => [key, typeof fields?.[key] === "string" ? fields[key].trim() : ""]));
  if (!address.name || !address.city || !address.street || !validDeliveryPhone(address.phone)) return null;
  return address;
}

export function deliveryAddressProblem(delivery) {
  const problem = deliveryProblem(delivery?.point);
  if (problem) return problem;
  const address = cleanAddress(delivery.address);
  return address ? addressLocationProblem(address.city, delivery.point) : addressProblem;
}

function guestOrders() {
  const orders = JSON.parse(localStorage.getItem(guestKey) || "[]");
  if (!Array.isArray(orders)) throw new Error("Saved demo orders could not be read.");
  return orders;
}

export function readOrders(userId) {
  try {
    const account = findSession(readDemo());
    if ((account?.id ?? null) !== userId) return [];
    return account ? account.orders || [] : guestOrders();
  } catch {
    return [];
  }
}

// Commit against fresh persisted cart and account data. Order and cleared account
// cart share one localStorage write, so a failed write leaves the cart intact.
export function saveOrder({ userId, reference, items, delivery, payment }) {
  const saved = readDemo();
  const account = findSession(saved);
  if ((account?.id ?? null) !== userId) throw new Error(sessionProblem);
  const history = account ? account.orders || [] : guestOrders();
  const existing = history.find((order) => order.reference === reference);
  if (existing) return existing;
  if (!validCart(items) || (account && (
    account.cart?.length !== items.length || !items.every(({ id, times }) =>
      account.cart.some((entry) => entry.id === id && entry.times === times))
  ))) throw new Error(cartProblem);

  const problem = deliveryAddressProblem(delivery);
  if (problem) throw new Error(problem);
  const address = cleanAddress(delivery.address);
  if (!Object.hasOwn(paymentLabels, payment)) throw new Error("Choose a demo payment method.");

  const { name, city, street } = address;
  const order = {
    reference, date: new Date().toISOString(),
    items: items.map(({ id, title, times, price }) => ({ id, title, times, price })),
    ...cartTotals(items),
    address: { name, city, street },
    location: { lat: Number(delivery.point.lat.toFixed(3)), lng: Number(delivery.point.lng.toFixed(3)) },
    payment, status: "demo",
  };
  const orders = [order, ...history];
  if (account) {
    writeDemo({ ...saved, accounts: saved.accounts.map((entry) =>
      entry.id === userId ? { ...entry, orders, cart: [] } : entry) });
  } else {
    localStorage.setItem(guestKey, JSON.stringify(orders));
  }
  return order;
}

export function deleteDeliveryData(userId) {
  const saved = readDemo();
  const account = findSession(saved);
  if ((account?.id ?? null) !== userId) throw new Error(sessionProblem);
  const orders = (account ? account.orders || [] : guestOrders()).map((order) => ({
    ...order, address: null, location: null,
  }));
  if (account) {
    writeDemo({ ...saved, accounts: saved.accounts.map((entry) =>
      entry.id === userId ? { ...entry, orders } : entry) });
  } else {
    localStorage.setItem(guestKey, JSON.stringify(orders));
  }
}
