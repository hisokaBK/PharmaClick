import { useParams } from "react-router-dom";
import { data1 } from "../data/data1";
import Card from "./card";
import NavShop from "./NavShop";
import Footer from "../components/Footer";

export default function Produit_by_needed_prescription(){

             const {need} =useParams()

            
                   const prods =data1.filter(elm=>elm.needed_prescription===need)
            


    // The shared catalog grid owns responsive gutters for this filtered view.
    return(<>
        <NavShop/>     
        <div className="cards-grid-container2"><Card medications={prods}/></div>
        <Footer/>
        </>
    )
}