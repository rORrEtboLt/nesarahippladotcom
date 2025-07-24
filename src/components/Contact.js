import React from 'react';

function Contact() {
  return (
    <section className="contact">
      <h2>Contact Nesara</h2>
      <form>
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Message
          <textarea rows="4" name="message" required />
        </label>
        <button type="submit">Send</button>
      </form>
      <div className="social-links">
        <a href="https://instagram.com/nesarahippla" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </section>
  );
}

export default Contact;
