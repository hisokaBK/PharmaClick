import { useParams } from "react-router-dom";
import { data1 } from "../data/data1";
import Card from "./card";
import NavShop from "./NavShop";
import Footer from "../components/Footer";

export default function ProduitFilter(){
            
            const {category}= useParams()
            const listFilter=data1.filter(elm=>elm.category===category)
            
          return (
            <>
                  <NavShop/>
                  <div className="cards-grid-container2" style={{padding:'63px'}}>
                    <Card medications={listFilter}/>
                  </div>
                  <Footer/>
            </>
          )
}  