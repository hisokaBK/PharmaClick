import ServicePage from "./ServicePage";

export default function NutritionPrograms() {
  return (
    <ServicePage
      title="Nutrition Programs"
      introduction="Build a varied menu around foods you enjoy and can find locally. Start with a few flexible meal ideas and adapt them to your budget and routine."
      image="/images/services/nutrition-programs.jpg"
      imageAlt="A plate of vegetables, grains and chickpeas beside fruit and yogurt"
    >
      <section className="service-section">
        <h2>Choose a variety of foods</h2>
        <ul>
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
    </ServicePage>
  );
}
