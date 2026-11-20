import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../css/product-slider.css';
import Card from './card';

const ProductSlider = ({products}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4.8; 

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      Math.min(prevIndex + itemsPerPage, products.length - itemsPerPage)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
  };

  return (
    <div className="product-slider-container">
      <button 
        className="slider-arrow left-arrow" 
        onClick={prevSlide}
        disabled={currentIndex === 0}
      >
        <FaChevronLeft />
      </button>
      
      <div className="product-slider">
        <div 
          className="product-slider-track"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
        >
          
               <Card medications={products}/>
            
         
        </div>
      </div>
      
      <button 
        className="slider-arrow right-arrow" 
        onClick={nextSlide}
        disabled={currentIndex >= products.length - itemsPerPage}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ProductSlider;