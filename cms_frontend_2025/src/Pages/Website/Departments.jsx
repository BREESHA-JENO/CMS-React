import React from "react";
import Header from "../../Elements/Header";
import logo from "../../Images/WhatsApp Image 2025-10-17 at 15.16.02.jpeg";

const Departments = () => {
  return (
    <>
      <Header />
      <main>
        <h2>Our Departments</h2>
        <section>
          <h3>General Medicine</h3>
          <p>
            Internal Medicine department provides diagnosis and treatment for a wide range of medical disorders including diabetes, endocrine, gastrointestinal, respiratory, neurological, and infectious diseases. Endoscopic procedures are also available.
          </p>

          <h3>Gynecology</h3>
          <p>
            The Obstetrics & Gynaecology department is equipped with modern monitors, ultrasound, and baby care facilities. It includes Menopause Clinic, High-Risk Pregnancy and Infertility Clinic, and offers painless labour services with expert anaesthesiologists.
          </p>

          <h3>Cardiology</h3>
          <p>
            Our mission at Healthis is to deliver high-quality cardiac care at affordable costs. We are one of the premier cardiac centers in South Kerala offering advanced cardiac interventions and emergency services with modern infrastructure including FFR, IVUS, and 3D Echocardiography.
          </p>

          <h3>Pediatrics</h3>
          <p>
            Our Pediatrics department offers excellent care from birth to young adulthood. We provide pediatric cardiology, surgery, ICU, respiratory clinics, and asthma care. Our highly skilled doctors ensure quality treatment and support for your children.
          </p>
        </section>
      </main>

      <footer>
        <img src={logo} alt="Healthis Logo" className="logo" />
        <p>© 2025 Healthis. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Departments;
