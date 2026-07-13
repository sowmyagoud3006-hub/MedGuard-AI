import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Users, AlertCircle, CheckCircle, TrendingUp, ShieldAlert } from 'lucide-react';

// Fake analytics data
const ADMISSIONS_DATA = [
  { name: 'Mon', admissions: 31, criticalAlerts: 4 },
  { name: 'Tue', admissions: 42, criticalAlerts: 8 },
  { name: 'Wed', admissions: 35, criticalAlerts: 5 },
  { name: 'Thu', admissions: 50, criticalAlerts: 12 },
  { name: 'Fri', admissions: 48, criticalAlerts: 7 },
  { name: 'Sat', admissions: 28, criticalAlerts: 3 },
  { name: 'Sun', admissions: 22, criticalAlerts: 2 },
];

const DISTRIBUTION_DATA = [
  { name: 'Critical Risk', value: 14, color: '#f43f5e' },
  { name: 'Moderate Risk', value: 28, color: '#f59e0b' },
  { name: 'Safe/Stable', value: 58, color: '#10b981' },
];

export function DoctorDashboardMockup() {
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');

  const totalPatients = 100;
  const criticalCount = 14;
  const moderateCount = 28;
  const safeCount = 58;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Bar / Subheading inside dashboard mockup */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <h4 className="font-display font-extrabold text-xl text-slate-800 dark:text-white">MedGuard Clinical Control Room</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Real-time ward overview & predictive risk monitoring</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('week')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'week' 
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Last 7 Days
          </button>
          <button 
            onClick={() => setActiveTab('month')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'month' 
                ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Critical Card */}
        <div className="p-5 rounded-xl border border-rose-500/10 dark:border-rose-500/5 bg-rose-500/5 dark:bg-rose-950/10 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">Critical Risk</span>
            <h5 className="font-display font-extrabold text-3xl text-rose-700 dark:text-rose-500 mt-1">{criticalCount}</h5>
            <p className="text-[10px] text-rose-500/80 dark:text-rose-400/60 mt-0.5">Requires urgent triage</p>
          </div>
          <div className="p-3 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Moderate Card */}
        <div className="p-5 rounded-xl border border-amber-500/10 dark:border-amber-500/5 bg-amber-500/5 dark:bg-amber-950/10 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Moderate Risk</span>
            <h5 className="font-display font-extrabold text-3xl text-amber-700 dark:text-amber-500 mt-1">{moderateCount}</h5>
            <p className="text-[10px] text-amber-500/80 dark:text-amber-400/60 mt-0.5">Monitoring advised</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Safe Card */}
        <div className="p-5 rounded-xl border border-emerald-500/10 dark:border-emerald-500/5 bg-emerald-500/5 dark:bg-emerald-950/10 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Safe & Stable</span>
            <h5 className="font-display font-extrabold text-3xl text-emerald-700 dark:text-emerald-500 mt-1">{safeCount}</h5>
            <p className="text-[10px] text-emerald-500/80 dark:text-emerald-400/60 mt-0.5">Ready for discharge</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Analytics Area Chart */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/20 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              <h5 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Patient Screening Trends</h5>
            </div>
            <div className="flex gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block" /> Total Admissions</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block" /> Critical Alerts</span>
            </div>
          </div>
          
          <div className="w-full h-64 text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMISSIONS_DATA} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }} 
                />
                <Area type="monotone" dataKey="admissions" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorAdmissions)" name="Admissions" />
                <Area type="monotone" dataKey="criticalAlerts" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorAlerts)" name="Critical Alerts" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/20 backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-cyan-500" />
            <h5 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200">Patient Risk Cohorts</h5>
          </div>

          <div className="w-full h-44 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DISTRIBUTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f3f4f6',
                    fontSize: '11px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-2xl text-slate-800 dark:text-white leading-none">{totalPatients}</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">Total Screened</span>
            </div>
          </div>

          {/* Pie Chart Legend */}
          <div className="flex flex-col gap-1.5 mt-2">
            {DISTRIBUTION_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
