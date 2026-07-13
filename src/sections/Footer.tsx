import { Shield, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-4 flex flex-col items-start gap-4">
          <div className="flex items-center gap-2.5 text-cyan-600 dark:text-cyan-400">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20">
              <Shield className="w-5 h-5 fill-cyan-500/20" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-slate-800 dark:text-white">
              MedGuard <span className="text-cyan-500">AI</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Intelligent pre-treatment screening that maps patient vitals and symptoms to risk vectors, protecting patients and assisting clinical workflows.
          </p>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {currentYear} MedGuard AI Inc. All rights reserved.
          </span>
        </div>

        {/* Features Column */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Features</span>
          <ul className="flex flex-col gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-455">
            <li><a href="#features" className="hover:text-cyan-500 transition-colors">AI Medical Analysis</a></li>
            <li><a href="#features" className="hover:text-cyan-500 transition-colors">Risk Prediction</a></li>
            <li><a href="#features" className="hover:text-cyan-500 transition-colors">Allergy Detection</a></li>
            <li><a href="#features" className="hover:text-cyan-500 transition-colors">Real-Time Dashboards</a></li>
          </ul>
        </div>

        {/* Technology Column */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Technology</span>
          <ul className="flex flex-col gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-455">
            <li><span className="hover:text-cyan-500 cursor-default transition-colors">React 18 + Vite</span></li>
            <li><span className="hover:text-cyan-500 cursor-default transition-colors">TypeScript</span></li>
            <li><span className="hover:text-cyan-500 cursor-default transition-colors">Tailwind CSS v4</span></li>
            <li><span className="hover:text-cyan-500 cursor-default transition-colors">Framer Motion</span></li>
            <li><span className="hover:text-cyan-500 cursor-default transition-colors">Recharts</span></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="md:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contact & Support</span>
          <ul className="flex flex-col gap-3 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-455">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
              <a href="mailto:support@medguard.ai" className="hover:text-cyan-500 transition-colors">support@medguard.ai</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="hover:text-cyan-500 transition-colors">+1 (800) MED-GUARD</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Medical Core Lab, San Francisco, CA</span>
            </li>
            <li className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-cyan-500 shrink-0">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-cyan-500 transition-colors flex items-center gap-1"
              >
                <span>GitHub Repository</span>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
