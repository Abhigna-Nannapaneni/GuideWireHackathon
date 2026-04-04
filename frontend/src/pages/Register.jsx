import { useState, useEffect } from "react";
import { User, Phone, MapPin, ShieldCheck, ChevronRight, Lock, Fingerprint } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Captcha from "../components/Captcha";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "", phone: "", password: "", zonePincode: "", upiId: "", vehicleType: "2W", platform: "Swiggy"
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaVerified) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/workers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      
      localStorage.setItem("shiftshield_user", JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="text-center mb-10">
        <Fingerprint className="w-12 h-12 text-indigo-400 mx-auto mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
        <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">Create Your Account</h2>
        <p className="text-slate-400 mt-2 text-sm font-sans">Set up your profile to start receiving automatic payouts.</p>
      </div>

      <div className="glass-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none z-0"></div>
        
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-md text-sm font-sans tracking-wide">{error}</div>}

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-slate-600" placeholder="John Doe"/>
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Mobile Number</label>
              <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-slate-600" placeholder="9876543210"/>
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-slate-600" placeholder="Enter a strong password"/>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Pincode</label>
              <input type="text" required value={formData.zonePincode} onChange={e => setFormData({...formData, zonePincode: e.target.value})} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-slate-600" placeholder="e.g. 500001"/>
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-1.5">UPI ID (For Payouts)</label>
              <input type="text" required value={formData.upiId} onChange={e => setFormData({...formData, upiId: e.target.value})} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-slate-600" placeholder="number@bank"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Platform</label>
              <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                <option>Swiggy</option>
                <option>Zomato</option>
                <option>Zepto</option>
                <option>Blinkit</option>
                <option>Porter</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-sans font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Vehicle Type</label>
              <select value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})} className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-md text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors">
                <option value="2W">Two Wheeler (Bike/Scooter)</option>
                <option value="3W">Three Wheeler (Auto)</option>
                <option value="BICYCLE">Bicycle</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <Captcha onVerify={setCaptchaVerified} />
          </div>

          <button type="submit" disabled={loading || !captchaVerified}
            className={`w-full flex items-center justify-center p-3 mt-4 font-sans font-bold uppercase tracking-widest rounded-md shadow-[0_0_15px_rgba(79,70,229,0.2)] transition-all text-sm border ${loading || !captchaVerified ? "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500"}`}>
            {loading ? "Creating..." : "Create Account"}
            {!loading && <ChevronRight className="w-4 h-4 ml-2" />}
          </button>

          <div className="text-center pt-5 border-t border-slate-800/50 mt-5">
            <p className="text-sm font-sans text-slate-400">
              Already have an account? <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Sign In</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
