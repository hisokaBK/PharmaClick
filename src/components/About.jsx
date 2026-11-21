import { motion } from "framer-motion";
import { FaPills, FaFilePrescription, FaFilter, FaBookMedical, 
         FaTruck, FaFileInvoice, FaUpload, FaBell, FaSearch, 
         FaComments, FaUserCircle } from "react-icons/fa";
import "../css/About.css";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const About = () => {
  const imageVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 2, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "backOut"
      }
    }
  };

  return (
 <div>
    <div className="about-container">
      <div className="pha-container">
        <div className="pha-content">
          <div className="pha-text">
            <h3 className="welcome-text">Hello, Welcome</h3>
            <h1 className="name-title">Core Services of HiSoKa</h1>
            <p className="bio-text">
              At Hisoka, we strive to improve healthcare accessibility by offering reliable online srvs for medication browsing, ordering, and expert advice.
            </p>
            <div className="contact-section">
              <div>
                <Link style={{textDecoration:'none'}} to='/contact' ><button className="animated-contact-btn">
                  Contact Us
                </button></Link>
              </div>
            </div>
          </div>
          <motion.div 
            className="pha-image"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={imageVariants}
          >
            {/* Resolve this public asset from the hosting root on direct route loads. */}
            <img src='/im0.jpg' alt="Anderson Cooper" className="pha-photo" />
          </motion.div>
        </div>
      </div>

        <div className="divider" style={{backgroundColor:'rgba(94, 112, 92, 0.16)'}}></div>

      <div style={{textAlign:'center'}}><h1 className="section-title contact-title ">Everything You Need in One Pharmacy Platform</h1></div>

      <div className="srvs-container">
        {[
          { icon: <FaPills />, title: "View Available Medications", content: "Browse all medicines available in a specific pharmacy with detailed info: name, form, price, dosage." },
          { icon: <FaFilePrescription />, title: "Prescription Requirement Display", content: "Clearly shows whether a prescription is required for a medicine or not.", warning: true },
          { icon: <FaFilter />, title: "Filter Medications by Category", content: <ul><li>Medications for children</li><li>Medications for adults</li><li>Dietary supplements</li><li>Skincare, herbal remedies, vitamins</li></ul> },
          { icon: <FaBookMedical />, title: "Medical and Health Tips", content: "Articles and advice written by pharmacists or doctors about prevention, dosage, and proper use of medications." },
          { icon: <FaTruck />, title: "Home Delivery Service", content: "Order medications and receive them at your doorstep with real-time delivery tracking." },
          { icon: <FaFileInvoice />, title: "Electronic Invoice Generation", content: "Receive detailed invoices in PDF format via email or direct download after ordering." },
          { icon: <FaUpload />, title: "Upload Prescription", content: "Securely upload photos of your prescription to request specific medications." },
          { icon: <FaBell />, title: "Notify When Medicine is Available", content: "Get automatic notifications when out-of-stock medications become available." },
          { icon: <FaSearch />, title: "Smart Search", content: "Find medications by name, active ingredient, or medical condition." },
          { icon: <FaComments />, title: "Live Chat with Pharmacist", content: "Instant messaging to get your medication questions answered by professionals.", optional: true },
          { icon: <FaUserCircle />, title: "User Profile Management", content: "Track orders, manage preferences, and view purchase history with your personal account." }
        ].map((srv, i) => (
          <motion.div
            key={i}
            className={`srv-card ${srv.warning ? 'warning' : ''} ${srv.optional ? 'optional' : ''}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
          >
            <div className="srv-icon">{srv.icon}</div>
            <h3>{srv.title}</h3>
            <div className="srv-content">
              {srv.content}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
        <div style={{textAlign:'center',marginBottom:'27px'}}> <h3 className='section-title contact-title' style={{marginBottom:'35px'}} >Available payment methods :</h3>
         <div>
          {/* Scale the payment artwork independently of the About hero on narrow screens. */}
          <img className="about-payment-image" src="/images/by.png" alt="" />
         </div></div>
        <Footer/>
</div>
  );
};

export default About;