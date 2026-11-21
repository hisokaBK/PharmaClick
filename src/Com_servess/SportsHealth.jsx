import ServicePage from "./ServicePage";
import { ServicePhoto, ServiceVideo } from "./ServiceMedia";

export default function SportsHealth() {
  return (
    <ServicePage layout="movement" title="Sports & Health" introduction="Explore ways to move that fit your abilities, schedule and preferences. Choose an activity you can return to regularly." image="/images/services/sports-health.jpg" imageAlt="Two adults walking together on a park path">
      <div className="service-grid">
        <article className="service-panel"><ServicePhoto file="sports-walking" alt="An adult tying sports shoes on a park bench" /><h2 className="mt-3">For an active break</h2><p>Choose a short, familiar route and a pace you can comfortably maintain. Consider when the route will be quiet and well lit.</p></article>
        <article className="service-panel"><ServicePhoto file="sports-mobility" alt="An adult using a chair for support during a mobility exercise" /><h2 className="mt-3">For a seated option</h2><p>Look for movements you can adapt to a stable chair. A qualified instructor or physiotherapist can help tailor exercises when you need an adaptation.</p></article>
      </div>
      <section className="service-section">
        <h2>Everyday movement</h2>
        <p>Try a comfortable walk, cycling, dancing or another activity you enjoy. Pick a route or setting you feel comfortable using and decide when it fits into your week.</p>
      </section>
      <section className="service-section">
        <h2>Strength and mobility</h2>
        <p>Explore everyday movements such as standing from a chair or reaching through a comfortable range. A qualified instructor can help adapt activities to your ability or available equipment.</p>
      </section>
      <section className="service-section">
        <h2>Build a routine you can repeat</h2>
        <p>Start with a manageable amount of movement and build gradually. Leave time to rest and adjust to how you feel. If you have a health condition, injury or uncertainty about safe activity, discuss suitable options with a healthcare professional.</p>
        <a href="https://www.who.int/news-room/fact-sheets/detail/physical-activity">Explore WHO's physical activity guidance</a>
      </section>
      <ServiceVideo id="EJgZygWBKaE" title="Chair-Based Exercises" source="Oxford University Hospitals NHS Foundation Trust" resource="https://www.ouh.nhs.uk/patient-guide/leaflets/files/85296exercises.pdf" />
    </ServicePage>
  );
}
