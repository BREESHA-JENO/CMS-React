import React, { useState, useEffect } from "react";
import Header1 from "../Elements/Header1";
import Footer1 from "../Elements/Footer1";
import Sidebar from "../Elements/Sidebar";

function DashboardLayout({ children, darkMode, setDarkMode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const handleSidebarToggle = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <div className={`dashboard-container${darkMode ? " dark" : ""}`}>
      <Header1
        onSidebarToggle={handleSidebarToggle}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={notifications}
      />
      <Sidebar
        open={sidebarOpen}
        role={role}
        darkMode={darkMode}
        onClose={() => setSidebarOpen(false)}
      />
      <main className={`dashboard-content${darkMode ? " dark" : ""}`}>
        {children}
      </main>
      <Footer1 darkMode={darkMode} />
    </div>
  );
}

export default DashboardLayout;
