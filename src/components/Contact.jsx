import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Footer from "./Footer";
import { useFeedback } from "./Feedback";
import "../css/Contact.css";
import { useI18n } from "../i18n/LanguageProvider";
import useLocalizedInvalid from "../i18n/useLocalizedInvalid";

const Contact = () => {
  const { t } = useI18n();
  const onInvalid = useLocalizedInvalid("Check the highlighted contact fields.");
  const { notify } = useFeedback();
  return (<div>
    <div className="contact-page-container">
      <div style={{textAlign:'center'}}><h1 className="section-title contact-title ">{t("Contact Us")}</h1></div>
      <h2 className="contact-subtitle">{t("Let's talk with us")}</h2>
      
      <div className="contact-content">
       
        <div className="contact-info-section">
          <p className="contact-description">
            {t("Questions, comments, or suggestions? Simply fill in the form and we'll be in touch shortly.")}
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
                 {/* Resolve this public asset from the hosting root on direct route loads. */}
                 <img src="/back7.jpg" className="contact-artwork" alt="" decoding="async" />
            </div>
        </div>

        <div className="contact-form-section">
          <form
            className="pharmacy-contact-form"
            onInvalid={onInvalid}
            onSubmit={(event) => {
              event.preventDefault();
              notify("error", "The contact form cannot send messages. Please use the email address shown on this page.");
            }}
          >
            <div className="form-group">
              <input type="text" placeholder={t("First Name")} required />
            </div>
            <div className="form-group">
              <input type="text" placeholder={t("Last Name*")} required />
            </div>
            <div className="form-group">
              <input type="email" placeholder={t("Email*")} required />
            </div>
            <div className="form-group">
              <input type="tel" placeholder={t("Phone Number*")} required />
            </div>
            <div className="form-group">
              <textarea placeholder={t("Your message...")} rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-button">
              {t("Send Message")}
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
