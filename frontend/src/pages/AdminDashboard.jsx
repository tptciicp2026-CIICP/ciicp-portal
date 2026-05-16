import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [offlineAmount, setOfflineAmount] = useState('');
  
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/applications`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    }
  };

  const toggleIdApproval = async (appId, currentStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/applications/${appId}/approve?id_approved=${!currentStatus}`, {
        method: 'PUT'
      });
      if (res.ok) {
        toast.success(!currentStatus ? 'ID Card Approved successfully!' : 'ID Card Revoked successfully!');
        loadData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ID status");
    }
  };

  const handleAddOfflinePayment = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    const amountToAdd = Number(offlineAmount);
    if (amountToAdd <= 0) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/applications/${selectedStudent.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountToAdd, payment_method: 'offline' })
      });
      if (res.ok) {
        toast.success(`₹${amountToAdd} offline payment recorded successfully!`);
        setOfflineAmount('');
        setShowPaymentModal(false);
        setSelectedStudent(null);
        loadData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to record offline payment");
    }
  };

  if (applications.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-gray-500 mt-4">No student registrations found yet.</p>
        <p className="text-sm text-gray-400 mt-2">Waiting for a student to apply...</p>
      </div>
    );
  }

  const totalRevenue = applications.reduce((acc, app) => acc + app.amount_paid, 0);
  const pendingApprovals = applications.filter(app => !app.id_approved).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage CEC student applications and payments</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Students</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Revenue Collected</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{totalRevenue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase">Pending ID Approvals</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingApprovals}</p>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Recent Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map(app => {
                const balanceDue = app.course_fee - app.amount_paid;
                return (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                          {app.photo_data ? <img src={app.photo_data} alt="" className="h-full w-full object-cover"/> : null}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{app.full_name}</div>
                          <div className="text-sm text-gray-500">{app.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.course}</div>
                      <div className="text-xs text-gray-500">{app.batch}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Paid: ₹{app.amount_paid}</div>
                      <div className="text-xs text-red-500">Due: ₹{balanceDue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => { setSelectedStudent(app); setShowDetailsModal(true); }} className="text-primary-600 hover:text-primary-900 bg-primary-50 px-3 py-1 rounded">
                        View Data
                      </button>
                      <button onClick={() => { setSelectedStudent(app); setShowPaymentModal(true); }} className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded">
                        Add Payment
                      </button>
                      <button onClick={() => toggleIdApproval(app.id, app.id_approved)} className={`${app.id_approved ? 'text-red-600 bg-red-50 hover:text-red-900' : 'text-yellow-600 bg-yellow-50 hover:text-yellow-900'} px-3 py-1 rounded font-medium`}>
                        {app.id_approved ? 'Revoke ID' : 'Approve ID'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offline Payment UI Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Record Offline Payment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Student: <span className="font-bold">{selectedStudent.full_name}</span><br/>
              Balance Due: <span className="font-bold text-red-600">₹{selectedStudent.course_fee - selectedStudent.amount_paid}</span>
            </p>
            <form onSubmit={handleAddOfflinePayment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (₹)</label>
                <input 
                  type="number" 
                  max={selectedStudent.course_fee - selectedStudent.amount_paid}
                  required
                  value={offlineAmount}
                  onChange={(e) => setOfflineAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => { setShowPaymentModal(false); setSelectedStudent(null); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Update Balance</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View All Data Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-primary-700">Student Application Data</h3>
              <button onClick={() => { setShowDetailsModal(false); setSelectedStudent(null); }} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="col-span-2 border-b pb-4 flex items-center space-x-6">
                 {selectedStudent.photo_data && <img src={selectedStudent.photo_data} className="w-24 h-32 object-cover border border-gray-300 rounded" alt="Student" />}
                 <div>
                    <h4 className="text-xl font-bold">{selectedStudent.full_name}</h4>
                    <p className="text-gray-600">{selectedStudent.course} ({selectedStudent.batch})</p>
                    <p className="text-gray-600 text-xs mt-1">Applied: {selectedStudent.start_date}</p>
                 </div>
              </div>

              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-semibold">{selectedStudent.gender}</p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth (Age)</p>
                <p className="font-semibold">{selectedStudent.dob} ({selectedStudent.age} years)</p>
              </div>
              <div>
                <p className="text-gray-500">Father's Name</p>
                <p className="font-semibold">{selectedStudent.father_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Aadhar Number</p>
                <p className="font-semibold">{selectedStudent.aadhar}</p>
              </div>
              <div>
                <p className="text-gray-500">Mobile Number</p>
                <p className="font-semibold">{selectedStudent.mobile}</p>
              </div>
              <div>
                <p className="text-gray-500">Email Address</p>
                <p className="font-semibold">{selectedStudent.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Contact Address</p>
                <p className="font-semibold bg-gray-50 p-2 rounded">{selectedStudent.address}</p>
              </div>
              <div>
                <p className="text-gray-500">Mode of Admission</p>
                <p className="font-semibold">{selectedStudent.admission_mode}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-semibold">{selectedStudent.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
