import ServicePage from "./ServicePage";

export default function ProfessionalGuidelines() {
  return (
    <ServicePage
      title="Professional Guidelines"
      introduction="Prepare for a healthcare visit, ask clearer questions and keep track of what you learn. This guide is for general education. A healthcare professional can advise you on your individual situation."
      image="/images/services/professional-guidelines.jpg"
      imageAlt="A healthcare professional listening to a patient with a notebook"
    >
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
      <section className="service-section">
        <h2>At home</h2>
        <p>Keep your visit summary and follow-up details together. If instructions seem unclear or differ from what you remember, check with the clinic or pharmacist before making changes.</p>
        <a href="https://www.ahrq.gov/questions/be-engaged/index.html">Read AHRQ's guide to taking part in your care</a>
      </section>
    </ServicePage>
  );
}
