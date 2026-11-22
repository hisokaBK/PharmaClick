import { Cross, Pill, ShoppingBag } from "lucide-react";
import { FaCapsules, FaChild, FaFlask, FaPumpSoap, FaSprayCan } from "react-icons/fa";
import NavMegaMenu from "./NavMegaMenu";

const columns = [
  [
    { title: "Medicine store", links: [
      ["Browse Medicines", "/Medications", Pill],
      ["Browse Product", "/Products", ShoppingBag],
    ] },
    { title: "Doctor's Prescription *", links: [["All Medicines *", "/Products2/yes", FaChild]] },
  ],
  [
    { title: "No Prescription Needed", links: [
      ["All Medicines", "/Products2/No", Cross],
      ["Multivitamins", "/Products/multivitamins", FaCapsules],
      ["Nutritional Supplements", "/Products/supplements", FaFlask],
      ["Medical Cleaning Supplies", "/Products/cleaning", FaPumpSoap],
      ["Topical Products", "/Products/products_usf", FaSprayCan],
    ] },
  ],
];

export default function MedicationsMenu(props) {
  return <NavMegaMenu name="Medications" columns={columns} {...props} />;
}
