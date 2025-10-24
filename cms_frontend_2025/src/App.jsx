import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

import Home from "./Pages/Website/Home";
import AboutUs from "./pages/website/AboutUs";
import Contact from "./Pages/Website/Contact";
import Departments from "./Pages/Website/Departments";
import OurDoctors from "./Pages/Website/OurDoctor";
import PublicLayout from "./Layout/PublicLayout";
import DashboardLayout from "./Layout/DashboardLayout";
import LeaveForm from "./Pages/Leave/LeaveForm";
import LeaveList from "./Pages/Leave/LeaveList";
import Profile from "./Pages/Profile/Profile";
import StaffForm from "./components/Admin/StaffForm";
import StaffList from "./components/Admin/StaffList";
import SpecializationForm from "./components/Admin/SpecializationForm";
import StaffManagementDashboard from "./Pages/Admin/StaffDashboard";
import SpecializationsDashboard from "./Pages/Admin/SpecializationDashboard";
import SpecializationTable from "./components/Admin/SpecializationTable";
import LoginContainer from "./components/Login/LoginContainer";
import ProtectedRoute from "./Utils/ProtectedRoute";
import AdminDashboard from "./Pages/Admin/Admin_dashboard";
import SpecializationSearch from "./components/Admin/SpecializationSearch";
import StaffSearch from "./components/Admin/StaffSearch";
import ChangePassword from "./Pages/Profile/ChangePassword";
import ForgotPasswordRequests from "./components/Login/ForgotPasswordRequests";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/departments" element={<PublicLayout><Departments /></PublicLayout>} />
        <Route path="/doctors" element={<PublicLayout><OurDoctors /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><LoginContainer /></PublicLayout>} />

        <Route
          path="/admin/forgot-password-requests"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <ForgotPasswordRequests />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD/ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <AdminDashboard darkMode={darkMode} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff-management"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <StaffManagementDashboard darkMode={darkMode} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/specializations-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <SpecializationsDashboard darkMode={darkMode} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/staff-list" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <StaffList darkMode={darkMode} />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/staff-form/:id?" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <StaffForm darkMode={darkMode} />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/staff-search" element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <StaffSearch />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route
          path="/admin/specializations/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <SpecializationForm darkMode={darkMode} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/specializations/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <SpecializationForm darkMode={darkMode} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/specializations"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <SpecializationTable darkMode={darkMode} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/specializations/search"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <SpecializationSearch />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leave-form"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <LeaveForm darkMode={darkMode} />
            </DashboardLayout>
          }
        />
        <Route
          path="/leave-list"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <LeaveList darkMode={darkMode} />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <Profile darkMode={darkMode} />
            </DashboardLayout>
          }
        />
        {/* Add more dashboard/protected routes as needed */}
        <Route
        path="/change-password"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "REC", "DOC", "LAB", "PHARM", "AMB"]}>
            <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
              <ChangePassword />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
