import ServicePage from "./ServicePage";
import { ServicePhoto, ServiceVideo } from "./ServiceMedia";
import { useI18n } from "../i18n/LanguageProvider";

export default function NutritionPrograms() {
  const { t } = useI18n();
  return (
    <ServicePage layout="market"
      title={t("Nutrition Programs")}
      introduction={t("Build a varied menu around foods you enjoy and can find locally. Start with a few flexible meal ideas and adapt them to your budget and routine.")}
      image="/images/services/nutrition-programs.jpg"
      imageAlt={t("A plate of vegetables, grains and chickpeas beside fruit and yogurt")}
    >
      <section className="service-split">
        <section className="service-panel">
          <h2>{t("Build a balanced meal from what you have")}</h2>
          <p>{t("Start with a grain or other staple, add vegetables or fruit, and choose a protein food you enjoy. Mix and match across the week rather than trying to put every food group on each plate.")}</p>
          <details><summary>{t("Example using pantry foods")}</summary><p>{t("Combine brown rice, canned beans and frozen vegetables. Add lemon and herbs for flavour. Compare sodium levels when choosing canned or prepared ingredients.")}</p></details>
        </section>
        <ServicePhoto file="market-ingredients" alt={t("Fresh vegetables, dry lentils and whole grains on a worktop")} caption="Start with foods that are easy to find and prepare." />
      </section>
      <section className="service-section">
        <h2>{t("Choose a variety of foods")}</h2>
        <ul className="service-grid nutrition-food-groups">
          <li><strong>{t("Vegetables and fruit.")}</strong>{t("Try a mix of seasonal produce, and keep frozen options for busy days.")}</li>
          <li><strong>{t("Whole grains.")}</strong>{t("Oats, whole-wheat bread and brown rice make useful bases for meals.")}</li>
          <li><strong>{t("Protein foods.")}</strong>{t("Rotate lentils, chickpeas, eggs, fish or other foods that suit your preferences.")}</li>
          <li><strong>{t("Fats and drinks.")}</strong>{t("Use olive oil, nuts or seeds for flavour, and make water easy to reach.")}</li>
        </ul>
      </section>
      <section className="service-section">
        <h2>{t("Plan two meals before shopping")}</h2>
        <p>{t("Try oats with plain yogurt and fruit for breakfast, then chickpeas, chopped vegetables and whole-wheat bread for lunch. Make extra grains or legumes so you can combine them with different vegetables the next day.")}</p>
      </section>
      <section className="service-section">
        <h2>{t("Explore more meal ideas")}</h2>
        <p>{t("Use these ideas for general education. A registered dietitian can help you adapt meals to allergies, dietary restrictions or medical needs.")}</p>
        <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet">{t("Read the WHO healthy diet guide")}</a>
      </section>
      <div className="service-split">
        <ServicePhoto file="meal-prep" alt={t("Glass containers filled with grains and roasted vegetables")} />
        <section className="service-panel">
          <h2>{t("Make a flexible shopping list")}</h2>
          <ol><li>{t("Check what you already have in the fridge and pantry.")}</li><li>{t("Choose two meals that share a staple ingredient.")}</li><li>{t("Add seasonal produce or plain frozen alternatives.")}</li></ol>
          <p>{t("Choose foods that fit your budget, preferences and any dietary guidance you follow.")}</p>
        </section>
      </div>
      <ServiceVideo id="EBBQ03vkHnM" title={t("Add More Fruits and Vegetables")} source="HappyHealthy · Mississippi State University Extension" resource="https://happyhealthy.extension.msstate.edu/tips-videos/add-more-fruits-and-vegetables-your-day" />
    </ServicePage>
  );
}
