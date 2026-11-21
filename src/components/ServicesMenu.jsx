import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
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

export default function ServicesMenu() {
  const panelId = useId();
  const trigger = useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <li id="services" style={{ minWidth: "99px" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={event => {
        if (!event.currentTarget.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={event => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          trigger.current.focus();
        }
      }}>
      <button type="button" className="listA services-trigger" ref={trigger} aria-expanded={open} aria-controls={panelId} onClick={event => setOpen(current => event.detail > 0 || !current)}>
        Services <FiChevronDown className="dropdown-icon" aria-hidden="true" />
      </button>
      <div className="dropdown-menu" id={panelId} hidden={!open}>
        <div className="row">
          {serviceGroups.map(group => (
            <div className="col-6" key={group.title}>
              <h6 className="h4_Services">{group.title}</h6>
              {group.links.map(([label, route, Icon]) => (
                <Link className="a_Services" key={route} to={route} onClick={() => setOpen(false)}>
                  <Icon className="me-2" aria-hidden="true" /> {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}

