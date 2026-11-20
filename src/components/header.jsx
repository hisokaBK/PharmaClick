import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../css/Nav.css";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { Pill, ShoppingBag, Cross } from "lucide-react";
import {
  FaHeartbeat,
  FaAppleAlt,
  FaNewspaper,
  FaLeaf,
  FaBrain,
  FaBed,
  FaDumbbell,
  FaBell,
  FaPoll,
  FaQuestionCircle,
  FaCapsules,
  FaFlask,
  FaPumpSoap,
  FaChild,
  FaSprayCan,
  FaUtensils,
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

          <li id="services" style={{ minWidth: "99px" }}>
            <Link className="listA" to="#">
              Services
              <FiChevronDown className="dropdown-icon" />
            </Link>

            <div className="dropdown-menu">
              <div className="row">
                <div className="col-6">
                  <h6 className="h4_Services">Health</h6>
                  <Link className="a_Services" to="/Professional">
                    <FaHeartbeat className="me-2" /> Professional Guidelines
                  </Link>
                  <Link className="a_Services" to="/Nutrition">
                    <FaAppleAlt className="me-2" /> Nutrition Programs
                  </Link>
                  <Link className="a_Services" to="/Medical_News">
                    <FaNewspaper className="me-2" /> Medical News
                  </Link>
                  <Link className="a_Services" to="/Herbal">
                    <FaLeaf className="me-2" /> Herbal Solutions
                  </Link>
                  <Link className="a_Services" to="/Mental">
                    <FaBrain className="me-2" /> Mental Health
                  </Link>
                </div>
                <div className="col-6">
                  <h6 className="h4_Services">Wellness</h6>
                  <Link className="a_Services" to="/Slep">
                    <FaBed className="me-2" /> Sleep & Stress
                  </Link>
                  <Link className="a_Services" to="/Healthy">
                    <FaUtensils className="me-2" /> Healthy Recipes
                  </Link>
                  <Link className="a_Services" to="/Sports">
                    <FaDumbbell className="me-2" /> Sports & Health
                  </Link>
                  <Link className="a_Services" to="/Health_Alerts">
                    <FaBell className="me-2" /> Health Alerts
                  </Link>
                  <Link className="a_Services" to="/Risk">
                    <FaPoll className="me-2" /> Risk Assessments
                  </Link>
                  <Link className="a_Services" to="/Health_Quizzes">
                    <FaQuestionCircle className="me-2" /> Health Quizzes
                  </Link>
                </div>
              </div>
            </div>
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