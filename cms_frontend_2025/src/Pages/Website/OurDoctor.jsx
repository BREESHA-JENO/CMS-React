import React from "react";
import Header from "../../Elements/Header";
import logo from "../../Images/WhatsApp Image 2025-10-17 at 15.16.02.jpeg";

const doctorsData = [
  {
    department: "General Medicine",
    doctors: [
      { name: "Dr. Velayudhan", qualification: "MBBS, MD", schedule: "Mon-Sat: 9:00 AM - 1:00 PM", image: "download (14).jfif" },
      { name: "Dr. Biju", qualification: "MBBS", schedule: "Mon-Fri: 8:00 AM - 1:00 PM", image: "download.jfif" },
      { name: "Dr. Jim Litton", qualification: "MBBS", schedule: "Mon, Wed, Sat: 4:00 PM - 7:00 PM / Tues, Fri: 9:30 AM - 1:00 PM", image: "images (9).jfif" }
    ]
  },
  {
    department: "Pediatrics",
    doctors: [
      { name: "Dr. Nisha", qualification: "MBBS, MD", schedule: "Mon-Sat: 9:00 AM - 1:00 PM", image: "download (1).jfif" }
    ]
  },
  {
    department: "Gynecology",
    doctors: [
      { name: "Dr. Fiona", qualification: "MBBS", schedule: "Wed, Thu, Sat: 4:00 PM - 8:00 PM", image: "images.jfif" },
      { name: "Dr. Shashikala", qualification: "MBBS", schedule: "Mon-Sat: 9:00 AM - 1:00 PM", image: "download (2).jfif" }
    ]
  },
  {
    department: "Cardiology",
    doctors: [
      { name: "Dr. Ram", qualification: "MBBS", schedule: "Mon, Tue, Fri: 9:00 AM - 1:00 PM", image: "images 11.jpg" },
      { name: "Dr. Kiran", qualification: "MBBS, MD", schedule: "Mon-Fri: 9:00 AM - 1:00 PM", image: "imagev 12.jpg" }
    ]
  },
  {
    department: "General Surgery",
    doctors: [
      { name: "Dr. Indira", qualification: "MBBS, MS", schedule: "Mon, Wed, Fri: 9:00 AM - 1:00 PM", image: "images (8).jfif" },
      { name: "Dr. Anil Kumar", qualification: "MBBS", schedule: "Mon-Sat: 8:00 AM - 1:00 PM", image: "images (10).jfif" }
    ]
  }
];

const OurDoctors = () => {
  return (
    <>
      <Header />
      <main>
        {doctorsData.map((dept, i) => (
          <section key={i} className="department">
            <h3>{dept.department}</h3>
            <div className="doctor-card-container">
              {dept.doctors.map((doc, index) => (
                <div key={index} className="doctor-card">
                  <img src={require(`../IMAGES/${doc.image}`)} alt={doc.name} />
                  <p>
                    <strong>{doc.name}</strong>
                    <br />
                    {doc.qualification}
                    <br />
                    {doc.schedule}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer>
        <img src={logo} alt="Healthis Logo" className="logo" />
        <p>© 2025 Healthis. All rights reserved.</p>
      </footer>
    </>
  );
};

export default OurDoctors;
