import {
  FaFacebookF,
  FaGithub,
  FaGoogle,
  FaMicrosoft,
  FaHome,
} from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../css/SignUp.css";
import ScrolToTop from "./scrolToTop";
import { useFeedback } from "./Feedback";
import { useDemoAuth } from "./DemoAuth";
import useDemoForm from "./useDemoForm";
import { createDemoAccount } from "../store/demoAccounts";

export default function SignUp() {
  const { notify } = useFeedback();
  const { user } = useDemoAuth();
  const navigate = useNavigate();
  const { pending, onSubmit } = useDemoForm(async (fields) => {
    await createDemoAccount(fields);
    notify("success", "Demo account created. You can now sign in.");
    navigate("/signin", { replace: true, state: { registeredEmail: fields.email.trim() } });
  });
  const showSocialNotice = () => notify("info", "Social sign-up is unavailable in this demo.");
  if (user) return <Navigate to="/profile" replace />;

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
          {/* Resolve this public asset from the hosting root on direct route loads. */}
          <img src="/images/set_log1.jpg" alt="" style={{ height: "30px" }} />
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
                  <form
                    onInvalid={() => notify("warning", "Complete the required fields and check your email address.")}
                    onSubmit={onSubmit}
                    aria-busy={pending}
                  >
                    <div className="form-group form-outline mb-4">
                      <input type="text" name="name" id="register-name" className="form-control"
                        autoComplete="name" maxLength={100} placeholder=" " required />
                      <label className="form-label" htmlFor="register-name">Full name</label>
                    </div>

                    <div className="form-group form-outline mb-4">
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
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
                        name="password"
                        maxLength={128}
                        autoComplete="new-password"
                        aria-describedby="demo-password-hint"
                        required
                        id="form3Example4"
                        className="form-control"
                        placeholder=" "
                      />
                      <label className="form-label" htmlFor="form3Example4">
                        Password
                      </label>
                    </div>

                    <p className="demo-password-hint" id="demo-password-hint">Use 8 to 128 characters.</p>
                    <div className="form-group mb-4">
                      <input type="password" name="confirmation" id="register-confirmation"
                        className="form-control" autoComplete="new-password" maxLength={128} placeholder=" " required />
                      <label className="form-label" htmlFor="register-confirmation">Confirm password</label>
                    </div>

                    <div className="divSubmit">
                      <button type="submit" className="btn1" disabled={pending}>
                        {pending ? "Creating account…" : "Sign up"}
                      </button>
                    </div>

                    <div className="text-center">
                      <p>or sign up with:</p>
                      <button type="button" className="btn2" onClick={showSocialNotice}>
                        <FaFacebookF size={24} title="Facebook" />
                      </button>
                      <button type="button" className="btn2" onClick={showSocialNotice}>
                        <FaGithub size={24} title="GitHub" />
                      </button>
                      <button type="button" className="btn2" onClick={showSocialNotice}>
                        <FaGoogle size={24} title="Google" />
                      </button>
                      <button type="button" className="btn2" onClick={showSocialNotice}>
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
                  <p className="demo-auth-note">Demo accounts stay in this browser. Use a password unique to this demo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
