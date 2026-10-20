function Contact() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="contact-label">CONTACT AURA</p>
        <h1>Get in Touch</h1>
        <p>
          Have a question about our fragrances or your order?
          We'd love to hear from you.
        </p>
      </section>

      <section className="contact-section">
        <div className="contact-info">
          <p className="contact-label">LET'S CONNECT</p>
          <h2>We’re Here to Help</h2>
          <p>
            Whether you need help choosing a fragrance
            or have a question about your order,
            send us a message.
          </p>
        </div>

        <div className="contact-form-card">
          <h2>Send Us a Message</h2>

          <form>
            <label htmlFor="contact-name">Full Name</label>
            <input
              id="contact-name"
              type="text"
              placeholder="Enter your name"
              required
            />

            <label htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              type="email"
              placeholder="Enter your email"
              required
            />

            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="How can we help?"
              required
            />

            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows="5"
              placeholder="Write your message..."
              required
            />

            <button type="submit">Send Message →</button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Contact
