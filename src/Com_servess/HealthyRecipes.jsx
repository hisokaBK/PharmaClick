import { useState } from "react";
import ServicePage from "./ServicePage";

const recipes = [
  { title: "Pear and yogurt oats", category: "Breakfast", time: "10 min", ingredients: ["Rolled oats", "Plain yogurt", "Pear", "Cinnamon"], instructions: "Stir the oats into yogurt in a bowl. Dice the pear, spoon it on top and finish with cinnamon. Add a splash of milk or water if you prefer a looser texture." },
  { title: "Chickpea and cucumber salad", category: "Lunch", time: "15 min", ingredients: ["Cooked chickpeas", "Cucumber", "Tomatoes", "Lemon", "Olive oil"], instructions: "Drain the chickpeas and chop the cucumber and tomatoes. Toss with lemon juice and olive oil, then serve with bread if you like." },
  { title: "White bean and vegetable soup", category: "Dinner", time: "30 min", ingredients: ["Cooked white beans", "Carrot", "Onion", "Vegetable stock", "Spinach"], instructions: "Dice and soften the onion and carrot in a saucepan. Add stock and beans and simmer until the carrot is tender. Stir in the spinach until wilted." },
];

export default function HealthyRecipes() {
  const [category, setCategory] = useState("All meals");
  return (
    <ServicePage title="Healthy Recipes" introduction="Find a simple breakfast, lunch or dinner using familiar ingredients. Adjust the quantities to the number of people you are feeding." image="/images/services/healthy-recipes.jpg" imageAlt="Bowls of oats, chickpea salad and vegetable soup">
      <section className="service-section">
        <h2>Find a recipe</h2>
        <label htmlFor="meal-category">Meal </label>
        <select id="meal-category" value={category} onChange={event => setCategory(event.target.value)}>
          <option>All meals</option><option>Breakfast</option><option>Lunch</option><option>Dinner</option>
        </select>
      </section>
      {recipes.filter(recipe => category === "All meals" || category === recipe.category).map(recipe => (
        <article className="service-section" key={recipe.title}>
          <h2>{recipe.title}</h2>
          <p>{recipe.category} · {recipe.time}</p>
          <details>
            <summary>Ingredients and method</summary>
            <ul>{recipe.ingredients.map(ingredient => <li key={ingredient}>{ingredient}</li>)}</ul>
            <p>{recipe.instructions}</p>
          </details>
        </article>
      ))}
    </ServicePage>
  );
}
