import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, ArrowUpRight, Activity, Users } from 'lucide-react';
import { useDarkMode } from './hooks/useDarkMode';
import { ThemeToggle } from './components/ThemeToggle';

// Page components
import { Hero } from './sections/Hero';
import { Statistics } from './components/Statistics';
import { HowItWorks } from './sections/HowItWorks';
import { Features } from './sections/Features';
import { PatientPortal } from './components/PatientPortal';
import { PatientScreeningDemo } from './components/PatientScreeningDemo';
import { DoctorDashboardMockup } from './components/DoctorDashboardMockup';
import { ChatbotPreview } from './components/ChatbotPreview';
import { CallToAction } from './sections/CallToAction';
import { Footer } from './sections/Footer';

export default function App() {
  const { toggleTheme, isDark } = useDarkMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePortal, setActivePortal] = useState<'both' | 'patient' | 'provider'>('both');

  // Section references for scroll trigger navigation
  const patientPortalRef = useRef<HTMLDivElement>(null);
  const providerDemoRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const assistantRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    setMobileMenuOpen(false);
    setActivePortal('both'); // reset view filters to show all sections
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Patient Assessment', onClick: () => scrollTo(patientPortalRef) },
    { label: 'AI Wellness Chat', onClick: () => scrollTo(assistantRef) },
    { label: 'Clinical Triage', onClick: () => scrollTo(providerDemoRef) },
    { label: 'Analytics Dashboard', onClick: () => scrollTo(dashboardRef) },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-[#090d16] text-slate-100 bg-grid-pattern-dark' 
        : 'bg-[#fafcff] text-slate-800 bg-grid-pattern-light'
    }`}>
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 text-cyan-600 dark:text-cyan-400 group">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 dark:bg-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-cyan-500/20" />
            </div>
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-800 dark:text-white">
              MedGuard <span className="text-cyan-500">AI</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={link.onClick}
                className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            <button
              onClick={() => scrollTo(patientPortalRef)}
              className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold rounded-xl border border-cyan-500/35 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all duration-300"
            >
              <span>Check Symptoms</span>
            </button>
            <button
              onClick={() => scrollTo(providerDemoRef)}
              className="flex items-center gap-1 py-2.5 px-4.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Provider Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-3">
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-455 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.href}
                    onClick={link.onClick ? link.onClick : () => setMobileMenuOpen(false)}
                    className="text-sm font-bold text-slate-600 dark:text-slate-350 hover:text-cyan-500 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="grid grid-cols-2 gap-3.5 mt-2">
                  <button
                    onClick={() => scrollTo(patientPortalRef)}
                    className="py-3 rounded-xl border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold text-center text-xs"
                  >
                    Check Symptoms
                  </button>
                  <button
                    onClick={() => scrollTo(providerDemoRef)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold shadow-md text-xs"
                  >
                    Provider Dashboard
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Layout */}
      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <Hero 
          onStartScreening={() => scrollTo(patientPortalRef)} 
          onViewDashboard={() => scrollTo(providerDemoRef)} 
        />

        {/* PORTAL SELECTOR BAR */}
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm relative z-20">
            <button
              onClick={() => setActivePortal('both')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activePortal === 'both'
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow'
                  : 'text-slate-500 hover:text-slate-855 dark:hover:text-slate-300'
              }`}
            >
              Full Platform
            </button>
            <button
              onClick={() => setActivePortal('patient')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activePortal === 'patient'
                  ? 'bg-white dark:bg-slate-800 text-cyan-655 dark:text-cyan-400 shadow'
                  : 'text-slate-500 hover:text-slate-855 dark:hover:text-slate-300'
              }`}
            >
              <Activity className="w-4 h-4" />
              Patient Assessment
            </button>
            <button
              onClick={() => setActivePortal('provider')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activePortal === 'provider'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow'
                  : 'text-slate-500 hover:text-slate-855 dark:hover:text-slate-300'
              }`}
            >
              <Users className="w-4 h-4" />
              Provider Triage
            </button>
          </div>
        </div>

        {/* STATISTICS SECTION */}
        <AnimatePresence>
          {activePortal === 'both' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Statistics />
            </motion.div>
          )}
        </AnimatePresence>

        {/* HOW IT WORKS SECTION */}
        <AnimatePresence>
          {activePortal === 'both' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <HowItWorks />
            </motion.div>
          )}
        </AnimatePresence>

        {/* FEATURES SECTION */}
        <AnimatePresence>
          {activePortal === 'both' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Features />
            </motion.div>
          )}
        </AnimatePresence>

        {/* PATIENT PORTAL: SYMPTOM ASSESSMENT CHECKER */}
        {(activePortal === 'both' || activePortal === 'patient') && (
          <div ref={patientPortalRef} className="py-20 px-4 max-w-7xl mx-auto scroll-mt-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-500">Symptom Checker</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 dark:text-white mt-2">
                Patient Symptom Checker & Triage
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
                Take an interactive wellness assessment. Evaluate warning signs and export clinical summary sheets to present to your healthcare provider.
              </p>
            </div>
            <PatientPortal />
          </div>
        )}

        {/* PATIENT PORTAL: AI CHAT ASSISTANT */}
        {(activePortal === 'both' || activePortal === 'patient') && (
          <div ref={assistantRef} className="py-20 px-4 max-w-7xl mx-auto scroll-mt-20 border-t border-slate-200/40 dark:border-slate-800/40">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-500">Conversational AI</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 dark:text-white mt-2">
                Friendly AI Wellness Assistant
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
                Chat with our wellness guide about symptoms, food habits, exercise suggestions, or sleep routines in a friendly, supportive environment.
              </p>
            </div>
            <ChatbotPreview />
          </div>
        )}

        {/* PROVIDER PORTAL: CLINICAL TRIAGE */}
        {(activePortal === 'both' || activePortal === 'provider') && (
          <div ref={providerDemoRef} className="py-20 px-4 max-w-7xl mx-auto scroll-mt-20 border-t border-slate-200/40 dark:border-slate-800/40">
            {/* AI PATIENT SCREENING TRIAGE */}
            <div className="pb-20">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Provider Telemetry</span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 dark:text-white mt-2">
                  Clinical AI Patient Screening Triage
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
                  Analyze clinical telemetry, monitor vital thresholds, review ICD-11 diagnostic rationales, and follow suggested care pathway checklists.
                </p>
              </div>
              <PatientScreeningDemo />
            </div>

            {/* DOCTOR DASHBOARD PREVIEW */}
            <div ref={dashboardRef} className="py-20 border-t border-slate-200/40 dark:border-slate-800/40">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Clinical Overview</span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 dark:text-white mt-2">
                  Ward Command Center Dashboard
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
                  Monitor clinics queues, track weekly patient trends, and map systemic risk distribution coordinates in a unified SaaS interface.
                </p>
              </div>
              <DoctorDashboardMockup />
            </div>
          </div>
        )}

        {/* CALL TO ACTION */}
        <CallToAction onAnalyzeNow={() => scrollTo(patientPortalRef)} />

      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
