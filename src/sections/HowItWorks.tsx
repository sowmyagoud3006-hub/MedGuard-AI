import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { ClipboardList, BrainCircuit, Activity, Stethoscope } from 'lucide-react';

export function HowItWorks() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 90, damping: 14 },
    },
  };

  const steps = [
    {
      num: '01',
      title: 'Patient Input',
      desc: 'Enter patient symptoms and medical history into the platform.',
      icon: ClipboardList,
      glow: 'teal' as const,
    },
    {
      num: '02',
      title: 'AI Analysis',
      desc: 'Advanced NLP AI extracts important medical information and anomalies.',
      icon: BrainCircuit,
      glow: 'indigo' as const,
    },
    {
      num: '03',
      title: 'Risk Detection',
      desc: 'Identifies critical health conditions, allergic conflicts, and clinical risks.',
      icon: Activity,
      glow: 'rose' as const,
    },
    {
      num: '04',
      title: 'Doctor Decision',
      desc: 'Provides clear, explainable diagnostic insights for healthcare teams.',
      icon: Stethoscope,
      glow: 'teal' as const,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative px-4 max-w-7xl mx-auto overflow-hidden">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-500">Platform Workflow</span>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-800 dark:text-white mt-2">
          How MedGuard AI Works
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm sm:text-base leading-relaxed">
          From intake to triage decision: see how our clinical neural network processes clinical data to protect patient safety.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
      >
        {steps.map((step, i) => {
          const IconComponent = step.icon;
          return (
            <motion.div key={i} variants={cardVariants} className="relative group">
              {/* Connecting line for large screens */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[56px] left-[70%] w-full h-[1px] border-t border-dashed border-slate-200 dark:border-slate-800 z-0 pointer-events-none" />
              )}
              
              <GlassCard
                glowColor={step.glow}
                className="h-full flex flex-col items-start p-7 relative z-10 border border-white/5 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md"
              >
                {/* Step badge */}
                <div className="flex justify-between items-center w-full mb-6">
                  <div className="p-3 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-600 dark:text-cyan-400">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-3xl font-black text-slate-200 dark:text-slate-800 tracking-tighter">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">
                  {step.title}
                </h3>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
