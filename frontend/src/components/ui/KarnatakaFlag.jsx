import flagImg from "../../karnataka-flag.png";

export function KarnatakaFlag({ className = "" }) {
  return (
    <div className={`absolute -z-10 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* 3D Perspective container */}
      <div className="w-full h-full opacity-[0.15] dark:opacity-[0.08]" style={{ perspective: "1500px" }}>
        
        {/* The flag wrapper with 3D wave animation */}
        <div 
          className="w-[120%] h-[120%] -ml-[10%] -mt-[10%] relative animate-cloth-wave" 
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Base Image */}
          <img 
            src={flagImg} 
            alt="Karnataka Flag Background" 
            className="w-full h-full object-cover blur-[1px]"
          />

          {/* First layer of sweeping light/shadow (Fast Wind) */}
          <div 
            className="absolute inset-0 animate-cloth-wind mix-blend-overlay" 
            style={{ 
              backgroundImage: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.8) 40%, rgba(0,0,0,0.6) 60%, transparent 80%)',
              backgroundSize: '250% 100%' 
            }}
          ></div>
          
          {/* Second layer of intricate, slower folds (Deep Shadows) */}
          <div 
            className="absolute inset-0 animate-cloth-folds mix-blend-overlay" 
            style={{ 
              backgroundImage: 'linear-gradient(85deg, transparent 0%, rgba(0,0,0,0.5) 15%, transparent 30%, rgba(255,255,255,0.5) 45%, transparent 60%, rgba(0,0,0,0.4) 75%, transparent 100%)',
              backgroundSize: '300% 100%' 
            }}
          ></div>

          {/* Static fabric weave texture using repeating CSS gradients */}
          <div 
            className="absolute inset-0 mix-blend-overlay opacity-40" 
            style={{ 
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 2px),
                repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.15) 1px, rgba(0,0,0,0.15) 2px)
              ` 
            }}
          ></div>
        </div>

      </div>
      
      {/* Vignette edge blending to perfectly merge with hero background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 via-transparent to-slate-50 dark:from-slate-950/50 dark:to-slate-950"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-slate-50 dark:from-slate-950 dark:to-slate-950"></div>
    </div>
  );
}
