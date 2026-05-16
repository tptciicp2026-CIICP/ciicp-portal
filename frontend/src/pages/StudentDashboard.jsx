import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [appData, setAppData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentsList, setPaymentsList] = useState([]);

  const fetchPayments = async (appId) => {
    try {
      const payRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/applications/${appId}/payments`);
      if (payRes.ok) {
        const pData = await payRes.json();
        setPaymentsList(pData);
      }
    } catch (err) {
      console.error("Error fetching payments", err);
    }
  };

  useEffect(() => {
    const fetchApp = async () => {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (!user.email) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/applications/${user.email}`);
        if (res.ok) {
          const data = await res.json();
          if (data.application) {
            setAppData(data.application);
            setPaymentData({
              amountPaid: data.application.amount_paid,
              status: data.application.payment_status,
              idApproved: data.application.id_approved,
              totalFee: data.application.course_fee
            });
            await fetchPayments(data.application.id);
          } else {
            navigate('/apply');
          }
        }
      } catch (err) {
        console.error("Error fetching application:", err);
      }
    };
    fetchApp();
  }, [navigate]);

  useEffect(() => {
    if (paymentData && paymentData.amountPaid === 0) {
      setPaymentAmount(paymentData.totalFee * 0.20);
    }
  }, [paymentData]);

  if (!appData || !paymentData) return <div className="p-10 text-center">Loading...</div>;

  const totalFee = paymentData.totalFee || 5000;
  const minimumAdvance = totalFee * 0.20;

  const handlePayment = async (e) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/applications/${appData.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount, payment_method: 'online' })
      });
      if (res.ok) {
        const newTotal = paymentData.amountPaid + amount;
        let newStatus = 'partial';
        if (newTotal >= totalFee) {
          newStatus = 'paid';
        }

        const newPaymentData = {
          ...paymentData,
          amountPaid: newTotal,
          status: newStatus
        };
        setPaymentData(newPaymentData);
        setPaymentAmount(1);
        toast.success(`Mock Payment of ₹${amount} Successful via UPI!`);
        
        await fetchPayments(appData.id);
      } else {
        toast.error("Payment failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment sync failed");
    }
  };

  const downloadReceipt = async (payment) => {
    const doc = new jsPDF();
    
    try {
      const img = new Image();
      img.src = import.meta.env.BASE_URL + 'logo.jpg';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      doc.addImage(img, 'JPEG', 20, 12, 22, 22);
    } catch (e) {
      console.error("Could not load logo for receipt", e);
    }

    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // primary-900 roughly
    doc.text("Thiagarajar Polytechnic College", 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Continuing Education Centre", 105, 28, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Official Payment Receipt", 105, 40, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(12);
    doc.text(`Receipt Date: ${new Date().toLocaleDateString()}`, 140, 55);
    doc.text(`Payment Date: ${new Date(payment.created_at).toLocaleString()}`, 20, 55);
    
    doc.text(`Student Name: ${appData.full_name}`, 20, 70);
    doc.text(`Course: ${appData.course}`, 20, 80);
    doc.text(`Installment: #${payment.installment_number}`, 20, 90);
    doc.text(`Payment Method: ${payment.payment_method.toUpperCase()}`, 20, 100);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Amount Paid: Rs. ${payment.amount}`, 20, 115);
    
    doc.setLineWidth(0.5);
    doc.line(20, 125, 190, 125);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("This is an electronically generated receipt.", 105, 135, { align: 'center' });

    doc.save(`Receipt_Inst_${payment.installment_number}_${appData.full_name.replace(/\s+/g, '_')}.pdf`);
    toast.success(`Receipt #${payment.installment_number} downloaded!`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {appData.full_name}</p>
      </div>

      <div className="mb-6">
        {/* Course Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">My Application</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Course Name</p>
              <p className="font-semibold text-gray-900">{appData.course}</p>
            </div>
            <div>
              <p className="text-gray-500">Application Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Verified
              </span>
            </div>
            <div>
              <p className="text-gray-500">Batch Timing</p>
              <p className="font-semibold text-gray-900">{appData.batch}</p>
            </div>
            <div>
              <p className="text-gray-500">Start Date</p>
              <p className="font-semibold text-gray-900">{appData.start_date}</p>
            </div>
            <div className="col-span-2 md:col-span-4 mt-2 pt-2 border-t border-gray-100">
               <p className="text-gray-500 mb-1">Contact Info</p>
               <p className="font-semibold text-gray-900 text-xs">{appData.email} | {appData.mobile}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Payment Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Fee Payment & History</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Course Fee:</span>
                <span className="font-bold">₹{totalFee}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Amount Paid:</span>
                <span className="font-bold text-green-600">₹{paymentData.amountPaid}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-800 font-medium">Balance Due:</span>
                <span className="font-bold text-red-600">₹{totalFee - paymentData.amountPaid}</span>
              </div>
            </div>

            {paymentData.status !== 'paid' && (
              <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded border border-yellow-100 mb-6">
                <strong>Note:</strong> A minimum 20% advance (₹{minimumAdvance}) is mandatory for registration confirmation.
              </p>
            )}
            
            {paymentsList.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Payment Receipts</h3>
                <div className="space-y-3">
                  {paymentsList.map(payment => (
                    <div key={payment.id} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded shadow-sm">
                      <div>
                        <p className="font-medium text-sm">Installment #{payment.installment_number} <span className="text-gray-500 text-xs ml-2">({payment.payment_method})</span></p>
                        <p className="text-xs text-gray-500">{new Date(payment.created_at).toLocaleDateString()} - ₹{payment.amount}</p>
                      </div>
                      <button 
                        onClick={() => downloadReceipt(payment)}
                        className="text-primary-600 text-sm font-medium hover:underline flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {paymentData.status !== 'paid' ? (
            <div className="border border-gray-200 rounded-lg p-5 bg-white">
              <h3 className="font-medium text-gray-800 mb-4">Make a Payment</h3>
              <form onSubmit={handlePayment}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Amount to Pay (₹)</label>
                  <input 
                    type="number" 
                    min={paymentData.amountPaid === 0 ? minimumAdvance : 1} 
                    max={totalFee - paymentData.amountPaid}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" 
                  />
                  {paymentData.amountPaid === 0 && <p className="text-xs text-gray-500 mt-1">Minimum ₹{minimumAdvance} required.</p>}
                </div>
                <button type="submit" className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors font-medium shadow-sm">
                  Pay via UPI (Mock)
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center justify-center border border-green-200 bg-green-50 rounded-lg p-5">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="font-bold text-green-800">Fees Fully Paid</h3>
                <p className="text-green-600 text-sm mt-1">Thank you for your payment.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
