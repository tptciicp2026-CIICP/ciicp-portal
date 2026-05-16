import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear auth tokens here
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white flex flex-col hidden md:flex">
        <div className="p-6 cursor-pointer" onClick={() => navigate('/')}>
          <h2 className="text-2xl font-bold font-inter tracking-tight hover:text-gray-300 transition-colors">CEC Portal</h2>
          <p className="text-sm text-gray-400 mt-1 capitalize">{role} Dashboard</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to={`/${role}-dashboard`} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 text-gray-300 hover:text-white">
            Dashboard
          </Link>
          {role === 'admin' && (
            <Link to="/admin-courses" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 text-gray-300 hover:text-white">
              Course Management
            </Link>
          )}
          {role === 'student' && (
            <Link to="/student-id-card" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 text-gray-300 hover:text-white">
              View ID Card
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 transition duration-200 text-gray-300 hover:text-white">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
          <div className="flex items-center md:hidden">
            <span className="text-xl font-bold text-gray-800 cursor-pointer" onClick={() => navigate('/')}>CEC Portal</span>
          </div>
          <div className="ml-auto">
            {/* Top right logout removed as requested */}
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
