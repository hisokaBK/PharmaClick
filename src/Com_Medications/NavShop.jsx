import ServicesMenu from "../components/ServicesMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../css/Nav.css";
import { Pill, ShoppingBag, Cross } from "lucide-react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const lengthState = useSelector(state => state.cardData.length);

  // Search functionality
  const searchRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const handleFocus = () => setIsSearchFocused(true);
  const handleBlur = () => setIsSearchFocused(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear search after submission
    }
  };

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

        {/* Search Bar - Updated */}
        <form onSubmit={handleSearch} style={{ display: "contents" }}>
          <div
            className={`nav__search ${
              isSearchFocused ? "nav__search--focused" : ""
            }`}
            ref={searchRef}
          >
            <input
              type="search"
              aria-label="Search products"
              placeholder="Search..."
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="nav-search-submit"
              aria-label="Submit product search"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <FiSearch className="nav__search-icon" />
            </button>
          </div>
        </form>

        {/* Rest of your existing code remains the same */}
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

        <ul className="ul2">
          <Link className="listA" to="/SignIn" style={{ textAlign: "center" }}>
            <li id="SignIn">Sign in</li>
          </Link>

          <Link className="listA" to="/SignUp" style={{ textAlign: "center" }}>
            <li id="SignUp">Sign up</li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}