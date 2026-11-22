import { useParams } from "react-router-dom";
import NavShop from "./NavShop";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddMore } from "../store/actions";
import { AddPanier } from "../store/actions";
import "../css/Produit.css";
import Footer from "../components/Footer";
import { useFeedback } from "../components/Feedback";

export default function Produit() {
  const cartItems = useSelector((state) => state.fullData);

  const dispatch = useDispatch();
  const { idP } = useParams();
  const NewProduit = useSelector((state) =>
    state.cardData.find((med) => med.id == idP)
  );
  const produit = cartItems.find((med) => med.id == idP);
  const [more, setMore] = useState(1);
  const { notify } = useFeedback();

  const handClick = () => {
    const targetProduct = NewProduit || produit;
    const quantity = Number(more) || 0;

   

    if (targetProduct.stock < quantity) {
      notify("warning", "There is not enough stock for that quantity.");
      return;
    }

    if (NewProduit) {
      dispatch(
        AddMore({
          id: NewProduit.id,
          title: NewProduit.title,
          shortDescription: NewProduit.shortDescription,
          price: NewProduit.price,
          image: NewProduit.image,
          stock: NewProduit.stock - quantity,
          fullDescription: NewProduit.fullDescription,
          times: NewProduit.times + quantity,
        })
      );
    } else {
      dispatch(
        AddPanier({
          id: produit.id,
          title: produit.title,
          shortDescription: produit.shortDescription,
          price: produit.price,
          stock: produit.stock - quantity,
          fullDescription: produit.fullDescription,
          image: produit.image,
          times: quantity,
        })
      );
    }
    notify("success", NewProduit ? "Cart quantity updated." : `${produit.title} added to your cart.`);
  };

  let totalPrice = produit.price * more;

  return (
    <>
      <NavShop />
      <div className="product-container">
        <div className="product-details">
          <h1 className="product-title">{produit.title}</h1>
          <p className="product-description">
            {produit.shortDescription} <strong>stock : </strong>
            {produit.stock}
          </p>

          <div className="price-container">
            <span className="product-price">{totalPrice.toFixed(2)} Dhs</span>
          </div>

          <div className="quantity-control">
            <input
              type="number"
              min={1}
              value={more}
              onChange={(e) => setMore(Math.max(1, e.target.value))}
              className="quantity-input"
            />
            <button onClick={handClick} className="add-to-bag-btn">
              ADD TO BAG
            </button>
          </div>

          <div className="full-description">
            <h3>Description</h3>
            <p>{produit.fullDescription}</p>
          </div>
        </div>
        <div className="product-image-container">
          <img
            src={produit.image}
            alt={produit.title}
            className="product-image1"
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
