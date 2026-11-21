import ServicePage from "./ServicePage";

export default function HerbalSolutions() {
  return (
    <ServicePage title="Herbal Solutions" introduction="Learn how to read about botanicals, compare traditional uses with research, and ask informed questions about products." image="/images/services/herbal-solutions.jpg" imageAlt="Ginger root, mint leaves and chamomile blossoms">
      <section className="service-section">
        <h2>Recognize the plant and the preparation</h2>
        <p>Chamomile flowers are used in herbal teas, ginger root in cooking and infusions, and peppermint leaves in food and tea. Extracts, capsules and essential oils are different products. Read the plant name, part used and preparation on the label.</p>
      </section>
      <section className="service-section">
        <h2>Separate tradition from evidence</h2>
        <p>Records of traditional use tell us how people have used a plant. Evidence for a health benefit depends on human research for the specific preparation, purpose and population. Results from one extract may not apply to a tea or a different extract.</p>
        <a href="https://www.nccih.nih.gov/health/herbsataglance">Compare the evidence in NCCIH's botanical fact sheets</a>
      </section>
      <section className="service-section">
        <h2>Discuss safety before use</h2>
        <p>Botanical supplements can cause side effects or interact with medicines. Ask a pharmacist or clinician before taking a supplement, especially if you take medicines, are pregnant or breastfeeding, or are preparing for surgery. Bring the product label so they can see exactly what it contains.</p>
      </section>
    </ServicePage>
  );
}
