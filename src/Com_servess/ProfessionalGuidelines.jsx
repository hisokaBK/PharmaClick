import { ServicePhoto, ServiceVideo } from "./ServiceMedia";
import ServicePage from "./ServicePage";

export default function ProfessionalGuidelines() {
  return (
    <ServicePage
      title="Professional Guidelines"
      layout="editorial"
      introduction="Prepare for a healthcare visit, ask clearer questions and keep track of what you learn. This guide is for general education. A healthcare professional can advise you on your individual situation."
      image="/images/services/professional-guidelines.jpg"
      imageAlt="A healthcare professional listening to a patient with a notebook"
    >
      <nav className="service-jump" aria-label="Appointment guide">
        <a href="#visit-checklist">Preparation checklist</a>
        <a href="#follow-up">Follow-up</a>
        <a href="#visit-questions">Common questions</a>
      </nav>
      <div className="service-split" id="visit-checklist">
        <ServicePhoto file="professional-preparation" alt="A notebook, glasses and medicine box on a consultation desk" />
        <section className="service-panel">
          <h2>What to bring</h2>
          <p>Use this checklist while getting ready for your visit. Selections are temporary.</p>
          <ul className="list-unstyled mb-0">
            {["Questions in order of importance", "Medicine and supplement list", "Relevant previous results or visit summaries"].map(item => (
              <li key={item}><label><input className="me-2" type="checkbox" />{item}</label></li>
            ))}
          </ul>
        </section>
      </div>
      <section className="service-section">
        <h2>Before your appointment</h2>
        <p>Write down the questions you most want to cover. If you have a concern, note when it started, what has changed and how it affects your routine. Bring a list of the medicines and supplements you take and note any known allergies.</p>
        <a href="https://www.ahrq.gov/questions/question-builder/online.html">Prepare a question list with AHRQ</a>
      </section>
      <section className="service-section">
        <h2>During the conversation</h2>
        <ul>
          <li>Ask what the next step is and why your care team recommends it.</li>
          <li>If anything is unclear, ask for an explanation in everyday language. Repeat the plan back in your own words to check your understanding.</li>
          <li>Ask who to contact with questions and when to expect results or follow-up.</li>
        </ul>
      </section>
      <section className="service-section" id="follow-up">
        <h2>At home</h2>
        <p>Keep your visit summary and follow-up details together. If instructions seem unclear or differ from what you remember, check with the clinic or pharmacist before making changes.</p>
        <a href="https://www.ahrq.gov/questions/be-engaged/index.html">Read AHRQ's guide to taking part in your care</a>
      </section>
      <ServiceVideo id="vxQ-dyohppY" title="Waiting Room Video: Questions Are the Answer" source="AHRQ Patient Safety" resource="https://www.ahrq.gov/questions/videos/waiting-room.html" />
      <div className="service-split" id="visit-questions">
        <section className="service-panel">
          <h2>Common questions</h2>
          <details><summary>What if I forget what was said?</summary><p>Ask for written instructions or a visit summary. Use the clinic contact you were given to clarify the next step.</p></details>
          <details><summary>What if I use several pharmacies?</summary><p>Bring one list that includes medicines from each pharmacy, along with over-the-counter products and supplements.</p></details>
        </section>
        <ServicePhoto file="professional-pharmacy" alt="A pharmacist and a customer reviewing a medicine container together" />
      </div>
    </ServicePage>
  );
}
