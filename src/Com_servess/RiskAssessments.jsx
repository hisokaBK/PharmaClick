import { useState } from "react";
import ServicePage from "./ServicePage";
import { ServicePhoto } from "./ServiceMedia";

const habits = [
  { id: "rest", question: "Were you able to set aside time to wind down most evenings?", idea: "Pick one evening and set aside a short period for an activity that helps you wind down." },
  { id: "movement", question: "Did your week include movement you found enjoyable?", idea: "Choose one activity you would enjoy and decide when and where you could try it." },
  { id: "connection", question: "Did you have time to connect with someone you trust?", idea: "Consider sending a message to someone you would like to catch up with." },
];

export default function RiskAssessments() {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);

  function submit(event) {
    event.preventDefault();
    setFeedback(habits.filter(habit => answers[habit.id] === "not-yet"));
  }

  return (
    <ServicePage layout="checkin" title="Risk Assessments" introduction="Reflect on a few everyday habits and choose one to make time for. This check-in is for education and does not estimate medical risk." image="/images/services/risk-assessments.jpg" imageAlt="A hand holding a pencil beside a simple notebook checklist">
      <div className="service-split">
        <section className="service-panel"><h2>Before you start</h2><p>Think about the last week. If your schedule was unusual, use the questions to notice what got in the way. Your selections stay on this page and reset when you leave.</p><a href="#wellness-check-in">Start the check-in</a></section>
        <ServicePhoto file="risk-planner" alt="A weekly planner and a glass of water" />
      </div>
      <form id="wellness-check-in" className="service-section" onSubmit={submit} onReset={() => { setAnswers({}); setFeedback(null); }}>
        <h2>Weekly wellness check-in</h2>
        <label className="d-block" htmlFor="wellness-progress">{Object.keys(answers).length} of {habits.length} answered</label>
        <progress id="wellness-progress" value={Object.keys(answers).length} max={habits.length} />
        {habits.map(habit => (
          <fieldset className="mb-3" key={habit.id}>
            <legend className="fs-6 fw-semibold">{habit.question}</legend>
            {[["yes", "Yes"], ["not-yet", "Not yet"]].map(([value, label]) => (
              <label key={value} className="me-3">
                <input type="radio" className="me-1" name={habit.id} value={value} required checked={answers[habit.id] === value} onChange={() => {
                  setAnswers(current => ({ ...current, [habit.id]: value }));
                  setFeedback(null);
                }} />
                {label}
              </label>
            ))}
          </fieldset>
        ))}
        <button className="btn btn-outline-success me-2" type="submit">See reflection ideas</button>
        <button className="btn btn-outline-dark" type="reset">Clear answers</button>
      </form>
      <div aria-live="polite">
        {feedback && <section className="service-section">
          <h2>Ideas for next week</h2>
          {feedback.length ? <ul>{feedback.map(habit => <li key={habit.id}>{habit.idea}</li>)}</ul> : <p>Think about which routine felt easiest to keep and what helped you make time for it.</p>}
        </section>}
      </div>
      <div className="service-split"><ServicePhoto file="risk-shoes" alt="Walking shoes and a notebook by the entrance of a home" /><section className="service-panel"><h2>Turn your reflection into a plan</h2><p>Pick one idea from your results. Write down when you will try it, where it will happen, and what might make it easier. Revisit the plan next week and adjust it if needed.</p></section></div>
    </ServicePage>
  );
}
