import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientConsultationHistory } from "../../Service/doctor_api";

const HistoryPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientInfo, setPatientInfo] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      console.log('Fetching history for patient ID:', patientId);
      setLoading(true);
      setError("");
      try {
        const res = await getPatientConsultationHistory(patientId);
        console.log('Patient history response:', res.data);
        
        // Extract patient info and history
        if (res.data && res.data.history) {
          setPatientInfo({
            patient_id: res.data.patient_id,
            patient_name: res.data.patient_name
          });
          setRecords(res.data.history);
          setFilteredRecords(res.data.history);
        } else {
          const data = Array.isArray(res.data) ? res.data : [];
          setRecords(data);
          setFilteredRecords(data);
        }
        console.log('Processed history data:', res.data.history || res.data);
      } catch (e) {
        console.error('Error fetching patient history:', e);
        setError(e.response?.data?.error || e.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    if (patientId) {
      fetchHistory();
    } else {
      console.error('No patient ID provided');
      setError('No patient ID provided');
      setLoading(false);
    }
  }, [patientId]);

  // Handle month filtering
  const handleMonthFilter = (month) => {
    setSelectedMonth(month);
    if (!month) {
      setFilteredRecords(records);
      return;
    }
    
    const filtered = records.filter(record => {
      const recordDate = new Date(record.created_at);
      const recordMonth = `${recordDate.getFullYear()}-${String(recordDate.getMonth() + 1).padStart(2, '0')}`;
      return recordMonth === month;
    });
    
    setFilteredRecords(filtered);
    console.log(`Filtered ${filtered.length} records for month ${month}`);
  };

  // Get available months from records
  const getAvailableMonths = () => {
    const months = new Set();
    records.forEach(record => {
      const date = new Date(record.created_at);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthStr);
    });
    return Array.from(months).sort().reverse();
  };

  return (
    <div className="container-fluid" style={{ padding: "1rem" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-1">
            <i className="fas fa-history me-2"></i>
            Consultation History
          </h2>
          {patientInfo && (
            <p className="text-muted mb-0">
              Patient: <strong>{patientInfo.patient_name}</strong> (ID: {patientInfo.patient_id})
            </p>
          )}
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left me-2"></i>Back
        </button>
      </div>

      {/* Month Filter */}
      {!loading && !error && records.length > 0 && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-3">
                <label className="form-label fw-bold">
                  <i className="fas fa-calendar me-2"></i>Filter by Month
                </label>
              </div>
              <div className="col-md-4">
                <select 
                  className="form-select"
                  value={selectedMonth}
                  onChange={(e) => handleMonthFilter(e.target.value)}
                >
                  <option value="">All Months</option>
                  {getAvailableMonths().map(month => {
                    const date = new Date(month + '-01');
                    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
                    return (
                      <option key={month} value={month}>{monthName}</option>
                    );
                  })}
                </select>
              </div>
              <div className="col-md-5">
                <div className="text-muted">
                  Showing {filteredRecords.length} of {records.length} consultations
                  {selectedMonth && ` for ${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}></div>
          <p className="text-muted mt-3">Loading consultation history...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Consultation Records */}
      {!loading && !error && (
        filteredRecords.length > 0 ? (
          <div className="row">
            {filteredRecords.map((record, index) => (
              <div key={record.consultation_id} className="col-12 mb-4">
                <div className="card border-left-primary shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <h5 className="mb-0">
                          <i className="fas fa-notes-medical me-2"></i>
                          Consultation #{record.consultation_id}
                        </h5>
                      </div>
                      <div className="col-md-6 text-md-end">
                        <small>
                          <i className="fas fa-calendar me-1"></i>
                          {new Date(record.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="row">
                      {/* Consultation Details */}
                      <div className="col-md-6">
                        <h6 className="text-primary mb-3">
                          <i className="fas fa-user-md me-2"></i>Consultation Details
                        </h6>
                        
                        <div className="mb-3">
                          <strong>Doctor:</strong> 
                          <span className="ms-2">{record.doctor_name}</span>
                        </div>
                        
                        <div className="mb-3">
                          <strong>Appointment Date:</strong>
                          <span className="ms-2">{new Date(record.appointment_date).toLocaleDateString()}</span>
                        </div>
                        
                        {record.symptoms && (
                          <div className="mb-3">
                            <strong>Symptoms:</strong>
                            <div className="mt-1 p-2 bg-light rounded">
                              {record.symptoms}
                            </div>
                          </div>
                        )}
                        
                        {record.diagnosis && (
                          <div className="mb-3">
                            <strong>Diagnosis:</strong>
                            <div className="mt-1 p-2 bg-light rounded">
                              {record.diagnosis}
                            </div>
                          </div>
                        )}
                        
                        {record.notes && (
                          <div className="mb-3">
                            <strong>Notes:</strong>
                            <div className="mt-1 p-2 bg-light rounded">
                              {record.notes}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Prescriptions */}
                      <div className="col-md-6">
                        <h6 className="text-success mb-3">
                          <i className="fas fa-prescription me-2"></i>Prescriptions
                        </h6>
                        
                        {/* Medicine Prescriptions */}
                        {record.medicine_prescriptions && record.medicine_prescriptions.length > 0 && (
                          <div className="mb-4">
                            <h6 className="text-success">
                              <i className="fas fa-pills me-2"></i>Medicines
                            </h6>
                            {record.medicine_prescriptions.map((medPrescription, medIndex) => (
                              <div key={medIndex} className="border rounded p-3 mb-2 bg-light">
                                <small className="text-muted">
                                  Prescribed: {new Date(medPrescription.created_at).toLocaleDateString()}
                                </small>
                                {medPrescription.medicines.map((medicine, idx) => (
                                  <div key={idx} className="mt-2">
                                    <div className="fw-bold">{medicine.medicine_name}</div>
                                    <div><strong>Dosage:</strong> {medicine.dosage}</div>
                                    <div><strong>Quantity:</strong> {medicine.quantity}</div>
                                    {medicine.instructions && (
                                      <div><strong>Instructions:</strong> {medicine.instructions}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Lab Test Prescriptions */}
                        {record.lab_prescriptions && record.lab_prescriptions.length > 0 && (
                          <div className="mb-4">
                            <h6 className="text-info">
                              <i className="fas fa-vial me-2"></i>Lab Tests
                            </h6>
                            {record.lab_prescriptions.map((labPrescription, labIndex) => (
                              <div key={labIndex} className="border rounded p-3 mb-2 bg-light">
                                <small className="text-muted">
                                  Prescribed: {new Date(labPrescription.created_at).toLocaleDateString()}
                                </small>
                                {labPrescription.tests.map((test, idx) => (
                                  <div key={idx} className="mt-2">
                                    <div className="fw-bold">{test.test_name}</div>
                                    {test.instructions && (
                                      <div><strong>Instructions:</strong> {test.instructions}</div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {(!record.medicine_prescriptions || record.medicine_prescriptions.length === 0) && 
                         (!record.lab_prescriptions || record.lab_prescriptions.length === 0) && (
                          <div className="text-muted">No prescriptions recorded</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center my-5">
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              {selectedMonth 
                ? `No consultation history found for ${new Date(selectedMonth + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`
                : 'No consultation history found for this patient'
              }
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default HistoryPage;
