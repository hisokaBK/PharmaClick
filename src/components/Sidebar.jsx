import { Outlet, Link } from "react-router-dom";
import "../css/Sidebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {

  FaHome,
  FaInfoCircle,
  FaShieldAlt,
  FaSprayCan,
  FaCapsules,
  FaFilePrescription,
  FaTruck,
  FaPhone,
  FaQuestionCircle,
  FaCog,
  FaTachometerAlt 
} from "react-icons/fa";

import { useState } from "react";
import Nav from "./header";
import ScrollToTop from "./scrolToTop";
const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
       
      {/* -----hna sidebar open----- */}
      <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
       
        <div className="divButton">
          <button
            className="toggle-button"
            onClick={() => setIsSidebarOpen(false)}
          >
            ☰
          </button>
        </div>
       
        {isSidebarOpen && (
          <div id="divSisebar_open">
            {" "}
            <div>
              <img className="logo1" src="images/logo1.png" alt="" />

              <div
                style={{
                  color: "#04b077",
                  marginTop: "-32px",
                  width: "75%",
                  marginLeft: "20px",
                }}
              >
                <hr />
              </div>
              <div className="scrol">
                <div className="divScrol">
                  <div className="scrol">
                    <div className="sidebar-links">
                      <Link to="/" className="a_icons_Sidebar">
                        <li className="li_icons_Sidebar">
                          <FaHome className="icons_Sidebar" /> Home
                        </li>{" "}
                      </Link>

                      <Link to="/Medications" className="a_icons_Sidebar">
                     <li className="li_icons_Sidebar">
                  
                      <FaCapsules className="icons_Sidebar" /> Browse Medicines
                   
                  </li></Link>

                       <Link to="/contact" className=""><li className="li_icons_Sidebar">
                      
                       
                          <FaPhone className="icons_Sidebar" /> Contact
                       
                      </li> </Link>

                       <Link to="/about" className=""><li className="li_icons_Sidebar">
                       
                          <FaInfoCircle className="icons_Sidebar" /> About
                       
                      </li> </Link>

                       
                       <Link to="/Dashboard" className=""><li className="li_icons_Sidebar">
                       
                          <FaTachometerAlt className="icons_Sidebar" /> Dashboard
                       
                      </li> </Link>


                      <div
                        style={{
                          color: "#04b077",
                          width: "50%",
                          marginLeft: "40px",
                        }}
                      >
                        <hr />
                      </div>

                      <div className="scrol2">
                        <li className="li_icons_Sidebar">
                          <Link to="/Products/supplements" className="a_icons_Sidebar">
                            <FaShieldAlt className="icons_Sidebar" /> Protective
                            Tools and Supplies
                          </Link>
                        </li>
                        <li className="li_icons_Sidebar">
                          <Link to="/Products/cleaning" className="a_icons_Sidebar">
                            <FaSprayCan className="icons_Sidebar" /> Healthcare
                            Cleaning Equipment
                          </Link>
                        </li>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{ color: "#04b077", width: "50%", marginLeft: "40px" }}
                >
                  <hr />
                </div>

                <div className="sidebar-links" style={{ maxHeight: "100px" }}>
                  
                  <li className="li_icons_Sidebar">
                    <a href="#" className="a_icons_Sidebar">
                      <FaFilePrescription className="icons_Sidebar" /> Upload
                      Prescription
                    </a>
                  </li>
                  <li className="li_icons_Sidebar">
                    <Link to="/Delivery" className="a_icons_Sidebar">
                      <FaTruck className="icons_Sidebar" /> Delivery Tracking
                    </Link>
                  </li>

                  <div
                    style={{
                      color: "#04b077",
                      width: "50%",
                      marginLeft: "40px",
                    }}
                  >
                    <hr />
                  </div>

                  <li className="li_icons_Sidebar">
                    <Link
                      to="/FAQ"
                      className="d-flex align-items-center gap-2 mb-2"
                    >
                      <FaQuestionCircle className="icons_Sidebar" /> FAQs
                    </Link>
                  </li>
                  <li className="li_icons_Sidebar">
                    <a href="#" className="d-flex align-items-center gap-2">
                      <FaCog className="icons_Sidebar" /> Settings
                    </a>
                  </li>
                </div>
              </div>
            </div>
            <div className="divSisebar_open">
              <img
                className="logo3"
                src="./images/set_log6.jpg"
                alt=""
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* ----hna sidebar closed---- */}
      {!isSidebarOpen && (
        <div>
          <button
            className="floating-button"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
        </div>
      )}

     
      <ScrollToTop/><div
        className={`main-content ${
          isSidebarOpen ? "with-sidebar" : "full-width"
        }`}
      >
  {/*------------------hada nav import mn header ----------- */}
         
        <Nav isSidebarOpen={isSidebarOpen} />
  {/*------------------hada kansta3mlo bach ndir route wast Route  ----------- */}
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
