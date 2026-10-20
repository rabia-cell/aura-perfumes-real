function About() {
  return (
    <main className="about-page">

      {/* BLOCK 1 - HERO */}
      <section className="about-hero">
        <p className="about-label">THE STORY OF AURA</p>

        <h1>More Than a Fragrance</h1>

        <p>
          At Aura Perfumes, we believe every fragrance tells a story.
          Discover scents created to reflect your personality,
          inspire confidence, and make every moment memorable.
        </p>
<div className="about-hero-perfumes">
</div>
<div className="about-floral-art" aria-hidden="true">
  <span className="floral-ring floral-ring-one"></span>
  <span className="floral-ring floral-ring-two"></span>
  <span className="floral-flower">✿</span>
  <span className="floral-leaf floral-leaf-one">❧</span>
  <span className="floral-leaf floral-leaf-two">❧</span>
  <span className="floral-sparkle floral-sparkle-one">✦</span>
  <span className="floral-sparkle floral-sparkle-two">✧</span>
</div>
</section>

      {/* BLOCK 2 - STORY & MISSION */}
      <section className="about-story-mission">

        {/* Our Story */}
        <div className="about-info-card about-story-card">
          <div className="about-info-text">
            <span className="about-card-icon">✧</span>
            <p className="about-label">OUR STORY</p>

            <h2>Every Scent Has a Story</h2>

            <p>
              Aura Perfumes was created with a simple idea:
              fragrance should be more than something you wear.
              It should express who you are.
            </p>

            <p>
              From warm and elegant notes to fresh everyday scents,
              our collection brings together fragrances for
              different moods, moments, and personalities.
            </p>
          </div>

          <div className="about-story-image"></div>
        </div>

        {/* Our Mission */}
        <div className="about-info-card about-mission-card">
          <div className="about-info-text">
            <span className="about-card-icon">◎</span>
            <p className="about-label">OUR MISSION</p>

            <h2>Fragrance That Feels Like You</h2>

            <p>
              Our mission is to help you discover fragrances
              that match your style, mood, and personality.
              We believe the right scent can bring confidence,
              create memories, and make everyday moments special.
            </p>
          </div>

          <div className="about-mission-image"></div>
        </div>

      </section>

      {/* BLOCK 3 - WHY CHOOSE AURA */}
      <section className="about-why">
        <p className="about-label">WHY CHOOSE AURA</p>
        <h2>Fragrances for Every You</h2>

        <div className="about-why-grid">
          <div className="about-why-card">
            <span>✧</span>
            <h3>Signature Scents</h3>
            <p>A collection of unique and elegant fragrances.</p>
          </div>

          <div className="about-why-card">
            <span>◇</span>
            <h3>Personal Expression</h3>
            <p>Find a scent that reflects your personality.</p>
          </div>

          <div className="about-why-card">
            <span>❀</span>
            <h3>Memorable Moments</h3>
            <p>Fragrances that become part of your story.</p>
          </div>
        </div>
      </section>

    </main>
  )
}

export default About
