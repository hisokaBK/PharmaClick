import { useI18n } from "../i18n/LanguageProvider";
import "../css/marquee.css";
import { useNavigate } from "react-router-dom";
export default function Marquee() {
  const { t } = useI18n();
  const navig = useNavigate();

  const image_mrq = [
    { name: "All medications", image: "/images_marque/img_all.jpg" },
    { name: "Multivitamins", image: "/images_marque/img_mltu.jpeg" },
    { name: "Kids place", image: "/images_marque/img_kids.jpg" },
    { name: "Nutritional supplements", image: "/images_marque/img_splm1.jpg" },
    { name: "Herbal medicine", image: "/images_marque/img_hrb.jpg" },
    { name: "Protect yourself", image: "/images_marque/img_prtY.jpg" },
    {
      name: "Disinfectants & cleaners.",
      image: "/images_marque/img_clien.jpg",
    },
    { name: "All medications", image: "/images_marque/img_all.jpg" },
    { name: "Multivitamins", image: "/images_marque/img_mltu.jpeg" },
    { name: "Kids place", image: "/images_marque/img_kids.jpg" },
    { name: "Nutritional supplements", image: "/images_marque/img_splm1.jpg" },
    { name: "Herbal medicine", image: "/images_marque/img_hrb.jpg" },
    { name: "Protect yourself", image: "/images_marque/img_prtY.jpg" },
    {
      name: "Disinfectants & cleaners.",
      image: "/images_marque/img_clien.jpg",
    },
  ];

  const handlClick = (k) => {
    if (k === 0 || k === 7) {
      navig("/Products");
    } else if (k === 1 || k === 8) {
      navig("/Products/multivitamins");
    } else if (k === 2 || k === 9) {
      navig("/Products/Kids");
    } else if (k === 3 || k === 10) {
      navig("/Products/supplements");
    } else if (k === 4 || k === 11) {
      navig("/Products/Herbal");
    } else if (k === 5 || k === 12) {
      navig("/Products/products_usf");
    } else if (k === 6 || k===13) {
      navig("/Products/cleaners");
    }
  };
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {image_mrq.map((elm, k) => (
          <div key={k} className="marquee-item" onClick={() => handlClick(k)}>
            <img
              src={elm.image}
              alt=""
              style={{
                height: "160px",
                width: "240px",
                borderRadius: "16px",
                borderRight: "6px solid",
              }}
            />
            <h4 className="h4_marquee">{t(elm.name)}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
