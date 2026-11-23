import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDemoAuth } from "../components/DemoAuth";
import { useFeedback } from "../components/Feedback";
import { useI18n } from "../i18n/LanguageProvider";
import { deleteDeliveryData, readOrders } from "./demoOrders";
import "./checkout.css";

export function OrderHistory({ userId }) {
  const { t, language } = useI18n();
  const { notify, requestConfirmation } = useFeedback();
  const [, refresh] = useState(0);
  const orders = readOrders(userId);

  useEffect(() => {
    const onChange = () => refresh((value) => value + 1);
    window.addEventListener("storage", onChange);
    return () => window.removeEventListener("storage", onChange);
  }, []);

  return <section className="demo-profile-section">
    <h2>{t("My Orders")}</h2>
    {orders.length ? <ul className="checkout-order-list">
      {orders.map((order) => <li key={order.reference}>
        <div>
          <strong>{t("Demo order")}</strong>
          <small><bdi>{order.reference}</bdi></small>
          <time dateTime={order.date}>{new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(new Date(order.date))}</time>
          <bdi>{new Intl.NumberFormat(language, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(order.total)} {t("Dhs")}</bdi>
        </div>
        <Link className="demo-secondary" to={`/checkout/invoice/${order.reference}`}>{t("View demo invoice")}</Link>
      </li>)}
    </ul> : <><p>{t("No orders yet. Your saved demo orders will appear here.")}</p>
      <Link to="/Products">{t("Browse products")}</Link></>}
    {orders.some((order) => order.address || order.location) && <button type="button" className="demo-danger"
      onClick={(event) => requestConfirmation({
        title: "Delete saved delivery details?",
        description: "Remove saved names, addresses and coordinates from these demo invoices. Order totals and products will be kept.",
        confirmLabel: "Delete delivery details",
        trigger: event.currentTarget,
        onConfirm: async () => {
          const remove = () => deleteDeliveryData(userId);
          if (navigator.locks) await navigator.locks.request("pharmaclick-demo-orders", remove);
          else remove();
          refresh((value) => value + 1);
          notify("success", "Saved delivery details were deleted.");
        },
      })}>{t("Delete delivery details")}</button>}
  </section>;
}

export default function GuestOrderHistory() {
  const { user } = useDemoAuth();
  const { t } = useI18n();
  if (user) return <Navigate to="/profile?tab=orders" replace />;
  return <main className="checkout-layout">
    <h1>{t("Guest demo orders")}</h1>
    <p>{t("Guest orders are stored separately in this browser.")}</p>
    <OrderHistory userId={null} />
  </main>;
}
