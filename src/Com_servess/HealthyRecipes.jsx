import { useState } from "react";
import ServicePage from "./ServicePage";
import { ServicePhoto } from "./ServiceMedia";

const recipes = [
  { title: "Pear and yogurt oats", category: "Breakfast", time: "10 min", ingredients: ["Rolled oats", "Plain yogurt", "Pear", "Cinnamon"], instructions: "Stir the oats into yogurt in a bowl. Dice the pear, spoon it on top and finish with cinnamon. Add a splash of milk or water if you prefer a looser texture." },
  { title: "Chickpea and cucumber salad", category: "Lunch", time: "15 min", ingredients: ["Cooked chickpeas", "Cucumber", "Tomatoes", "Lemon", "Olive oil"], instructions: "Drain the chickpeas and chop the cucumber and tomatoes. Toss with lemon juice and olive oil, then serve with bread if you like." },
  { title: "White bean and vegetable soup", category: "Dinner", time: "30 min", ingredients: ["Cooked white beans", "Carrot", "Onion", "Vegetable stock", "Spinach"], instructions: "Dice and soften the onion and carrot in a saucepan. Add stock and beans and simmer until the carrot is tender. Stir in the spinach until wilted." },
];

export default function HealthyRecipes() {
  const [category, setCategory] = useState("All meals");
  return (
    <ServicePage layout="kitchen" title="Healthy Recipes" introduction="Find a simple breakfast, lunch or dinner using familiar ingredients. Adjust the quantities to the number of people you are feeding." image="/images/services/healthy-recipes.jpg" imageAlt="Bowls of oats, chickpea salad and vegetable soup">
      <nav className="service-jump" aria-label="Recipe guide"><a href="#meal-category">Filter recipes</a><a href="#recipe-substitutions">Ingredient swaps</a></nav>
      <section className="service-section">
        <h2>Find a recipe</h2>
        <label htmlFor="meal-category">Meal </label>
        <select id="meal-category" value={category} onChange={event => setCategory(event.target.value)}>
          <option>All meals</option><option>Breakfast</option><option>Lunch</option><option>Dinner</option>
        </select>
      </section>
      <div className="service-grid">
        {recipes.filter(recipe => category === "All meals" || category === recipe.category).map(recipe => (
          <article className="service-section" key={recipe.title}>
            {recipe.category === "Lunch" && <ServicePhoto file="recipe-chickpea" alt="Chickpea, tomato and cucumber salad on a plate" />}
            {recipe.category === "Dinner" && <ServicePhoto file="recipe-soup" alt="White bean and vegetable soup in a ceramic bowl" />}
            <h2>{recipe.title}</h2>
            <p>{recipe.category} · {recipe.time}</p>
            <details>
              <summary>Ingredients and method</summary>
              <ul>{recipe.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
              <p>{recipe.instructions}</p>
            </details>
          </article>
        ))}
      </div>
      <section className="service-panel" id="recipe-substitutions">
        <h2>Swap what you already have</h2>
        <dl className="mb-0"><dt>Salad</dt><dd>Try cooked white beans instead of chickpeas or fresh herbs instead of extra dressing.</dd><dt>Soup</dt><dd>Stir in chopped kale instead of spinach and cook until tender.</dd><dt>Oats</dt><dd>Use diced apple instead of pear. Check any yogurt or milk alternative for ingredients you avoid.</dd></dl>
      </section>
    </ServicePage>
  );
}
