import { ServicePhoto, ServiceVideo } from "./ServiceMedia";
import ServicePage from "./ServicePage";
import { useI18n } from "../i18n/LanguageProvider";

export default function ProfessionalGuidelines() {
  const { t } = useI18n();
  return (
    <ServicePage
      title={t("Professional Guidelines")}
      layout="editorial"
      introduction={t("Prepare for a healthcare visit, ask clearer questions and keep track of what you learn. This guide is for general education. A healthcare professional can advise you on your individual situation.")}
      image="/images/services/professional-guidelines.jpg"
      imageAlt={t("A healthcare professional listening to a patient with a notebook")}
    >
      <nav className="service-jump" aria-label={t("Appointment guide")}>
        <a href="#visit-checklist">{t("Preparation checklist")}</a>
        <a href="#follow-up">{t("Follow-up")}</a>
        <a href="#visit-questions">{t("Common questions")}</a>
      </nav>
      <div className="service-split" id="visit-checklist">
        <ServicePhoto file="professional-preparation" alt={t("A notebook, glasses and medicine box on a consultation desk")} />
        <section className="service-panel">
          <h2>{t("What to bring")}</h2>
          <p>{t("Use this checklist while getting ready for your visit. Selections are temporary.")}</p>
          <ul className="list-unstyled mb-0">
            {["Questions in order of importance", "Medicine and supplement list", "Relevant previous results or visit summaries"].map(item => (
              <li key={item}><label><input className="me-2" type="checkbox" />{t(item)}</label></li>
            ))}
          </ul>
        </section>
      </div>
      <section className="service-section">
        <h2>{t("Before your appointment")}</h2>
        <p>{t("Write down the questions you most want to cover. If you have a concern, note when it started, what has changed and how it affects your routine. Bring a list of the medicines and supplements you take and note any known allergies.")}</p>
        <a href="https://www.ahrq.gov/questions/question-builder/online.html">{t("Prepare a question list with AHRQ")}</a>
      </section>
      <section className="service-section">
        <h2>{t("During the conversation")}</h2>
        <ul>
          <li>{t("Ask what the next step is and why your care team recommends it.")}</li>
          <li>{t("If anything is unclear, ask for an explanation in everyday language. Repeat the plan back in your own words to check your understanding.")}</li>
          <li>{t("Ask who to contact with questions and when to expect results or follow-up.")}</li>
        </ul>
      </section>
      <section className="service-section" id="follow-up">
        <h2>{t("At home")}</h2>
        <p>{t("Keep your visit summary and follow-up details together. If instructions seem unclear or differ from what you remember, check with the clinic or pharmacist before making changes.")}</p>
        <a href="https://www.ahrq.gov/questions/be-engaged/index.html">{t("Read AHRQ's guide to taking part in your care")}</a>
      </section>
      <ServiceVideo id="vxQ-dyohppY" title={t("Waiting Room Video: Questions Are the Answer")} source="AHRQ Patient Safety" resource="https://www.ahrq.gov/questions/videos/waiting-room.html" />
      <div className="service-split" id="visit-questions">
        <section className="service-panel">
          <h2>{t("Common questions")}</h2>
          <details><summary>{t("What if I forget what was said?")}</summary><p>{t("Ask for written instructions or a visit summary. Use the clinic contact you were given to clarify the next step.")}</p></details>
          <details><summary>{t("What if I use several pharmacies?")}</summary><p>{t("Bring one list that includes medicines from each pharmacy, along with over-the-counter products and supplements.")}</p></details>
        </section>
        <ServicePhoto file="professional-pharmacy" alt={t("A pharmacist and a customer reviewing a medicine container together")} />
      </div>
    </ServicePage>
  );
}
