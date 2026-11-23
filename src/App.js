import "./App.css";
import { useState } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Nav from "./components/header";
import Home from "./components/home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignI";
import ForgotPassword from "./components/ForgotPassword";
import ScrollToTop from "./components/scrolToTop"; // Corrected spelling
import Contact from "./components/Contact";
import About from "./components/About";
import Medications from "./Com_Medications/Medications";
import Products from "./Com_Medications/Products";
import ProduitFilter from "./Com_Medications/produitFilter";
import ProductsByPrescription from "./Com_Medications/Produit_by_needed_prescription";
import { Provider } from "react-redux";
import { legacy_createStore } from "redux";
import reducer from "./store/reducer";
import Cart from "./Com_Medications/Cart";
import Checkout from "./checkout/Checkout";
import OrderInvoice from "./checkout/OrderInvoice";
import GuestOrderHistory from "./checkout/OrderHistory";
import Footer from "./components/Footer";
import Produit from "./Com_Medications/Preduit";
import FAQ from "./components/FAQ ";
import TrackingPage from "./Com_Medications/Delivery";
import Dashboard from "./Com_Medications/Dashboard";
import Slep from "./Com_servess/Slep";
import ProfessionalGuidelines from "./Com_servess/ProfessionalGuidelines";
import NutritionPrograms from "./Com_servess/NutritionPrograms";
import MedicalNews from "./Com_servess/MedicalNews";
import HerbalSolutions from "./Com_servess/HerbalSolutions";
import MentalHealth from "./Com_servess/MentalHealth";
import HealthyRecipes from "./Com_servess/HealthyRecipes";
import SportsHealth from "./Com_servess/SportsHealth";
import HealthAlerts from "./Com_servess/HealthAlerts";
import RiskAssessments from "./Com_servess/RiskAssessments";
import HealthQuizzes from "./Com_servess/HealthQuizzes";
import FeedbackProvider from "./components/Feedback";
import DemoAuthProvider, { RequireDemoAccount } from "./components/DemoAuth";
import Profile from "./components/Profile";
import LanguageProvider from "./i18n/LanguageProvider";

const App = () => {
  const [store] = useState(() => legacy_createStore(reducer));

  return (
  <Provider store={store}>
    <BrowserRouter>
      <LanguageProvider>
      <FeedbackProvider>
      <DemoAuthProvider>
   
      <ScrollToTop />
      
      <Routes>
        <Route element={<Sidebar />}>
          <Route element={<><Nav /><Outlet /></>}>
            <Route index element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/Delivery" element={<TrackingPage />} />
            <Route path="/profile" element={<RequireDemoAccount><Profile /></RequireDemoAccount>} />
            <Route path="/checkout" element={<><Checkout /><Footer /></>} />
            <Route path="/checkout/invoice/:reference" element={<><OrderInvoice /><Footer /></>} />
            <Route path="/checkout/orders" element={<><GuestOrderHistory /><Footer /></>} />
          </Route>
          <Route path="/Medications" element={<Medications />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Products/:category" element={<ProduitFilter />} />
          <Route path="/Products2/:need" element={<ProductsByPrescription />} />
          <Route path="/Medications/Shop" element={<Cart />} />
          <Route path="/Produit/:idP" element={<Produit />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Slep" element={<Slep />} />
          <Route path="/Healthy" element={<HealthyRecipes />} />
          <Route path="/Professional" element={<ProfessionalGuidelines />} />
          <Route path="/Nutrition" element={<NutritionPrograms />} />
          <Route path="/Medical_News" element={<MedicalNews />} />
          <Route path="/Herbal" element={<HerbalSolutions />} />
          <Route path="/Mental" element={<MentalHealth />} />
          <Route path="/Sports" element={<SportsHealth />} />
          <Route path="/Risk" element={<RiskAssessments />} />
          <Route path="/Health_Alerts" element={<HealthAlerts />} />
          <Route path="/Health_Quizzes" element={<HealthQuizzes />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      </DemoAuthProvider>
      </FeedbackProvider>
      </LanguageProvider>
    </BrowserRouter>
  </Provider>
  );
};

export default App;
