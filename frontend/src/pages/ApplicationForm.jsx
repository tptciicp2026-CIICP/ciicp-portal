import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBase64, setPhotoBase64] = useState("");
  const [age, setAge] = useState("");
  const [selectedCourseFee, setSelectedCourseFee] = useState(0);
  const [coursesList, setCoursesList] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/courses`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoursesList(data);
        } else {
          setCoursesList(defaultCourses);
        }
      })
      .catch(err => {
        console.error(err);
        setCoursesList(defaultCourses);
      });
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setPhotoBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    if (dobValue) {
      const dobDate = new Date(dobValue);
      const today = new Date();
      let calculatedAge = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge("");
    }
  };

  const handleCourseChange = (e) => {
    const courseName = e.target.value;
    const course = coursesList.find(c => c.name === courseName);
    if (course) {
      setSelectedCourseFee(course.total_fee || course.totalFee || 0);
    } else {
      setSelectedCourseFee(0);
    }
  };

  const restrictToNumbers = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  const handleAadharInput = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,4}', 'g')).join(' '); // Add space after every 4 digits
    }
    e.target.value = value;
  };

  const handleMobileInput = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,5}', 'g')).join(' '); // Add space after 5 digits
    }
    e.target.value = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      const form = e.target;
      const data = new FormData(form);
      const appData = Object.fromEntries(data.entries());
      
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      const formattedData = {
        user_email: user.email || appData.email,
        course: appData.course,
        start_date: appData.startDate,
        batch: appData.batch,
        full_name: appData.fullName,
        gender: appData.gender,
        father_name: appData.fatherName,
        dob: appData.dob,
        age: parseInt(age) || 0,
        aadhar: appData.aadhar,
        mobile: appData.mobile,
        email: appData.email,
        address: appData.address,
        sslc_year: appData.SSLC_year || '',
        sslc_marks: appData.SSLC_marks || '',
        sslc_inst: appData.SSLC_inst || '',
        hsc_year: appData.HSC_year || '',
        hsc_marks: appData.HSC_marks || '',
        hsc_inst: appData.HSC_inst || '',
        diploma_year: appData.Diploma_year || '',
        diploma_marks: appData.Diploma_marks || '',
        diploma_inst: appData.Diploma_inst || '',
        degree_year: appData.Degree_year || '',
        degree_marks: appData.Degree_marks || '',
        degree_inst: appData.Degree_inst || '',
        pg_year: appData.PG_year || '',
        pg_marks: appData.PG_marks || '',
        pg_inst: appData.PG_inst || '',
        admission_mode: appData.admissionMode,
        status: appData.status,
        employment_details: appData.employmentDetails || '',
        photo_data: photoBase64,
        course_fee: selectedCourseFee,
        amount_paid: 0,
        payment_status: 'unpaid',
        id_approved: false
      };

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData)
        });
        
        if (res.ok) {
          toast.success('Application Submitted Successfully!');
          navigate('/student-dashboard');
        } else {
          const errData = await res.json();
          console.error("Backend Error:", errData);
          toast.error('Failed to submit application: ' + JSON.stringify(errData));
        }
      } catch (err) {
         console.error(err);
         toast.error("Server error.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-primary-600 px-6 py-8 text-white text-center">
          <h2 className="text-3xl font-bold">Course Registration Form</h2>
          <p className="mt-2 text-primary-100">Thiagarajar Polytechnic College, Salem - CEC</p>
        </div>

        {/* Stepper */}
        <div className="bg-gray-50 border-b border-gray-100 px-4 sm:px-6 py-4 flex justify-between items-center text-xs sm:text-sm font-medium overflow-x-auto whitespace-nowrap">
          <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 ${step >= 1 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>1</div>
            Course
          </div>
          <div className="flex-1 border-t-2 border-gray-200 mx-4"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 ${step >= 2 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>2</div>
            Personal
          </div>
          <div className="flex-1 border-t-2 border-gray-200 mx-4"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 ${step >= 3 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>3</div>
            Academic
          </div>
          <div className="flex-1 border-t-2 border-gray-200 mx-4"></div>
          <div className={`flex items-center ${step >= 4 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 ${step >= 4 ? 'border-primary-600 bg-primary-50' : 'border-gray-300'}`}>4</div>
            Final
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          
          {/* STEP 1 */}
          <div className={`space-y-6 ${step === 1 ? 'block' : 'hidden'}`}>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Course Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Course *</label>
                <select name="course" onChange={handleCourseChange} required={step===1} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option value="">-- Select a Course --</option>
                  {coursesList.map((c, idx) => (
                    <option key={idx} value={c.name}>
                      {c.name} - Fee: ₹{c.total_fee || c.totalFee}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Start Date *</label>
                <input name="startDate" type="date" required={step===1} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Batch Timing *</label>
                <select name="batch" required={step===1} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option value="">-- Select Timing --</option>
                  <option value="Forenoon (FN)">Forenoon (FN)</option>
                  <option value="Afternoon (AN)">Afternoon (AN)</option>
                  <option value="Evening (EVE)">Evening (EVE)</option>
                  <option value="Weekend (WK)">Weekend (WK)</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className={`space-y-6 ${step === 2 ? 'block' : 'hidden'}`}>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Photo *</label>
                <div className="w-32 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 relative hover:bg-gray-50 cursor-pointer overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-center px-2">Click to Upload</span>
                  )}
                  <input name="photoFile" type="file" onChange={handlePhotoUpload} required={step===2 && !photoBase64} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name of the Candidate (Initials at the end) *</label>
                  <input name="fullName" type="text" required={step===2} placeholder="e.g., John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select name="gender" required={step===2} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name of Father / Husband *</label>
                  <input name="fatherName" type="text" required={step===2} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input name="dob" type="date" onChange={handleDobChange} required={step===2} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input name="ageDisplay" type="text" value={age} readOnly className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-md text-gray-600" placeholder="Auto-calculated" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number *</label>
                <input name="aadhar" type="text" maxLength="14" onInput={handleAadharInput} title="12 digit Aadhar number" required={step===2} placeholder="XXXX XXXX XXXX" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No *</label>
                <input name="mobile" type="text" maxLength="11" onInput={handleMobileInput} required={step===2} placeholder="XXXXX XXXXX" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID *</label>
                <input name="email" type="email" required={step===2} placeholder="you@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address *</label>
                <textarea name="address" required={step===2} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"></textarea>
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className={`space-y-6 ${step === 3 ? 'block' : 'hidden'}`}>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Academic Qualification</h3>
            <div className="overflow-x-auto">
              <table className="min-w-[600px] sm:min-w-full divide-y divide-gray-200 border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Examination</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year of Passing</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Marks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution Name</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {['SSLC', 'HSC', 'Diploma', 'Degree', 'PG'].map((exam) => (
                    <tr key={exam}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{exam}</td>
                      <td className="px-4 py-3"><input name={`${exam}_year`} type="text" maxLength="4" onInput={restrictToNumbers} className="w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="YYYY" /></td>
                      <td className="px-4 py-3"><input name={`${exam}_marks`} type="text" className="w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="%" /></td>
                      <td className="px-4 py-3"><input name={`${exam}_inst`} type="text" className="w-full border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Institution" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* STEP 4 */}
          <div className={`space-y-6 ${step === 4 ? 'block' : 'hidden'}`}>
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Other Details & Declaration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Admission</label>
                <select name="admissionMode" required={step===4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select Mode</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Friends">Friends</option>
                  <option value="Old Student">Old Student</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status of Candidate</label>
                <select name="status" required={step===4} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                  <option value="">Select Status</option>
                  <option value="Student">Student</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Employed">Employed</option>
                  <option value="Business">Business</option>
                  <option value="Senior Citizen">Senior Citizen</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">If employed, working at (Company Name) as (Designation)</label>
                <input name="employmentDetails" type="text" placeholder="e.g., Working at TCS as Software Engineer" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" />
              </div>
            </div>

            <div className="mt-8 bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">Declaration</h4>
              <p className="text-sm text-gray-600 mb-4">
                I hereby declare that the details furnished above are correct and I will adhere to the rules of Continuing Education Centre.
              </p>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input name="declaration" type="checkbox" required={step===4} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">I agree and accept</label>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Back
              </button>
            ) : <div></div>}
            
            <button 
              type="submit" 
              className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              {step === 4 ? 'Submit Application' : 'Save & Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
