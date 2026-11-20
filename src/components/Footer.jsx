import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import '../css/Footer.css';
import Marquee from "./Marquee";
import { Link } from "react-router-dom";

const Footer = () => {
  const links = [
    { title: "Our services" },
    { title: "About Us" },
    { title: "Contact Us" },
    { title: "FAQ" },

    
  ];

  return (
    <section className="client-showcase">
      <div className="showcase-container">
        <div className="clients-section">
          <h3 className="section-heading">
           The Main Categories We Offer 
          </h3>
          <div className="main-con ">
            <Marquee />
          </div>
        </div>

        <div className="divider"></div>
        <div
          style={{
            backgroundColor: "black",
            borderRadius: "20px",
            padding: " 30px",
          }}
        >
          <div className="footer-content">
            <div className="brand-section">
              <div>
                <h2 className="brand-name">PharmaClick</h2>
                <p className="brand-tagline">
                  Your health at the press of a button
                </p>

                <h4 style={{ color: "rgba(255, 255, 255, 0.16)" }}>
                  Subscribe to our newsletter
                </h4>
              </div>
              <div>
                <img
                  className="foot_logo"
                  src="/images/set_log5.jpg"
                  alt=""
                  loading="lazy"
                />
              </div>
            </div>

            <div className="links-section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div className="links-column">
                  <h3>Help Center</h3>
                   <Link className="footer-link" to="/Our_services">Our services</Link>
                   <Link className="footer-link" to="/About">About Us</Link>
                   <Link className="footer-link" to="/Contact">Contact Us</Link>
                   <Link className="footer-link" to="/FAQ">FAQ</Link>
                </div>
                <div className="links-column">
                  <h3>INFORMATION</h3>
                    <Link  className="footer-link" to='/Medications'>
                        Medications
                    </Link>
                    <Link  className="footer-link" to='/Delivery'>
                        Delivery Tracking
                    </Link>
                    <Link  className="footer-link" to='/Herbal'>
                        Herbal Solutions
                    </Link>
                    <Link  className="footer-link" to='/products_usf'>
                        Protect yourself
                    </Link>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="mdy">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebookF size={24} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedinIn size={24} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter size={24} />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: "100%", textAlign: "center" }}>
            &copy; 2025 PharmaClick 
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
