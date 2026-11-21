import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../css/product-slider.css";
import Card from "./card";

export default function ProductSlider({ products }) {
  const viewport = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  // Touch, trackpad and arrows share the same native scroll limits at every width.
  function updateEdges() {
    if (!viewport.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = viewport.current;
    const start = scrollLeft <= 1;
    const end = scrollLeft + clientWidth >= scrollWidth - 1;
    setEdges(current => current.start === start && current.end === end ? current : { start, end });
  }

  // Update disabled controls after resizing or changing the product set.
  useEffect(() => {
    const observer = new ResizeObserver(updateEdges);
    observer.observe(viewport.current);
    updateEdges();
    return () => observer.disconnect();
  }, [products.length]);

  function move(direction) {
    const element = viewport.current;
    const track = element.firstElementChild;
    const [first, second] = track.children;
    if (!second) return;

    // Measure a card and its gap so phones advance one card and larger screens
    // advance one complete visible group, regardless of breakpoint.
    const step = second.offsetLeft - first.offsetLeft;
    if (step <= 0) return;
    const style = getComputedStyle(track);
    const padding = parseFloat(style.paddingInlineStart) + parseFloat(style.paddingInlineEnd);
    const gap = parseFloat(style.columnGap);
    const pageSize = Math.max(1, Math.floor((element.clientWidth - padding + gap + 1) / step));
    const index = Math.round(element.scrollLeft / step);
    const target = (index + direction * pageSize) * step;
    element.scrollTo({
      left: Math.max(0, Math.min(element.scrollWidth - element.clientWidth, target)),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <div className="product-slider-container">
      {/* Keep the arrows keyboard-accessible and disable them at the actual scroll edges. */}
      <button type="button" className="slider-arrow left-arrow" aria-label="Previous products" onClick={() => move(-1)} disabled={edges.start}>
        <FaChevronLeft aria-hidden="true" />
      </button>
      <div className="product-slider" ref={viewport} onScroll={updateEdges}>
        <div className="product-slider-track">
          <Card medications={products} />
        </div>
      </div>
      <button type="button" className="slider-arrow right-arrow" aria-label="Next products" onClick={() => move(1)} disabled={edges.end}>
        <FaChevronRight aria-hidden="true" />
      </button>
    </div>
  );
}
