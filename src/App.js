import "./App.css";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Nav from "./components/header";
import Home from "./components/home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignI";
import ScrollToTop from "./components/scrolToTop"; // Corrected spelling
import Contact from "./components/Contact";
import About from "./components/About";
import Medications from "./Com_Medications/Medications";
import Products from "./Com_Medications/Products";
import ProduitFilter from "./Com_Medications/produitFilter";
import Produit_by_needed_prescription from "./Com_Medications/Produit_by_needed_prescription";
import { Provider } from "react-redux";
import { legacy_createStore } from "redux";
import reducer from "./store/reducer";
import Cart from "./Com_Medications/Cart";
import Produit from "./Com_Medications/Preduit";
import FAQ from "./components/FAQ ";
import TrackingPage from "./Com_Medications/Delivery";
import Dashboard from "./Com_Medications/Dashboard";
import Slep from "./Com_servess/Slep";
import Working from "./Com_servess/test1";

const App = () => {
        const store=legacy_createStore(reducer)

  return (
  <Provider store={store}>
    <BrowserRouter>
   
      <ScrollToTop />
      
      <Routes>
        <Route element={<Sidebar />}>
          <Route element={<><Nav /><Outlet /></>}>
            <Route index element={<Home />} />
            <Route path="tact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/Delivery" element={<TrackingPage />} />
          </Route>
          <Route path="/Medications" element={<Medications />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Products/:category" element={<ProduitFilter />} />
          <Route path="/Products2/:need" element={<Produit_by_needed_prescription />} />
          <Route path="/Medications/Shop" element={<Cart />} />
          <Route path="/Produit/:idP" element={<Produit />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Slep" element={<Slep />} />
          <Route path="/Healthy" element={<Working />} />
          <Route path="/Professional" element={<Working />} />
          <Route path="/Nutrition" element={<Working />} />
          <Route path="/Medical_News" element={<Working />} />
          <Route path="/Herbal" element={<Working />} />
          <Route path="/Mental" element={<Working />} />
          <Route path="/Sports" element={<Working />} />
          <Route path="/Risk" element={<Working />} />
          <Route path="/Health_Alerts" element={<Working />} />
          <Route path="/Health_Quizzes" element={<Working />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  </Provider>
  );
};

export default App;