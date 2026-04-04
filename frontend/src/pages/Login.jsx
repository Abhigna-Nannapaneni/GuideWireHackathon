import { useState, useEffect } from "react";
import { LogIn, AlertCircle, Fingerprint, Shield, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Captcha from "../components/Captcha";

export default function Login() {
  const [role, setRole] = useState(null); // 'WORKER' or 'ADMIN'
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect them
  useEffect(() => {
    const user = localStorage.getItem("shiftshield_user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    }
  }, [navigate]);

  const handleWorkerLogin = async (e) => {
    e.preventDefault();
    if (!captchaVerified) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/workers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("shiftshield_user", JSON.stringify({ ...data, role: "WORKER" }));
        navigate('/dashboard');
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Network timeout. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Mock Admin Login simulation
    setTimeout(() => {
      if (password === "admin123") {
        localStorage.setItem("shiftshield_user", JSON.stringify({ 
          id: "sys-admin-01", 
          name: "System Administrator", 
          role: "ADMIN" 
        }));
        navigate(`/admin`);
      } else {
        setError("Invalid Admin Credentials. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  if (!role) {
    return (
      <div className="max-w-3xl mx-auto mt-20 relative">
        <div className="text-center mb-10">
          <Fingerprint className="w-12 h-12 text-indigo-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">Select Portal Access</h2>
          <p className="text-slate-400 mt-2 text-lg font-sans">Are you a delivery partner or an administrator?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button onClick={() => setRole('WORKER')} className="dashboard-card p-8 group border border-slate-700 hover:border-indigo-500 transition-all hover:-translate-y-1 text-left flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors"></div>
             <User className="w-16 h-16 text-indigo-400 mb-6" />
             <h3 className="text-2xl font-bold text-white mb-2">Worker Portal</h3>
             <p className="text-slate-400 text-center text-sm">Access your claims, manage active policies, and view payout history.</p>
          </button>
          
          <button onClick={() => setRole('ADMIN')} className="dashboard-card p-8 group border border-slate-700 hover:border-rose-500 transition-all hover:-translate-y-1 text-left flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-rose-500/20 transition-colors"></div>
             <Shield className="w-16 h-16 text-rose-400 mb-6" />
             <h3 className="text-2xl font-bold text-white mb-2">Admin Portal</h3>
             <p className="text-slate-400 text-center text-sm">Access system override sandbox, platform analytics, and simulation triggers.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="text-center mb-10">
        {role === 'ADMIN' ? (
          <Shield className="w-12 h-12 text-rose-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
        ) : (
          <User className="w-12 h-12 text-indigo-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
        )}
        <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
          {role === 'ADMIN' ? 'Admin Gateway' : 'Worker Login'}
        </h2>
        <p className="text-slate-400 mt-2 text-sm font-sans">
          {role === 'ADMIN' ? 'Restricted access override interface.' : 'Enter your details to log in to your account.'}
        </p>
      </div>

      <div className="glass-panel p-8 relative overflow-hidden group">
        <form onSubmit={role === 'ADMIN' ? handleAdminLogin : handleWorkerLogin} className="space-y-5 relative z-10">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-md text-sm flex items-center font-sans tracking-wide">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {role === 'WORKER' && (
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Mobile Number</label>
              <input 
                type="tel" 
                required 
                value={phone} 
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-slate-600" 
                placeholder="e.g. 9876543210" 
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-slate-600" 
              placeholder="••••••••" 
            />
          </div>

          {role === 'WORKER' && (
            <div className="pt-2">
              <Captcha onVerify={setCaptchaVerified} />
            </div>
          )}

          <button type="submit" disabled={role === 'WORKER' && (!captchaVerified || loading)}
            className={`w-full flex items-center justify-center p-3 mt-4 font-sans font-bold uppercase tracking-widest rounded-md transition-all text-sm border 
            ${(role === 'WORKER' && !captchaVerified) || loading ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed" : 
              role === 'ADMIN' ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.2)]" : 
              "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.2)]"}`}>
            {loading ? "Authenticating..." : role === 'ADMIN' ? 'Execute Override' : 'Log In'}
            {!loading && <LogIn className="w-4 h-4 ml-2" />}
          </button>
          
          <div className="text-center pt-5 border-t border-slate-800/50 mt-5 space-y-3">
            {role === 'WORKER' && (
              <p className="text-sm font-sans text-slate-400">
                Don't have an account? <Link to="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Register Now</Link>
              </p>
            )}
            <button type="button" onClick={() => setRole(null)} className="text-xs text-slate-500 hover:text-white transition-colors">
               ← Go back to portal selection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
