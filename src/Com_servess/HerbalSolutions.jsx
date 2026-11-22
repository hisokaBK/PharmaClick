import ServicePage from "./ServicePage";
import { ServicePhoto } from "./ServiceMedia";
import { useI18n } from "../i18n/LanguageProvider";

export default function HerbalSolutions() {
  const { t } = useI18n();
  return (
    <ServicePage layout="botanical" title={t("Herbal Solutions")} introduction={t("Learn how to read about botanicals, compare traditional uses with research, and ask informed questions about products.")} image="/images/services/herbal-solutions.jpg" imageAlt={t("Ginger root, mint leaves and chamomile blossoms")}>
      <section aria-labelledby="botanical-library">
        <h2 id="botanical-library">{t("Botanical reference cards")}</h2>
        <div className="service-grid">
          <article className="service-panel">
            <ServicePhoto file="herbal-chamomile" alt={t("Dried chamomile flowers beside a cup of infusion")} />
            <h3 className="mt-3">{t("Chamomile")}</h3>
            <p>{t("Commonly prepared as an infusion. Research findings depend on the preparation and purpose. People allergic to related plants can be more likely to react.")}</p>
            <a href="https://www.nccih.nih.gov/health/chamomile">{t("Chamomile evidence and safety")}</a>
          </article>
          <article className="service-panel">
            <ServicePhoto file="herbal-ingredients" alt={t("Fresh mint leaves and sliced ginger in separate ceramic bowls")} />
            <h3 className="mt-3">{t("Peppermint and ginger")}</h3>
            <p>{t("Both are used as foods and in teas. Evidence from a specific capsule, oil or extract should be read in the context of that product.")}</p>
            <a href="https://www.nccih.nih.gov/health/peppermint-oil">{t("Read about peppermint oil")}</a>
          </article>
        </div>
      </section>
      <section className="service-section">
        <h2>{t("Recognize the plant and the preparation")}</h2>
        <p>{t("Chamomile flowers are used in herbal teas, ginger root in cooking and infusions, and peppermint leaves in food and tea. Extracts, capsules and essential oils are different products. Read the plant name, part used and preparation on the label.")}</p>
      </section>
      <section className="service-section">
        <h2>{t("Separate tradition from evidence")}</h2>
        <p>{t("Records of traditional use tell us how people have used a plant. Evidence for a health benefit depends on human research for the specific preparation, purpose and population. Results from one extract may not apply to a tea or a different extract.")}</p>
        <a href="https://www.nccih.nih.gov/health/herbsataglance">{t("Compare the evidence in NCCIH's botanical fact sheets")}</a>
      </section>
      <section className="service-section">
        <h2>{t("Discuss safety before use")}</h2>
        <p>{t("Botanical supplements can cause side effects or interact with medicines. Ask a pharmacist or clinician before taking a supplement, especially if you take medicines, are pregnant or breastfeeding, or are preparing for surgery. Bring the product label so they can see exactly what it contains.")}</p>
      </section>
      <section className="service-panel">
        <h2>{t("Read a supplement label with a pharmacist")}</h2>
        <ul><li>{t("Note the exact plant name and form, such as leaf, root, extract or essential oil.")}</li><li>{t("Look for the amount per serving and any other active ingredients.")}</li><li>{t("Bring the package or a clear photo if you have questions about interactions.")}</li></ul>
      </section>
    </ServicePage>
  );
}
