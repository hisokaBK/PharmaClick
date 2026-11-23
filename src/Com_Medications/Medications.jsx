import  { useEffect, useRef } from "react";
import "../css/Medications.css";
import NavShop from "./NavShop";
import MarqueeShop from "./MarqueShop";
import ProductSlider from "./ProductSlider";
import ProductSearch, {
  filterProductsByName,
  ProductSearchResults,
  useProductSearch,
} from "./ProductSearch";

import { useSelector } from "react-redux";
import Card from "./card";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/LanguageProvider";
export default function Medications() {
  const { t } = useI18n();
  const fullMedicat=useSelector(state=>state.fullData);
  const headerRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const headings = [headerRef.current, descriptionRef.current].filter(Boolean);
    if (typeof IntersectionObserver === "undefined") {
      headings.forEach((element) => element.classList.add("show"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    headings.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const [query, setQuery] = useProductSearch();
  return (
    <div>
      <NavShop />

      <div className="medications-container">
        <div className="header-section">
          <div className="header-image-container">
            {/* Load the hero image from the hosting root on direct shop visits. */}
            <img
              src="/images/back5.jpeg"
              alt={t("Pharmacy Products")}
              className="header-image"
            />
            <div className="header-text-overlay">
              <h1 ref={headerRef} className="header-title fade-in">
                {t("We Help You Find the Right Medication")}
              </h1>
              <p ref={descriptionRef} className="header-description fade-in1">
                {t("Providing safe, effective medications with expert support and seamless delivery — committed to your well-being.")}
              </p>
              <div>
                <Link to="/Products" className="pulse-button">{t("Browse Products")}</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="medications-search product-search-list">
          <ProductSearch query={query} onChange={setQuery} />
          {query.trim() && (
            <ProductSearchResults products={filterProductsByName(fullMedicat, query)} query={query} />
          )}
        </div>

        {!query.trim() && (
          <>
            <h1 className="medications-title">{t("Multivitamins")}</h1>
            <ProductSlider products={fullMedicat.filter(product => product.category === "multivitamins").slice(1, 12)} />

            <h1 className="medications-title">{t("Nutritional Products")}</h1>
            <div className="cards-grid-container2">
              <Card medications={fullMedicat.filter(product => product.category === "products_usf").slice(7, 15)} />
            </div>

            <MarqueeShop />
            <h1 className="medications-title">{t("Medical Supplements")}</h1>
            <ProductSlider products={fullMedicat.filter(product => product.category === "supplements").slice(0, 18)} />

            <h1 className="medications-title">{t("Topical Cleaning Supplies")}</h1>
            <div className="cards-grid-container2">
              <Card medications={fullMedicat.filter(product => product.category === "cleaning").slice(5, 13)} />
            </div>
          </>
        )}
      </div>
      <Footer/>
    </div>
  );
}
