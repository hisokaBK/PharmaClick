import  { useEffect, useRef, useState } from "react";
import "../css/pimageTest.css";

const images = [
  "im7.webp",
  "im7.webp",
  "im7.webp",
  "im7.webp",
  "im7.webp",
  "im7.webp",
  "im7.webp",
  "im7.webp",
  "im7.webp",
];

export default function ImageTest() {
  const sliderRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const scrollToIndex = (index) => {
    const slider = sliderRef.current;
    const childWidth = slider.children[0].offsetWidth + 20; // 20 for margin
    slider.scrollTo({
      left: index * childWidth,
      behavior: "smooth",
    });
  };

  const nextSlide = () => {
    const newIndex = (scrollIndex + 1) % images.length;
    setScrollIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (scrollIndex - 1 + images.length) % images.length;
    setScrollIndex(newIndex);
    scrollToIndex(newIndex);
  };

  // Auto scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [scrollIndex]);

  return (
    <div className="slider-wrapper">
      <button className="arrow left-arrow" onClick={prevSlide}>
        ←
      </button>

      <div className="image-slider" ref={sliderRef}>
        {images.map((img, index) => (
          <div className="image-container" key={index}>
            <img src={img} loading="lazy" alt="" style={{ height: "200px" }} />
            <div className="image-overlay">
              <h4>مرحبا بك</h4>
              <button className="btn btn-light mt-2">اضغط هنا</button>
            </div>
          </div>
        ))}
      </div>

      <button className="arrow right-arrow" onClick={nextSlide}>
        →
      </button>
    </div>
  );
}
