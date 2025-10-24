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
import DriverAmbulanceDashboard from "./Pages/Ambulance/DriverAmbulanceDashboard";
import AdminAmbulanceDashboard from "./Pages/Admin/AdminAmbulanceDashboard";
import ReceptionistAmbulanceDashboard from "./Pages/Receptionist/ReceptionistAmbulanceDashboard";
import AmbulanceList from "./Pages/Admin/AmbulanceList";
import AdminAmbulanceRequests from "./Pages/Admin/AdminAmbulanceRequest";
import "./App.css";

// Add these imports to your existing App.jsx
import ReceptionistDashboard from "./Pages/Receptionist/Receptionist_dashboard";
import ManagePatients from "./Pages/Receptionist/ManagePatients";
import AddPatient from "./components/Receptionist/AddPatients";
import PatientList from "./components/Receptionist/PatientList";
import PatientSearch from "./components/Receptionist/PatientSearch";
import EditPatient from "./components/Receptionist/EditPatient";
import DeletePatient from "./components/Receptionist/DeletePatient";
import SelectPatientEdit from './components/Receptionist/SelectPatientEdit';
import ManageAppointments from './Pages/Receptionist/ManageAppointments';
import AddAppointment from './components/Receptionist/AddAppointments';
import AppointmentList from './components/Receptionist/AppointmentList';
import AppointmentSearch from './components/Receptionist/AppointmentSearch';
import EditAppointment from './components/Receptionist/EditAppointments';

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
        {/* DASHBOARD/RECEPTIONIST ROUTES */}
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute role="REC">
              <ReceptionistDashboard/>
            </ProtectedRoute>
          }
        />
        <Route 
            path="/manage-patients" 
            element={
              <ProtectedRoute role="REC">
                <ManagePatients />
              </ProtectedRoute>
            } 
        />
        <Route 
          path="/add-patient" 
          element={
            <ProtectedRoute role="REC">
              <AddPatient />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient-list" 
          element={
            <ProtectedRoute role="REC">
              <PatientList />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/patient-search" 
          element={
            <ProtectedRoute role="REC">
              <PatientSearch />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-patient/:id" 
          element={
            <ProtectedRoute role="REC">
              <EditPatient />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-patient" 
          element={
            <ProtectedRoute role="REC">
              <SelectPatientEdit />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/delete-patient" 
          element={
            <ProtectedRoute role="REC">
              <DeletePatient />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-appointments" 
          element={
            <ProtectedRoute role="REC">
              <ManageAppointments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-appointment" 
          element={
            <ProtectedRoute role="REC">
              <AddAppointment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/appointment-list" 
          element={
            <ProtectedRoute role="REC">
              <AppointmentList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/appointment-search" 
          element={
            <ProtectedRoute role="REC">
              <AppointmentSearch />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-appointment/:id" 
          element={
            <ProtectedRoute role="REC">
              <EditAppointment />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/ambulance"
          element={
            <ProtectedRoute allowedRoles={["AMB"]}>
              <DriverAmbulanceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ambulance"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <AdminAmbulanceDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ambulance-list"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <AmbulanceList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/ambulance-requests" 
          element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <AdminAmbulanceRequests />
              </DashboardLayout>
            </ProtectedRoute>
          } />

        <Route
          path="/receptionist/ambulance"
          element={
            <ProtectedRoute allowedRoles={["REC"]}>
              <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                <ReceptionistAmbulanceDashboard />
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
