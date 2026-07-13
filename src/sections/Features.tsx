import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  LayoutDashboard, 
  Mic, 
  FileSpreadsheet, 
  Bell, 
  History 
} from 'lucide-react';

export function Features() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 90, damping: 14 },
    },
  };

  const featureList = [
    {
      title: 'AI Medical Analysis',
      desc: 'Contextual NLP model interprets complex patient symptoms and extracts clinical insights.',
      icon: Activity,
      glow: 'teal' as const,
    },
    {
      title: 'Risk Prediction',
      desc: 'Early identification of cardiovascular, diabetic, and respiratory emergency conditions.',
      icon: TrendingUp,
      glow: 'indigo' as const,
    },
    {
      title: 'Drug Allergy Detection',
      desc: 'Cross-checks prescriptions against patient records and allergy histories automatically.',
      icon: AlertTriangle,
      glow: 'rose' as const,
    },
    {
      title: 'Real-Time Dashboard',
      desc: 'Centralized telemetry dashboard for doctors to monitor all triage priorities live.',
      icon: LayoutDashboard,
      glow: 'teal' as const,
    },
    {
      title: 'Voice Patient Input',
      desc: 'Transcribes patient vocal symptoms into structured electronic health records.',
      icon: Mic,
      glow: 'indigo' as const,
    },
    {
      title: 'Medical Report Analysis',
      desc: 'Parses uploaded PDFs, lab result tables, and pathology reports within seconds.',
      icon: FileSpreadsheet,
      glow: 'teal' as const,
    },
    {
      title: 'Emergency Alerts',
      desc: 'Immediate cellular and system push warnings for patients crossing critical risk thresholds.',
      icon: Bell,
      glow: 'rose' as const,
    },
    {
      title: 'Patient History Tracking',
      desc: 'Tracks patient symptom timelines and risk trajectories over longitudinal reviews.',
      icon: History,
      glow: 'indigo' as const,
    },
  ];

  return (
    <section id="features" className="py-20 relative px-4 max-w-7xl mx-auto overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Core Capabilities</span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 dark:text-white mt-2">
          Advanced Clinical Intelligence Features
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
          MedGuard AI equips healthcare teams with responsive tools to screen, predict, and monitor emergency risk profiles.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
      >
        {featureList.map((feat, i) => {
          const IconComponent = feat.icon;
          return (
            <motion.div key={i} variants={itemVariants}>
              <GlassCard
                glowColor={feat.glow}
                className="h-full flex flex-col items-start p-6 border border-white/5 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md"
              >
                <div className="p-2.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 mb-4">
                  <IconComponent className="w-5 h-5" />
                </div>
                
                <h3 className="font-display font-bold text-base text-slate-850 dark:text-slate-200 mb-1.5">
                  {feat.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-450 leading-relaxed font-normal">
                  {feat.desc}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
