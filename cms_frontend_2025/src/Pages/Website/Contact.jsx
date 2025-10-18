import React from "react";
import logo from "../../Images/WhatsApp Image 2025-10-17 at 15.16.02.jpeg";

const Contact = () => {
  return (
    <>
      <main>
        <div className="contact-container">
          <section className="contact-form">
            <h2>Send Us a Message</h2>
            <form>
              <label htmlFor="fname">First Name:</label>
              <input type="text" id="fname" name="firstname" required />

              <label htmlFor="lname">Last Name:</label>
              <input type="text" id="lname" name="lastname" required />

              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required />

              <label htmlFor="phone">Phone Number:</label>
              <input type="tel" id="phone" name="phone" required />

              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                required
              ></textarea>

              <button type="submit">Submit</button>
            </form>
          </section>

          <section className="hospital-address">
            <h3>Healthis Hospital Address</h3>
            <p>
              <i className="fas fa-map-marker-alt"></i> Building Number: 92, Kumer Street, 73, Rosey Nagar, Trivandrum
              <br />
              <i className="fas fa-phone"></i> Phone: +91 8837230058
              <br />
              <i className="fas fa-envelope"></i> Email: healthis@gmail.com
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Contact;
