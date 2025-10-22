// import React from "react";

// Custom header component
const CustomHeader = ({ onLogout }) => {
  return (
    <>
      <style>{`
        header {
          background-color: #003087;
          padding: 1rem 2rem;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .logout-btn {
          background: transparent;
          border: 2px solid white;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }
        .logout-btn:hover {
          background-color: white;
          color: #003087;
        }
      `}</style>
      <header>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </header>
    </>
  );
};

// Main Dashboard component
const DoctorDashboard = () => {
  const doctorName = "John Doe"; // Replace with real data
  const doctorId = "12345";       // Replace with real data

  const handleLogout = () => {
    alert("Logout clicked"); // Replace with your logout logic
  };

  const handleClick = (action) => {
    alert(`You clicked on "${action}"`); 
  };

  return (
    <>
      {/* Custom header with only logout */}
      <CustomHeader onLogout={handleLogout} />
      
      {/* Welcome message */}
      <div style={{
        maxWidth: "960px",
        margin: "1.5rem auto 0 auto",
        fontFamily: "Arial, sans-serif",
        fontSize: "1.25rem",
        color: "#333",
        padding: "0 1rem"
      }}>
        Welcome Dr. {doctorName} (ID: {doctorId})
      </div>

      {/* Dashboard cards container */}
      <div style={{
        maxWidth: "960px",
        margin: "2rem auto",
        background: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "1.5rem"
        }}>
          {[
            "View Today's Appointments",
            "View Appointments by Date",
            "Consult Patient",
            "Prescribe Medicine",
            "Prescribe Lab Test",
            "View Patient Consultation History"
          ].map((action, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#e3f2fd",
                color: "#003087",
                padding: "1.5rem",
                borderRadius: "10px",
                textAlign: "center",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
              onClick={() => handleClick(action)}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#003087";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "#e3f2fd";
                e.currentTarget.style.color = "#003087";
              }}
            >
              {action}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
