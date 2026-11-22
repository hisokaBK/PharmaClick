import React, { useState } from 'react';
import '../css/FAQ.css';
import { FaChevronDown, FaChevronUp, FaShippingFast, FaPills, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { useI18n } from "../i18n/LanguageProvider";

const FAQ = () => {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqCategories = [
    {
      title: "General Questions",
      icon: <FaQuestionCircle className="category-icon" />,
      questions: [
        {
          question: "How do I create an account with HeiSoKa PharmaCy?",
          answer: "You can create an account by clicking on the 'Register' button at the top of the page and entering the required information."
        },
        {
          question: "Is your website trustworthy for purchasing medications?",
          answer: "Yes, we are a licensed pharmacy and all our products are authentic and approved by the Ministry of Health."
        }
      ]
    },
    {
      title: "Products & Medications",
      icon: <FaPills className="category-icon" />,
      questions: [
        {
          question: "Do you require prescriptions for certain medications?",
          answer: "Yes, prescription-only medications cannot be dispensed without a valid doctor's prescription."
        },
        {
          question: "How can I check if a medication is in stock?",
          answer: "Products will be shown as available on our website, or you can contact customer service for availability inquiries."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: <FaShippingFast className="category-icon" />,
      questions: [
        {
          question: "What are your delivery times?",
          answer: "Delivery typically takes 1-3 business days depending on your location."
        },
        {
          question: "Do you offer free shipping?",
          answer: "We offer free shipping for orders over 200 Dhs. Below that amount, a nominal shipping fee applies."
        }
      ]
    }
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(item => 
      t(item.question).toLowerCase().includes(searchTerm.toLowerCase()) ||
      t(item.answer).toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(category => category.questions.length > 0);

  return (<>
    <div className="faq-container">
      <div className="faq-header">
        <h1>{t("Frequently Asked Questions")}</h1>
        <p>{t("Find answers to common questions about our products and services")}</p>
      </div>

      <div className="search-faq">
        <input 
          type="text" 
          placeholder={t("Search FAQs...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>{t("Search")}</button>
      </div>

      <div className="faq-content">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, catIndex) => (
            <div key={catIndex} className="faq-category">
              <div className="category-header">
                {category.icon}
                <h2>{t(category.title)}</h2>
              </div>
              
              <div className="questions-list">
                {category.questions.map((item, index) => (
                  <div key={index} className="faq-item">
                    <div 
                      className="faq-question" 
                      onClick={() => toggleFAQ(`${catIndex}-${index}`)}
                    >
                      <h3>{t(item.question)}</h3>
                      {activeIndex === `${catIndex}-${index}` ? 
                        <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {activeIndex === `${catIndex}-${index}` && (
                      <div className="faq-answer">
                        <p>{t(item.answer)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>{t("No questions found matching your search. Please try different keywords.")}</p>
          </div>
        )}
      </div>

      <div className="contact-support">
        <h3>{t("Didn't find what you were looking for?")}</h3>
        <Link to='/contact'><button className="contact-btn">{t("Contact Customer Support")}</button></Link>
      </div>
    </div>
    <Footer/>
  </>);
};

export default FAQ;