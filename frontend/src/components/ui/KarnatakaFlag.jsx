import flagImg from "../../karnataka-flag.png";

export function KarnatakaFlag({ className = "" }) {
  return (
    <div className={`absolute -z-10 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* 3D Perspective container with higher opacity */}
      <div className="w-full h-full opacity-[0.25] dark:opacity-[0.18]" style={{ perspective: "2000px" }}>
        
        {/* The flag wrapper with 3D wave animation, scaled up and rotated for a diagonal banner feel */}
        <div 
          className="w-[140%] h-[140%] -ml-[20%] -mt-[20%] relative animate-cloth-wave -rotate-6 sm:-rotate-12 scale-110" 
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Base Image: No blur, sharp colors */}
          <img 
            src={flagImg} 
            alt="Karnataka Flag Background" 
            className="w-full h-full object-cover"
          />

          {/* First layer of sweeping light/shadow (Fast Wind) */}
          <div 
            className="absolute inset-0 animate-cloth-wind mix-blend-overlay" 
            style={{ 
              backgroundImage: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.7) 40%, rgba(0,0,0,0.7) 60%, transparent 80%)',
              backgroundSize: '250% 100%' 
            }}
          ></div>
          
          {/* Second layer of intricate, slower folds (Deep Shadows) */}
          <div 
            className="absolute inset-0 animate-cloth-folds mix-blend-overlay" 
            style={{ 
              backgroundImage: 'linear-gradient(85deg, transparent 0%, rgba(0,0,0,0.6) 15%, transparent 30%, rgba(255,255,255,0.6) 45%, transparent 60%, rgba(0,0,0,0.5) 75%, transparent 100%)',
              backgroundSize: '300% 100%' 
            }}
          ></div>

          {/* Static fabric weave texture using repeating CSS gradients */}
          <div 
            className="absolute inset-0 mix-blend-overlay opacity-50" 
            style={{ 
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.2) 1px, rgba(0,0,0,0.2) 2px),
                repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.2) 1px, rgba(0,0,0,0.2) 2px)
              ` 
            }}
          ></div>
        </div>

      </div>
      
      {/* Softer vignette edge blending so the flag isn't completely hidden */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/20 via-transparent to-slate-50 dark:from-slate-950/20 dark:to-slate-950"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-slate-50/80 dark:from-slate-950 dark:to-slate-950/80"></div>
    </div>
  );
}
