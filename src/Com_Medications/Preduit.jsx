import { useParams } from "react-router-dom";
import NavShop from "./NavShop";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddMore } from "../store/actions";
import { AddPanier } from "../store/actions";
import "../css/Produit.css";
import Footer from "../components/Footer";
import { useFeedback } from "../components/Feedback";
import { useI18n } from "../i18n/LanguageProvider";
import CatalogDescription from "./CatalogDescription";

export default function Produit() {
  const { t } = useI18n();
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
    if (NewProduit) notify("success", "Cart quantity updated.");
    else notify("success", "{0} added to your cart.", [produit.title]);
  };

  let totalPrice = produit.price * more;

  return (
    <>
      <NavShop />
      <div className="product-container">
        <div className="product-details">
          <h1 className="product-title"><bdi>{produit.title}</bdi></h1>
          <p className="product-description"><CatalogDescription product={produit} /></p>
          <p className="product-description">
            <strong>{t(produit.stock > 0 ? "Stock: {0}" : "Out of stock ({0})", [produit.stock])}</strong>
          </p>

          <div className="price-container">
            <span className="product-price"><bdi>{totalPrice.toFixed(2)}</bdi> {t("Dhs")}</span>
          </div>

          <div className="quantity-control">
            <input
              type="number"
              aria-label={t("Quantity")}
              min={1}
              value={more}
              onChange={(e) => setMore(Math.max(1, e.target.value))}
              className="quantity-input"
            />
            <button onClick={handClick} className="add-to-bag-btn">
              {t("ADD TO BAG")}
            </button>
          </div>

          <div className="full-description">
            <h3>{t("Description")}</h3>
            <p><CatalogDescription product={produit} field="fullDescription" /></p>
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
