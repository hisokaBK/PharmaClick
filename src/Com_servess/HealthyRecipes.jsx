import { useState } from "react";
import ServicePage from "./ServicePage";
import { ServicePhoto, ServiceVideo } from "./ServiceMedia";
import { useI18n } from "../i18n/LanguageProvider";

const recipes = [
  {
    title: "Pear and yogurt oats", category: "Breakfast", time: "10 min", serves: 1,
    photo: "recipe-oats", alt: "Rolled oats with yogurt, diced pear and cinnamon",
    ingredients: ["40 g rolled oats", "120 g plain yogurt", "1 ripe pear", "A pinch of cinnamon"],
    steps: ["Stir the oats into the yogurt.", "Dice the pear and spoon it over the oats.", "Add the cinnamon. Loosen with a splash of milk or water if needed."],
  },
  {
    title: "Chickpea and cucumber salad", category: "Lunch", time: "15 min", serves: 2,
    photo: "recipe-chickpea", alt: "Chickpea, tomato and cucumber salad on a plate",
    ingredients: ["240 g cooked chickpeas, drained", "Half a cucumber", "2 tomatoes", "Juice of half a lemon", "1 tablespoon olive oil"],
    steps: ["Rinse the chickpeas and drain well.", "Dice the cucumber and tomatoes.", "Toss with the chickpeas, lemon juice and olive oil."],
  },
  {
    title: "White bean and vegetable soup", category: "Dinner", time: "30 min", serves: 2,
    photo: "recipe-soup", alt: "White bean and vegetable soup in a ceramic bowl",
    ingredients: ["240 g cooked white beans, drained", "1 carrot", "1 small onion", "500 ml vegetable stock", "1 handful of spinach", "1 teaspoon olive oil"],
    steps: ["Dice the onion and carrot. Soften the onion in the oil, then add the carrot.", "Add stock and beans and simmer until the carrot is tender.", "Stir in the spinach until wilted."],
  },
];

export default function HealthyRecipes() {
  const { t } = useI18n();
  const [category, setCategory] = useState("All meals");
  return (
    <ServicePage layout="kitchen" title={t("Healthy Recipes")} introduction={t("Find a simple breakfast, lunch or dinner using familiar ingredients. Adjust the quantities to the number of people you are feeding.")} image="/images/services/healthy-recipes.jpg" imageAlt={t("Bowls of oats, chickpea salad and vegetable soup")}>
      <nav className="service-jump" aria-label={t("Recipe guide")}><a href="#meal-category">{t("Filter recipes")}</a><a href="#recipe-substitutions">{t("Ingredient swaps")}</a></nav>
      <section className="service-section">
        <h2>{t("Find a recipe")}</h2>
        <label htmlFor="meal-category">{t("Meal")} </label>
        <select id="meal-category" value={category} onChange={event => setCategory(event.target.value)}>
          {["All meals", "Breakfast", "Lunch", "Dinner"].map((meal) => <option key={meal} value={meal}>{t(meal)}</option>)}
        </select>
      </section>
      <div className="service-grid">
        {recipes.filter(recipe => category === "All meals" || category === recipe.category).map(recipe => (
          <article className="service-section" key={recipe.title}>
            <ServicePhoto file={recipe.photo} alt={t(recipe.alt)} />
            <h2>{t(recipe.title)}</h2>
            <p>{t("{0} · {1} · Serves {2}", [t(recipe.category), t(recipe.time), recipe.serves])}</p>
            <details>
              <summary>{t("Ingredients and method")}</summary>
              <ul>{recipe.ingredients.map(ingredient => <li key={ingredient}>{t(ingredient)}</li>)}</ul>
              <ol>{recipe.steps.map(step => <li key={step}>{t(step)}</li>)}</ol>
            </details>
          </article>
        ))}
      </div>
      <div className="service-split" id="recipe-substitutions">
        <ServicePhoto file="recipe-prep" alt={t("Hands chopping cucumber beside a lemon and a bowl of chickpeas")} />
        <section className="service-panel">
        <h2>{t("Swap what you already have")}</h2>
        <dl className="mb-0"><dt>{t("Salad")}</dt><dd>{t("Try cooked white beans instead of chickpeas or fresh herbs instead of extra dressing.")}</dd><dt>{t("Soup")}</dt><dd>{t("Stir in chopped kale instead of spinach and cook until tender.")}</dd><dt>{t("Oats")}</dt><dd>{t("Use diced apple instead of pear. Check any yogurt or milk alternative for ingredients you avoid.")}</dd></dl>
        </section>
      </div>
      <ServiceVideo id="z7Bu-Fyg8rw" title={t("Chickpea Salad")} source="HappyHealthy · Mississippi State University Extension" resource="https://happyhealthy.extension.msstate.edu/recipes/chickpea-salad" />
    </ServicePage>
  );
}
