import { useEffect, useState } from "react";
import { PageHero } from "../components/ui/PageHero";
import { api } from "../lib/api";
import { useAuth } from "../providers/AuthProvider";

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get(`/certificates/${user._id}`)
        .then(res => {
          if (res.data?.success) {
            setCertificates(res.data.certificates || []);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return <div className="p-20 text-center">Please log in to view your certificates.</div>;
  }

  const getCertStyle = (type) => {
    switch(type) {
      case "winner": return "from-amber-400 to-orange-500 border-amber-300";
      case "top-innovator": return "from-purple-500 to-indigo-600 border-indigo-400";
      default: return "from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border-slate-300 dark:border-slate-600";
    }
  }

  return (
    <div>
      <PageHero
        badge="My achievements"
        title="Verified certificates and awards"
        description="View and download your earned certificates from competitions, science fairs, and innovation challenges."
      />
      
      <section className="mx-auto max-w-7xl px-4 py-12">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading certificates...</div>
        ) : certificates.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {certificates.map((cert) => (
              <div key={cert._id} className="relative group perspective-1000">
                <div className={`relative p-8 rounded-xl border-4 bg-gradient-to-br shadow-xl transition-transform duration-500 transform group-hover:scale-[1.02] ${getCertStyle(cert.type)}`}>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 p-4 opacity-20">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>

                  <div className="relative z-10 text-center space-y-6">
                    <h2 className={`font-display text-3xl font-bold uppercase tracking-widest ${cert.type === "winner" || cert.type === "top-innovator" ? "text-white" : "text-slate-800 dark:text-white"}`}>
                      Certificate of {cert.type === "winner" ? "Excellence" : "Participation"}
                    </h2>
                    
                    <p className={`text-lg font-medium ${cert.type === "winner" || cert.type === "top-innovator" ? "text-white/80" : "text-slate-600 dark:text-slate-300"}`}>
                      This certifies that
                    </p>
                    
                    <h3 className={`font-display text-4xl font-bold italic border-b border-black/10 dark:border-white/10 pb-4 inline-block px-8 ${cert.type === "winner" || cert.type === "top-innovator" ? "text-white" : "text-brand-700 dark:text-brand-300"}`}>
                      {user.fullName}
                    </h3>
                    
                    <p className={`text-lg font-medium ${cert.type === "winner" || cert.type === "top-innovator" ? "text-white/80" : "text-slate-600 dark:text-slate-300"}`}>
                      has successfully participated in and submitted an innovation for
                    </p>
                    
                    <h4 className={`font-bold text-2xl ${cert.type === "winner" || cert.type === "top-innovator" ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
                      {cert.competition?.title || "SkillVerse Official Event"}
                    </h4>

                    <div className="flex justify-between items-end mt-12 pt-8 border-t border-black/10 dark:border-white/10">
                      <div className="text-left">
                        <p className={`text-xs uppercase tracking-wider font-bold mb-1 ${cert.type === "winner" || cert.type === "top-innovator" ? "text-white/60" : "text-slate-500"}`}>Issue Date</p>
                        <p className={`font-medium ${cert.type === "winner" || cert.type === "top-innovator" ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs uppercase tracking-wider font-bold mb-1 ${cert.type === "winner" || cert.type === "top-innovator" ? "text-white/60" : "text-slate-500"}`}>Certificate ID</p>
                        <p className={`font-mono text-sm ${cert.type === "winner" || cert.type === "top-innovator" ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                          {cert.certificateNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Download Button Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center z-20 backdrop-blur-sm">
                  <button onClick={() => window.print()} className="px-6 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Print / Save PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card py-24 text-center">
            <svg className="w-20 h-20 mx-auto text-slate-300 dark:text-slate-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            <h3 className="font-display text-2xl font-bold text-slate-700 dark:text-slate-300">No Certificates Yet</h3>
            <p className="mt-2 text-slate-500">Participate in competitions and submit projects to earn certificates.</p>
          </div>
        )}
      </section>
    </div>
  );
}
