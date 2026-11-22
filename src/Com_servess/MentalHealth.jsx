import ServicePage from "./ServicePage";
import { ServicePhoto, ServiceVideo } from "./ServiceMedia";
import { useI18n } from "../i18n/LanguageProvider";

export default function MentalHealth() {
  const { t } = useI18n();
  return (
    <ServicePage layout="quiet" title={t("Mental Health")} introduction={t("Make space to check in with yourself, stay connected and find the right support when everyday life feels harder.")} image="/images/services/mental-health.jpg" imageAlt={t("A person writing in a journal beside a sunny window")}>
      <section className="service-split">
        <div className="service-panel">
          <h2>{t("Make the next conversation easier")}</h2>
          <p>{t("A short, specific request can be easier to make. Let someone you trust know whether you would like a listening ear, a check-in later or practical help.")}</p>
          <details><summary>{t("See an example of what to say")}</summary><p>{t("“This week has felt harder than usual. Could we take a short walk together or talk this evening?”")}</p></details>
        </div>
        <ServicePhoto file="mental-connection" alt={t("Two adults talking on a park bench")} />
      </section>
      <section className="service-section">
        <h2>{t("Notice what has changed")}</h2>
        <p>{t("Take a quiet moment to notice how sleep, energy, concentration and daily routines have been going. Write down what feels harder and what has helped you get through the day.")}</p>
      </section>
      <section className="service-section">
        <h2>{t("Choose one manageable action")}</h2>
        <p>{t("Pick one activity you can reasonably make time for, such as a short walk, a regular bedtime routine or talking to someone you trust. If asking feels hard, try naming one practical thing that would help today.")}</p>
      </section>
      <section className="service-section">
        <h2>{t("Finding support")}</h2>
        <p>{t("If distress is persistent, worsening or making daily life difficult, consider talking with a healthcare professional. You can bring a note about what you have noticed and ask about available support. This page offers general education.")}</p>
        <a href="https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health">{t("Explore NIMH's mental health resources")}</a>
      </section>
      <section className="service-split">
        <ServicePhoto file="mental-rest" alt={t("A quiet reading chair and open book near a window")} />
        <div className="service-panel">
          <h2>{t("Try a brief pause")}</h2>
          <p>{t("Get comfortable. Notice how the chair or the floor supports you. If it feels comfortable, let your breathing settle gently without forcing it.")}</p>
          <a href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/">{t("Read the NHS breathing exercise")}</a>
        </div>
      </section>
      <ServiceVideo id="wfDTp2GogaQ" title={t("Mindful Breathing Exercise")} source="Every Mind Matters" resource="https://www.berkshirehealthcare.nhs.uk/breathingcanreducestress" />
    </ServicePage>
  );
}
