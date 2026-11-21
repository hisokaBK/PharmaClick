import { useState } from "react";
import ServicePage from "./ServicePage";
import { ServicePhoto } from "./ServiceMedia";

const questions = [
  { id: "notice", prompt: "What should you check before sharing a health notice?", choices: ["How many times it was shared", "Its issuing authority, location and latest update", "Whether the headline is short"], correct: 1, explanation: "The original authority, location and update help establish whether the notice is relevant and current." },
  { id: "visit", prompt: "What can help you prepare for a healthcare appointment?", choices: ["A list of your questions and medicines", "A list of unrelated news stories", "Only the name of your clinic"], correct: 0, explanation: "A written list makes it easier to cover your questions and review the medicines you take." },
  { id: "botanicals", prompt: "What does a traditional use tell you about an herb?", choices: ["Exactly how much to take", "That it works for everyone", "How people have used it over time"], correct: 2, explanation: "Traditional use records describe past practices. Research is needed to evaluate specific benefits and risks." },
];

export default function HealthQuizzes() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = questions.filter(question => answers[question.id] === question.correct).length;

  function restart() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <ServicePage layout="quiz" title="Health Quizzes" introduction="Check what you know about preparing for healthcare visits and reading health information. Each answer comes with a short explanation." image="/images/services/health-quizzes.jpg" imageAlt="An open notebook, pencil and green study cards">
      <section className="service-split"><ServicePhoto file="quiz-revision" alt="Flashcards and pencils arranged for a review session" /><section className="service-panel"><h2>How the quiz works</h2><p>Choose one answer per question. After submitting, compare your choices with the explanations, then restart to practise again.</p><a href="#health-information-quiz">Go to the quiz</a></section></section>
      <form id="health-information-quiz" className="service-section" onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
        <h2>Everyday health information quiz</h2>
        <label className="d-block" htmlFor="quiz-progress">{Object.keys(answers).length} of {questions.length} answered</label>
        <progress id="quiz-progress" value={Object.keys(answers).length} max={questions.length} />
        {questions.map(question => (
          <fieldset className="mb-3" key={question.id} disabled={submitted}>
            <legend className="fs-6 fw-semibold">{question.prompt}</legend>
            {question.choices.map((choice, index) => (
              <label key={choice} className="d-block mb-1">
                <input className="me-2" type="radio" name={question.id} required checked={answers[question.id] === index} onChange={() => setAnswers(current => ({ ...current, [question.id]: index }))} />
                {choice}
              </label>
            ))}
          </fieldset>
        ))}
        {!submitted && <button className="btn btn-outline-success" type="submit">Check answers</button>}
      </form>
      <div aria-live="polite">
        {submitted && <section className="service-section">
          <h2>Score {score} out of {questions.length}</h2>
          <ol>{questions.map(question => <li key={question.id}><span className="d-block">{answers[question.id] === question.correct ? "Correct" : "Review this answer"}</span><strong>{question.choices[question.correct]}.</strong> {question.explanation}</li>)}</ol>
          <button className="btn btn-outline-success" type="button" onClick={restart}>Restart quiz</button>
        </section>}
      </div>
      <div className="service-split"><section className="service-panel"><h2>Keep learning after the quiz</h2><p>Use the answer explanations as prompts for checking claims. For an example, compare a headline with the organization?s original announcement and read what action it actually requests.</p><a href="/Medical_News">Explore the Medical News explainers</a></section><ServicePhoto file="quiz-review" alt="Hands sorting study cards into two stacks" /></div>
    </ServicePage>
  );
}
