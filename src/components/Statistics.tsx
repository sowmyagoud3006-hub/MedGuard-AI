import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Shield, Activity, Clock, Award } from 'lucide-react';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

function AnimatedNumber({ value, suffix = '', duration = 2 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 16); // cap at ~60fps
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-display font-bold text-4xl sm:text-5xl bg-gradient-to-r from-cyan-500 to-indigo-500 dark:from-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function Statistics() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  const stats = [
    {
      value: 10000,
      suffix: '+',
      label: 'Patients Screened',
      icon: Shield,
      description: 'Active screenings globally',
      glow: 'teal' as const,
    },
    {
      value: 98,
      suffix: '%',
      label: 'AI Accuracy',
      icon: Award,
      description: 'Validated clinical results',
      glow: 'indigo' as const,
    },
    {
      value: 24,
      suffix: '/7',
      label: 'Risk Monitoring',
      icon: Activity,
      description: 'Continuous vital alerts',
      glow: 'teal' as const,
    },
    {
      value: 5,
      suffix: ' sec',
      label: 'Instant Analysis',
      icon: Clock,
      description: 'Average processing time',
      glow: 'rose' as const,
    },
  ];

  return (
    <section className="py-20 relative px-4 max-w-7xl mx-auto">
      {/* Background glow meshes */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
      >
        {stats.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <motion.div key={i} variants={itemVariants}>
              <GlassCard
                glowColor={stat.glow}
                className="h-full flex flex-col items-center text-center p-8 border border-white/5"
              >
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 mb-4 inline-flex">
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="mb-2">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>

                <h3 className="font-display font-semibold text-lg text-slate-800 dark:text-slate-200 mb-1">
                  {stat.label}
                </h3>
                
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.description}
                </p>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
