import React from "react";
import hospitalImage from "../../Images/a_modern_hospital_exterior_with_a_welcoming_entrance_clear_signage_greenery_and_bright_daylight_cle_yo9m63qx2tvurvsvaxm8_0.png";
import team1 from "../../Images/team1.jpg";
import team2 from "../../Images/team2.jpg";
import team3 from "../../Images/team3.jpg";
import team4 from "../../Images/team4.jpg";
import "./About.css";

const teamMembers = [
  { name: "Dr. Aditi Sharma", role: "Chief Medical Officer", img: team1 },
  { name: "Dr. Rahul Menon", role: "Head of Research", img: team2 },
  { name: "Ananya Verma", role: "Lead Software Engineer", img: team3 },
  { name: "Sanjay Patel", role: "Operations Manager", img: team4 },
];

const whyChoose = [
  {
    title: "User-Friendly Interface",
    desc: "Intuitive dashboards and clean design for all hospital roles.",
  },
  {
    title: "All-in-One System",
    desc: "Manage appointments, lab tests, prescriptions, and billing seamlessly.",
  },
  {
    title: "Data Security",
    desc: "Advanced encryption ensures privacy of medical records.",
  },
  {
    title: "Role-Based Access",
    desc: "Separate dashboards for Admin, Doctors, Lab Technicians, and Receptionists.",
  },
  {
    title: "Scalable & Modular",
    desc: "Easily extend modules as your hospital expands.",
  },
  {
    title: "24/7 Support",
    desc: "Dedicated technical support for all Healthis clients.",
  },
];

const About = () => {
  return (
    <div>
      {/* Header Section */}
      <section className="about-header">
        <h1>About Healthis</h1>
        <p>
          Empowering hospitals and clinics with intelligent tools to deliver
          efficient, patient-centered healthcare management.
        </p>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision">
        <div>
          <img src={hospitalImage} alt="Healthis Hospital" />
        </div>
        <div>
          <h2>Our Mission</h2>
          <p>
            At <strong>Healthis</strong>, our mission is to revolutionize clinical
            management through digital innovation. We provide a secure, intuitive,
            and scalable platform for hospitals, doctors, and staff to manage
            appointments, prescriptions, laboratory operations, and billing—all
            in one place.
          </p>

          <h2>Our Vision</h2>
          <p>
            We envision a world where healthcare systems are fully automated and
            data-driven—empowering doctors, patients, and administrators with
            technology that enhances efficiency and care quality.
          </p>
        </div>
      </section>

      {/* Why Choose Healthis Section */}
      <section className="why-choose">
        <h2>Why Choose Healthis?</h2>
        <div className="why-cards">
          {whyChoose.map((item, index) => (
            <div key={index} className="why-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team">
        <h2>Our Dedicated Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <img src={member.img} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
