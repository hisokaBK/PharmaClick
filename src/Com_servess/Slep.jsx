import React from "react";
import "../css/Slep.css";
import Nav from "../components/header";
import Footer from "../components/Footer";
import { ServicePhoto, ServiceVideo } from "./ServiceMedia";
import "../css/Services.css";
import { useI18n } from "../i18n/LanguageProvider";
const Slep = () => {
  const { t } = useI18n();
  return (
    <div>
      <Nav />
      <main className="sleep-page">
      <section className="hero-container">
        <div className="hero-content">
          <h1 className="h1Home ">{t("Sleep & Stress")}</h1>
          <p className="hero-subtitle">{t("..Stress can drain your peace, your focus, and your well-being. But you deserve calm nights and refreshing sleep. Let nature help you relax, unwind, and sleep better — every night.")}</p>
        </div>
        <div className="hero-image-container">
          <img
            src="/images/slep.jpeg"
            alt={t("Illustration of a person sitting on a bed, with the words Sleep Deprivation and Stress")}
            className="hero-image"
          />
        </div>
      </section>
      <section id="sleep-stress-articles">
        <article className="sleep-article">
          <img src="/images/slep1.jpg" loading="lazy" decoding="async" alt={t("Bedtime habits")} />
          <h2>{t("Build a wind-down routine")}</h2>
          <p>{t("Use the hour before bed for a quieter activity, such as reading or taking a warm bath. Dim the lights if you can and choose a wind-down routine you can repeat.")}</p>
        </article>

        <article className="sleep-article">
          <img src="/images/slep2.jpg" loading="lazy" decoding="async" alt={t("Food and sleep")} />
          <h2>{t("Food and caffeine near bedtime")}</h2>
          <p>{t("Avoid a large meal close to bedtime if it makes you uncomfortable. Notice which caffeinated drinks or foods you have late in the day and consider trying them earlier.")}</p>
        </article>

        <article className="sleep-article">
          <img src="/images/slep3.jpg" loading="lazy" decoding="async" alt={t("Screens before bed")} />
          <h2>{t("Screens and bright light before bed")}</h2>
          <p>{t("Reduce bright light near bedtime. If it fits your routine, put the phone away and try a quiet activity without a screen.")}</p>
        </article>

        <article className="sleep-article">
          <img src="/images/slep4.webp" loading="lazy" decoding="async" alt={t("Stress and sleep")} />
          <h2>{t("Stress and sleep")}</h2>
          <p>{t("If thoughts about tomorrow keep you awake, try writing them down earlier in the evening. A quiet breathing exercise is another option if it feels comfortable.")}</p>
        </article>

        <article className="sleep-article">
          <img src="/images/slep5.jpg" loading="lazy" decoding="async" alt={t("Sleep quality")} />
          <h2>{t("Notice interruptions to your sleep")}</h2>
          <p>{t("If you often wake during the night, note when it happens and how you feel the next day. A short diary can help you describe the pattern if you speak with a clinician.")}</p>
        </article>

        <article className="sleep-article">
          <img src="/images/slep6.webp" loading="lazy" decoding="async" alt={t("Bedroom sanctuary")} />
          <h2>{t("Create a comfortable sleep environment")}</h2>
          <p>{t("Try making the room quiet, dark and comfortably cool. An eye mask or curtains may help if the room has too much light.")}</p>
        </article>
        <article className="sleep-article">
          <img src="/images/slep7.jpg" loading="lazy" decoding="async" alt={t("Exercise and sleep")} />
          <h2>{t("Making time for daytime activity")}</h2>
          <p>{t("Make time for physical activity during the day. If vigorous activity near bedtime makes it harder for you to wind down, try moving it earlier.")}</p>
        </article>

        <article className="sleep-article">
          <img src="/images/slep8.webp" loading="lazy" decoding="async" alt={t("Mindfulness meditation")} />
          <h2>{t("Using Mindfulness Meditation to Calm Your Mind Before Sleep")}</h2>
          <p>{t("Mindfulness can be a way to settle into a quieter activity before bed. Try following your breath gently or noticing how your body feels against the chair or bed.")}</p>
        </article>

        <article className="sleep-article">
          <img src="/images/slep9.webp" loading="lazy" decoding="async" alt={t("Avoiding caffeine")} />
          <h2>{t("The Impact of Caffeine on Your Sleep and How to Manage It")}</h2>
          <p>{t("Caffeine can affect sleep for several hours. Try moving coffee, tea or other caffeinated drinks earlier and observe whether the change helps.")}</p>
        </article>

        <article className="sleep-article">
          <img
            src="/images/slep10.webp" loading="lazy" decoding="async"
            alt={t("Creating a bedtime routine")}
          />
          <h2>{t("Creating a Consistent Bedtime Routine for Better Sleep")}</h2>
          <p>{t("If your schedule allows, try going to bed and getting up at roughly the same times. Keep the routine flexible enough to work around your everyday obligations.")}</p>
        </article>
      </section>
      <section className="service-content sleep-enrichment" aria-label={t("Sleep resources")}>
        <div className="service-split">
          <ServicePhoto file="sleep-diary" alt={t("A blank sleep diary and clock on a bedside table")} />
          <section className="service-panel">
            <h2>{t("Use a simple sleep diary")}</h2>
            <p>{t("For a few days, note bedtime, wake time, long periods awake and how rested you felt. Add relevant details such as a late caffeine drink or a change in schedule.")}</p>
            <a href="https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits">{t("Read NHLBI’s healthy sleep habits guide")}</a>
          </section>
        </div>
        <ServiceVideo id="zsaRRAk9a0E" title={t("Sleep Well for a Healthy Heart")} source="NHLBI" resource="https://www.nhlbi.nih.gov/health/sleep-deprivation/healthy-sleep-habits" />
        <section className="service-panel">
          <h2>{t("Frequently asked questions")}</h2>
          <details><summary>{t("What should I try first?")}</summary><p>{t("Pick one manageable change, such as a quieter wind-down or a more consistent wake time, and observe how it fits your routine.")}</p></details>
          <details><summary>{t("When should I ask for support?")}</summary><p>{t("If sleep problems keep recurring or disrupt your daytime activities, discuss them with a healthcare professional. Bring any notes about your sleep pattern.")}</p></details>
        </section>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default Slep;
