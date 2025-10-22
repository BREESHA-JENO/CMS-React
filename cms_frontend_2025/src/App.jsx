import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


// Website pages (public)
import Home from "./Pages/Website/Home";
import AboutUs from "./pages/website/AboutUs";
import Contact from "./Pages/Website/Contact";
import Departments from "./Pages/Website/Departments";
import OurDoctors from "./Pages/Website/OurDoctor";

import './App.css';


import Header from "./Elements/Header";
import Footer from "./Elements/Footer";
import LoginContainer from "./components/Login/LoginContainer";
import ReceptionDashboard from "./Pages/Receptionist/Receptionist_dashboard";
// Module dashboards (protected)
// import AdminDashboard from "./modules/admin/AdminDashboard";
// import ReceptionistDashboard from "./modules/receptionist/ReceptionistDashboard";
// import DoctorDashboard from "./modules/doctor/DoctorDashboard";
// import LabDashboard from "./modules/labtechnician/LabDashboard";
// import PharmacistDashboard from "./modules/pharmacist/PharmacistDashboard";

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
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/doctors" element={<OurDoctors />} />

        {/* Login */}
        <Route path="/login" element={
          <div className="login-center-wrapper">
            <LoginContainer />
          </div>
         } />
        {/* Protected Routes for modules */}
        {/* {/* <Route
          path="/admin"
          element={
            <ProtectedRoute allowedId={1}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/receptionist"
          element={
            // <ProtectedRoute allowedId={2}>
              <ReceptionDashboard />
            // </ProtectedRoute>
          }
        />
        {/* <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedId={3}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/lab"
          element={
            <ProtectedRoute allowedId={4}>
              <LabDashboard />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/pharmacist"
          element={
            <ProtectedRoute allowedId={5}>
              <PharmacistDashboard />
            </ProtectedRoute>
          }
        /> */}
        

        {/* Catch all */}
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
