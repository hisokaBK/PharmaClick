import { useState } from "react";
import ServicePage from "./ServicePage";
import { ServicePhoto } from "./ServiceMedia";
import { useI18n } from "../i18n/LanguageProvider";

const articles = [
  { category: "Research", title: "What does a clinical trial compare?", summary: "Learn why the comparison group matters when reading a study.", detail: "Read how participants were assigned, what the comparison group received, and which outcome the researchers planned to measure. Check who participated and how long the study lasted before applying its findings to other groups." },
  { category: "Public health", title: "How to read a public health announcement", summary: "Find the issuing authority, location and guidance in an announcement.", detail: "Open the original publication and look for the affected area, the groups the guidance applies to and any action requested. Check for revisions before sharing a copy or screenshot." },
  { category: "Research", title: "What a headline leaves out", summary: "Read beyond the headline to understand the evidence.", detail: "Find the original study, check whether it observed an association or tested an intervention, and read how the authors describe uncertainty and limitations." },
];

export default function MedicalNews() {
  const { t } = useI18n();
  const [category, setCategory] = useState("All topics");

  return (
    <ServicePage layout="magazine" title={t("Medical News")} introduction={t("Explore sample articles about reading medical research and public health announcements. These are educational examples, not a current news feed.")} image="/images/services/medical-news.jpg" imageAlt={t("A clinician reviewing charts at a research desk")}>
      <section className="service-split" aria-labelledby="featured-reading">
        <ServicePhoto file="news-research" alt={t("A researcher reviewing a chart on a clipboard")} />
        <div className="service-panel">
          <h2 id="featured-reading">{t("Featured explainer: From study to headline")}</h2>
          <p>{t("Start with the original research question, then look at the comparison, the people studied and the uncertainty around the finding.")}</p>
          <a href="#news-category">{t("Browse the demonstration articles")}</a>
        </div>
      </section>
      <section className="service-section">
        <h2>{t("Browse sample articles")}</h2>
        <label htmlFor="news-category">{t("Topic")} </label>
        <select id="news-category" value={category} onChange={event => setCategory(event.target.value)}>
          {["All topics", "Research", "Public health"].map((topic) => <option key={topic} value={topic}>{t(topic)}</option>)}
        </select>
      </section>
      <div className="service-grid">
        {articles.filter(article => category === "All topics" || category === article.category).map(article => (
          <article className="service-section" key={article.title}>
            <p>{t(article.category)}</p>
            <h2>{t(article.title)}</h2>
            <p>{t(article.summary)}</p>
            <details>
              <summary>{t("Read example")}</summary>
              <p>{t(article.detail)}</p>
            </details>
          </article>
        ))}
      </div>
      <div className="service-split">
        <section className="service-panel">
          <h2>{t("Verify before sharing")}</h2>
          <details><summary>{t("How can I tell who published the information?")}</summary><p>{t("Look for the named authors or organization, when the information was reviewed, and links to original sources.")}</p></details>
          <details><summary>{t("What if two articles sound contradictory?")}</summary><p>{t("Compare the people studied, the outcomes measured and the time frame. They may be answering different questions.")}</p></details>
          <a href="https://www.fda.gov/drugs/quick-tips-buying-medicines-over-internet/health-information-web">{t("FDA guide to online health information")}</a>
        </section>
        <ServicePhoto file="news-sources" alt={t("A reader comparing printed resources in a library")} />
      </div>
    </ServicePage>
  );
}

