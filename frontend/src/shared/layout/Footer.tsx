export default function Footer() {
  return (
    <footer className="relative mt-24 rounded-t-[4rem] bg-foreground px-8 pb-12 pt-24 text-background md:px-24">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">

        {/* Brand & Tagline */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <h2 className="font-sans text-3xl font-bold tracking-tight">MindMirror</h2>
          <p className="max-w-xs font-serif text-lg italic text-background/60">
            Your Personalized AI Mind-Mirror. Absolute clarity through clinical reflection.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-20"></div>
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-background/40">System Operational</span>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-background/40">Platform</h4>
            <a href="#" className="font-sans text-sm text-background/80 hover:text-primary hover:-translate-y-px transition-all">Reflection Space</a>
            <a href="#" className="font-sans text-sm text-background/80 hover:text-primary hover:-translate-y-px transition-all">Sacred Journal</a>
            <a href="#" className="font-sans text-sm text-background/80 hover:text-primary hover:-translate-y-px transition-all">Insight Dashboard</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-background/40">Company</h4>
            <a href="#" className="font-sans text-sm text-background/80 hover:text-primary hover:-translate-y-px transition-all">About Sanity.ID</a>
            <a href="#" className="font-sans text-sm text-background/80 hover:text-primary hover:-translate-y-px transition-all">Methodology</a>
            <a href="#" className="font-sans text-sm text-background/80 hover:text-primary hover:-translate-y-px transition-all">Careers</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-background/40">Legal</h4>
            <a href="#" className="font-sans text-sm text-background/80 hover:text-primary hover:-translate-y-px transition-all">Privacy Policy</a>
            <a href="#" className="font-sans text-sm text-background/80 hover:text-primary hover:-translate-y-px transition-all">Terms of Service</a>
            <a href="#" className="font-sans text-sm text-background/80 hover:text-primary hover:-translate-y-px transition-all">Cookie Preferences</a>
          </div>
        </div>
      </div>

      <div className="mt-24 border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-sans text-sm text-background/40">© {new Date().getFullYear()} Sanity.ID. All rights reserved.</p>
        <p className="font-serif italic text-sm text-background/40">Designed with Serene Clarity.</p>
      </div>
    </footer>
  );
}
