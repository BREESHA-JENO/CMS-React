import React, { useState } from 'react';
import { createLeaveRequest } from '../../Service/admin_api';

function LeaveForm() {
  const [form, setForm] = useState({ start_date: '', end_date: '', reason: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeaveRequest(form);
      alert('Leave request submitted successfully!');
    } catch (error) {
      alert('Failed to submit leave request.');
    }
  };

  return (
    <div className="leave-form">
      <h2>Leave Request</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required />
        <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Reason" required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LeaveForm;
