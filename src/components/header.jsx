import AccountMenu from "./AccountMenu";
import { useSelector } from "react-redux";
import { FaCartPlus } from "react-icons/fa";
import ServicesMenu from "./ServicesMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Nav.css";
import MedicationsMenu from "./MedicationsMenu";
import { useI18n } from "../i18n/LanguageProvider";
import LanguageSelector from "../i18n/LanguageSelector";

export default function Nav() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const cartCount = useSelector(state => state.cardData.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    // Pair the same listener on mount and unmount so compact-route transitions do not accumulate scroll work.
    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixNav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-layout">
        {/* Link the navbar logo to Home while retaining its responsive alignment. */}
        <Link className="nav__logo" to="/" aria-label={t("Go to homepage")}>
          <img src="/images/set_log1.jpg" alt="" loading="lazy" />
          <span>PharmaClick</span>
        </Link>

        <ul className="ul1">
          {/* Desktop route links move to the global drawer on compact screens. */}
          <li className="nav-desktop-item">
            <Link className="listA" to="/">
              {t("Home")}
            </Link>
          </li>

          <MedicationsMenu active={active} setActive={setActive} />
          <ServicesMenu active={active} setActive={setActive} />
          <li className="cart-link-item">
            <Link to="/Medications/Shop" className="cart-link" aria-label={t("Shopping cart, {0} products", [cartCount])}>
              <FaCartPlus className="cart-icon" size={29} aria-hidden="true" />
              <span className="cart-counter">{cartCount}</span>
            </Link>
          </li>
        </ul>

        <div className="nav-account-zone">
          <LanguageSelector />
          <AccountMenu active={active} setActive={setActive} />
        </div>
      </div>
    </nav>
  );
}
