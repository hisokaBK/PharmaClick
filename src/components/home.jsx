import "../css/home.css";
import WhyChooseUs from "./WhyChooseUs";
import "../css/Footer.css";
import Footer from "./Footer";
import HelpSection from "./HelpSection";
import PharmacyServices from "./forYou";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/LanguageProvider";

export default function Home() {
  const { t } = useI18n();
  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);
  const [show, setShow] = useState(false);

  return (
    <main>
      <div className="bcImg">
        <div
          className={`fade-in1 ${show ? "show" : ""}`}
          style={{ padding: "16px 20px " }}
        >
          <p id="pHome">{t("Welcome to our home")}</p>
          <h1 className="h1Home ">{t("Your health, our priority")}</h1>
        </div>

        <div id="div_home1">
          <div className={`  mb-3 fade-in ${show ? "show" : ""}`} id="id_home1">
            <div>
              <img loading="lazy" src="images/logo2.png" alt="" id="home_logo1" />
            </div>
            <p className="p_home2">
              <span style={{ fontFamily: "cursive" }}><span style={{fontSize:'24px'}}>P</span>harmaClick</span> {t("is a web platform for browsing, buying, and ordering medications with health tips and delivery options. It also shows whether a prescription is required for each medicine.")}
            </p>
          </div>

          <div className="row " id="row1">
            <div
              className={`col   me-2 fade-in ${show ? "show" : ""}`}
              id="id_home1"
            >
              <div>
                <img loading="lazy" src="images/login.png" alt="" id="home_logo2" />
              </div>
              <div>
                <p className="p_home2">
                  {t("Register now to benefit from all our services.")}
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Link to="/SignUp">
                    <button className="homeButton">{t("sign up now")}</button>
                  </Link>
                </div>
              </div>
            </div>

            <div
              className={`col   me-2 fade-in ${show ? "show" : ""}`}
              id="id_home1"
            >
              <div>
                <img loading="lazy" src="images/home1.jpg" alt="" id="home_logo3" />
              </div>
              <div>
                <p className="p_home2">
                  {t("You can discover all our different services here.")}
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Link to='/About' ><button className="homeButton">{t("Discover More")}</button></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ----------------WhyChooseUs------------------------------------------- */}
      <div>
        <WhyChooseUs />
      </div>
      {/* ---------------test2----------- */}
      <div>
        <PharmacyServices />
      </div>
      {/* ----------HelpSection--------------- */}
      <div>
        <HelpSection />
      </div>
      <div>
        <Footer />
      </div>
    </main>
  );
}
