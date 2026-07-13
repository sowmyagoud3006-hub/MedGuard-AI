import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface CallToActionProps {
  onAnalyzeNow: () => void;
}

export function CallToAction({ onAnalyzeNow }: CallToActionProps) {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background neon orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        className="relative z-10"
      >
        <GlassCard
          glowColor="teal"
          hoverEffect={false}
          className="text-center py-16 px-6 sm:px-12 border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-indigo-950/20 dark:from-slate-900/60 dark:to-slate-950/80 rounded-3xl max-w-5xl mx-auto shadow-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for Clinical Integration</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-800 dark:text-white max-w-3xl mx-auto leading-tight">
            Healthcare decisions powered by Artificial Intelligence
          </h2>
          
          <p className="text-slate-500 dark:text-slate-450 mt-6 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Empower your clinical teams, minimize administrative bottlenecks, and prioritize critical risk patients in real-time. Join the future of predictive healthcare today.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={onAnalyzeNow}
              className="flex items-center justify-center gap-2 py-4 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/20 group hover:-translate-y-0.5"
            >
              <span>Analyze Patient Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#features"
              className="py-4 px-8 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              Learn More
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-xs font-semibold text-slate-400 dark:text-slate-550 border-t border-slate-200/40 dark:border-slate-850 pt-8 max-w-lg mx-auto">
            <span>✓ 14-Day Free Evaluation</span>
            <span>•</span>
            <span>✓ HIPAA Compliant Sandboxing</span>
            <span>•</span>
            <span>✓ Fast API Integration</span>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
