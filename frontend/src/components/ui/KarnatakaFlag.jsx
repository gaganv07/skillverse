import flagImg from "../../karnataka-flag.png";

export function KarnatakaFlag({ className = "" }) {
  return (
    <div className={`relative overflow-hidden inline-flex items-center justify-center ${className}`}>
      <img 
        src={flagImg} 
        alt="Karnataka Flag" 
        className="object-cover w-full h-full animate-wave"
        style={{
          transformOrigin: 'left center',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />
    </div>
  );
}
