import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const defaultCourses = [
  { name: "Office Pack", hrs: 60, fee: 2500, totalFee: 3010 },
  { name: "Office Management", hrs: 80, fee: 3000, totalFee: 3600 },
  { name: "Tally Prime and Tax Accounting", hrs: 80, fee: 4000, totalFee: 4780 },
  { name: "Python Programming", hrs: 60, fee: 4000, totalFee: 4780 },
  { name: "C & C++ Programming", hrs: 60, fee: 4000, totalFee: 4780 },
  { name: "Web Designing for Kids", hrs: 40, fee: 2500, totalFee: 3010 },
  { name: "Computer Networks and Hacking", hrs: 80, fee: 4000, totalFee: 4780 },
  { name: "CCNA Coaching", hrs: 120, fee: 6000, totalFee: 7140 },
  { name: "Design and Animation", hrs: 30, fee: 2500, totalFee: 3010 },
  { name: "3D Animation", hrs: 30, fee: 2500, totalFee: 3010 },
  { name: "Multimedia Package", hrs: 50, fee: 3500, totalFee: 4190 },
  { name: "Spoken English", hrs: 40, fee: 3000, totalFee: 3600 },
  { name: "Spoken Hindi", hrs: 40, fee: 3000, totalFee: 3600 },
  { name: "Video Editing", hrs: 50, fee: 3500, totalFee: 4190 },
  { name: "R Programming", hrs: 60, fee: 4000, totalFee: 4780 },
  { name: "Java Programming", hrs: 60, fee: 4000, totalFee: 4780 },
  { name: "Internet Operations", hrs: 30, fee: 2500, totalFee: 3010 },
  { name: "Data Science (Level -I)", hrs: 60, fee: 5000, totalFee: 5960 },
  { name: "Data Science (Level -II)", hrs: 60, fee: 5000, totalFee: 5960 },
  { name: "AutoCAD", hrs: 60, fee: 3000, totalFee: 3600 },
  { name: "Advanced Excel", hrs: 60, fee: 4000, totalFee: 4780 },
  { name: "Digital Marketing", hrs: 60, fee: 4000, totalFee: 4780 }
];

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    hrs: '',
    fee: '',
    total_fee: ''
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    
    // Auto-calculate Total Fee if Fee is changed (Add 18% GST)
    if (name === 'fee' && value) {
        const feeVal = parseFloat(value);
        newFormData.total_fee = Math.round(feeVal * 1.18);
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing && currentCourse !== null) {
      const courseId = courses[currentCourse].id;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/courses/${courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          toast.success("Course updated successfully!");
          fetchCourses();
          setIsEditing(false);
          setCurrentCourse(null);
        } else {
          toast.error("Failed to update course");
        }
      } catch (err) {
        console.error("Failed to update course:", err);
        toast.error("Failed to update course");
      }
    } else {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          toast.success("Course added successfully!");
          fetchCourses();
        }
      } catch (err) {
        console.error("Failed to add course:", err);
        toast.error("Failed to add course");
      }
    }
    setFormData({ name: '', hrs: '', fee: '', total_fee: '' });
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    setCurrentCourse(index);
    setFormData(courses[index]);
  };

  const confirmDelete = (index) => {
    setCourseToDelete(index);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (courseToDelete === null) return;
    const courseId = courses[courseToDelete].id;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success("Course deleted successfully!");
        fetchCourses();
      } else {
        toast.error("Failed to delete course");
      }
    } catch (err) {
      console.error("Failed to delete course:", err);
      toast.error("Failed to delete course");
    }
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Course Management</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Course' : 'Add New Course'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Hrs</label>
            <input type="number" name="hrs" value={formData.hrs} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fee (₹)</label>
            <input type="number" name="fee" value={formData.fee} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Fee (w/ GST) (₹)</label>
            <input type="number" name="total_fee" value={formData.total_fee} onChange={handleInputChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
          </div>
          <div className="md:col-span-5 flex justify-end gap-2 mt-2">
            {isEditing && (
              <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: '', hrs: '', fee: '', total_fee: '' }); }} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Cancel
              </button>
            )}
            <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
              {isEditing ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name of the Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hrs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount (18% GST)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.hrs} Hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{course.fee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">₹{course.total_fee || course.totalFee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(index)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => confirmDelete(index)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No courses available. Add a course above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Confirm Deletion</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => { setShowDeleteModal(false); setCourseToDelete(null); }} 
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
