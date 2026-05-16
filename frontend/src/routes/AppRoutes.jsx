import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import StudentDashboard from '../pages/StudentDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ApplicationForm from '../pages/ApplicationForm';
import StudentIdCard from '../pages/StudentIdCard';
import AdminCourses from '../pages/AdminCourses';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Main Layout (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/apply" element={<ApplicationForm />} />
      </Route>

      {/* Protected Routes with Dashboard Layout */}
      <Route element={<DashboardLayout role="student" />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-id-card" element={<StudentIdCard />} />
      </Route>
      
      <Route element={<DashboardLayout role="admin" />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-courses" element={<AdminCourses />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
