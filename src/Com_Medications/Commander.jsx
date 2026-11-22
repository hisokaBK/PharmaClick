import { useState } from 'react';
import '../css/Commander.css';
import { useI18n } from "../i18n/LanguageProvider";

export default function Commander({ cartItems, subtotal, onClose }) {
  const { t, language } = useI18n();
  const [invoiceNumber] = useState(() => Math.floor(Math.random() * 10000));
  const currentDate = new Date().toLocaleDateString(language);
  
  return (
    <div className="commander-modal">
      <div className="commander-content">
        <button className="close-btn" aria-label={t("Close invoice")} onClick={onClose}>×</button>
        
        <div className="invoice-header">
          <h2>{t("Purchase invoice")}</h2>
          <div className="invoice-info">
            <p>{t("Date:")} {currentDate}</p>
            <p>{t("Invoice number: #")}<bdi>{invoiceNumber}</bdi></p>
          </div>
        </div>
        
        <div className="invoice-items">
          <table>
            <thead>
              <tr>
                <th>{t("Item")}</th>
                <th>{t("Quantity")}</th>
                <th>{t("Price")}</th>
                <th>{t("Total")}</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td><bdi>{item.title}</bdi></td>
                  <td>{item.times}</td>
                  <td>{item.price} {t("Dhs")}</td>
                  <td>{(item.price * item.times).toFixed(2)} {t("Dhs")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="invoice-summary">
          <div className="summary-row">
            <span>{t("Subtotal:")}</span>
            <span>{subtotal.toFixed(2) - 30} {t("Dhs")}</span>
          </div>
          
          <div className="summary-row total">
            <span>{t("Grand total:")}</span>
            <span>{(subtotal).toFixed(2)} {t("Dhs")}</span>
          </div>
        </div>
        
        <div className="invoice-actions">
          <button className="print-btn" onClick={() => window.print()}>{t("Print invoice")}</button>
          <button className="close-invoice-btn" onClick={onClose}>{t("Close")}</button>
        </div>
      </div>
    </div>
  );
}
