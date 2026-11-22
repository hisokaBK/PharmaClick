import { useParams } from "react-router-dom";
import { data1 } from "../data/data1";
import NavShop from "./NavShop";
import { SearchableProductList } from "./ProductSearch";
import Footer from "../components/Footer";

export default function ProduitFilter() {
  const { category } = useParams();
  const products = data1.filter(product => product.category === category);

  return (
    <>
      <NavShop />
      <SearchableProductList products={products} />
      <Footer />
    </>
  );
}
