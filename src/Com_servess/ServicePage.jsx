import Nav from "../components/header";
import Footer from "../components/Footer";
import "../css/Slep.css";
import "../css/Services.css";

export default function ServicePage({ title, introduction, image, imageAlt, children }) {
  return (
    <>
      <Nav />
      <main className="service-page">
        <section className="hero-container" aria-labelledby="service-title">
          <div className="hero-content">
            <h1 id="service-title" className="h1Home">{title}</h1>
            <p className="hero-subtitle">{introduction}</p>
          </div>
          <div className="hero-image-container">
            <img className="hero-image" src={image} alt={imageAlt} />
          </div>
        </section>
        <div className="service-content">{children}</div>
      </main>
      <Footer />
    </>
  );
}
