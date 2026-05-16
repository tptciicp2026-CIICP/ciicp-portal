import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const StudentIdCard = () => {
  const navigate = useNavigate();
  const [appData, setAppData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const cardRef = useRef(null);

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
              idApproved: data.application.id_approved
            });
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

  if (!appData || !paymentData) return <div className="p-10 text-center">Loading...</div>;

  if (!paymentData.idApproved) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-yellow-200 text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ID Card Pending</h2>
          <p className="text-gray-600">Your ID card is waiting for administrator approval. Please ensure your fees are paid.</p>
        </div>
      </div>
    );
  }

  const downloadPDF = async () => {
    const input = cardRef.current;
    if (!input) return;

    const toastId = toast.loading("Generating PDF...");

    try {
      const canvas = await html2canvas(input, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = 100;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF('l', 'mm', [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${appData.full_name.replace(/\s+/g, '_')}_ID_Card.pdf`);
      
      toast.success("ID Card downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error("Failed to generate PDF.", { id: toastId });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Official ID Card</h1>
      
      <div ref={cardRef} className="border border-gray-300 rounded-xl w-full max-w-2xl bg-white shadow-xl overflow-hidden relative">
        {/* Card Header */}
        <div className="bg-white p-4 flex items-center border-b-2 border-primary-600">
          <img src="/logo.jpg" alt="TPT Logo" className="h-14 w-auto object-contain mr-4" />
          <div className="text-left">
            <h3 className="text-primary-700 font-extrabold text-lg leading-tight uppercase tracking-wide">Thiagarajar Polytechnic College</h3>
            <p className="text-accent-600 font-bold text-sm">Continuing Education Centre</p>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="p-6 flex flex-col sm:flex-row justify-between bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          
          {/* Left Side: Student Details */}
          <div className="flex-1 pr-4 mb-4 sm:mb-0">
            <table className="text-sm font-medium text-gray-800 text-left">
              <tbody>
                <tr>
                  <td className="py-2 pr-4 text-gray-500 w-24">Name</td>
                  <td className="py-2 font-bold uppercase">: {appData.full_name}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-500">Course</td>
                  <td className="py-2 font-bold text-primary-600 uppercase">: {appData.course}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-500">Batch</td>
                  <td className="py-2 font-bold">: {appData.batch}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-500">Email ID</td>
                  <td className="py-2 font-bold lowercase">: {appData.email}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-gray-500">Unique ID</td>
                  <td className="py-2 font-mono font-bold text-gray-900">: {appData.course.substring(0,3).toUpperCase()}-CS-0001</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Side: Photo */}
          <div className="flex flex-col items-center justify-center sm:pl-6 sm:border-l border-gray-200">
            <div className="w-[100px] h-[130px] bg-white border-2 border-primary-200 overflow-hidden flex items-center justify-center shadow-md rounded">
              {appData.photo_data ? (
                <img src={appData.photo_data} alt="Student" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">No Photo</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Card Footer */}
        <div className="bg-primary-600 h-3 w-full"></div>
      </div>
      
      <button className="mt-8 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors" onClick={downloadPDF}>
        Download ID as PDF
      </button>
    </div>
  );
};

export default StudentIdCard;
