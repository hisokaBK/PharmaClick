import ServicePage from "./ServicePage";
import { ServicePhoto, ServiceVideo } from "./ServiceMedia";

export default function NutritionPrograms() {
  return (
    <ServicePage layout="market"
      title="Nutrition Programs"
      introduction="Build a varied menu around foods you enjoy and can find locally. Start with a few flexible meal ideas and adapt them to your budget and routine."
      image="/images/services/nutrition-programs.jpg"
      imageAlt="A plate of vegetables, grains and chickpeas beside fruit and yogurt"
    >
      <section className="service-split">
        <section className="service-panel">
          <h2>Build a balanced meal from what you have</h2>
          <p>Start with a grain or other staple, add vegetables or fruit, and choose a protein food you enjoy. Mix and match across the week rather than trying to put every food group on each plate.</p>
          <details><summary>Example using pantry foods</summary><p>Combine brown rice, canned beans and frozen vegetables. Add lemon and herbs for flavour. Compare sodium levels when choosing canned or prepared ingredients.</p></details>
        </section>
        <ServicePhoto file="market-ingredients" alt="Fresh vegetables, dry lentils and whole grains on a worktop" caption="Start with foods that are easy to find and prepare." />
      </section>
      <section className="service-section">
        <h2>Choose a variety of foods</h2>
        <ul className="service-grid nutrition-food-groups">
          <li><strong>Vegetables and fruit.</strong> Try a mix of seasonal produce, and keep frozen options for busy days.</li>
          <li><strong>Whole grains.</strong> Oats, whole-wheat bread and brown rice make useful bases for meals.</li>
          <li><strong>Protein foods.</strong> Rotate lentils, chickpeas, eggs, fish or other foods that suit your preferences.</li>
          <li><strong>Fats and drinks.</strong> Use olive oil, nuts or seeds for flavour, and make water easy to reach.</li>
        </ul>
      </section>
      <section className="service-section">
        <h2>Plan two meals before shopping</h2>
        <p>Try oats with plain yogurt and fruit for breakfast, then chickpeas, chopped vegetables and whole-wheat bread for lunch. Make extra grains or legumes so you can combine them with different vegetables the next day.</p>
      </section>
      <section className="service-section">
        <h2>Explore more meal ideas</h2>
        <p>Use these ideas for general education. A registered dietitian can help you adapt meals to allergies, dietary restrictions or medical needs.</p>
        <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet">Read the WHO healthy diet guide</a>
      </section>
      <div className="service-split">
        <ServicePhoto file="meal-prep" alt="Glass containers filled with grains and roasted vegetables" />
        <section className="service-panel">
          <h2>Make a flexible shopping list</h2>
          <ol><li>Check what you already have in the fridge and pantry.</li><li>Choose two meals that share a staple ingredient.</li><li>Add seasonal produce or plain frozen alternatives.</li></ol>
          <p>Choose foods that fit your budget, preferences and any dietary guidance you follow.</p>
        </section>
      </div>
      <ServiceVideo id="EBBQ03vkHnM" title="Add More Fruits and Vegetables" source="HappyHealthy · Mississippi State University Extension" resource="https://happyhealthy.extension.msstate.edu/tips-videos/add-more-fruits-and-vegetables-your-day" />
    </ServicePage>
  );
}
