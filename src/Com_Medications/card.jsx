import { FaShoppingCart, FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AddPanier, Addplus } from "../store/actions";
import { Link } from "react-router-dom";
import "../css/Card.css";

export default function Card({ medications }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cardData);
const handleAddToCart = (med) => {
  const alreadyInCart = cartItems.some((item) => item.id === med.id);

  if (!alreadyInCart) {
    if (med.stock < 1) {
      alert('No stock');
    } else {
      dispatch(
        AddPanier({
          id: med.id,
          title: med.title,
          shortDescription: med.shortDescription,
          price: med.price,
          fullDescription: med.fullDescription,
          image: med.image,
          stock: med.stock - 1,
          times: 1,
        })
      );
    }
  }
};

const handleMoreToCart = (med) => {
  const itemInCart = cartItems.find((elm) => elm.id === med.id);
  const currentCount = itemInCart ? itemInCart.times : 0;

  if (med.stock <= currentCount) {
    alert('No stock');
  } else {
    dispatch(
      Addplus({
        id: med.id,
        title: med.title,
        shortDescription: med.shortDescription,
        price: med.price,
        image: med.image,
        fullDescription: med.fullDescription,
        times: currentCount + 1,
        stock: med.stock - 1 
      })
    );
  }
};

  return (
    <>
      {medications.map((med) => {
        const cartItem = cartItems.find((item) => item.id === med.id);
        const isInCart = cartItem !== undefined;
        const itemCount = isInCart ? cartItem.times : 0;

        return (
          <div key={med.id} className="eco-card-wrapper">
            <div className="eco-card">
              {/* A native link keeps the entire product preview reachable by touch and keyboard. */}
              <Link className="goToProdui" to={`/Produit/${med.id}`}>
                <div className="eco-card-header">
                  <h5 className="eco-brand">{med.title}</h5>
                  <div className="eco-by">
                    BY {med.brand || "HiSoKa PharmaCy"}
                  </div>
                </div>
                <img
                  src={med.image}
                  alt={med.title}
                  loading="lazy"
                  className="eco-image"
                  onError={(e) => {
                    // Use a shipped image and avoid retrying if the fallback also fails.
                    const fallback = "/images/logo2.png";
                    if (e.currentTarget.getAttribute("src") !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
                <div className="eco-card-body">
                  <p className="eco-description">{med.shortDescription}</p>
                  <p className="eco-price">
                    <strong>{med.price} Dhs</strong>
                  </p>
                </div>
              </Link>
              <div className="eco-card-footer">
                {itemCount === 0 ? (
                  <button
                    className="eco-btn"
                    onClick={() => handleAddToCart(med)}
                  >
                    <FaShoppingCart className="me-2" />
                    Add to cart
                  </button>
                ) : (
                  <button
                    className="eco-btn"
                    onClick={() => handleMoreToCart(med)}
                  >
                    <FaCartPlus className="me-2" />
                    Add More ¦ {itemCount}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
