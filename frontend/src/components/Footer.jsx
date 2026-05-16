import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Thiagarajar Polytechnic College</h3>
            <p className="text-sm leading-relaxed mb-4">
              Continuing Education Centre (CEC)<br />
              Empowering students through advanced technical education and skill development programs.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register for Courses</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <address className="not-italic text-sm space-y-2">
              <p>Thiagarajar Polytechnic College</p>
              <p>Junction Main Road</p>
              <p>Salem - 636 005, Tamil Nadu, India</p>
              <p className="mt-4">Email: contact@tpt.edu.in</p>
              <p>Phone: +91 427 1234567</p>
            </address>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Continuing Education Centre, Thiagarajar Polytechnic College. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
