import { useState } from "react";
import ServicePage from "./ServicePage";

const articles = [
  { category: "Research", title: "What does a clinical trial compare?", summary: "Learn why the comparison group matters when reading a study.", detail: "Read how participants were assigned, what the comparison group received, and which outcome the researchers planned to measure. Check who participated and how long the study lasted before applying its findings to other groups." },
  { category: "Public health", title: "How to read a public health announcement", summary: "Find the issuing authority, location and guidance in an announcement.", detail: "Open the original publication and look for the affected area, the groups the guidance applies to and any action requested. Check for revisions before sharing a copy or screenshot." },
  { category: "Research", title: "What a headline leaves out", summary: "Read beyond the headline to understand the evidence.", detail: "Find the original study, check whether it observed an association or tested an intervention, and read how the authors describe uncertainty and limitations." },
];

export default function MedicalNews() {
  const [category, setCategory] = useState("All topics");

  return (
    <ServicePage title="Medical News" introduction="Explore sample articles about reading medical research and public health announcements. These are educational examples, not a current news feed." image="/images/services/medical-news.jpg" imageAlt="A clinician reviewing charts at a research desk">
      <section className="service-section">
        <h2>Browse sample articles</h2>
        <label htmlFor="news-category">Topic </label>
        <select id="news-category" value={category} onChange={event => setCategory(event.target.value)}>
          <option>All topics</option><option>Research</option><option>Public health</option>
        </select>
      </section>
      {articles.filter(article => category === "All topics" || category === article.category).map(article => (
        <article className="service-section" key={article.title}>
          <p>{article.category}</p>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
          <details>
            <summary>Read example</summary>
            <p>{article.detail}</p>
          </details>
        </article>
      ))}
    </ServicePage>
  );
}

