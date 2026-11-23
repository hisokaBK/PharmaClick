import { useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Addplus } from "../store/actions";
import { RemovePanier, clearCart } from "../store/actions";
import '../css/Cart.css'; 
import NavShop from "./NavShop";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';
import { useFeedback } from "../components/Feedback";
import { useDemoAuth } from "../components/DemoAuth";
import { findSession, readDemo } from "../store/demoAccounts";
import { useI18n } from "../i18n/LanguageProvider";
import CatalogDescription from "./CatalogDescription";
import { cartTotals, readOrders } from "../checkout/demoOrders";

export default function Cart() {
  const { t } = useI18n();
  
  const cartItems = useSelector((state) => state.cardData);
  const dispatch = useDispatch();
  const cartRegion = useRef(null);
  const { notify, requestConfirmation } = useFeedback();
  const { user } = useDemoAuth();

  function updateConfirmedCart(action, message) {
    if ((findSession(readDemo())?.id || null) !== (user?.id || null)) {
      notify("warning", "The active account changed. Review your cart before trying again.");
      return;
    }
    dispatch(action);
    notify("success", message);
  }

const updateCartItem = (item, quantityChange) => {
  const newTimes = item.times + quantityChange;
  const newStock = item.stock - quantityChange;

  if (newTimes < 1) return;
  if (quantityChange > 0 && newStock < 0) {
    notify("warning", "There is not enough stock for that quantity.");
    return;
  }

  dispatch(
    Addplus({
      ...item, 
      times: newTimes,
      stock: newStock,
    })
  );
  notify("success", "Cart quantity updated.");
};

const handleIncrease = (item) => updateCartItem(item, 1);
const handleDecrease = (item) => updateCartItem(item, -1);


  const handleRemove = (item, trigger) => {
    requestConfirmation({
      title: "Remove item?",
      description: "Remove {0} from your shopping cart?",
      descriptionValues: [item.title],
      confirmLabel: "Remove item",
      trigger,
      fallbackFocus: () => cartRegion.current,
      onConfirm: () => updateConfirmedCart(RemovePanier(item.id), "Item removed from your cart."),
    });
  };

  const handleClearCart = (trigger) => {
    requestConfirmation({
      title: "Clear your cart?",
      description: "This will remove all items from your shopping cart.",
      confirmLabel: "Clear cart",
      trigger,
      fallbackFocus: () => cartRegion.current,
      onConfirm: () => updateConfirmedCart(clearCart(), "Your cart was cleared."),
    });
  };

  const { subtotal, shipping, total } = cartTotals(cartItems);

  return (
    <>
      <NavShop/>
      <main className="cart-container" ref={cartRegion} tabIndex={-1} aria-label={t("Shopping cart")}>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>{t("Your cart is empty")}</h2>
            <Link to="/Products" className="continue-shopping">
              {t("Continue Shopping")}
            </Link>
            {!user && readOrders(null).length > 0 && <p><Link to="/checkout/orders">{t("View My Orders")}</Link></p>}
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image-container">
                    <img src={item.image} alt={item.title} className="item-image" />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-title"><bdi>{item.title}</bdi></h3>
                    <p className="item-description"><CatalogDescription product={item} /></p>
                    
                    <div className="item-price">
                      <span className="unit-price">{item.price} {t("Dhs")}</span>
                      {item.times > 1 && (
                        <span className="quantity-details">({item.times} × {item.price} {t("Dhs")})</span>
                      )}
                    </div>
                    
                    <div className="item-actions">
                      <div className="quantity-control2">
                        <button aria-label={t("Decrease quantity")} onClick={() => handleDecrease(item)} className="quantity-btn" disabled={item.times <= 1}>-</button>
                        <span className="quantity">{item.times}</span>
                        <button aria-label={t("Increase quantity")} onClick={() => handleIncrease(item)} className="quantity-btn">+</button>
                      </div>
                      <button 
                        onClick={(event) => handleRemove(item, event.currentTarget)}
                        className="remove-btn"
                      >
                        {t("Remove")}
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-total">
                    <span className="total-price">{(item.price * item.times).toFixed(2)} {t("Dhs")}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h2 className="summary-title">{t("SHOPPING CART SUMMARY")}</h2>
              <div className="summary-row">
                <span>{t("Subtotal")}</span>
                <span className="subtotal-price">{subtotal.toFixed(2)} {t("Dhs")}</span>
              </div>
              <div className="summary-row">
                <span>{t("Shipping")}</span>
                <span className="shipping-price">{shipping.toFixed(2)} {t("Dhs")}</span>
              </div>
              <div className="summary-row total">
                <span>{t("Total")}</span>
                <span className="total-price">{total.toFixed(2)} {t("Dhs")}</span>
              </div>
              <Link className="checkout-btn" to="/checkout">
                {t("Proceed to Checkout ({0} {1})", [total.toFixed(2), t("Dhs")])}
              </Link>
              <button type="button" className="remove-btn" onClick={(event) => handleClearCart(event.currentTarget)}>
                {t("Clear cart")}
              </button>
              {!user && readOrders(null).length > 0 && <Link to="/checkout/orders">{t("View My Orders")}</Link>}
            </div>
          </>
        )}
      </main>
      
      <Footer/>
    </>
  );
}
