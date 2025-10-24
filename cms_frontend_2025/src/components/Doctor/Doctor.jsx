import React from "react";

const doctorStyles = {
  container: {
    maxWidth: "1200px",
    margin: "2rem auto",
    background: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "3rem",
    paddingBottom: "1rem",
    borderBottom: "3px solid #2c5aa0",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#2c5aa0",
    marginBottom: "0.5rem",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#666",
    fontWeight: "400",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },
  statCard: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "1.5rem",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease",
  },
  statCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
  },
  statIcon: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
    opacity: "0.9",
  },
  statNumber: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "0.25rem",
  },
  statLabel: {
    fontSize: "0.9rem",
    opacity: "0.9",
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    marginTop: "2rem",
  },
  actionCard: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "2rem",
    borderRadius: "16px",
    textAlign: "center",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
    border: "none",
    position: "relative",
    overflow: "hidden",
  },
  actionCardHover: {
    transform: "translateY(-8px)",
    boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
  },
  actionIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
    opacity: "0.9",
  },
  actionTitle: {
    fontSize: "1.4rem",
    marginBottom: "0.5rem",
    fontWeight: "700",
  },
  actionDescription: {
    fontSize: "0.95rem",
    opacity: "0.9",
    lineHeight: "1.4",
  },
};

const Doctor = ({ onAction, doctorInfo, dashboardStats }) => {
  const actionButtons = [
    {
      title: "View Appointments",
      description: "Manage appointments and consult patients",
      icon: "📅",
      action: "viewAppointments"
    },
  ];

  return (
    <div style={doctorStyles.container}>
      <div style={doctorStyles.header}>
        <h1 style={doctorStyles.title}>Doctor Dashboard</h1>
        {doctorInfo && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "rgba(255,255,255,0.1)", borderRadius: "8px" }}>
            <p style={{ fontSize: "1.2rem", margin: "0", fontWeight: "600" }}>
              Welcome, Dr. {doctorInfo.name || 'Doctor'}
            </p>
            <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0 0", opacity: "0.8" }}>
              Staff ID: {doctorInfo.staff_id || 'N/A'}
            </p>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div style={doctorStyles.statsGrid}>
        <div style={doctorStyles.statCard}>
          <div style={doctorStyles.statIcon}>📊</div>
          <div style={doctorStyles.statNumber}>{dashboardStats?.totalAppointments || 0}</div>
          <div style={doctorStyles.statLabel}>Total Appointments</div>
        </div>
        <div style={doctorStyles.statCard}>
          <div style={doctorStyles.statIcon}>📅</div>
          <div style={doctorStyles.statNumber}>{dashboardStats?.todayAppointments || 0}</div>
          <div style={doctorStyles.statLabel}>Today's Appointments</div>
        </div>
        <div style={doctorStyles.statCard}>
          <div style={doctorStyles.statIcon}>✅</div>
          <div style={doctorStyles.statNumber}>{dashboardStats?.totalConsultations || 0}</div>
          <div style={doctorStyles.statLabel}>Consultations Done</div>
        </div>
        <div style={doctorStyles.statCard}>
          <div style={doctorStyles.statIcon}>⏳</div>
          <div style={doctorStyles.statNumber}>{dashboardStats?.pendingAppointments || 0}</div>
          <div style={doctorStyles.statLabel}>Pending Appointments</div>
        </div>
      </div>
      
      {/* Action Cards */}
      <div style={doctorStyles.actionGrid}>
        {actionButtons.map((btn, i) => {
          const [hover, setHover] = React.useState(false);
          return (
            <div
              key={i}
              onClick={() => onAction(btn.action)}
              style={hover ? { ...doctorStyles.actionCard, ...doctorStyles.actionCardHover } : doctorStyles.actionCard}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <div style={doctorStyles.actionIcon}>{btn.icon}</div>
              <div style={doctorStyles.actionTitle}>{btn.title}</div>
              <div style={doctorStyles.actionDescription}>{btn.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Doctor;