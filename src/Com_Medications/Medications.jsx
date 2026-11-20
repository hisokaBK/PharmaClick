import  { useEffect, useRef } from "react";
import "../css/Medications.css";
import NavShop from "./NavShop";
import MarqueeShop from "./MarqueShop";
import ProductSlider from "./ProductSlider";

import { useSelector } from "react-redux";
import Card from "./card";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
export default function Medications() {
  const fullMedicat=useSelector(state=>state.fullData);
  const headerRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    if (descriptionRef.current) observer.observe(descriptionRef.current);

    return () => {
      if (headerRef.current) observer.unobserve(headerRef.current);
      if (descriptionRef.current) observer.unobserve(descriptionRef.current);
    };
  }, []);

  const medications = fullMedicat;
  return (
    <div>
      <NavShop />

      <div className="medications-container">
        <div className="header-section">
          <div className="header-image-container">
            <img
              src="./images/back5.jpeg"
              alt="Pharmacy Products"
              className="header-image"
            />
            <div className="header-text-overlay">
              <h1 ref={headerRef} className="header-title fade-in">
                We Help You Find the Right Medication
              </h1>
              <p ref={descriptionRef} className="header-description fade-in1">
                Providing safe, effective medications with expert support and
                seamless delivery — committed to your well-being.
              </p>
              <div>
                <Link to='/Products'><button className="pulse-button">Browse Products</button></Link>
              </div>
            </div>
          </div>
        </div>

        <h1 className="medications-title">Multivitamins</h1>
        <ProductSlider products={fullMedicat.filter((elm)=>elm.category==='multivitamins').slice(1,12)} />

         <h1 className="medications-title">Nutritional Products</h1>
         <div className="cards-grid-container2">
        <Card medications={fullMedicat.filter(elm=>elm.category==='products_usf').slice(7,15)}/>
        </div>
        <MarqueeShop/>
       <h1 className="medications-title">Medical Supplements</h1>
        
        <ProductSlider products={fullMedicat.filter(elm=>elm.category==='supplements').slice(0,18)} />
         <h1 className="medications-title">Topical Cleaning Supplies</h1>
         <div className="cards-grid-container2">
        <Card medications={medications.filter(elm=>elm.category==='cleaning').slice(5,13)}/>
        </div>
 
      </div>
      <Footer/>
    </div>
  );
}
