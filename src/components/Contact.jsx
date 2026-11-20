import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Footer from "./Footer";
import "../css/Contact.css";

const Contact = () => {
  return (<div>
    <div className="contact-page-container">
      <div style={{textAlign:'center'}}><h1 className="section-title contact-title ">Contact Us</h1></div>
      <h2 className="contact-subtitle">Let's talk with us</h2>
      
      <div className="contact-content">
       
        <div className="contact-info-section">
          <p className="contact-description">
            Questions, comments, or suggestions? Simply fill in the form and we'll be in touch shortly.
          </p>

          <ul className="contact-info-list">
            <li className="contact-info-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>1055 Zanqa Lhadada, 67, Hay Nahda, Oued Zem City</span>
            </li>
            <li className="contact-info-item checked">
              <FaPhone className="contact-icon" />
              <span>+1 234 678 9108 99</span>
            </li>
            <li className="contact-info-item">
              <FaEnvelope className="contact-icon" />
              <span>hisokapharmacy@gmail.com</span>
            </li>
          </ul>
            <div style={{display:'flex',justifyContent:'center'}}>
                 <img src="back7.jpg" alt="" style={{height:'350px'}} />
            </div>
        </div>

        <div className="contact-form-section">
          <form className="pharmacy-contact-form">
            <div className="form-group">
              <input type="text" placeholder="First Name" required />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Last Name*" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email*" required />
            </div>
            <div className="form-group">
              <input type="tel" placeholder="Phone Number*" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your message..." rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-button">
              Send Message
            </button>
          </form>
        </div>
      </div>
      
    </div>
       <Footer/>
    </div>
  );
};

export default Contact;