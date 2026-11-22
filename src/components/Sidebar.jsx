import { useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { serviceGroups } from "./ServicesMenu";
import { useDemoAuth } from "./DemoAuth";
import { accountLinks } from "./AccountMenu";
import "../css/Sidebar.css";

const links = [
  ["Home", "/"], ["Browse Medicines", "/Medications"], ["All Products", "/Products"],
  ["Cart", "/Medications/Shop"], ["Dashboard", "/Dashboard"], ["Delivery Tracking", "/Delivery"],
  ["Contact", "/contact"], ["About", "/about"], ["FAQs", "/FAQ"],
  ["Supplements", "/Products/supplements"], ["Healthcare Cleaning Equipment", "/Products/cleaning"],
  ["Prescription Medicines", "/Products2/yes"],
];
// Keep every desktop Medications submenu destination reachable by touch in the drawer.
const medicationLinks = [
  ["All Medicines", "/Products2/No"], ["Multivitamins", "/Products/multivitamins"],
  ["Topical Products", "/Products/products_usf"],
];

export default function Sidebar() {
  const { user } = useDemoAuth();
  const drawer = useRef(null);
  const { key } = useLocation();
  useEffect(() => {
    if (drawer.current.open) drawer.current.close();
  }, [key]);

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
          <ul>{renderLinks([...links, ...(user ? accountLinks : [["Sign in", "/signin"], ["Sign up", "/signup"]])])}</ul>
          <h2>Medications</h2>
          <ul>{renderLinks(medicationLinks)}</ul>
          {serviceGroups.map(group => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              <ul>{renderLinks(group.links)}</ul>
            </section>
          ))}
        </nav>
      </dialog>
      <Outlet />
    </>
  );
}
