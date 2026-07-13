import { motion } from 'framer-motion';
import { Shield, Brain, Heart, FileText, ChevronRight, Activity, Bell } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

interface HeroProps {
  onStartScreening: () => void;
  onViewDashboard: () => void;
}

export function Hero({ onStartScreening, onViewDashboard }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const slowPulse = {
    animate: {
      scale: [1, 1.06, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 max-w-7xl mx-auto overflow-hidden">
      {/* Background Glowing Mesh Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Text Details */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 flex flex-col text-left"
        >
          {/* Tagline */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold w-max mb-6"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Next-Gen Medical Decision Support</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-850 dark:text-white leading-[1.1] tracking-tight"
          >
            <span className="bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-400 dark:to-teal-300 bg-clip-text text-transparent text-glow-cyan">
              AI-Powered
            </span>{' '}
            Healthcare{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent text-glow-indigo">
              Screening
            </span>{' '}
            <span className="block text-2xl sm:text-3xl lg:text-4xl text-slate-500 dark:text-slate-400 mt-3 font-semibold leading-normal">
              Before Treatment Begins
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mt-6 max-w-xl leading-relaxed font-normal"
          >
            MedGuard AI transforms patient information into intelligent medical insights, helping healthcare teams identify risks faster and make safer decisions.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <button
              onClick={onStartScreening}
              className="flex items-center justify-center gap-2 py-4 px-7 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/20 group hover:-translate-y-0.5 focus:outline-none"
            >
              <span>Start Patient Screening</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={onViewDashboard}
              className="flex items-center justify-center gap-2 py-4 px-7 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-300 hover:-translate-y-0.5 focus:outline-none"
            >
              <span>View AI Dashboard</span>
            </button>
          </motion.div>

          {/* Core Badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-6 mt-10 text-xs font-semibold text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/60 pt-6"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>HIPAA Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span>CLIA Reference Standards</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>FDA Class II Tool Equivalent</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Interactive Animation Area */}
        <div className="lg:col-span-6 flex justify-center items-center relative min-h-[400px]">
          {/* Glowing Radial Orb */}
          <motion.div
            variants={slowPulse}
            animate="animate"
            className="absolute w-80 h-80 rounded-full bg-radial from-cyan-500/20 to-transparent blur-2xl pointer-events-none"
          />

          {/* Central Animated Graphic */}
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="relative w-full max-w-[420px] aspect-square flex items-center justify-center"
          >
            {/* Pulsing Brain / Neural Connections */}
            <div className="absolute w-60 h-60 rounded-full border border-cyan-500/10 dark:border-cyan-500/5 bg-slate-50/50 dark:bg-slate-900/10 backdrop-blur-3xl flex items-center justify-center text-cyan-500 dark:text-cyan-400 neon-glow-teal z-20">
              <Brain className="w-24 h-24 animate-heartbeat text-cyan-500 dark:text-cyan-400" />
            </div>

            {/* Orbit paths */}
            <div className="absolute inset-0 rounded-full border border-dashed border-slate-200/50 dark:border-slate-800/60 animate-spin" style={{ animationDuration: '40s' }} />
            <div className="absolute inset-8 rounded-full border border-dashed border-cyan-500/20 dark:border-cyan-500/10 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />

            {/* Orbiting Glass Icons */}
            
            {/* Pill Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              className="absolute inset-0 z-30 pointer-events-none"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <GlassCard glowColor="teal" hoverEffect={false} className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                </GlassCard>
              </div>
            </motion.div>

            {/* Heart Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear', delay: -5 }}
              className="absolute inset-0 z-30 pointer-events-none"
            >
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <GlassCard glowColor="rose" hoverEffect={false} className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500" />
                </GlassCard>
              </div>
            </motion.div>

            {/* Document / File Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 22, ease: 'linear', delay: -12 }}
              className="absolute inset-0 z-30 pointer-events-none"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-auto">
                <GlassCard glowColor="indigo" hoverEffect={false} className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </GlassCard>
              </div>
            </motion.div>

            {/* Alarm Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 28, ease: 'linear', delay: -18 }}
              className="absolute inset-0 z-30 pointer-events-none"
            >
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <GlassCard glowColor="teal" hoverEffect={false} className="p-3.5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-emerald-500" />
                </GlassCard>
              </div>
            </motion.div>

            {/* Mini Dashboard Preview in Hero */}
            <div className="absolute bottom-4 right-[-40px] z-30 hidden md:block">
              <GlassCard glowColor="teal" hoverEffect={true} className="p-4 rounded-xl border border-cyan-500/20 bg-white/70 dark:bg-slate-900/60 backdrop-blur-lg flex flex-col gap-2 max-w-[180px] shadow-lg">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Predictive Triage</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                </div>
                <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Critical Patient Index</span>
                  <h4 className="font-display font-extrabold text-xl text-rose-500 leading-none mt-1">92% Risk</h4>
                </div>
                <div className="flex gap-1.5 text-[8px] font-bold text-slate-500 dark:text-slate-400">
                  <span className="bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded border border-rose-500/10">Cardio Alert</span>
                </div>
              </GlassCard>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
