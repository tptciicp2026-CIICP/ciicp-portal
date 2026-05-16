import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Award, Monitor, Settings, Lightbulb, ChevronRight, GraduationCap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Dynamic Hero Section with Background Image */}
      <div 
        className="relative bg-secondary text-white min-h-[600px] flex items-center justify-center pt-10 pb-24"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 41, 70, 0.85), rgba(15, 41, 70, 0.95)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 w-full">
          <div className="inline-block bg-accent-500 text-white font-bold px-4 py-1.5 rounded-full text-sm mb-6 uppercase tracking-wider animate-pulse">
            Admissions Open 2024-2026
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Continuing Education Centre
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-4xl mx-auto leading-relaxed font-light drop-shadow">
            Empowering students and professionals with industry-aligned certification courses since 1993. 
            Join the legacy of Thiagarajar Polytechnic College.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link to="/register" className="bg-accent-500 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-accent-600 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center">
              Apply For Admission <ChevronRight className="ml-2" size={20}/>
            </Link>
            <Link to="/login" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/50 px-8 py-4 rounded-md font-bold text-lg hover:bg-white/20 transition-all transform hover:scale-105 shadow-lg">
              Student Login
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Stats Section - Overlapping the Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat 1 */}
          <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-primary-600 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <Users size={32} />
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-1">1,25,000<span className="text-primary-600">+</span></h3>
            <p className="text-lg font-bold text-gray-700">Students Trained</p>
            <p className="text-xs text-gray-400 mt-2 font-semibold uppercase tracking-wider">From 1993 to 2024</p>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-accent-500 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-accent-50 text-accent-600 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <Award size={32} />
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-1">5,000<span className="text-accent-500">+</span></h3>
            <p className="text-lg font-bold text-gray-700">Participants Benefitted</p>
            <p className="text-xs text-gray-400 mt-2 font-semibold uppercase tracking-wider">Annually</p>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-green-500 flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-5 shadow-inner">
              <BookOpen size={32} />
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-1">300<span className="text-green-500">+</span></h3>
            <p className="text-lg font-bold text-gray-700">Programmes Offered</p>
            <p className="text-xs text-gray-400 mt-2 font-semibold uppercase tracking-wider">Every year</p>
          </div>
        </div>
      </div>

      {/* About CIICP Section to break up space */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2">About CIICP</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Pioneering Skill Development <br/> in South India
              </h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                The Canada India Institutional Co-operation Project (CIICP) is a major human resource development project launched in 1993. 
                At Thiagarajar Polytechnic College, our Continuing Education Centre identifies the needs of the community and offers cutting-edge short-term courses.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start"><GraduationCap className="text-accent-500 mr-3 mt-1 flex-shrink-0"/> <span className="text-gray-700 font-medium">Industry-tailored curriculum matching current market demands.</span></li>
                <li className="flex items-start"><GraduationCap className="text-accent-500 mr-3 mt-1 flex-shrink-0"/> <span className="text-gray-700 font-medium">State-of-the-art laboratories and highly experienced faculty.</span></li>
                <li className="flex items-start"><GraduationCap className="text-accent-500 mr-3 mt-1 flex-shrink-0"/> <span className="text-gray-700 font-medium">Certification that is widely recognized across various sectors.</span></li>
              </ul>
            </div>
            <div className="lg:w-1/2 relative">
               {/* Pattern Background */}
               <div className="absolute inset-0 bg-primary-100 transform translate-x-4 translate-y-4 rounded-xl -z-10"></div>
               <img 
                 src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                 alt="Students in lab" 
                 className="rounded-xl shadow-lg w-full object-cover h-[400px]"
               />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Programmes Matrix (Dark Theme) */}
      <div className="bg-secondary text-white py-24 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-700 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-accent-600 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-accent-400 font-bold tracking-wider uppercase text-sm mb-2 block">Our Impact</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">Extensive Programme Reach</h2>
            <div className="w-24 h-1 bg-accent-500 mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Category 1 */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-500 transition-colors shadow-2xl group">
              <Monitor className="w-14 h-14 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-8 text-white">Computer Courses</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-slate-300 text-sm uppercase tracking-wider font-semibold mb-1">No. of Programmes</p>
                  <p className="text-4xl font-black text-white">3,937<span className="text-blue-400">+</span></p>
                </div>
                <div className="pt-6 border-t border-slate-700">
                  <p className="text-slate-300 text-sm uppercase tracking-wider font-semibold mb-1">No. of Beneficiaries</p>
                  <p className="text-4xl font-black text-white">62,464<span className="text-blue-400">+</span></p>
                </div>
              </div>
            </div>

            {/* Category 2 */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-green-500 transition-colors shadow-2xl group transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">MOST POPULAR</div>
              <Settings className="w-14 h-14 text-green-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-8 text-white">Skill Development</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-slate-300 text-sm uppercase tracking-wider font-semibold mb-1">No. of Programmes</p>
                  <p className="text-4xl font-black text-white">2,326<span className="text-green-400">+</span></p>
                </div>
                <div className="pt-6 border-t border-slate-700">
                  <p className="text-slate-300 text-sm uppercase tracking-wider font-semibold mb-1">No. of Beneficiaries</p>
                  <p className="text-4xl font-black text-white">33,488<span className="text-green-400">+</span></p>
                </div>
              </div>
            </div>

            {/* Category 3 */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-yellow-500 transition-colors shadow-2xl group">
              <Lightbulb className="w-14 h-14 text-yellow-400 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold mb-8 text-white">Other Courses</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-slate-300 text-sm uppercase tracking-wider font-semibold mb-1">No. of Programmes</p>
                  <p className="text-4xl font-black text-white">951<span className="text-yellow-400">+</span></p>
                </div>
                <div className="pt-6 border-t border-slate-700">
                  <p className="text-slate-300 text-sm uppercase tracking-wider font-semibold mb-1">No. of Beneficiaries</p>
                  <p className="text-4xl font-black text-white">27,669<span className="text-yellow-400">+</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer CTA Section */}
      <div className="bg-gray-100 py-20 text-center relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Ready to upgrade your career?</h2>
          <p className="text-gray-600 text-lg">Registration is now open for the upcoming batch. Secure your spot in our industry-recognized certification programs today.</p>
        </div>
      </div>

    </div>
  );
};

export default Home;
