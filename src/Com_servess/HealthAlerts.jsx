import ServicePage from "./ServicePage";
import { ServicePhoto } from "./ServiceMedia";
import { useI18n } from "../i18n/LanguageProvider";

export default function HealthAlerts() {
  const { t } = useI18n();
  return (
    <ServicePage layout="notice" title={t("Health Alerts")} introduction={t("Use these examples to learn where to check public health notices and what details to look for. This page displays educational categories only.")} image="/images/services/health-alerts.jpg" imageAlt={t("A desk with a phone, paper and pen for checking public health updates")}>
      <section className="service-panel"><h2>{t("Check the notice before acting")}</h2><ol><li>{t("Go to the issuing authority’s website and locate the original notice.")}</li><li>{t("Check the location, product or group affected and the date it applies.")}</li><li>{t("Read what action is requested and check for later updates.")}</li></ol></section>
      <section className="service-section">
        <h2>{t("Public health advisories")}</h2>
        <p>{t("Check the organization that issued the notice, the area it covers and the groups it applies to. Read the original announcement for instructions and subsequent updates.")}</p>
        <a href="https://www.who.int/emergencies/disease-outbreak-news">{t("Check WHO Disease Outbreak News")}</a>
      </section>
      <section className="service-section">
        <h2>{t("Medicine and product notices")}</h2>
        <p>{t("A recall or safety notice may identify a specific product, manufacturer, batch and country. Compare those details with the packaging, and follow the instructions from the authority that issued the notice. Ask a pharmacist if you are unsure which product you have.")}</p>
      </section>
      <section className="service-section">
        <h2>{t("Food or environmental notices")}</h2>
        <p>{t("Look for the exact product or location and the effective date. For action in your area, use the notice issued by the responsible local authority. Check that an announcement is still current before sharing it.")}</p>
      </section>
      <div className="service-grid">
        <article className="service-panel"><ServicePhoto file="alerts-packaging" alt={t("A person checking the markings on a product box")} /><h2 className="mt-3">{t("Example: match the details")}</h2><p>{t("A notice about a particular lot may not apply to another package of the same product. Compare the full batch identifier before deciding whether the notice applies.")}</p></article>
        <article className="service-panel"><ServicePhoto file="alerts-notices" alt={t("A person looking at a community notice board")} /><h2 className="mt-3">{t("Example: check the location")}</h2><p>{t("A public health notice can be specific to one district. Check the issuing jurisdiction and use your local authority’s instructions.")}</p></article>
      </div>
    </ServicePage>
  );
}
