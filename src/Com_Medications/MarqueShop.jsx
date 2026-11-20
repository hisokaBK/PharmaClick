import "../css/MarqueeShop.css";
import { useNavigate } from "react-router-dom";

export default function MarqueeShop() {
  const navigate = useNavigate();

  const categories = [
    { name: "All medications", image: "./images_marque/img_all.jpg" },
    { name: "Multivitamins", image: "./images_marque/img_mltu.jpeg" },
    { name: "Kids place", image: "./images_marque/img_kids.jpg" },
    { name: "Nutritional supplements", image: "./images_marque/img_splm1.jpg" },
    { name: "Herbal medicine", image: "./images_marque/img_hrb.jpg" },
    { name: "Protect yourself", image: "./images_marque/img_prtY.jpg" },
    { name: "Disinfectants & cleaners", image: "./images_marque/img_clien.jpg" },
    { name: "All medications", image: "./images_marque/img_all.jpg" },
    { name: "Multivitamins", image: "./images_marque/img_mltu.jpeg" },
    { name: "Kids place", image: "./images_marque/img_kids.jpg" },
    { name: "Nutritional supplements", image: "./images_marque/img_splm1.jpg" },
    { name: "Herbal medicine", image: "./images_marque/img_hrb.jpg" },
    { name: "Protect yourself", image: "./images_marque/img_prtY.jpg" },
    { name: "Disinfectants & cleaners", image: "./images_marque/img_clien.jpg" },
  ];

  const handleCategoryClick = (index) => {
    const routes = [
      "/Products",
      "/Products/multivitamins",
      "/Products/Kids",
      "/Products/supplements",
      "/Products/Herbal",
      "/Products/products_usf",
      "/cleaners",
      "/Products",
      "/Products/multivitamins",
      "/Products/Kids",
      "/Products/supplements",
      "/Products/Herbal",
      "/Products/products_usf",
      "/Products/cleaners"
    ];
    navigate(routes[index]);
  };

  return (
    <div className="category-slider-container">
      <div className="category-slider-track">
        {categories.map((category, index) => (
          <div 
            className="category-card" 
            key={`${category.name}-${index}`}
            onClick={() => handleCategoryClick(index)}
          >
            <img
              src={category.image}
              alt={category.name}
              className="category-image"
            />
            <h4 className="category-title">{category.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}