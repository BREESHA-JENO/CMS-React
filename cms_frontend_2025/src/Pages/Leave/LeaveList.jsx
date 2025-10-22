import React, { useEffect, useState } from 'react';
import { getLeaveRequests } from '../../Service/admin_api';
import './Leave.css';

function LeaveList() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const response = await getLeaveRequests(); // Use the imported service function
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  if (loading) {
    return <p>Loading leave requests...</p>;
  }

  return (
    <div className="leave-list-container">
      <h2>Leave Requests</h2>
      <table className="leave-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Staff Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Requested</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length > 0 ? (
            leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.staff_info.name}</td>
                <td>{leave.start_date}</td>
                <td>{leave.end_date}</td>
                <td>{leave.reason}</td>
                <td className={`status ${leave.status.toLowerCase()}`}>
                  {leave.status}
                </td>
                <td>{new Date(leave.requested_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveList;
