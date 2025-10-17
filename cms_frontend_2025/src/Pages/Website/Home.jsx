import React from "react";

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Welcome to <span className="text-yellow-300">Healthis</span>
            </h1>
            <p className="text-lg">
              Your trusted Clinical Management System that ensures better care,
              smoother workflows, and healthier outcomes.
            </p>
            <a
              href="/about"
              className="inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 hover:text-blue-900 transition"
            >
              Learn More
            </a>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="/images/hospital-hero.png"
              alt="Healthis Hospital"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10 text-blue-700">
            Our Core Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Outpatient Care",
                desc: "Seamless appointment and consultation system for patients.",
              },
              {
                title: "Laboratory Services",
                desc: "Track, record, and manage lab reports efficiently.",
              },
              {
                title: "Pharmacy Integration",
                desc: "Manage medicine inventory and prescriptions in real-time.",
              },
              {
                title: "Doctor Scheduling",
                desc: "View, edit, and manage doctor availability effortlessly.",
              },
              {
                title: "Billing & Invoicing",
                desc: "Generate and track invoices with secure payment records.",
              },
              {
                title: "Analytics Dashboard",
                desc: "Monitor key statistics of your healthcare facility in one view.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-blue-50 p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Healthcare Management?
        </h2>
        <p className="mb-8 text-lg">
          Join Healthis today and take control of your clinical operations with
          smart, secure, and efficient tools.
        </p>
        <a
          href="/contact"
          className="bg-yellow-300 text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default Home;
