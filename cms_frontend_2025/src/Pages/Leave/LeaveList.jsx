import React, { useEffect, useState } from 'react';
import { getLeaveRequests, updateLeaveRequestStatus } from '../../Service/admin_api';
import './Leave.css'; // Your CSS for styling

function LeaveList() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    try {
      const response = await getLeaveRequests();
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      alert('Error loading leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handler for approving or rejecting leave
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeaveRequestStatus(id, { status: newStatus });
      alert(`Leave request ${newStatus.toLowerCase()} successfully.`);
      fetchLeaves();
    } catch (error) {
      console.error('Error updating leave request status:', error);
      alert('Failed to update leave request status.');
    }
  };

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
            <th>Actions</th>
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
                <td>
                  {leave.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleStatusChange(leave.id, 'APPROVED')}>
                        Approve
                      </button>
                      <button onClick={() => handleStatusChange(leave.id, 'REJECTED')}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
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
