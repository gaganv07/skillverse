import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppShell({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
      <Navbar />
      <main className="relative z-10 pt-[68px] sm:pt-24">{children}</main>
      <Footer />
    </div>
  );
}
