import {
  FaFacebookF,
  FaGithub,
  FaGoogle,
  FaMicrosoft,
  FaHome,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../css/SignUp.css";
import ScrolToTop from "./scrolToTop";

export default function SignUp() {
  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "9px",
        }}
      >
        <ScrolToTop />
        <div>
          {" "}
          <Link to="/" id="linkUp">
            <FaHome />{" "}
            <span style={{ fontFamily: "cursive", fontSize: "large" }}>
              home
            </span>
          </Link>
        </div>
        <div>
          <img src="images/set_log1.jpg" alt="" style={{ height: "30px" }} />
          <span style={{ fontFamily: "cursive" }}><span style={{fontSize:'24px'}}>P</span>harmaClick</span>
        </div>
      </nav>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ color: "green", width: "80%" }}>
          <hr />
        </div>
      </div>

      {/* Scope compact form spacing to this route without changing the desktop form. */}
      <section className="sign-up-layout d-flex align-items-center justify-content-center">
        <div className="container-fluid px-4 py-5 px-md-5 text-center text-lg-start">
          <div
            className="row gx-4 align-items-center justify-content-center"
            style={{
              backgroundColor: "rgba(224, 224, 224, 0.11)",
              padding: "10px",
            }}
          >
            <div
              className="col-12 col-lg-6 mb-4 mb-lg-0"
              style={{ zIndex: 10, padding: "6px" }}
            >
              <h1
                className="my-5 display-5 fw-bold ls-tight"
                style={{ color: "hsla(111, 55.00%, 76.50%, 0.43)" }}
                id="h1First"
              >
                Your health, our priority <br />
                <span
                  style={{
                    color: "hsl(124, 44.80%, 46.90%) ",
                    fontFamily: "cursive",
                  }}
                >
                  Your trusted pharmacy partner
                </span>
              </h1>
              <p
                className="mb-4 opacity-70"
                style={{ color: "hsl(119, 100.00%, 21.80%)" }}
              >
                Discover fast delivery, expert advice, and a wide range of
                medications tailored for your needs.
              </p>
            </div>

            <div className="col-12 col-lg-6 position-relative">
              <div className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "15px",
                  }}
                >
                  <div>
                    <img
                      src="/images/set_log4.jpg"
                      alt="Company"
                      loading="lazy"
                      style={{ height: "120px", marginLeft: "-20px" }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginLeft: "-3px",
                  }}
                >
                  <p className="P_form">Create an account</p>
                </div>
                <div className="card-body px-4 py-5 px-md-5">
                  <form>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="form-group form-outline">
                          <input
                            type="text"
                            id="form3Example1"
                            className="form-control"
                            placeholder=" "
                          />
                          <label className="form-label" htmlFor="form3Example1">
                            First name
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="form-group form-outline">
                          <input
                            type="text"
                            id="form3Example2"
                            className="form-control"
                            placeholder=" "
                          />
                          <label className="form-label" htmlFor="form3Example2">
                            Last name
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-group form-outline mb-4">
                      <input
                        type="email"
                        id="form3Example3"
                        className="form-control"
                        placeholder=" "
                      />
                      <label className="form-label" htmlFor="form3Example3">
                        Email address
                      </label>
                    </div>

                    <div className="form-group  mb-4">
                      <input
                        type="password"
                        id="form3Example4"
                        className="form-control"
                        placeholder=" "
                      />
                      <label className="form-label" htmlFor="form3Example4">
                        Password
                      </label>
                    </div>

                    <div className="form-check d-flex justify-content-center mb-4">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id="form2Example33"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="form2Example33"
                      >
                        Subscribe to our newsletter
                      </label>
                    </div>

                    <div className="divSubmit">
                      <button type="submit" className="btn1">
                        Sign up
                      </button>
                    </div>

                    <div className="text-center">
                      <p>or sign up with:</p>
                      <button type="button" className="btn2">
                        <FaFacebookF size={24} title="Facebook" />
                      </button>
                      <button type="button" className="btn2">
                        <FaGithub size={24} title="GitHub" />
                      </button>
                      <button type="button" className="btn2">
                        <FaGoogle size={24} title="Google" />
                      </button>
                      <button type="button" className="btn2">
                        <FaMicrosoft size={24} title="Microsoft" />
                      </button>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      Already have an account?{" "}
                      <Link to="/SignIn" style={{ color: "green" }}>
                        Sign in
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
