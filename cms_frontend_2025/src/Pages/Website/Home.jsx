import React from "react";
// import "./Home.css";
import general from "../../Images/general.jfif";
import pediatrics from "../../Images/pediatrics.jfif";
import cardio from "../../Images/cardio.jfif";
import lab from "../../Images/lab.jfif";

const Home = () => {
  return (
    <>
      <section id="hero">
        <h2>Welcome to Healthis</h2>
        <p>Your health, our priority.</p>
      </section>

      <section id="services">
        <h3>Our Services</h3>
        <ul>
          <li>
            <img src={general} alt="General Checkup" />
            General Checkup
          </li>
          <li>
            <img src={pediatrics} alt="Pediatrics" />
            Pediatrics
          </li>
          <li>
            <img src={cardio} alt="Cardiology" />
            Cardiology
          </li>
          <li>
            <img src={lab} alt="Pharmacy & Lab" />
            Pharmacy & Lab
          </li>
        </ul>
      </section>

      <section id="testimonials">
        <h3>What Our Patients Say</h3>
        <blockquote>
          "Healthis gave me a second life. Truly caring staff and
          state-of-the-art facilities!" – Ananya K.
        </blockquote>
        <blockquote>
          "My family trusts Healthis completely. They're like our extended
          family now." – Ramesh M.
        </blockquote>
      </section>

      <section id="contact">
        <h3>Contact Us</h3>
        <p>Email: info@healthis.com | Phone: 9876543210</p>
      </section>
    </>
  );
};

export default Home;
