import { useEffect, useRef, useState } from "react";
import { useStore, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Banknote, CreditCard, LocateFixed } from "lucide-react";
import { clearCart } from "../store/actions";
import { useDemoAuth } from "../components/DemoAuth";
import { useFeedback } from "../components/Feedback";
import ValidatedField, { useFieldValidation } from "../components/ValidatedField";
import { useI18n } from "../i18n/LanguageProvider";
import DeliveryMap from "./DeliveryMap";
import { addressLocationProblem, deliveryProblem, locationCity, parseCoordinate, searchCities } from "./coverage";
import { cartProblem, cartTotals, cleanAddress, deliveryAddressProblem, paymentLabels, saveOrder, validCart, validDeliveryPhone } from "./demoOrders";
import { Address, OrderItems } from "./OrderInvoice";
import "./checkout.css";

const steps = ["Cart", "Delivery Location", "Payment", "Review & Confirmation"];
const fields = [
  ["name", "Full name", "name", 100],
  ["phone", "Phone number", "tel", 32],
  ["city", "City", "address-level2", 100],
  ["street", "Street address", "street-address", 240],
  ["instructions", "Delivery instructions (optional)", "off", 240],
];

function coordinates(point) {
  return <bdi dir="ltr">{point.lat.toFixed(5)}, {point.lng.toFixed(5)}</bdi>;
}

export default function Checkout() {
  const { user } = useDemoAuth();
  return <CheckoutFlow key={user?.id ?? "guest"} user={user} />;
}

function CheckoutFlow({ user }) {
  const { t, language } = useI18n();
  const { notify, requestConfirmation } = useFeedback();
  const items = useSelector((state) => state.cardData);
  const store = useStore();
  const navigate = useNavigate();
  const heading = useRef(null);
  const active = useRef(true);
  const gpsRequest = useRef(0);
  const submitting = useRef(false);
  const reference = useRef(null);
  const [saving, setSaving] = useState(false);
  const [stage, setStage] = useState("location");
  const [point, setPoint] = useState(null);
  const [view, setView] = useState(null);
  const [gpsPending, setGpsPending] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [mapAttempt, setMapAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [address, setAddress] = useState({
    name: user?.name ?? "", phone: "", city: "", street: "", instructions: "",
  });
  const [delivery, setDelivery] = useState(null);
  const [payment, setPayment] = useState("");
  const validation = useFieldValidation({
    name: null,
    phone: (value) => !validDeliveryPhone(value) && "Enter a valid phone number.",
    city: (value) => point && addressLocationProblem(value, point),
    street: null,
  });
  const stepIndex = stage === "review" ? 3 : stage === "payment" ? 2 : 1;

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  function go(next) {
    gpsRequest.current++;
    setGpsPending(false);
    setStage(next);
    heading.current?.focus();
    heading.current?.scrollIntoView?.({ block: "nearest" });
  }

  function selectLocation(candidate, zoom) {
    gpsRequest.current++;
    setGpsPending(false);
    const problem = deliveryProblem(candidate);
    if (problem) {
      notify("warning", problem);
      return;
    }
    setPoint(candidate);
    setDelivery(null);
    setView(zoom ? { ...candidate, zoom } : null);
    validation.reset();
    const city = locationCity(candidate);
    setAddress((current) => ({
      ...current, city: city?.[language] ?? "", street: "", instructions: "",
    }));
  }

  function locate() {
    const geo = navigator.geolocation;
    if (!geo) {
      notify("warning", "Location access is unavailable. Use the map or enter coordinates.");
      return;
    }
    const request = ++gpsRequest.current;
    setGpsPending(true);
    geo.getCurrentPosition(({ coords }) => {
      if (!active.current || request !== gpsRequest.current) return;
      selectLocation({ lat: coords?.latitude, lng: coords?.longitude, accuracy: coords?.accuracy ?? NaN }, 16);
    }, ({ code }) => {
      if (!active.current || request !== gpsRequest.current) return;
      setGpsPending(false);
      notify("warning", code === 1
        ? "Location permission was denied. Use the map or enter coordinates."
        : "Your location could not be read. Try again or use the map.");
    }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  }

  function confirmAddress(event) {
    event.preventDefault();
    if (!validation.validate(event.currentTarget)) return;
    const problem = deliveryAddressProblem({ point, address });
    if (problem) {
      notify("warning", problem);
      return;
    }
    const cleaned = cleanAddress(address);
    requestConfirmation({
      title: "Confirm delivery location?",
      description: "Use {0}, {1}, Morocco for this demo order? The address must match your map pin.",
      descriptionValues: [cleaned.street, cleaned.city],
      confirmLabel: "Confirm Location",
      trigger: event.nativeEvent.submitter,
      fallbackFocus: () => heading.current,
      icon: LocateFixed,
      onConfirm: () => {
        if (!active.current) return;
        setDelivery({ point, address: cleaned });
        go("payment");
      },
    });
  }

  async function submit() {
    if (submitting.current) return;
    submitting.current = true;
    setSaving(true);
    try {
      const placeOrder = () => {
        if (!active.current) return;
        const current = store.getState().cardData;
        if (current !== items) {
          notify("warning", "Your cart changed. Review it before confirming.");
          return;
        }
        reference.current ??= `PC-${crypto.randomUUID()}`;
        const order = saveOrder({ userId: user?.id ?? null, reference: reference.current, items: current, delivery, payment });
        store.dispatch(clearCart());
        notify("success", "Your demo order was saved in this browser.");
        navigate(`/checkout/invoice/${order.reference}`, { replace: true });
      };
      if (navigator.locks) await navigator.locks.request("pharmaclick-demo-orders", placeOrder);
      else placeOrder();
    } catch (error) {
      const messages = [cartProblem, deliveryAddressProblem(delivery),
        "Your session changed. Sign in again.", "Choose a demo payment method."];
      notify("warning", messages.includes(error.message) ? error.message :
        "The demo order could not be saved in this browser. Please try again.");
    } finally {
      submitting.current = false;
      if (active.current) setSaving(false);
    }
  }

  const citySearch = query.trim();
  const cityResults = citySearch ? searchCities(citySearch) : [];
  const totals = cartTotals(items);
  const tileNotice = tileError && <div className="checkout-actions">
    <p role="status">{t("Some map tiles could not load. You can retry or enter coordinates.")}</p>
    <button type="button" className="demo-secondary" onClick={() => {
      setTileError(false);
      if (point) setView({ ...point, zoom: 16 });
      setMapAttempt((attempt) => attempt + 1);
    }}>{t("Retry map")}</button>
  </div>;

  return (
    <main className="checkout-layout">
      <h1 ref={heading} tabIndex={-1}>{t("Demo checkout")}</h1>
      <p>{t("This is a demo. No payment is collected and no delivery is arranged.")}</p>
      <nav aria-label={t("Checkout progress")}>
        <ol className="checkout-steps">
          {steps.map((step, index) => <li key={step} aria-current={stepIndex === index ? "step" : undefined}>
            {index === 0 ? <Link to="/Medications/Shop">{t(step)}</Link> : t(step)}
          </li>)}
        </ol>
      </nav>
      {!validCart(items) ? <section className="checkout-panel">
        <p>{t(cartProblem)}</p><Link to="/Medications/Shop">{t("Back to Cart")}</Link>
      </section> : <>
        {stage === "location" && <section className="checkout-panel">
          <h2>{t("Choose your delivery location")}</h2>
          <p>{t("Place the pin on the delivery address. Demo delivery is available only in Morocco.")}</p>
          <div className="checkout-location-tools">
            <label>{t("Find a city on the map")}
              <input className="form-control" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <button type="button" className="demo-secondary" onClick={locate} disabled={gpsPending}>
              <LocateFixed size={18} aria-hidden="true" /> {t(gpsPending ? "Finding your location…" : "Use my location")}
            </button>
          </div>
          {citySearch && <div className="checkout-actions">
            {cityResults.length ? cityResults.map((city) => <button className="demo-secondary"
              type="button" key={`${city.lat},${city.lng}`} onClick={() => {
                // A city result navigates the map. The delivery pin still needs a precise pick.
                const problem = deliveryProblem(city);
                if (problem) return notify("warning", problem);
                setView({ ...city, zoom: 13 });
                setQuery("");
              }}>{city[language]}</button>) : <p role="status">{t("No matching demo cities. Use the map or enter coordinates.")}</p>}
          </div>}
          <DeliveryMap key={mapAttempt} point={point} view={view} onPick={(candidate) => selectLocation(candidate)}
            onTileError={() => setTileError(true)} />
          {tileNotice}
          <details className="checkout-coordinate-entry">
            <summary>{t("Enter coordinates")}</summary>
            <form className="checkout-location-tools" onSubmit={(event) => {
              event.preventDefault();
              selectLocation({ lat: parseCoordinate(latInput), lng: parseCoordinate(lngInput) }, 16);
            }}>
              <label>{t("Latitude")}<input className="form-control" dir="ltr" inputMode="decimal" value={latInput}
                onChange={(event) => setLatInput(event.target.value)} /></label>
              <label>{t("Longitude")}<input className="form-control" dir="ltr" inputMode="decimal" value={lngInput}
                onChange={(event) => setLngInput(event.target.value)} /></label>
              <button className="demo-secondary" type="submit">{t("Use these coordinates")}</button>
            </form>
          </details>
          <div className="checkout-actions">
            {point && <p role="status">{t("Selected coordinates")} {coordinates(point)}</p>}
            <button className="demo-primary" type="button" disabled={!point} onClick={() => {
              const problem = deliveryProblem(point);
              if (problem) notify("warning", problem);
              else go("address");
            }}>{t("Continue to delivery address")}</button>
          </div>
        </section>}
        {stage === "address" && <section className="checkout-panel">
          <h2>{t("Confirm your delivery address")}</h2>
          <DeliveryMap key={mapAttempt} point={point} preview onTileError={() => setTileError(true)} />
          {tileNotice}
          <p>{t("Selected coordinates")} {coordinates(point)}</p>
          <p>{t("Enter the address at the pinned location in Morocco.")}</p>
          <form noValidate onSubmit={confirmAddress} onChange={validation.onChange} onBlur={validation.onBlur}>
            <div className="checkout-address-fields">
              {fields.map(([name, label, autocomplete, maxLength]) => <div key={name}>
                <ValidatedField id={`checkout-${name}`} name={name} label={label} error={validation.errors[name]}
                  type={name === "phone" ? "tel" : "text"}
                  dir={name === "phone" ? "ltr" : "auto"} autoComplete={autocomplete} maxLength={maxLength}
                  required={name !== "instructions"} value={address[name]}
                  onChange={(event) => {
                    setDelivery(null);
                    setAddress({ ...address, [name]: event.target.value });
                  }} />
              </div>)}
            </div>
            <p className="checkout-note">{t("The name and address are saved with the invoice. Phone and instructions stay in this checkout.")}</p>
            <div className="checkout-actions">
              <button type="button" className="demo-secondary" onClick={() => {
                setView({ ...point, zoom: 16 });
                go("location");
              }}>{t("Change Location")}</button>
              <button type="submit" className="demo-primary">{t("Confirm Location")}</button>
            </div>
          </form>
        </section>}
        {stage === "payment" && delivery && <section className="checkout-panel">
          <h2>{t("Choose a demo payment method")}</h2>
          <fieldset className="checkout-payment">
            <legend className="visually-hidden">{t("Payment method")}</legend>
            {Object.entries(paymentLabels).map(([method, label]) => {
              const Icon = method === "cash" ? Banknote : CreditCard;
              return <label key={method}>
                <input type="radio" name="payment" checked={payment === method} onChange={() => setPayment(method)} />
                <Icon aria-hidden="true" />
                <span><strong>{t(label)}</strong><small>{t(method === "cash"
                  ? "Simulate paying on delivery." : "Simulate using a card without entering card details.")}</small></span>
              </label>;
            })}
          </fieldset>
          <div className="checkout-actions">
            <button className="demo-secondary" type="button" onClick={() => go("address")}>{t("Back to delivery address")}</button>
            <button className="demo-primary" type="button" disabled={!payment} onClick={() => go("review")}>{t("Review demo order")}</button>
          </div>
        </section>}
        {stage === "review" && delivery && payment && <section className="checkout-panel">
          <h2>{t("Review your demo order")}</h2>
          <OrderItems items={items} totals={totals} showImages />
          <div className="checkout-review-details">
            <section><h3>{t("Delivery address")}</h3><Address address={delivery.address} />
              <p>{coordinates(delivery.point)}</p>
              <p><bdi>{delivery.address.phone}</bdi></p>
              {delivery.address.instructions && <p dir="auto">{delivery.address.instructions}</p>}
            </section>
            <section><h3>{t("Payment method")}</h3><p>{t(paymentLabels[payment])}</p></section>
          </div>
          <div className="checkout-actions">
            <button className="demo-secondary" type="button" disabled={saving} onClick={() => go("payment")}>{t("Back to payment")}</button>
            <button className="demo-primary" type="button" disabled={saving} onClick={submit}>
              {t(saving ? "Saving demo order…" : "Confirm Demo Order")}
            </button>
          </div>
        </section>}
      </>}
    </main>
  );
}
