import flagImg from "../../karnataka-flag.png";

export function KarnatakaFlag({ className = "" }) {
  return (
    <div className={`absolute -z-10 overflow-hidden pointer-events-none select-none ${className}`}>
      <div className="w-full h-full opacity-[0.06] dark:opacity-[0.03]" style={{ perspective: "1500px" }}>
        <div className="w-[110%] h-[110%] -ml-[5%] -mt-[5%] relative animate-cloth-wave" style={{ transformStyle: "preserve-3d" }}>
          <img 
            src={flagImg} 
            alt="Karnataka Flag Background" 
            className="w-full h-full object-cover blur-[2px]"
          />
          {/* Wind lighting simulation */}
          <div className="absolute inset-0 animate-cloth-wind bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-black/60 mix-blend-overlay" style={{ backgroundSize: "200% 100%" }}></div>
        </div>
      </div>
    </div>
  );
}
