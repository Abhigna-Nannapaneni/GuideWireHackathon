import { Link } from "react-router-dom";
import { ShieldCheck, Zap, CloudLightning, Activity, Cpu, Database, Fingerprint } from "lucide-react";

export default function Home() {
  const userStr = localStorage.getItem("shiftshield_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const targetRoute = user ? (user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/register';
  const ctaText = user ? "Go to Dashboard" : "Register Now";

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center max-w-4xl mx-auto py-12 relative">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
        <ShieldCheck className="w-12 h-12 text-indigo-400" />
      </div>
      
      <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
        Smart delivery insurance that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 glow-text">pays out automatically</span>.
      </h1>
      
      <p className="text-lg sm:text-xl text-slate-400 mb-6 leading-relaxed font-medium max-w-2xl mx-auto">
        ShiftShield tracks local weather and pollution in real-time to instantly reimburse your lost wages when extreme conditions prevent you from working. No claim forms required.
      </p>

      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-sm py-2 px-4 rounded-lg mb-10 max-w-2xl mx-auto backdrop-blur-sm">
        <strong>Important:</strong> ShiftShield provides income protection via a <strong>Weekly pricing model</strong>. This strictly excludes coverage for health, life, accidents or vehicle repairs.
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-24 z-10">
        <Link to={targetRoute} className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-indigo-500/50 text-center flex items-center justify-center">
          <Fingerprint className="w-5 h-5 mr-2" /> {ctaText}
        </Link>
        <Link to="/services" className="px-8 py-3.5 bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 font-medium rounded-lg transition-all text-center flex items-center justify-center">
          <Database className="w-5 h-5 mr-2" /> Read Documentation
        </Link>
      </div>

      <div className="w-full grid sm:grid-cols-3 gap-6 relative">
         <div className="glass-panel p-6 text-left relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -z-10 group-hover:bg-blue-500/20 transition-colors"></div>
            <CloudLightning className="w-8 h-8 mb-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            <h4 className="text-lg font-bold text-white mb-2">Weather Monitoring</h4>
            <p className="text-sm text-slate-400">We constantly monitor live feeds from the Indian Meteorological Department.</p>
         </div>
         <div className="glass-panel p-6 text-left relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -z-10 group-hover:bg-amber-500/20 transition-colors"></div>
            <Activity className="w-8 h-8 mb-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            <h4 className="text-lg font-bold text-white mb-2">Pollution Tracking</h4>
            <p className="text-sm text-slate-400">Automatic payouts trigger instantly when city AQI levels exceed safe limits.</p>
         </div>
         <div className="glass-panel p-6 text-left relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -z-10 group-hover:bg-emerald-500/20 transition-colors"></div>
            <Zap className="w-8 h-8 mb-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <h4 className="text-lg font-bold text-white mb-2">Instant Payouts</h4>
            <p className="text-sm text-slate-400">Say goodbye to waiting. Funds are transferred to your UPI ID immediately.</p>
         </div>
      </div>
    </div>
  );
}
