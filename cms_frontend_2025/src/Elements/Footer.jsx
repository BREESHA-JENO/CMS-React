import React from "react";
import logo from "../Images/WhatsApp Image 2025-10-17 at 15.16.02.jpeg"; // Replace with your logo path

const Footer = () => {
  return (
    <footer className="footer bg-blue-800 text-white py-6 mt-16 text-center">
      {/* Logo */}
      <div className="mb-4">
        <img
          src={logo}
          alt="ClinicCare+ Logo"
          className="logo mx-auto"
          style={{ width: "80px", height: "auto" }}
          onError={(e) => {
            e.target.className = "logo-fallback";
            e.target.src = "";
            e.target.alt = "Logo Not Found";
          }}
        />
      </div>

      {/* Social Icons */}
      <div className="social-icons mb-4">
        <a href="#" className="mx-2 text-white hover:text-yellow-300"><i className="fab fa-facebook"></i></a>
        <a href="#" className="mx-2 text-white hover:text-yellow-300"><i className="fab fa-instagram"></i></a>
        <a href="#" className="mx-2 text-white hover:text-yellow-300"><i className="fab fa-twitter"></i></a>
        <a href="#" className="mx-2 text-white hover:text-yellow-300"><i className="fab fa-linkedin"></i></a>
        <a href="#" className="mx-2 text-white hover:text-yellow-300"><i className="fab fa-whatsapp"></i></a>
        <a href="#" className="mx-2 text-white hover:text-yellow-300"><i className="fab fa-youtube"></i></a>
      </div>

      {/* Text */}
      <p className="text-gray-200 mb-1">© {new Date().getFullYear()} HealthIs. All rights reserved.</p>
      <p className="text-gray-200">
        <a href="#" className="hover:text-yellow-300">Privacy Policy</a> |{" "}
        <a href="#" className="hover:text-yellow-300">Disclaimer</a>
      </p>
    </footer>
  );
};

export default Footer;
