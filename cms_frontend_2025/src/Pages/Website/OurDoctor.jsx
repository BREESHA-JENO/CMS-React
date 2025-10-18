import React from "react";
import logo from "../../Images/WhatsApp Image 2025-10-17 at 15.16.02.jpeg";
import "./OurDoctor.css";

// Import all doctor images (doc1.jpg, doc2.jpg, etc.)
const doctorImages = import.meta.glob("../../Images/doc*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
});

const doctorsData = [
  {
    department: "General Medicine",
    doctors: [
      { name: "Dr. Velayudhan", qualification: "MBBS, MD", schedule: "Mon-Sat: 9:00 AM - 1:00 PM", image: "doc1.jpg" },
      { name: "Dr. Biju", qualification: "MBBS", schedule: "Mon-Fri: 8:00 AM - 1:00 PM", image: "doc2.jpg" },
      { name: "Dr. Jim Litton", qualification: "MBBS", schedule: "Mon, Wed, Sat: 4:00 PM - 7:00 PM / Tues, Fri: 9:30 AM - 1:00 PM", image: "doc3.jpg" },
    ],
  },
  {
    department: "Pediatrics",
    doctors: [
      { name: "Dr. Nisha", qualification: "MBBS, MD", schedule: "Mon-Sat: 9:00 AM - 1:00 PM", image: "doc4.jpg" },
    ],
  },
  {
    department: "Gynecology",
    doctors: [
      { name: "Dr. Fiona", qualification: "MBBS", schedule: "Wed, Thu, Sat: 4:00 PM - 8:00 PM", image: "doc5.jpg" },
      { name: "Dr. Shashikala", qualification: "MBBS", schedule: "Mon-Sat: 9:00 AM - 1:00 PM", image: "doc6.jpg" },
    ],
  },
  {
    department: "Cardiology",
    doctors: [
      { name: "Dr. Ram", qualification: "MBBS", schedule: "Mon, Tue, Fri: 9:00 AM - 1:00 PM", image: "doc7.jpg" },
      { name: "Dr. Kiran", qualification: "MBBS, MD", schedule: "Mon-Fri: 9:00 AM - 1:00 PM", image: "doc8.jpg" },
    ],
  },
  {
    department: "General Surgery",
    doctors: [
      { name: "Dr. Indira", qualification: "MBBS, MS", schedule: "Mon, Wed, Fri: 9:00 AM - 1:00 PM", image: "doc9.jpg" },
      { name: "Dr. Anil Kumar", qualification: "MBBS", schedule: "Mon-Sat: 8:00 AM - 1:00 PM", image: "doc10.jpg" },
    ],
  },
];

const OurDoctors = () => {
  return (
    <main className="our-doctors-container">
      <h2 className="page-title">Our Dedicated Doctors</h2>

      {doctorsData.map((dept, i) => (
        <section key={i} className="department-section">
          <h3 className="department-title">{dept.department}</h3>
          <div className="doctor-card-container">
            {dept.doctors.map((doc, index) => {
              // Match image name (e.g., ../../Images/doc1.jpg)
              const imageSrc =
                doctorImages[`../../Images/${doc.image}`] || logo;

              return (
                <div key={index} className="doctor-card">
                  <img
                    src={imageSrc}
                    alt={doc.name}
                    className="doctor-image"
                  />
                  <div className="doctor-info">
                    <h4>{doc.name}</h4>
                    <p>{doc.qualification}</p>
                    <small>{doc.schedule}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
};

export default OurDoctors;
