export const demoStorageKey = "pharmaclick.demo.v1";
export const demoAccountNotice = "Browser-only demo. Accounts and carts stay in this browser. Use a demo password you do not use elsewhere.";

export class DemoAccountError extends Error {}
const surnamePrefixes = new Set(["al", "el", "de", "del", "da", "di", "van", "von"]);

export function readDemo() {
  try {
    const saved = JSON.parse(localStorage.getItem(demoStorageKey));
    if (saved && Array.isArray(saved.accounts)) return saved;
  } catch {
    // A missing or unreadable record cannot authenticate a session.
  }
  return { accounts: [], sessionId: null };
}

export function writeDemo(saved) {
  localStorage.setItem(demoStorageKey, JSON.stringify(saved));
}

export function findSession(saved) {
  return saved.accounts.find(({ id }) => id === saved.sessionId) || null;
}

export function publicAccount(account) {
  if (!account) return null;
  const { id, name, email } = account;
  return { id, name, email };
}

export function validateIdentity(name, email) {
  const cleanName = name.trim().replace(/\s+/g, " ");
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanName || cleanName.length > 100) throw new DemoAccountError("Enter a full name of up to 100 characters.");
  if (cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new DemoAccountError("Enter a valid email address.");
  }
  return { name: cleanName, email: cleanEmail };
}

export function ensureUniqueEmail(accounts, email, currentId) {
  if (accounts.some((account) => account.email === email && account.id !== currentId)) {
    throw new DemoAccountError("A demo account already uses that email address.");
  }
}

export function initialsFor(name) {
  const words = name.trim().split(/\s+/);
  const first = Array.from(words[0])[0] || "";
  let surnameStart = words.length - 1;
  while (surnameStart > 1 && surnamePrefixes.has(words[surnameStart - 1].toLowerCase())) surnameStart--;
  const last = surnameStart > 0 ? Array.from(words[surnameStart])[0] : "";
  return (first + last).toLocaleUpperCase();
}

function cryptoForDemo() {
  if (!window.crypto?.subtle) {
    throw new DemoAccountError("Demo accounts require Web Crypto. Open PharmaClick through localhost or HTTPS.");
  }
  return window.crypto;
}

function hex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function deriveVerifier(password, salt) {
  const { subtle } = cryptoForDemo();
  const key = await subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const saltBytes = Uint8Array.from(salt.match(/../g), (byte) => parseInt(byte, 16));
  const result = await subtle.deriveBits({
    name: "PBKDF2", hash: "SHA-256", salt: saltBytes, iterations: 600000,
  }, key, 256);
  return hex(new Uint8Array(result));
}

export async function createDemoAccount({ name, email, password, confirmation }) {
  const identity = validateIdentity(name, email);
  if (password.length < 8 || password.length > 128) throw new DemoAccountError("Use a password with 8 to 128 characters.");
  if (password !== confirmation) throw new DemoAccountError("The passwords do not match.");
  ensureUniqueEmail(readDemo().accounts, identity.email);

  const crypto = cryptoForDemo();
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  const verifier = await deriveVerifier(password, salt);
  const saved = readDemo();
  ensureUniqueEmail(saved.accounts, identity.email);
  const id = hex(crypto.getRandomValues(new Uint8Array(16)));
  writeDemo({ ...saved, accounts: [...saved.accounts, { id, ...identity, salt, verifier, cart: [] }] });
}

export async function authenticateDemo(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = readDemo().accounts.find((candidate) => candidate.email === normalizedEmail);
  const invalid = new DemoAccountError("The email address or password is incorrect.");
  if (!account || !password || password.length > 128) throw invalid;
  if (await deriveVerifier(password, account.salt) !== account.verifier) throw invalid;

  const saved = readDemo();
  const current = saved.accounts.find(({ id }) => id === account.id);
  if (!current || current.email !== normalizedEmail || current.verifier !== account.verifier) throw invalid;
  const next = { ...saved, sessionId: current.id };
  writeDemo(next);
  return next;
}
