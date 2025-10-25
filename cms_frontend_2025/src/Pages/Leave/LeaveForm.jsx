import React, { useState } from 'react';
import { createLeaveRequest } from '../../Service/admin_api';

function LeaveForm() {
  const [form, setForm] = useState({ start_date: '', end_date: '', reason: '' });
  const [errors, setErrors] = useState({ start_date: '', end_date: '', reason: '' });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = { start_date: '', end_date: '', reason: '' };
    let isValid = true;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

    // Validate start date
    if (!form.start_date) {
      newErrors.start_date = 'Start date is required';
      isValid = false;
    } else {
      const startDate = new Date(form.start_date);
      startDate.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        newErrors.start_date = 'Start date cannot be in the past';
        isValid = false;
      }
    }

    // Validate end date
    if (!form.end_date) {
      newErrors.end_date = 'End date is required';
      isValid = false;
    } else if (form.start_date) {
      const startDate = new Date(form.start_date);
      const endDate = new Date(form.end_date);
      
      if (endDate < startDate) {
        newErrors.end_date = 'End date cannot be before start date';
        isValid = false;
      }
    }

    // Validate reason
    if (!form.reason.trim()) {
      newErrors.reason = 'Reason is required';
      isValid = false;
    } else if (form.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      await createLeaveRequest(form);
      alert('Leave request submitted successfully!');
      // Reset form after successful submission
      setForm({ start_date: '', end_date: '', reason: '' });
      setErrors({ start_date: '', end_date: '', reason: '' });
    } catch (error) {
      alert('Failed to submit leave request.');
    }
  };

  return (
    <div className="leave-form">
      <h2>Leave Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="start_date">Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            min={getTodayDate()} // ✅ Prevents selecting past dates in date picker
            required
          />
          <small>Select the first day of your leave</small>
          {errors.start_date && (
            <span className="error-message">{errors.start_date}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="end_date">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            min={form.start_date || getTodayDate()} // ✅ End date must be >= start date
            required
          />
          <small>Select the last day of your leave</small>
          {errors.end_date && (
            <span className="error-message">{errors.end_date}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Reason for leave (minimum 10 characters)"
            required
          />
          {errors.reason && (
            <span className="error-message">{errors.reason}</span>
          )}
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LeaveForm;
