import { useEffect, useState } from "react";
import { Shield, Zap, CheckCircle2, AlertCircle, Clock, Server, Monitor, Crosshair, Network, Cpu } from "lucide-react";

export default function Dashboard() {
  const userStr = localStorage.getItem("shiftshield_user");
  const workerId = userStr ? JSON.parse(userStr).id : null;
  const [worker, setWorker] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [triggering, setTriggering] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [wrkRes, polRes, clmRes] = await Promise.all([
        fetch(`http://localhost:4000/api/workers/id/${workerId}`),
        fetch(`http://localhost:4000/api/policies/worker/${workerId}`),
        fetch(`http://localhost:4000/api/claims/worker/${workerId}`)
      ]);
      if(wrkRes.ok) setWorker(await wrkRes.json());
      if(polRes.ok) setPolicies(await polRes.json());
      if(clmRes.ok) setClaims(await clmRes.json());
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 3000);
    return () => clearInterval(interval);
  }, [workerId]);

  const handlePurchase = async (planLevel) => {
    setPurchasing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // processing sim
      await fetch("http://localhost:4000/api/policies/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, planLevel })
      });
      fetchDashboardData();
    } catch(e) {
      console.error(e);
    } finally {
      setPurchasing(false);
    }
  };

  const handleSimulateTrigger = async () => {
    setTriggering(true);
    try {
      await fetch("http://localhost:4000/api/claims/webhook/weather-trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "EXTREME_RAIN", severity: "HIGH" })
      });
      fetchDashboardData();
    } catch(e) {
      console.error(e);
    } finally {
      setTriggering(false);
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center text-indigo-400 font-sans font-semibold text-sm">
      <div className="flex flex-wrap items-center space-x-2">
        <Cpu className="w-5 h-5 animate-pulse" />
        <span className="animate-pulse">Loading Dashboard Data...</span>
      </div>
    </div>
  );

  const handleManualClaim = async () => {
    setTriggering(true);
    try {
      await fetch("http://localhost:4000/api/claims/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, eventType: "MANUAL_REPORT_SEVERE_WEATHER" })
      });
      fetchDashboardData();
    } catch(e) {
      console.error(e);
    } finally {
      setTriggering(false);
    }
  };

  const activePolicy = policies.find(p => p.status === "ACTIVE");

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Identity Header */}
      <div className="dashboard-card p-6 flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        
        <div className="flex items-center space-x-5 shadow-sm">
          <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-2 relative">
             <div className="absolute inset-0 bg-indigo-500/20 rounded-xl animate-pulse"></div>
             <Monitor className="w-8 h-8 text-indigo-400 z-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight flex items-center">
              {worker?.name || 'Worker Name'} 
              <span className="ml-3 text-[10px] uppercase font-sans font-bold tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Online</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-slate-400 text-xs font-sans font-medium">
              <span className="flex items-center bg-slate-800/80 px-2 py-1 rounded border border-slate-700"><Network className="w-3 h-3 mr-1"/> Platform: {worker?.platform}</span>
              <span className="flex items-center bg-slate-800/80 px-2 py-1 rounded border border-slate-700"><Crosshair className="w-3 h-3 mr-1"/> Pincode: {worker?.zonePincode}</span>
              <span className="flex items-center bg-slate-800/80 px-2 py-1 rounded border border-slate-700"><Server className="w-3 h-3 mr-1"/> UPI ID: {worker?.upiId}</span>
            </div>
          </div>
        </div>
        
        <div className={`mt-6 md:mt-0 px-5 py-2.5 rounded-lg border flex items-center font-sans font-semibold text-xs uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)] ${activePolicy ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'}`}>
          {activePolicy ? <><Shield className="w-4 h-4 mr-2 text-indigo-400" /> Policy Active</> : <><AlertCircle className="w-4 h-4 mr-2 text-rose-400" /> No Active Policy</>}
        </div>
      </div>

      {/* Claims Success Alert (If any) */}
      {claims.filter(c => c.status === "APPROVED").length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] flex items-start">
          <Zap className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-emerald-400"/>
          <div>
            <h3 className="font-bold text-emerald-300 text-sm">Payout Transferred</h3>
            <p className="text-xs mt-1 text-emerald-400/80 font-sans">Extreme conditions hit. We safely transferred funds to your UPI account.</p>
          </div>
        </div>
      )}

      {/* Policy State */}
      {activePolicy ? (
        <div className="dashboard-card overflow-hidden">
          <div className="bg-slate-900/50 border-b border-slate-800/50 px-6 py-4 flex justify-between items-center backdrop-blur-sm">
            <h3 className="font-bold text-white flex items-center text-sm uppercase tracking-wider">
              <Shield className="w-4 h-4 mr-2 text-indigo-400" /> Active Policy Details
            </h3>
            <span className="text-xs font-sans font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded">7-Day Coverage</span>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <p className="text-slate-400 text-xs font-sans font-semibold uppercase tracking-widest mb-1 shadow-sm">Premium Paid</p>
              <p className="text-3xl font-extrabold text-white glow-text">₹{activePolicy.premiumAmount}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <p className="text-slate-400 text-xs font-sans font-semibold uppercase tracking-widest mb-1 shadow-sm">Max Coverage Amount</p>
              <p className="text-3xl font-extrabold text-white glow-text">₹{activePolicy.maxPayout}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 flex flex-col justify-center">
              <p className="text-slate-400 text-xs font-sans font-semibold uppercase tracking-widest mb-1 shadow-sm">Status</p>
              <p className="font-semibold text-emerald-400 flex items-center text-sm mt-1 bg-emerald-500/10 px-3 py-2 rounded-md border border-emerald-500/20 w-fit">
                <CheckCircle2 className="w-4 h-4 mr-2"/> Actively Monitoring Weather
              </p>
            </div>
          </div>
          <div className="bg-slate-900/30 p-4 border-t border-slate-800/50 flex justify-between items-center flex-wrap gap-2">
            <span className="text-xs text-slate-400 font-sans">Parametric automation is active. Claims process automatically during external disruptions.</span>
            <div className="flex gap-2">
              <button onClick={handleManualClaim} disabled={triggering} className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-sans font-bold text-xs px-4 py-2 rounded transition-colors disabled:opacity-50">
                {triggering ? "Processing..." : "File Manual Claim"}
              </button>
              <button onClick={handleSimulateTrigger} disabled={triggering} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 font-sans font-bold text-xs px-4 py-2 rounded transition-colors disabled:opacity-50">
                {triggering ? "Simulating..." : "Simulate Weather Disruption"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="dashboard-card p-6 flex flex-col items-start relative group hover:border-slate-600 transition-colors">
            <span className="bg-slate-800 text-indigo-300 text-xs font-sans font-semibold uppercase tracking-widest px-3 py-1.5 rounded border border-slate-700 mb-5 inline-flex items-center">
               <Zap className="w-3 h-3 mr-1.5 text-indigo-400"/> Basic Coverage
            </span>
            <h3 className="text-xl font-bold text-white mb-1">Standard Plan</h3>
            <div className="mb-6 flex items-baseline">
              <span className="text-4xl font-extrabold text-white">₹49</span><span className="text-slate-500 font-sans font-medium text-sm ml-2">/ week</span>
            </div>
            <ul className="text-sm text-slate-400 space-y-4 w-full mb-8 font-sans">
               <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-3 text-slate-500 mt-0.5 shrink-0"/> Max Payout: ₹1,000</li>
               <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-3 text-slate-500 mt-0.5 shrink-0"/> Global Weather Tracking</li>
            </ul>
            <button disabled={purchasing} onClick={() => handlePurchase("STANDARD")} 
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-3 rounded-lg mt-auto transition-colors text-sm disabled:opacity-50 font-sans uppercase tracking-wide">
              {purchasing ? "Processing Payment..." : "Buy Standard Plan"}
            </button>
          </div>

          <div className="dashboard-card p-6 flex flex-col items-start relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none z-0"></div>
            <span className="bg-indigo-500/10 text-indigo-400 text-xs font-sans font-semibold uppercase tracking-widest px-3 py-1.5 rounded border border-indigo-500/20 mb-5 inline-flex items-center z-10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
               <Shield className="w-3 h-3 mr-1.5 text-indigo-400"/> Premium Coverage
            </span>
            <h3 className="text-xl font-bold text-white mb-1 z-10">Pro Plan</h3>
            <div className="mb-6 flex items-baseline z-10">
              <span className="text-4xl font-extrabold text-white glow-text">₹79</span><span className="text-indigo-400/60 font-sans font-medium text-sm ml-2">/ week</span>
            </div>
            <ul className="text-sm text-slate-300 space-y-4 w-full mb-8 font-sans z-10">
               <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 shrink-0"/> Max Payout: ₹2,000</li>
               <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-3 text-indigo-400 mt-0.5 shrink-0"/> Localized Pollution Alert Tracking</li>
            </ul>
            <button disabled={purchasing} onClick={() => handlePurchase("PRO")} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg border border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.4)] mt-auto transition-colors text-sm disabled:opacity-50 font-sans uppercase tracking-wide z-10">
              {purchasing ? "Processing Payment..." : "Buy Pro Plan"}
            </button>
          </div>
        </div>
      )}

      {/* Claims Ledger */}
      <div className="dashboard-card mt-8 overflow-hidden border border-slate-800">
        <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 backdrop-blur-sm">
           <h3 className="font-bold text-slate-300 text-sm flex items-center uppercase tracking-wider font-sans">
             <Clock className="w-4 h-4 mr-3 text-slate-500" /> Claims History
           </h3>
        </div>
        <div>
          {claims.length === 0 ? (
            <div className="text-center p-12 text-slate-500 font-sans font-medium text-sm border-t border-slate-800/50">
              <Clock className="w-8 h-8 mx-auto mb-3 text-slate-700"/>
              No claims history found.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
               {claims.map(claim => (
                  <div key={claim.id} className="flex justify-between items-center p-6 bg-slate-900/30 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-indigo-400"/>
                       </div>
                       <div>
                         <p className="font-bold text-white text-sm tracking-wide">{claim.triggerEvent.replace("_", " ")}</p>
                         <p className="text-[11px] text-slate-500 font-sans mt-1">ID: {claim.id} • {new Date(claim.createdAt).toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-sans font-bold text-white shadow-sm">+₹{claim.payoutAmount}</p>
                       <p className="text-[9px] font-sans font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-1 inline-block uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.1)]">Approved</p>
                    </div>
                  </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
