import React, { useEffect, useRef } from 'react';
import '../css/forYou.css';
import { Link } from 'react-router-dom';
import { FaPrescriptionBottleAlt, FaUserMd, FaHeart } from 'react-icons/fa';
import { useI18n } from "../i18n/LanguageProvider";

const PharmacyServices = () => {
  const { t } = useI18n();
  const healthMetrics = [
    { value: "2080+", label: "Medicines Delivered", icon: <FaPrescriptionBottleAlt /> },
    { value: "1760+", label: "Prescriptions Fulfilled", icon: <FaPrescriptionBottleAlt /> },
    { value: "1260+", label: "Virtual Consultations", icon: <FaUserMd /> },
    { value: "1520+", label: "Satisfied Patients", icon: <FaHeart /> }
  ];

  const serviceHighlights = [
    {
      title: "Fast & Reliable Delivery",
      description: "Medications delivered to your doorstep in record time with temperature-controlled packaging."
    },
    {
      title: "Prescription Management",
      description: "Seamless digital prescription handling with automatic refill reminders and insurance coordination."
    }
  ];

  const elementRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elementRefs.current.forEach(el => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="pharmacy-services-section">
      <div className="services-container">

        <div className="metrics-grid">
          {healthMetrics.map((metric, index) => (
            <div 
              key={index} 
              className="metric-card"
              ref={el => elementRefs.current[index] = el}
            >
              <div className="metric-icon">{metric.icon}</div>
              <h3 className="metric-value">{metric.value}</h3>
              <p className="metric-label">{t(metric.label)}</p>
            </div>
          ))}
        </div>

        <div className="services-content">
          <h2 className="section-title">{t("Our Commitment to Your Health")}</h2>
          <div className="services-description">
            <p>{t("We provide timely delivery of essential medications, prescription management, and access to certified pharmacists for trusted medical advice.")}</p>
            <p>{t("Our platform ensures safe and secure ordering with pharmaceutical-grade accuracy and patient-first service standards.")}</p>
          </div>

          <div className="highlights-grid">
            {serviceHighlights.map((highlight, index) => (
              <div 
                key={index} 
                className="service-highlight"
                ref={el => elementRefs.current[healthMetrics.length + index] = el}
              >
                <h3 className="highlight-title">{t(highlight.title)}</h3>
                <p className="highlight-description">{t(highlight.description)}</p>
              </div>
            ))}
          </div>

          <Link to="/Medications"
            className="pharmacy-action-button"
            ref={el => { elementRefs.current[healthMetrics.length + serviceHighlights.length] = el; }}
          >
            {t("Access medications easily →")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PharmacyServices;
