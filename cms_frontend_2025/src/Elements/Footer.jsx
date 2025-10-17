import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/WhatsApp Image 2025-10-17 at 15.16.02.jpeg"; // Update path if needed

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white mt-16">
      {/* Top Section */}
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Info with Logo */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={logo}
              alt="Healthis Logo"
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.src = "";
                e.target.alt = "Logo not found";
              }}
            />
            <h2 className="text-2xl font-bold text-yellow-300">Healthis</h2>
          </div>
          <p className="text-sm text-gray-200">
            A comprehensive Clinical Management System built to simplify hospital
            operations, enhance doctor-patient communication, and ensure better
            healthcare outcomes.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-yellow-300 transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-yellow-300 transition-colors duration-200">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/departments" className="hover:text-yellow-300 transition-colors duration-200">
                Departments
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-yellow-300 transition-colors duration-200">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Services</h3>
          <ul className="space-y-2">
            <li>Outpatient & Appointments</li>
            <li>Laboratory Reports</li>
            <li>Pharmacy Management</li>
            <li>Billing & Invoicing</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-gray-200">
            <li>📍 123 Wellness Street, MedCity, India</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ contact@healthis.com</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-blue-600"></div>

      {/* Bottom Section */}
      <div className="text-center py-4 text-sm text-gray-300">
        © {new Date().getFullYear()} <span className="text-yellow-300 font-semibold">Healthis</span>. 
        All rights reserved. | Designed with ❤️ for better healthcare.
      </div>
    </footer>
  );
};

export default Footer;
