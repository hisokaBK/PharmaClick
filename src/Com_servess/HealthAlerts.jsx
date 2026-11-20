import ServicePage from "./ServicePage";

export default function HealthAlerts() {
  return (
    <ServicePage title="Health Alerts" introduction="Use these examples to learn where to check public health notices and what details to look for. This page displays educational categories only." image="/images/services/health-alerts.jpg" imageAlt="A desk with a phone, paper and pen for checking public health updates">
      <section className="service-section">
        <h2>Public health advisories</h2>
        <p>Check the organization that issued the notice, the area it covers and the groups it applies to. Read the original announcement for instructions and subsequent updates.</p>
        <a href="https://www.who.int/emergencies/disease-outbreak-news">Check WHO Disease Outbreak News</a>
      </section>
      <section className="service-section">
        <h2>Medicine and product notices</h2>
        <p>A recall or safety notice may identify a specific product, manufacturer, batch and country. Compare those details with the packaging, and follow the instructions from the authority that issued the notice. Ask a pharmacist if you are unsure which product you have.</p>
      </section>
      <section className="service-section">
        <h2>Food or environmental notices</h2>
        <p>Look for the exact product or location and the effective date. For action in your area, use the notice issued by the responsible local authority. Check that an announcement is still current before sharing it.</p>
      </section>
    </ServicePage>
  );
}
