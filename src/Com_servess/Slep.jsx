import React from "react";
import "../css/Slep.css";
import Nav from "../components/header";
import Footer from "../components/Footer";
const Slep = () => {
  return (
    <div>
      <Nav />
      <section className="hero-container">
        <div className="hero-content">
          <h1 className="h1Home ">Sleep & Stress</h1>
          <p className="hero-subtitle">
            ..Stress can drain your peace, your focus, and your well-being. But
            you deserve calm nights and refreshing sleep. Let nature help you
            relax, unwind, and sleep better — every night.
          </p>
        </div>
        <div className="hero-image-container">
          <img
            src="/images/Slep.jpeg"
            alt="Modern apartment interior"
            className="hero-image"
          />
        </div>
      </section>
      <section id="sleep-stress-articles">
        <article class="sleep-article">
          <img src="/images/slep1.jpg" alt="Bedtime habits image" />
          <h2>7 Bedtime Habits That Help You Sleep Like a Baby</h2>
          <p>
            Simple rituals—such as putting your phone away an hour before bed,
            taking a warm shower, sipping a soothing herbal tea, and dimming the
            lights—prime your brain to wind down naturally and drift off faster.
          </p>
        </article>

        <article class="sleep-article">
          <img src="/images/slep2.jpg" alt="Food and sleep image" />
          <h2>What to Eat for Better Sleep: Food Choices That Matter</h2>
          <p>
            Nutrition has a direct impact on sleep quality. Discover which foods
            (like bananas, almonds, and yogurt) boost melatonin and magnesium,
            and why late-night caffeine, sugar, or heavy meals can sabotage
            restorative rest.
          </p>
        </article>

        <article class="sleep-article">
          <img src="/images/slep3.jpg" alt="Screens before bed image" />
          <h2>Screens Before Bed: The Silent Sleep Killer</h2>
          <p>
            Blue light from phones, tablets, and TVs tricks your brain into
            thinking it’s still daytime. Learn how reducing screen time—or using
            night-shift filters—can shorten the time it takes to fall asleep and
            improve REM cycles.
          </p>
        </article>

        <article class="sleep-article">
          <img src="/images/slep4.webp" alt="Stress and sleep image" />
          <h2>The Hidden Link Between Stress and Poor Sleep</h2>
          <p>
            Chronic stress keeps cortisol levels high long after sunset,
            preventing deep sleep. This piece explains relaxation
            techniques—like diaphragmatic breathing and mindfulness— that calm
            the nervous system before bed.
          </p>
        </article>

        <article class="sleep-article">
          <img src="/images/slep5.jpg" alt="Sleep quality image" />
          <h2>Why Quantity Isn’t Quality: How Fragmented Sleep Exhausts You</h2>
          <p>
            Logging eight hours doesn’t guarantee you’ll wake refreshed.
            Discover how interruptions, light pollution, and alcohol disrupt
            sleep architecture, and get actionable tips to protect your
            deep-sleep stages.
          </p>
        </article>

        <article class="sleep-article">
          <img src="/images/slep6.webp" alt="Bedroom sanctuary image" />
          <h2>Transform Your Bedroom into a Sleep Sanctuary</h2>
          <p>
            Temperature, lighting, and even wall colors influence how quickly
            you fall asleep. Follow these design tweaks—cooler air, blackout
            curtains, calming hues—to create a space your body associates
            exclusively with rest.
          </p>
        </article>
        <article class="sleep-article">
          <img src="/images/slep7.jpg" alt="Exercise and sleep image" />
          <h2>How Regular Exercise Improves Your Sleep Quality</h2>
          <p>
            Engaging in moderate physical activity during the day helps regulate
            your sleep cycle, reduces anxiety, and promotes deeper, more
            restorative sleep—just avoid intense workouts close to bedtime.
          </p>
        </article>

        <article class="sleep-article">
          <img src="/images/slep8.webp" alt="Mindfulness meditation image" />
          <h2>Using Mindfulness Meditation to Calm Your Mind Before Sleep</h2>
          <p>
            Practicing mindfulness meditation can lower stress hormones and
            quiet racing thoughts, making it easier to relax and fall asleep
            faster. Even a few minutes nightly can make a difference.
          </p>
        </article>

        <article class="sleep-article">
          <img src="/images/slep9.webp" alt="Avoiding caffeine image" />
          <h2>The Impact of Caffeine on Your Sleep and How to Manage It</h2>
          <p>
            Caffeine can stay in your system for hours, disrupting your ability
            to fall asleep. Learn how to time your coffee intake to avoid
            interference with your natural sleep rhythm.
          </p>
        </article>

        <article class="sleep-article">
          <img
            src="/images/slep10.webp"
            alt="Creating a bedtime routine image"
          />
          <h2>Creating a Consistent Bedtime Routine for Better Sleep</h2>
          <p>
            Establishing a regular schedule and relaxing pre-sleep rituals
            trains your body to expect sleep at certain times, improving both
            the quality and duration of your rest.
          </p>
        </article>
      </section>
      <Footer />
    </div>
  );
};

export default Slep;
