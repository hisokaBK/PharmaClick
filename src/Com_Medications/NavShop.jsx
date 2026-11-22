import AccountMenu from "../components/AccountMenu";
import ServicesMenu from "../components/ServicesMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Nav.css";
import { Pill, ShoppingBag, Cross } from "lucide-react";
import { FiChevronDown } from "react-icons/fi";
import {
  FaCapsules,
  FaFlask,
  FaPumpSoap,
  FaChild,
  FaSprayCan,
  FaCartPlus,
} from "react-icons/fa";
import { useSelector } from "react-redux";

export default function NavShop() {
  const [scrolled, setScrolled] = useState(false);
  const lengthState = useSelector(state => state.cardData.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    // Pair the same listener on mount and unmount so compact-route transitions do not accumulate scroll work.
    const onScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixNav ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-layout">
        {/* Link the navbar logo to Home while retaining its responsive alignment. */}
        <Link className="nav__logo" to="/" aria-label="Go to homepage">
          <img src="/images/set_log1.jpg" alt="" loading="lazy" />
        </Link>

        <ul className="ul1">
          {/* Desktop route links move to the global drawer on compact screens. */}
          <li className="nav-desktop-item">
            <Link className="listA" to="/">
              Home
            </Link>
          </li>

          <li className="nav-desktop-item" style={{ minWidth: "99px" }}>
            <Link className="listA" to="/Medications">
              Medications
              <FiChevronDown className="dropdown-icon" />
            </Link>

            <div className="dropdown-menu" id="min1">
             <div className="row">
                <div className="col-6">
                  <h6 className="h4_Services">Medicine store</h6>
                  <Link className="a_Services" to="/Medications">
                    <Pill className="me-2" size={18} /> Browse Medicines
                  </Link>
                  <Link className="a_Services" to="/Products">
                    <ShoppingBag size={18} className="me-2" /> Browse Product
                  </Link>
                  <h6 className="h4_Services">Doctor's Prescription *</h6>
                  <Link className="a_Services" to="/Products2/yes">
                    <FaChild className="me-2" />
                    All Medicines *
                  </Link>
                </div>
                <div className="col-6">
                  <h6 className="h4_Services">No Prescription Needed</h6>
                  <Link className="a_Services" to="/Products2/No">
                    <Cross className="me-2" size={19} /> All Medicines
                  </Link>
                  <Link className="a_Services" to="/Products/multivitamins">
                    <FaCapsules className="me-2" /> Multivitamins
                  </Link>
                  <Link className="a_Services" to="/Products/supplements">
                    <FaFlask className="me-2" /> Nutritional Supplements
                  </Link>
                  <Link className="a_Services" to="/Products/cleaning">
                    <FaPumpSoap className="me-2" /> Medical Cleaning Supplies
                  </Link>
                  <Link className="a_Services" to="/Products/products_usf">
                    <FaSprayCan className="me-2" /> Topical Products
                  </Link>
                </div>
              </div>
            </div>
          </li>

          <ServicesMenu />
          <li className="cart-link-item">
            <Link to="/Medications/Shop" className="cart-link" aria-label={`Shopping cart, ${lengthState} products`}>
              <FaCartPlus className="cart-icon " size="29px" />
              <span className="cart-counter">{lengthState}</span>
            </Link>
          </li>
        </ul>

        <AccountMenu />
      </div>
    </nav>
  );
}