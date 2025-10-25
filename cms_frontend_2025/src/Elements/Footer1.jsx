import React from "react";
import "./Footer1.css";

const Footer1 = ({ darkMode }) => (
  <footer className={`dashboard-footer${darkMode ? " dark" : ""}`}>
    <p>© {new Date().getFullYear()} HealthIs. All Rights Reserved.</p>
  </footer>
);

export default Footer1;
