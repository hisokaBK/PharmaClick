import ServicePage from "./ServicePage";

export default function MentalHealth() {
  return (
    <ServicePage title="Mental Health" introduction="Make space to check in with yourself, stay connected and find the right support when everyday life feels harder." image="/images/services/mental-health.jpg" imageAlt="A person writing in a journal beside a sunny window">
      <section className="service-section">
        <h2>Notice what has changed</h2>
        <p>Take a quiet moment to notice how sleep, energy, concentration and daily routines have been going. Write down what feels harder and what has helped you get through the day.</p>
      </section>
      <section className="service-section">
        <h2>Choose one manageable action</h2>
        <p>Pick one activity you can reasonably make time for, such as a short walk, a regular bedtime routine or talking to someone you trust. If asking feels hard, try naming one practical thing that would help today.</p>
      </section>
      <section className="service-section">
        <h2>Finding support</h2>
        <p>If distress is persistent, worsening or making daily life difficult, consider talking with a healthcare professional. You can bring a note about what you have noticed and ask about available support. This page offers general education.</p>
        <a href="https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health">Explore NIMH's mental health resources</a>
      </section>
    </ServicePage>
  );
}
