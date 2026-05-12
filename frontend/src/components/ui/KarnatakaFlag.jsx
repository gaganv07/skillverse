import { useEffect, useRef } from "react";

/**
 * KarnatakaFlag — renders a crisp, resolution-independent Karnataka flag
 * as an inline SVG with a realistic waving-cloth effect powered by an
 * animated SVG feTurbulence + feDisplacementMap filter.
 *
 * Designed as a background element for the hero section.
 */
export function KarnatakaFlag({ className = "" }) {
  const turbRef = useRef(null);

  useEffect(() => {
    let frame;
    let t = 0;
    const animate = () => {
      t += 0.004;
      // Slowly shift the turbulence seed values to simulate wind
      if (turbRef.current) {
        turbRef.current.setAttribute(
          "baseFrequency",
          `${0.012 + Math.sin(t) * 0.004} ${0.018 + Math.cos(t * 0.7) * 0.003}`
        );
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`absolute -z-10 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* Main flag layer */}
      <div
        className="w-full h-full animate-cloth-wave"
        style={{
          opacity: 0.22,
          transformOrigin: "center center",
          perspective: "1200px",
        }}
      >
        <svg
          viewBox="0 0 900 600"
          preserveAspectRatio="none"
          className="w-[140%] h-[140%] -ml-[20%] -mt-[20%] -rotate-6 sm:-rotate-12"
          style={{ filter: "url(#cloth-distortion)" }}
          aria-hidden="true"
        >
          <defs>
            {/* SVG cloth distortion filter */}
            <filter id="cloth-distortion" x="-10%" y="-10%" width="120%" height="120%">
              {/* Turbulence creates the organic wave pattern */}
              <feTurbulence
                ref={turbRef}
                type="fractalNoise"
                baseFrequency="0.012 0.018"
                numOctaves="4"
                seed="3"
                stitchTiles="stitch"
                result="turbulence"
              />
              {/* Displacement bends the flag image using the turbulence */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="turbulence"
                scale="35"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Fabric lighting gradient */}
            <linearGradient id="fabric-light" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0%" stopColor="white" stopOpacity="0.15" />
              <stop offset="30%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="black" stopOpacity="0.12" />
              <stop offset="70%" stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Karnataka Flag — Yellow band (top half) */}
          <rect x="0" y="0" width="900" height="300" fill="#FFC61E" />

          {/* Karnataka Flag — Red band (bottom half) */}
          <rect x="0" y="300" width="900" height="300" fill="#DC143C" />

          {/* Thin divider line for realism */}
          <rect x="0" y="296" width="900" height="8" fill="#B8860B" opacity="0.3" />

          {/* Fabric lighting overlay */}
          <rect x="0" y="0" width="900" height="600" fill="url(#fabric-light)" />
        </svg>
      </div>

      {/* Sweeping wind highlight — animates across the flag */}
      <div
        className="absolute inset-0 animate-cloth-wind"
        style={{
          opacity: 0.18,
          backgroundImage:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.6) 45%, rgba(0,0,0,0.3) 55%, transparent 70%)",
          backgroundSize: "300% 100%",
          mixBlendMode: "overlay",
        }}
      ></div>

      {/* Soft edge vignette to blend into hero background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/30 via-transparent to-slate-50/90 dark:from-slate-950/30 dark:to-slate-950/90"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-transparent to-slate-50/80 dark:from-slate-950/80 dark:to-slate-950/80"></div>
    </div>
  );
}
