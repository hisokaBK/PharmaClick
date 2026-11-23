import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import { useDemoAuth } from "../components/DemoAuth";
import { useI18n } from "../i18n/LanguageProvider";
import { paymentLabels, readOrders } from "./demoOrders";
import "./checkout.css";

export function Address({ address }) {
  const { t } = useI18n();
  if (!address) return <p>{t("Saved delivery details were deleted.")}</p>;
  return <address>
    <bdi>{address.name}</bdi><br />
    <bdi>{address.street}</bdi><br />
    <bdi>{address.city}</bdi>, {t("Morocco")}
  </address>;
}

export function OrderItems({ items, totals, showImages = false }) {
  const { t, language } = useI18n();
  const numbers = new Intl.NumberFormat(language, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money = (amount) => <bdi>{numbers.format(amount)} {t("Dhs")}</bdi>;
  return <>
    <table className="checkout-items">
      <thead><tr>
        <th scope="col">{t("Product")}</th><th scope="col">{t("Quantity")}</th>
        <th scope="col">{t("Unit price")}</th><th scope="col">{t("Total")}</th>
      </tr></thead>
      <tbody>{items.map((item) => <tr key={item.id}>
        <th scope="row">
          {showImages && item.image && <img src={item.image} alt="" />}
          <bdi>{item.title}</bdi>
        </th>
        <td><bdi>{item.times}</bdi></td><td>{money(item.price)}</td><td>{money(item.price * item.times)}</td>
      </tr>)}</tbody>
    </table>
    <dl className="checkout-totals">
      {Object.entries({ Subtotal: totals.subtotal, Shipping: totals.shipping, Total: totals.total })
        .map(([label, amount]) => <div key={label}><dt>{t(label)}</dt><dd>{money(amount)}</dd></div>)}
    </dl>
  </>;
}

export default function OrderInvoice() {
  const { t, language } = useI18n();
  const { user } = useDemoAuth();
  const { reference } = useParams();
  const history = user ? "/profile?tab=orders" : "/checkout/orders";
  const order = readOrders(user?.id ?? null).find((entry) => entry.reference === reference);
  const printable = Boolean(order);

  useEffect(() => {
    if (!printable) return;
    document.body.classList.add("checkout-printing");
    return () => document.body.classList.remove("checkout-printing");
  }, [printable]);

  if (!order) return <main className="checkout-layout"><h1>{t("Demo invoice unavailable")}</h1>
    <Link to={history}>{t("View My Orders")}</Link>
  </main>;

  return (
    <main className="checkout-layout checkout-invoice-page">
      <div className="checkout-invoice-actions">
        <h1>{t("Demo order saved")}</h1>
        <div className="checkout-actions">
          <button type="button" className="demo-primary" onClick={() => window.print()}>
            <Printer size={18} aria-hidden="true" /> {t("Print Invoice")}
          </button>
          <Link className="demo-secondary" to={history}>{t("View My Orders")}</Link>
          <Link className="demo-secondary" to="/">{t("Back to Home")}</Link>
        </div>
        <p>{t("To download a PDF, choose Save as PDF in your print dialog.")}</p>
      </div>
      <article className="checkout-panel checkout-invoice">
        <header className="checkout-invoice-header">
          <strong>PharmaClick</strong>
          <h2>{t("Demo invoice")}</h2>
          <p><small><bdi>{order.reference}</bdi></small></p>
          <p>{t("Order date")} <time dateTime={order.date}>
            {new Intl.DateTimeFormat(language, { dateStyle: "long" }).format(new Date(order.date))}
          </time></p>
        </header>
        <div className="checkout-invoice-notice">{t("Demonstration only. No payment was collected and no delivery was arranged.")}</div>
        <div className="checkout-review-details">
          <section><h3>{t("Delivery address")}</h3><Address address={order.address} /></section>
          <section><h3>{t("Payment method")}</h3><p>{t(paymentLabels[order.payment])}</p>
            <p>{t("Status")} <strong>{t("Demo order")}</strong></p></section>
        </div>
        <OrderItems items={order.items} totals={order} />
      </article>
    </main>
  );
}
