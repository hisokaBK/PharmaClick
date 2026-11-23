import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { useFeedback } from "./Feedback";
import {
  authenticateDemo, DemoAccountError, demoStorageKey, ensureUniqueEmail,
  findSession, publicAccount, readDemo, validateIdentity, writeDemo,
} from "../store/demoAccounts";
import { readProfilePhoto, writeProfilePhoto } from "../store/profilePhotos";

const DemoAuthContext = createContext(null);

export function useDemoAuth() {
  return useContext(DemoAuthContext);
}

export function RequireDemoAccount({ children }) {
  const { user } = useDemoAuth();
  const location = useLocation();
  const hadUser = useRef(Boolean(user));
  useEffect(() => {
    if (user) hadUser.current = true;
  }, [user]);
  if (user) return children;
  return hadUser.current
    ? <Navigate replace to="/" />
    : <Navigate replace to="/signin" state={{ profileSearch: location.search }} />;
}

export default function DemoAuthProvider({ children }) {
  const store = useStore();
  const { notify } = useFeedback();
  const [user, setUser] = useState(() => publicAccount(findSession(readDemo())));
  const [photo, setPhoto] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const photoWrites = useRef(Promise.resolve());
  const owner = useRef(null);
  const guestCart = useRef([]);
  const switching = useRef(false);

  const restoreSession = useCallback((saved) => {
    const account = findSession(saved);
    owner.current = account?.id || null;
    const catalog = new Map(store.getState().fullData.map((item) => [item.id, item]));
    const cart = account ? (account.cart || []).flatMap(({ id, times }) => {
      const product = catalog.get(id);
      if (!product || !Number.isFinite(times) || times < 0) return [];
      return [{ ...product, times, stock: Math.max(0, product.stock - times) }];
    }) : guestCart.current;

    switching.current = true;
    store.dispatch({ type: "RESTORE_DEMO_CART", payload: cart });
    switching.current = false;
    const profile = publicAccount(account);
    setUser(profile);
    return profile;
  }, [store]);

  useLayoutEffect(() => {
    let previous = store.getState().cardData;
    const unsubscribe = store.subscribe(() => {
      const cart = store.getState().cardData;
      if (cart === previous) return;
      previous = cart;
      if (switching.current) return;
      if (!owner.current) {
        guestCart.current = cart;
        return;
      }

      const saved = readDemo();
      if (saved.sessionId !== owner.current) {
        restoreSession(saved);
        return;
      }
      const items = cart.map(({ id, times }) => ({ id, times }));
      const storedCart = findSession(saved)?.cart;
      if (storedCart?.length === items.length && items.every(({ id, times }, index) =>
        storedCart[index].id === id && storedCart[index].times === times)) return;
      try {
        writeDemo({ ...saved, accounts: saved.accounts.map((account) =>
          account.id === owner.current ? { ...account, cart: items } : account) });
      } catch {
        notify("error", "Your cart changed here, but could not be saved in this browser.");
      }
    });

    restoreSession(readDemo());
    const onStorage = (event) => {
      if (event.storageArea === localStorage && (event.key === demoStorageKey || event.key === null)) {
        restoreSession(readDemo());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [store, notify, restoreSession]);

  const accountId = user?.id;
  useEffect(() => {
    setPhoto(null);
    if (!accountId || !window.indexedDB) return;
    let cancelled = false;
    readProfilePhoto(accountId).then((blob) => {
      if (!cancelled) setPhoto((current) => current?.accountId === accountId ? current : { accountId, blob });
    }).catch(() => {
      // Keep the initials available if photo storage is blocked or unreadable.
    });
    return () => { cancelled = true; };
  }, [accountId]);

  useEffect(() => {
    if (!photo?.blob || photo.accountId !== accountId) {
      setAvatar(null);
      return;
    }
    const url = URL.createObjectURL(photo.blob);
    setAvatar({ photo, url });
    return () => URL.revokeObjectURL(url);
  }, [accountId, photo]);

  function queuePhotoWrite(operation) {
    const result = photoWrites.current.then(operation);
    photoWrites.current = result.catch(() => {});
    return result;
  }

  function updatePhoto(blob) {
    return queuePhotoWrite(async () => {
      if (!accountId || findSession(readDemo())?.id !== accountId) {
        throw new DemoAccountError("Your session changed. Sign in again.");
      }
      await writeProfilePhoto(accountId, blob);
      if (!readDemo().accounts.some(({ id }) => id === accountId)) {
        await writeProfilePhoto(accountId, null);
        throw new DemoAccountError("This demo account no longer exists.");
      }
      if (owner.current === accountId) setPhoto({ accountId, blob });
    });
  }

  async function signIn(email, password) {
    return restoreSession(await authenticateDemo(email, password));
  }

  function signOut() {
    const saved = readDemo();
    const next = { ...saved, sessionId: null };
    writeDemo(next);
    restoreSession(next);
  }

  function updateProfile(name, email) {
    const identity = validateIdentity(name, email);
    const saved = readDemo();
    const account = findSession(saved);
    if (!account || account.id !== user.id) throw new DemoAccountError("Your session changed. Sign in again.");
    ensureUniqueEmail(saved.accounts, identity.email, account.id);
    const updated = { ...account, ...identity };
    writeDemo({ ...saved, accounts: saved.accounts.map((item) => item.id === account.id ? updated : item) });
    setUser(publicAccount(updated));
  }

  function deleteAccount() {
    return queuePhotoWrite(async () => {
      if (findSession(readDemo())?.id !== accountId) throw new DemoAccountError("Your session changed. Sign in again.");
      if (window.indexedDB) await writeProfilePhoto(accountId, null);
      const saved = readDemo();
      if (findSession(saved)?.id !== accountId) throw new DemoAccountError("Your session changed. Sign in again.");
      setPhoto({ accountId, blob: null });
      const next = { sessionId: null, accounts: saved.accounts.filter(({ id }) => id !== accountId) };
      writeDemo(next);
      restoreSession(next);
    });
  }

  const photoUrl = avatar?.photo === photo && photo?.accountId === accountId ? avatar?.url : undefined;
  return (
    <DemoAuthContext.Provider value={{ user, signIn, signOut, updateProfile, deleteAccount, photoUrl, updatePhoto }}>
      {children}
    </DemoAuthContext.Provider>
  );
}
