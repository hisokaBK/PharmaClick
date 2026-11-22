import NavMegaMenu from "./NavMegaMenu";
import {
  FaAppleAlt, FaBed, FaBell, FaBrain, FaDumbbell, FaHeartbeat, FaLeaf,
  FaNewspaper, FaPoll, FaQuestionCircle, FaUtensils,
} from "react-icons/fa";

export const serviceGroups = [
  { title: "Health", links: [
    ["Professional Guidelines", "/Professional", FaHeartbeat],
    ["Nutrition Programs", "/Nutrition", FaAppleAlt],
    ["Medical News", "/Medical_News", FaNewspaper],
    ["Herbal Solutions", "/Herbal", FaLeaf],
    ["Mental Health", "/Mental", FaBrain],
  ] },
  { title: "Wellness", links: [
    ["Sleep & Stress", "/Slep", FaBed],
    ["Healthy Recipes", "/Healthy", FaUtensils],
    ["Sports & Health", "/Sports", FaDumbbell],
    ["Health Alerts", "/Health_Alerts", FaBell],
    ["Risk Assessments", "/Risk", FaPoll],
    ["Health Quizzes", "/Health_Quizzes", FaQuestionCircle],
  ] },
];

const columns = serviceGroups.map((group) => [group]);

export default function ServicesMenu(props) {
  return <NavMegaMenu name="Services" columns={columns} {...props} />;
}
