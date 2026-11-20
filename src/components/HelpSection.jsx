import  { useEffect, useRef } from 'react';
import { FaHeadset, FaQuestionCircle, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../css/HelpSection.css';

const HelpSection = () => {
  const helpOptionsRef = useRef(null);
  const emailSubscriptionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, { threshold: 0.1 });

    if (helpOptionsRef.current) {
      observer.observe(helpOptionsRef.current);
    }
    if (emailSubscriptionRef.current) {
      observer.observe(emailSubscriptionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="pharmacy-help-section" >
      <div className="container">
        <div className="help-content">
          <h2 className="section-title">Do You Have Any Questions About Your Medications?</h2>
          <p className="help-subtitle">Get Professional Help From Our Pharmacy Team</p>
          
          <div className="help-options1" ref={helpOptionsRef}>
            <div className="help-option" style={{ backgroundColor: '#ffffff' }}>
              <div className="option-icon">
                <FaHeadset />
              </div>
              <Link to='/contact' className='LinkContFAQ'><h3>Contact Us for More Information</h3></Link>
              <p>24/7 support from licensed professionals</p>
            </div>
            
            <div className="help-option" style={{ backgroundColor: '#ffffff' }}>
              <div className="option-icon">
                <FaQuestionCircle />
              </div>
              <Link to='/FAQ' className='LinkContFAQ'><h3>Browse our Medication FAQ</h3></Link>
              <p>Find answers to common questions</p>
            </div>
          </div>
          
          <div className="email-subscription" ref={emailSubscriptionRef}>
            <h3>Stay Updated on Health Tips</h3>
            <div className="email-input-group">
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                className="email-input"
                style={{ backgroundColor: '#ffffff' }}
              />
              <button type="submit" className="submit-button">
                <FaPaperPlane /> Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;