import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header Section */}
      <section className="bg-blue-700 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Healthis</h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-200">
          Empowering hospitals and clinics with intelligent tools to deliver
          efficient, patient-centered healthcare management.
        </p>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-6 container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="/images/about-hospital.jpg"
            alt="Healthis Hospital"
            className="rounded-2xl shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-blue-700">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            At <span className="font-semibold text-blue-700">Healthis</span>, our
            mission is to revolutionize clinical management through digital
            innovation. We provide a secure, intuitive, and scalable platform for
            hospitals, doctors, and staff to manage appointments, prescriptions,
            laboratory operations, and billing—all in one place.
          </p>

          <h2 className="text-3xl font-bold text-blue-700">Our Vision</h2>
          <p className="text-gray-700 leading-relaxed">
            We envision a world where healthcare systems are fully automated and
            data-driven—empowering doctors, patients, and administrators with
            technology that enhances efficiency and care quality.
          </p>
        </div>
      </section>

      {/* Why Choose Healthis Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-10">
            Why Choose Healthis?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
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
            ].map((item, index) => (
              <div
                key={index}
                className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-8">
          Our Dedicated Team
        </h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6">
          {[
            {
              name: "Dr. Aditi Sharma",
              role: "Chief Medical Officer",
              img: "/images/team1.jpg",
            },
            {
              name: "Dr. Rahul Menon",
              role: "Head of Research",
              img: "/images/team2.jpg",
            },
            {
              name: "Ananya Verma",
              role: "Lead Software Engineer",
              img: "/images/team3.jpg",
            },
            {
              name: "Sanjay Patel",
              role: "Operations Manager",
              img: "/images/team4.jpg",
            },
          ].map((member, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md p-6">
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-blue-700">
                {member.name}
              </h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
