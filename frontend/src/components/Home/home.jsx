import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, AlertCircle, BarChart3, ShieldCheck, 
  Building2, Users, Clock, CheckCircle2, ArrowRight,
  MonitorSmartphone, Shield
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      
   {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Building2 className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold">Smart Campus</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            Sign in
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-600 pt-20 pb-32 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Hero Left Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Powering Modern Universities
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Manage Your <br />Campus Operations <br />
              <span className="text-green-400">Effortlessly</span>
            </h1>
            <p className="text-indigo-100 text-lg mb-8 max-w-lg leading-relaxed">
              A comprehensive platform for managing university facilities, resource bookings, maintenance tickets, and campus operations all in one centralized hub.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                Start Free Trial <ArrowRight size={18} />
              </button>
              <button className="bg-indigo-500/30 text-white border border-indigo-400/30 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500/50 transition-colors">
                Book a Demo
              </button>
            </div>
            <div className="mt-10 flex items-center gap-4 text-sm text-indigo-200">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-indigo-300 border-2 border-indigo-600"></div>
                ))}
              </div>
              <div>
                <div className="flex text-yellow-400">{'★★★★★'}</div>
                <p>Trusted by 50+ universities</p>
              </div>
            </div>
          </div>

          {/* Hero Right Grid Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white">
              <Calendar className="mb-4 text-indigo-300" size={28} />
              <h3 className="font-bold mb-2">Smart Scheduling</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">Automated booking management with conflict detection</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white mt-8">
              <AlertCircle className="mb-4 text-indigo-300" size={28} />
              <h3 className="font-bold mb-2">Quick Response</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">Real-time incident tracking and resolution</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white">
              <BarChart3 className="mb-4 text-indigo-300" size={28} />
              <h3 className="font-bold mb-2">Deep Insights</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">Comprehensive analytics and reporting</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white mt-8">
              <ShieldCheck className="mb-4 text-indigo-300" size={28} />
              <h3 className="font-bold mb-2">Secure Platform</h3>
              <p className="text-sm text-indigo-100 leading-relaxed">Enterprise-grade security and compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS STRIP --- */}
      <div className="max-w-6xl mx-auto -mt-12 relative z-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Building2 className="text-indigo-600" size={24} />
          </div>
          <h4 className="text-3xl font-bold text-gray-900 mb-1">500+</h4>
          <p className="text-sm text-gray-500 font-medium">Campus Resources</p>
        </div>
        <div>
          <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="text-indigo-600" size={24} />
          </div>
          <h4 className="text-3xl font-bold text-gray-900 mb-1">10,000+</h4>
          <p className="text-sm text-gray-500 font-medium">Monthly Bookings</p>
        </div>
        <div>
          <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <MonitorSmartphone className="text-indigo-600" size={24} />
          </div>
          <h4 className="text-3xl font-bold text-gray-900 mb-1">98%</h4>
          <p className="text-sm text-gray-500 font-medium">Uptime Guarantee</p>
        </div>
        <div>
          <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="text-indigo-600" size={24} />
          </div>
          <h4 className="text-3xl font-bold text-gray-900 mb-1">24/7</h4>
          <p className="text-sm text-gray-500 font-medium">Support Available</p>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <div className="bg-gray-50 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Run Your Campus</h2>
            <p className="text-gray-500 text-lg">Powerful features designed to streamline operations, improve efficiency, and enhance the campus experience for everyone.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resource Booking</h3>
              <p className="text-gray-500 leading-relaxed">Streamline facility reservations with intelligent scheduling and automated approval workflows.</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <AlertCircle className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Incident Management</h3>
              <p className="text-gray-500 leading-relaxed">Track and resolve maintenance issues efficiently with real-time updates and photo documentation.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Dashboard</h3>
              <p className="text-gray-500 leading-relaxed">Gain insights into resource utilization, booking trends, and operational performance.</p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User Management</h3>
              <p className="text-gray-500 leading-relaxed">Role-based access control for students, faculty, and administrators with customizable permissions.</p>
            </div>
            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-emerald-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Compliant</h3>
              <p className="text-gray-500 leading-relaxed">Enterprise-grade security ensuring data protection and privacy compliance.</p>
            </div>
            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-yellow-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Availability</h3>
              <p className="text-gray-500 leading-relaxed">Access the platform anytime, anywhere with cloud-based infrastructure and mobile optimization.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- TRANSFORM SECTION --- */}
      <div className="py-24 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">Transform Your Campus Operations</h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Join leading universities that have modernized their operations with Smart Campus Hub.
          </p>
          <ul className="space-y-4">
            {[
              "Reduce administrative overhead by 60%",
              "Improve resource utilization by 40%",
              "Faster incident resolution time",
              "Centralized operations management",
              "Real-time notifications and alerts",
              "Comprehensive audit trails"
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-gray-700 font-medium">
                <CheckCircle2 className="text-green-500" size={20} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-600 p-8 rounded-3xl text-white transform translate-y-4">
            <h3 className="text-4xl font-bold mb-2">60%</h3>
            <p className="text-indigo-100 font-medium">Less Admin Work</p>
          </div>
          <div className="bg-orange-500 p-8 rounded-3xl text-white">
            <h3 className="text-4xl font-bold mb-2">2x</h3>
            <p className="text-orange-100 font-medium">Faster Resolution</p>
          </div>
          <div className="bg-green-500 p-8 rounded-3xl text-white transform translate-y-4">
            <h3 className="text-4xl font-bold mb-2">40%</h3>
            <p className="text-green-100 font-medium">Better Utilization</p>
          </div>
          <div className="bg-red-500 p-8 rounded-3xl text-white">
            <h3 className="text-4xl font-bold mb-2">24/7</h3>
            <p className="text-red-100 font-medium">Always Available</p>
          </div>
        </div>
      </div>

      {/* --- CTA SECTION --- */}
      <div className="bg-indigo-600 py-24 px-8 text-center text-white">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Transform Your Campus?</h2>
        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of administrators, faculty, and students using Smart Campus Hub to streamline operations and enhance the campus experience.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-white text-indigo-600 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
            Get Started Free <ArrowRight size={18} />
          </button>
          <button className="bg-indigo-500 text-white border border-indigo-400 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-400 transition-colors w-full sm:w-auto">
            Book a Demo
          </button>
        </div>
        <p className="text-indigo-200 text-sm mt-6">No credit card required • 14-day free trial</p>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-gray-800 pb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <Building2 className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">Smart Campus</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Empowering universities with modern campus management solutions.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><button className="hover:text-white transition-colors">Features</button></li>
              <li><button className="hover:text-white transition-colors">Pricing</button></li>
              <li><button className="hover:text-white transition-colors">Security</button></li>
              <li><button className="hover:text-white transition-colors">Roadmap</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><button className="hover:text-white transition-colors">About</button></li>
              <li><button className="hover:text-white transition-colors">Blog</button></li>
              <li><button className="hover:text-white transition-colors">Careers</button></li>
              <li><button className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><button className="hover:text-white transition-colors">Documentation</button></li>
              <li><button className="hover:text-white transition-colors">Help Center</button></li>
              <li><button className="hover:text-white transition-colors">Community</button></li>
              <li><button className="hover:text-white transition-colors">Support</button></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© 2026 Smart Campus Operations Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <button className="hover:text-white transition-colors">Cookie Policy</button>
          </div>
        </div>
      </footer>
    </div>
  );
}