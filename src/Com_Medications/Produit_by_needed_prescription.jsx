import { useParams } from "react-router-dom";
import { data1 } from "../data/data1";
import NavShop from "./NavShop";
import { SearchableProductList } from "./ProductSearch";
import Footer from "../components/Footer";

export default function Produit_by_needed_prescription() {
  const { need } = useParams();
  const products = data1.filter(product => product.needed_prescription === need);

  return (
    <>
      <NavShop />
      <SearchableProductList products={products} />
      <Footer />
    </>
  );
}
