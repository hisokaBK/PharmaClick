import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Addplus } from "../store/actions";
import { RemovePanier } from "../store/actions";
import '../css/Cart.css'; 
import NavShop from "./NavShop";
import Footer from "../components/Footer";
import Commander from './Commander';
import { Link } from 'react-router-dom';

export default function Cart() {
  
  const cartItems = useSelector((state) => state.cardData);
  const dispatch = useDispatch();
  const [showCommander, setShowCommander] = useState(false);

const updateCartItem = (item, quantityChange) => {
  const newTimes = item.times + quantityChange;
  const newStock = item.stock - quantityChange;

  if (newTimes < 0) return;  
  if (quantityChange > 0 && newTimes > item.stock) {
    alert('No stock available');
    return;
  }

  dispatch(
    Addplus({
      ...item, 
      times: newTimes,
      stock: newStock,
    })
  );
};

const handleIncrease = (item) => updateCartItem(item, 1);
const handleDecrease = (item) => updateCartItem(item, -1);


  const handleRemove = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this item from the cart?");
    if (isConfirmed) {
      dispatch(RemovePanier(id));
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.times), 0);

  return (
    <>
      <NavShop/>
      <div className="cart-container">
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
                        onClick={() => handleRemove(item.id)} 
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
                onClick={() => setShowCommander(true)}
              >
                Proceed to Checkout ({(subtotal + 30).toFixed(2)} Dhs)
              </button>
            </div>
          </>
        )}
      </div>
      
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