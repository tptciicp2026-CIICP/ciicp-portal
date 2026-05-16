import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // In a real app, clear auth tokens here
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-secondary text-white flex flex-col absolute md:relative z-30 h-full transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 cursor-pointer" onClick={() => navigate('/')}>
          <h2 className="text-2xl font-bold font-inter tracking-tight hover:text-gray-300 transition-colors">CEC Portal</h2>
          <p className="text-sm text-gray-400 mt-1 capitalize">{role} Dashboard</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <Link onClick={closeMobileMenu} to={`/${role}-dashboard`} className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname.includes('dashboard') ? 'bg-primary-600 text-white' : 'hover:bg-gray-700 text-gray-300 hover:text-white'}`}>
            Dashboard
          </Link>
          {role === 'admin' && (
            <Link onClick={closeMobileMenu} to="/admin-courses" className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname.includes('courses') ? 'bg-primary-600 text-white' : 'hover:bg-gray-700 text-gray-300 hover:text-white'}`}>
              Course Management
            </Link>
          )}
          {role === 'student' && (
            <Link onClick={closeMobileMenu} to="/student-id-card" className={`block py-2.5 px-4 rounded transition duration-200 ${location.pathname.includes('id-card') ? 'bg-primary-600 text-white' : 'hover:bg-gray-700 text-gray-300 hover:text-white'}`}>
              View ID Card
            </Link>
          )}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full text-left py-2 px-4 rounded hover:bg-red-600 hover:bg-opacity-80 transition duration-200 text-gray-300 hover:text-white flex items-center">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="mr-3 md:hidden p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Menu size={24} />
            </button>
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
