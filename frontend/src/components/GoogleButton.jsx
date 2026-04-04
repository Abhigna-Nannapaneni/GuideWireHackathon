import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function GoogleButton({ actionText = "Continue with Google" }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectAccount = (email, name) => {
    setLoading(true);
    setTimeout(() => {
       localStorage.setItem("shiftshield_user", JSON.stringify({ id: "demo-google-user", name: name, email: email }));
       setShowModal(false);
       navigate(`/dashboard/demo-google-user`);
    }, 1200);
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center p-3.5 bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold rounded-xl shadow-sm transition-all focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {actionText}
      </button>

      {/* Mock Google OAuth Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-slate-900 max-w-sm w-full rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in border border-slate-700">
            {loading && (
              <div className="absolute inset-0 bg-slate-900/80 z-10 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            )}
            
            <div className="p-8 text-center border-b border-slate-800">
              <svg className="w-10 h-10 mx-auto mb-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <h3 className="text-xl font-medium text-white">Choose an account</h3>
              <p className="text-slate-400 mt-2 text-sm">to continue to <span className="font-bold text-indigo-400">ShiftShield</span></p>
            </div>

            <div className="p-2">
              <button onClick={() => handleSelectAccount('rajukumar@gmail.com', 'Raju Kumar')} className="w-full flex items-center p-4 hover:bg-slate-800 rounded-xl transition-colors border-b border-transparent hover:border-slate-700 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mr-4">R</div>
                <div className="text-left">
                  <p className="font-medium text-white">Raju Kumar</p>
                  <p className="text-xs text-slate-400">rajukumar@gmail.com</p>
                </div>
              </button>

              <button onClick={() => handleSelectAccount('amit.delivery@gmail.com', 'Amit Sharma')} className="w-full flex items-center p-4 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border-b border-slate-800">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mr-4">A</div>
                <div className="text-left">
                  <p className="font-medium text-white">Amit Sharma</p>
                  <p className="text-xs text-slate-400">amit.delivery@gmail.com</p>
                </div>
              </button>

              <button onClick={() => setShowModal(false)} className="w-full text-center p-4 hover:bg-slate-800/50 rounded-b-2xl font-medium text-indigo-400 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
