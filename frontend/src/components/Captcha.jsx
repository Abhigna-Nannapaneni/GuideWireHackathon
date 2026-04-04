import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";

export default function Captcha({ onVerify }) {
  const [state, setState] = useState("idle"); // idle, loading, verified

  const handleClick = () => {
    if (state === "idle") {
      setState("loading");
      // Simulate network verification
      setTimeout(() => {
        setState("verified");
        onVerify(true);
      }, 1200);
    }
  };

  return (
    <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-3 items-center shadow-sm w-full transition-all">
      <div 
        onClick={handleClick} 
        className={`w-7 h-7 flex-shrink-0 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${
          state === "verified" ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300 hover:border-slate-400"
        }`}
      >
        {state === "loading" && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
        {state === "verified" && <Check className="w-4 h-4 text-white font-bold" />}
      </div>
      
      <span className="ml-4 text-slate-700 font-medium select-none">I'm not a robot</span>
      
      <div className="ml-auto flex flex-col items-center justify-center text-[10px] text-slate-400">
        <div className="flex items-center space-x-1 opacity-60">
          <div className="w-4 h-4 bg-[url('https://www.gstatic.com/recaptcha/api2/logo_48.png')] bg-contain bg-no-repeat bg-center"></div>
        </div>
        <div className="mt-1 font-semibold flex flex-col items-center">
          <span>reCAPTCHA</span>
          <span className="text-[8px]">Privacy - Terms</span>
        </div>
      </div>
    </div>
  );
}
