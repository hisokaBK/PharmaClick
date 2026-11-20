import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import "../css/Sidebar.css";

const links = [
  ["Home", "/"], ["Browse Medicines", "/Medications"], ["All Products", "/Products"],
  ["Cart", "/Medications/Shop"], ["Dashboard", "/Dashboard"], ["Delivery Tracking", "/Delivery"],
  ["Contact", "/contact"], ["About", "/about"], ["FAQs", "/FAQ"],
  ["Sign in", "/signin"], ["Sign up", "/signup"],
];
const health = [
  ["Professional Guidelines", "/Professional"], ["Nutrition Programs", "/Nutrition"],
  ["Medical News", "/Medical_News"], ["Herbal Solutions", "/Herbal"], ["Mental Health", "/Mental"],
];
const wellness = [
  ["Sleep & Stress", "/Slep"], ["Healthy Recipes", "/Healthy"], ["Sports & Health", "/Sports"],
  ["Health Alerts", "/Health_Alerts"], ["Risk Assessments", "/Risk"], ["Health Quizzes", "/Health_Quizzes"],
];

export default function Sidebar() {
  const drawer = useRef(null);
  const { key } = useLocation();
  useEffect(() => { drawer.current.close(); }, [key]);

  function renderLinks(items) {
    return items.map(([name, route]) => <li key={route}><NavLink end to={route} onClick={() => drawer.current.close()}>{name}</NavLink></li>);
  }

  return (
    <>
      <button className="global-menu-toggle" type="button" aria-label="Open navigation menu" aria-haspopup="dialog" aria-controls="global-sidebar" onClick={() => drawer.current.showModal()}>
        <FiMenu aria-hidden="true" />
      </button>
      <dialog id="global-sidebar" className="global-sidebar" aria-label="Site navigation" ref={drawer} onClick={event => {
        if (event.target === event.currentTarget) drawer.current.close();
      }}>
        <nav aria-label="Site menu">
          <button className="global-menu-close" type="button" aria-label="Close navigation menu" onClick={() => drawer.current.close()}><FiX aria-hidden="true" /></button>
          <img src="/images/logo1.png" alt="PharmaClick" />
          <ul>{renderLinks(links)}</ul>
          <h2>Health</h2>
          <ul>{renderLinks(health)}</ul>
          <h2>Wellness</h2>
          <ul>{renderLinks(wellness)}</ul>
        </nav>
      </dialog>
      <Outlet />
    </>
  );
}
