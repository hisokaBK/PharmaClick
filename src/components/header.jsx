import ServicesMenu from "./ServicesMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../css/Nav.css";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { Pill, ShoppingBag, Cross } from "lucide-react";
import {
  FaCapsules,
  FaFlask,
  FaPumpSoap,
  FaChild,
  FaSprayCan,
} from "react-icons/fa";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const handleFocus = () => setIsSearchFocused(true);
  const handleBlur = () => setIsSearchFocused(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", () =>
      requestAnimationFrame(handleScroll)
    );
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixNav ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="nav__logo">
          <img src="/images/set_log1.jpg" alt="Company" loading="lazy" />
        </div>

        {/* --------Search Bar -----------------*/}
        <form onSubmit={handleSearch} style={{ display: "contents" }}>
          <div
            className={`nav__search ${
              isSearchFocused ? "nav__search--focused" : ""
            }`}
            ref={searchRef}
          >
            <input
              type="search"
              placeholder="Search..."
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <FiSearch className="nav__search-icon" />
            </button>
          </div>
        </form>

        <ul className="ul1">
          <li>
            <Link className="listA" to="/">
              Home
            </Link>
          </li>

          <li style={{ minWidth: "99px" }}>
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