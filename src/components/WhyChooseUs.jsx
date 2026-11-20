// WhyChooseUs.jsx
import  { useEffect, useRef } from "react";
import { FaTruck, FaCheckCircle, FaHandshake, FaCogs } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/WhyChooseUs.css";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <FaTruck className="feature-icon" />,
      title: "Fast & Secure Delivery",
      description:
        "We provide quick and reliable medication delivery to your doorstep.",
    },
    {
      icon: <FaCheckCircle className="feature-icon" />,
      title: "Quality Medications",
      description:
        "Only genuine pharmaceutical products from trusted manufacturers.",
    },
    {
      icon: <FaHandshake className="feature-icon" />,
      title: "Trusted Service",
      description: "Verified pharmacists with professional expertise and care.",
    },
    {
      icon: <FaCogs className="feature-icon" />,
      title: "Efficient Service",
      description: "Quick prescription processing and medication management.",
    },
  ];

  const featureCardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-feature");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    featureCardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-choose-us py-5">
      <div className="text-left mb-5" style={{ textAlign: "center" }}>
        <h2 className="section-title mb-3">Why Choose Our Pharmacy?</h2>
        <p className="mb-0">
          Committed to providing exceptional pharmaceutical services with
          professionalism and care
        </p>
      </div>
      <div className="container">
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <div
                className="feature-card h-100 p-4 text-left"
                ref={(el) => (featureCardsRef.current[index] = el)}
              >
                <div className="feature-icon-wrapper mb-3">{feature.icon}</div>
                <h3 className="feature-title h5">{feature.title}</h3>
                <p className="feature-text mb-0">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
