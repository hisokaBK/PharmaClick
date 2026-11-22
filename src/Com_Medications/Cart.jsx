import { useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Addplus } from "../store/actions";
import { RemovePanier, clearCart } from "../store/actions";
import '../css/Cart.css'; 
import NavShop from "./NavShop";
import Footer from "../components/Footer";
import Commander from './Commander';
import { Link } from 'react-router-dom';
import { useFeedback } from "../components/Feedback";
import { useDemoAuth } from "../components/DemoAuth";
import { findSession, readDemo } from "../store/demoAccounts";

export default function Cart() {
  
  const cartItems = useSelector((state) => state.cardData);
  const dispatch = useDispatch();
  const [showCommander, setShowCommander] = useState(false);
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

  if (newTimes < 0) return;  
  if (quantityChange > 0 && newTimes > item.stock) {
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
      description: `Remove ${item.title} from your shopping cart?`,
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

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.times), 0);

  return (
    <>
      <NavShop/>
      <main className="cart-container" ref={cartRegion} tabIndex={-1} aria-label="Shopping cart">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <Link to="/Products" className="continue-shopping">
              Continue Shopping
            </Link>
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
                    <h3 className="item-title">{item.title}</h3>
                    <p className="item-description">{item.shortDescription}</p>
                    
                    <div className="item-price">
                      <span className="unit-price">{item.price} Dhs</span>
                      {item.times > 1 && (
                        <span className="quantity-details">({item.times} × {item.price} Dhs)</span>
                      )}
                    </div>
                    
                    <div className="item-actions">
                      <div className="quantity-control2">
                        <button onClick={() => handleDecrease(item)} className="quantity-btn">-</button>
                        <span className="quantity">{item.times}</span>
                        <button onClick={() => handleIncrease(item)} className="quantity-btn">+</button>
                      </div>
                      <button 
                        onClick={(event) => handleRemove(item, event.currentTarget)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="item-total">
                    <span className="total-price">{(item.price * item.times).toFixed(2)} Dhs</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h2 className="summary-title">SHOPPING CART SUMMARY</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span className="subtotal-price">{subtotal.toFixed(2)} Dhs</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="shipping-price">30.00 Dhs</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="total-price">{(subtotal + 30).toFixed(2)} Dhs</span>
              </div>
              <button 
                className="checkout-btn" 
                onClick={() => {
                  setShowCommander(true);
                  notify("info", "This is an invoice preview. Online ordering is unavailable.");
                }}
              >
                Proceed to Checkout ({(subtotal + 30).toFixed(2)} Dhs)
              </button>
              <button type="button" className="remove-btn" onClick={(event) => handleClearCart(event.currentTarget)}>
                Clear cart
              </button>
            </div>
          </>
        )}
      </main>
      
      {showCommander && (
        <Commander 
          cartItems={cartItems}
          subtotal={subtotal}
          onClose={() => setShowCommander(false)}
        />
      )}
      
      <Footer/>
    </>
  );
}
