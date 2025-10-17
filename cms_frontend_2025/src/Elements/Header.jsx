import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/WhatsApp Image 2025-10-17 at 15.16.02.jpeg"; // Update path as per your project

const Header = () => {
  return (
    <header>
      <div className="logo-title">
        <img
          src={logo}
          alt="Healthis Logo"
          className="logo"
          onError={(e) => {
            e.target.className = "logo-fallback";
            e.target.src = "";
            e.target.alt = "Logo Not Found";
          }}
        />
        <h1>Healthis</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/doctors">Our Doctors</Link>
          </li>
          <li>
            <Link to="/departments">Departments</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
