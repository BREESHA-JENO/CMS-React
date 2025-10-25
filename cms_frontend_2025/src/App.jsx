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
// Module dashboards (protected)
// import AdminDashboard from "./modules/admin/AdminDashboard";
// import ReceptionistDashboard from "./modules/receptionist/ReceptionistDashboard";
// import DoctorDashboard from "./modules/doctor/DoctorDashboard";
// import LabDashboard from "./modules/labtechnician/LabDashboard";
// import PharmacistDashboard from "./modules/pharmacist/PharmacistDashboard";

//reception imports (patient,billing,appointments)
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
import ManageBilling from './Pages/Receptionist/ManageBilling';
import CreateBilling from './components/Receptionist/CreateBilling';
import BillingList from './components/Receptionist/BillingList';
import BillingSearch from './components/Receptionist/BillingSearch';

//A&E module imports
// ========== A&E MODULE IMPORTS ==========

// AE Landing
import AELanding from './components/AE/AELanding';

// Temp Patient
import TempPatientMenu from './components/AE/TempPatient/TempPatientMenu';
import AddTempPatient from './components/AE/TempPatient/AddTempPatient';
import ListTempPatients from './components/AE/TempPatient/ListTempPatients';
import SearchTempPatient from './components/AE/TempPatient/SearchTempPatient';
import ViewTempPatient from './components/AE/TempPatient/ViewTempPatient';
import UpdateTempPatient from './components/AE/TempPatient/UpdateTempPatient';
import ConvertToPermanent from './components/AE/TempPatient/ConvertToPermanent';

// A&E Case
import AECaseMenu from './components/AE/AECase/AECaseMenu';
import AddAECase from './components/AE/AECase/AddAECase';
import ListAECases from './components/AE/AECase/ListAECase';
import ViewAECase from './components/AE/AECase/ViewAECase';
import UpdateAECase from './components/AE/AECase/UpdateAECase';

// Treatment
import TreatmentMenu from './components/AE/Treatment/TreatmentMenu';
import AddTreatment from './components/AE/Treatment/AddTreatment';
import ListTreatments from './components/AE/Treatment/ListTreatments';
import ViewTreatment from './components/AE/Treatment/ListTreatments';


import SearchAECase from './components/AE/SearchAECase/SearchAECase';
import CaseHistory from './components/AE/CaseHistory/CaseHistory';
// Auth
// import Login from "./auth/Login";

// ProtectedRoute Component
// const ProtectedRoute = ({ children, allowedId }) => {
//   const user = JSON.parse(localStorage.getItem("user")); // e.g., { id: 1, name: "Admin" }

//   if (!user) return <Navigate to="/login" replace />; // Not logged in
//   if (allowedId && user.id !== allowedId) return <Navigate to="/login" replace />; // ID mismatch

//   return children;
// };

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
        {/* patient routes */}
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
        {/* appointment route */}
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
        {/* Billing Routes */}
            <Route 
              path="/manage-billing" 
              element={
                <ProtectedRoute role="REC">
                  <ManageBilling />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/create-billing" 
              element={
                <ProtectedRoute role="REC">
                  <CreateBilling />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/billing-list" 
              element={
                <ProtectedRoute role="REC">
                  <BillingList />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/billing-search" 
              element={
                <ProtectedRoute role="REC">
                  <BillingSearch />
                </ProtectedRoute>
              } 
            />

            {/* A&E routes */}
            {/* ========== A&E MODULE ROUTES ========== */}

{/* A&E Landing */}
<Route 
  path="/ae-module" 
  element={
    <ProtectedRoute role="REC">
      <AELanding />
    </ProtectedRoute>
  } 
/>

{/* ========== TEMPORARY PATIENT ROUTES ========== */}
<Route 
  path="/ae-module/temp-patient-menu" 
  element={
    <ProtectedRoute role="REC">
      <TempPatientMenu />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/add-temp-patient" 
  element={
    <ProtectedRoute role="REC">
      <AddTempPatient />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/list-temp-patients" 
  element={
    <ProtectedRoute role="REC">
      <ListTempPatients />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/search-temp-patient" 
  element={
    <ProtectedRoute role="REC">
      <SearchTempPatient />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/view-temp-patient/:id" 
  element={
    <ProtectedRoute role="REC">
      <ViewTempPatient />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/update-temp-patient/:id" 
  element={
    <ProtectedRoute role="REC">
      <UpdateTempPatient />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/convert-to-permanent/:id" 
  element={
    <ProtectedRoute role="REC">
      <ConvertToPermanent />
    </ProtectedRoute>
  } 
/>

{/* ========== A&E CASE ROUTES ========== */}
<Route 
  path="/ae-module/ae-case-menu" 
  element={
    <ProtectedRoute role="REC">
      <AECaseMenu />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/add-ae-case" 
  element={
    <ProtectedRoute role="REC">
      <AddAECase />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/list-ae-cases" 
  element={
    <ProtectedRoute role="REC">
      <ListAECases />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/view-ae-case/:id" 
  element={
    <ProtectedRoute role="REC">
      <ViewAECase />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/update-ae-case/:id" 
  element={
    <ProtectedRoute role="REC">
      <UpdateAECase />
    </ProtectedRoute>
  } 
/>

{/* ========== TREATMENT ROUTES ========== */}
<Route 
  path="/ae-module/treatment-menu" 
  element={
    <ProtectedRoute role="REC">
      <TreatmentMenu />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/add-treatment/:caseId" 
  element={
    <ProtectedRoute role="REC">
      <AddTreatment />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/case-treatments/:caseId" 
  element={
    <ProtectedRoute role="REC">
      <ListTreatments />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/view-treatment/:id" 
  element={
    <ProtectedRoute role="REC">
      <ViewTreatment />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/ae-module/search-case" 
  element={
    <ProtectedRoute role="REC">
      <SearchAECase  />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/case-history" 
  element={
    <ProtectedRoute role="REC">
      <CaseHistory  />
    </ProtectedRoute>
  } 
/>



       
{/* 
<Route 
  path="/ae-module/search-temp-patient" 
  element={
    <ProtectedRoute role="REC">
      <SearchTempPatient />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/update-temp-patient" 
  element={
    <ProtectedRoute role="REC">
      <UpdateTempPatient />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/update-temp-patient/:id" 
  element={
    <ProtectedRoute role="REC">
      <UpdateTempPatient />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/ae-module/convert-to-permanent/:id" 
  element={
    <ProtectedRoute role="REC">
      <ConvertToPermanent />
    </ProtectedRoute>
  } 
/> */}

        {/* <Route
          path="/doctor"
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
