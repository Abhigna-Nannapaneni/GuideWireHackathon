import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldAlert, User, LogIn, Activity, Lock, ArrowRight, ShieldCheck, Mail, LayoutDashboard, Settings, Zap, CheckCircle2 } from "lucide-react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

// Utility to read auth state
const getUser = () => {
  const user = localStorage.getItem("shiftshield_user");
  return user ? JSON.parse(user) : null;
};

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  
  const handleLogout = () => {
    localStorage.removeItem("shiftshield_user");
    navigate("/");
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed top-0 left-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link to="/" className="flex items-center group">
          <ShieldAlert className="w-6 h-6 text-indigo-500 mr-2 group-hover:text-indigo-400 transition" />
          <span className="text-xl font-bold text-white tracking-tight glow-text">ShiftShield</span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-1 px-4 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Navigation</div>
        <Link to="/" className={`flex items-center px-3 py-2 rounded-lg transition-colors ${location.pathname==='/' ? 'bg-indigo-500/10 text-indigo-400':'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <LayoutDashboard className="w-4 h-4 mr-3" /> Home
        </Link>
        <Link to="/services" className={`flex items-center px-3 py-2 rounded-lg transition-colors ${location.pathname==='/services' ? 'bg-indigo-500/10 text-indigo-400':'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <Activity className="w-4 h-4 mr-3" /> Services
        </Link>
        <Link to="/about" className={`flex items-center px-3 py-2 rounded-lg transition-colors ${location.pathname==='/about' ? 'bg-indigo-500/10 text-indigo-400':'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <ShieldCheck className="w-4 h-4 mr-3" /> About Us
        </Link>
        <Link to="/contact" className={`flex items-center px-3 py-2 rounded-lg transition-colors ${location.pathname==='/contact' ? 'bg-indigo-500/10 text-indigo-400':'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
          <Mail className="w-4 h-4 mr-3" /> Contact Support
        </Link>

        {user && user.role !== 'ADMIN' && (
          <>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 px-2">Dashboard</div>
            <Link to="/dashboard" className={`flex items-center px-3 py-2 rounded-lg transition-colors ${location.pathname.startsWith('/dashboard') ? 'bg-indigo-500/10 text-indigo-400':'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <User className="w-4 h-4 mr-3" /> My Dashboard
            </Link>
          </>
        )}

        {user && user.role === 'ADMIN' && (
          <>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 px-2">System</div>
            <Link to="/admin" className={`flex items-center px-3 py-2 rounded-lg transition-colors ${location.pathname==='/admin' ? 'bg-emerald-500/10 text-emerald-400':'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Settings className="w-4 h-4 mr-3" /> Admin Panel
            </Link>
          </>
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center bg-slate-800 px-3 py-2 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium text-white truncate">{user.name || "Worker"}</div>
                <div className="text-xs text-slate-400 line-clamp-1 truncate">{user.id}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link to="/login" className="w-full flex justify-center items-center py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors">
              <LogIn className="w-4 h-4 mr-2" /> Sign In
            </Link>
            <Link to="/register" className="w-full flex justify-center items-center py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
              Register Now
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}

// Route Guard Component
function ProtectedRoute({ children }) {
  const user = getUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const ServicesPage = () => {
  const user = getUser();
  const targetRoute = user ? (user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/register';
  const buttonTextStandard = user ? 'Purchase from Dashboard' : 'Register to Buy Standard';
  const buttonTextPro = user ? 'Purchase Pro from Dashboard' : 'Register to Buy Pro';

  return (
    <div className="py-10 max-w-5xl mx-auto text-slate-300">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold mb-3 text-white">Our Protection Plans</h2>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">Transparent, zero-touch automated coverage plans tailored for the modern gig economy.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Standard Plan */}
        <div className="dashboard-card p-8 border border-slate-700 flex flex-col relative group hover:border-slate-500 transition-colors">
          <span className="bg-slate-800 text-indigo-300 text-xs font-sans font-semibold uppercase tracking-widest px-3 py-1.5 rounded border border-slate-700 mb-5 inline-flex items-center w-max">
             <Zap className="w-3 h-3 mr-1.5 text-indigo-400"/> Basic Coverage
          </span>
          <h3 className="text-2xl font-bold text-white mb-2">Standard Plan</h3>
          <p className="text-sm text-slate-400 mb-6">Essential protection against common weather disruptions.</p>
          
          <div className="mb-6 flex items-baseline">
            <span className="text-5xl font-extrabold text-white">₹49</span><span className="text-slate-500 font-sans font-medium text-sm ml-2">/ week</span>
          </div>
          
          <ul className="text-sm text-slate-400 space-y-4 w-full mb-8 font-sans flex-1">
             <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-slate-500 mt-0.5 shrink-0"/> <span className="pt-0.5">Max Automated Payout: ₹1,000</span></li>
             <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-slate-500 mt-0.5 shrink-0"/> <span className="pt-0.5">Heavy Rain Protection (&gt;35mm/hr trigger) via IMD</span></li>
             <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-slate-500 mt-0.5 shrink-0"/> <span className="pt-0.5">Instant UPI Settlement</span></li>
          </ul>
          
          <Link to={targetRoute} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-3 rounded-lg text-center transition-colors text-sm font-sans uppercase tracking-wide">
            {buttonTextStandard}
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="dashboard-card p-8 border border-indigo-500/30 flex flex-col relative group hover:border-indigo-500/60 transition-colors overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none z-0"></div>
          <span className="bg-indigo-500/10 text-indigo-400 text-xs font-sans font-semibold uppercase tracking-widest px-3 py-1.5 rounded border border-indigo-500/20 mb-5 inline-flex items-center w-max z-10">
             <ShieldAlert className="w-3 h-3 mr-1.5 text-indigo-400"/> Maximum Security
          </span>
          <h3 className="text-2xl font-bold text-white mb-2 z-10">Pro Plan</h3>
          <p className="text-sm text-slate-400 mb-6 z-10">Complete coverage against extreme weather and hazardous environmental conditions.</p>
          
          <div className="mb-6 flex items-baseline z-10">
            <span className="text-5xl font-extrabold text-white glow-text">₹79</span><span className="text-indigo-400/60 font-sans font-medium text-sm ml-2">/ week</span>
          </div>
          
          <ul className="text-sm text-slate-300 space-y-4 w-full mb-8 font-sans flex-1 z-10">
             <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-indigo-400 mt-0.5 shrink-0"/> <span className="pt-0.5">Max Automated Payout: ₹2,000</span></li>
             <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-indigo-400 mt-0.5 shrink-0"/> <span className="pt-0.5">Heavy Rain Protection (&gt;35mm/hr trigger) via IMD</span></li>
             <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-indigo-400 mt-0.5 shrink-0"/> <span className="pt-0.5">Severe Air Pollution Defense (AQI &gt; 350 shutdown limit)</span></li>
             <li className="flex items-start"><CheckCircle2 className="w-5 h-5 mr-3 text-indigo-400 mt-0.5 shrink-0"/> <span className="pt-0.5">Instant UPI Settlement</span></li>
          </ul>
          
          <Link to={targetRoute} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg border border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.4)] text-center transition-colors text-sm font-sans uppercase tracking-wide z-10">
            {buttonTextPro}
          </Link>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="py-10 max-w-3xl mx-auto text-slate-300">
    <h2 className="text-3xl font-bold mb-4 text-white">About ShiftShield</h2>
    <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-2xl">
      Fixing the friction of the gig economy through zero-touch automated claim settlements.
    </p>
    <div className="p-8 glass-panel text-left align-middle inline-block w-full">
      <Lock className="w-8 h-8 text-indigo-500 mb-4" />
      <h4 className="font-bold text-lg mb-2 text-white">Our Mission</h4>
      <p className="text-sm text-slate-400 leading-relaxed">
        Delivery partners navigate extreme conditions to hit 10-minute SLAs. Our platform eliminates the bureaucracy of loss-wage claims by routing automatic payouts to you the absolute second environmental conditions become dangerous.
      </p>
    </div>
  </div>
);

const ContactPage = () => {
  const [formData, setFormData] = React.useState({ email: '', message: '' });
  const [status, setStatus] = React.useState('idle'); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const user = getUser();
      const payload = {
        email: formData.email,
        message: formData.message,
        workerId: user ? user.id : null
      };

      const res = await fetch("http://localhost:4000/api/support/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch(err) {
      setStatus('error');
    }
  };

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white flex items-center"><Mail className="w-6 h-6 mr-3 text-indigo-500" /> Contact Support</h2>
        <p className="text-slate-400 text-sm">Need help? Give us a call at 1800-123-4567</p>
      </div>
      
      <div className="glass-panel p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'success' && <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-sm font-medium">Message sent successfully! We'll be in touch.</div>}
          {status === 'error' && <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-sm font-medium">Failed to send message. Please try again.</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow placeholder-slate-600" placeholder="you@example.com"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Your Message</label>
            <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows="4" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow placeholder-slate-600" placeholder="How can we help?"></textarea>
          </div>
          
          <button type="submit" disabled={status === 'loading'} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 text-sm mt-2">
             {status === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex">
        <Sidebar />
        
        <main className="flex-1 ml-64 p-8 relative overflow-y-auto">
          {/* Decorative background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -z-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none -z-10"></div>
          
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
