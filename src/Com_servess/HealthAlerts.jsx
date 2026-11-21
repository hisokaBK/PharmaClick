import ServicePage from "./ServicePage";
import { ServicePhoto } from "./ServiceMedia";

export default function HealthAlerts() {
  return (
    <ServicePage layout="notice" title="Health Alerts" introduction="Use these examples to learn where to check public health notices and what details to look for. This page displays educational categories only." image="/images/services/health-alerts.jpg" imageAlt="A desk with a phone, paper and pen for checking public health updates">
      <section className="service-panel"><h2>Check the notice before acting</h2><ol><li>Go to the issuing authority?s website and locate the original notice.</li><li>Check the location, product or group affected and the date it applies.</li><li>Read what action is requested and check for later updates.</li></ol></section>
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
      <div className="service-grid">
        <article className="service-panel"><ServicePhoto file="alerts-packaging" alt="A person checking the markings on a product box" /><h2 className="mt-3">Example: match the details</h2><p>A notice about a particular lot may not apply to another package of the same product. Compare the full batch identifier before deciding whether the notice applies.</p></article>
        <article className="service-panel"><ServicePhoto file="alerts-notices" alt="A person looking at a community notice board" /><h2 className="mt-3">Example: check the location</h2><p>A public health notice can be specific to one district. Check the issuing jurisdiction and use your local authority?s instructions.</p></article>
      </div>
    </ServicePage>
  );
}
