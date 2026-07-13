import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full border border-cyan-500/20 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md hover:border-cyan-500/50 hover:bg-white/20 dark:hover:bg-slate-900/60 transition-all duration-300 text-cyan-600 dark:text-cyan-400 focus:outline-none"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="w-5 h-5 flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
    </button>
  );
}
