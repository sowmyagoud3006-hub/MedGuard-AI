import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Play, RotateCcw, AlertTriangle, CheckCircle, ShieldAlert, Cpu, Heart, Activity, Plus, UserPlus, HeartPulse, Mic } from 'lucide-react';

interface PatientProfile {
  id?: number;
  name: string;
  age: number;
  gender: string;
  symptoms: string[];
  history: string;
  riskScore: number;
  status: 'CRITICAL' | 'MODERATE' | 'SAFE';
  detectedRisks: string[];
  color: string;
  vitals: {
    bp: string;
    hr: number;
    spo2: number;
    temp: string;
  };
  reasoning: string;
  pathway: string[];
}

const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 1,
    name: 'John Anderson',
    age: 58,
    gender: 'Male',
    symptoms: ['Chest pain', 'Dizziness', 'Shortness of breath'],
    history: 'Hypertension, High Cholesterol',
    riskScore: 92,
    status: 'CRITICAL',
    detectedRisks: ['Hypertensive Crisis (Stage 2)', 'Ischemic Cardiac Markers', 'Beta-Blocker Therapy Contraindication'],
    color: 'rose',
    vitals: { bp: '178/112 mmHg', hr: 108, spo2: 91, temp: '36.8°C' },
    reasoning: 'Patient reports acute chest discomfort and dizziness. Vitals telemetry reports systemic hypertensive crisis (178/112 mmHg) and tachycardia (108 bpm) coupled with mild blood oxygen desaturation (91%). Cross-reference suggests immediate cardiac assessment is required.',
    pathway: [
      'Order emergency 12-lead ECG and continuous cardiac monitor telemetry.',
      'Obtain blood panel: Troponin-I, metabolic profile, and coagulation index.',
      'Start low-flow oxygen protocol if SpO2 drops below 92%.',
      'Prepare emergency cardiac referral team.'
    ]
  }
];

export function PatientScreeningDemo() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStage, setScanStage] = useState('');
  const [resultReady, setResultReady] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(92);
  
  // Custom intake form state
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formGender, setFormGender] = useState('Male');
  const [formSymptoms, setFormSymptoms] = useState('');
  const [formHistory, setFormHistory] = useState('');
  const [isListening, setIsListening] = useState(false);

  const activePatient = patients[selectedPatientIndex] || INITIAL_PATIENTS[0];

  // Fetch patient database on mount
  useEffect(() => {
    fetch('/api/patients')
      .then(res => {
        if (!res.ok) throw new Error('Backend offline');
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Add color field dynamically if not present
          const formatted = data.map(p => ({
            ...p,
            color: p.status === 'CRITICAL' ? 'rose' : p.status === 'MODERATE' ? 'amber' : 'emerald'
          }));
          setPatients(formatted);
          setSelectedPatientIndex(0);
          setAnimatedScore(formatted[0].riskScore);
        } else {
          setPatients(INITIAL_PATIENTS);
        }
      })
      .catch(err => {
        console.warn('Failed to load patient records from database, using defaults:', err);
        setPatients(INITIAL_PATIENTS);
      });
  }, []);

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type symptoms manually.");
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormSymptoms(prev => prev ? `${prev}, ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSelectPatient = (index: number) => {
    setSelectedPatientIndex(index);
    setShowIntakeForm(false);
    setResultReady(false);
    setScanning(false);
    setScanProgress(0);
  };

  const startAnalysis = () => {
    if (scanning) return;
    setScanning(true);
    setResultReady(false);
    setScanProgress(0);
    setAnimatedScore(0);
  };

  const handleAddPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAge.trim() || !formSymptoms.trim()) return;

    const symptomsArr = formSymptoms.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const patientIntakeData = {
      name: formName,
      age: parseInt(formAge) || 30,
      gender: formGender,
      symptoms: symptomsArr,
      history: formHistory.trim() || 'No active clinical history recorded'
    };

    // Clear form inputs
    setFormName('');
    setFormAge('');
    setFormGender('Male');
    setFormSymptoms('');
    setFormHistory('');

    // Launch scanning screen
    setShowIntakeForm(false);
    setResultReady(false);
    setScanning(true);
    setScanProgress(0);
    setAnimatedScore(0);
    setScanStage('Contacting MedGuard triage server...');

    fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientIntakeData)
    })
      .then(res => {
        if (!res.ok) throw new Error('API triage query failed');
        return res.json();
      })
      .then(savedRecord => {
        const formatted = {
          ...savedRecord,
          color: savedRecord.status === 'CRITICAL' ? 'rose' : savedRecord.status === 'MODERATE' ? 'amber' : 'emerald'
        };
        setPatients(prev => {
          const updated = [...prev, formatted];
          setSelectedPatientIndex(updated.length - 1);
          return updated;
        });
      })
      .catch(err => {
        console.warn('Triage server offline, running fallback simulation:', err);
        const fallback = runFallbackSimulation(patientIntakeData);
        setPatients(prev => {
          const updated = [...prev, fallback];
          setSelectedPatientIndex(updated.length - 1);
          return updated;
        });
      });
  };

  const handleDeletePatient = (id: number | undefined, index: number) => {
    if (!id) {
      // Local delete for fallback cards
      setPatients(prev => prev.filter((_, idx) => idx !== index));
      setSelectedPatientIndex(0);
      setResultReady(true);
      return;
    }

    if (confirm(`Are you sure you want to delete patient ${patients[index].name}'s clinical file?`)) {
      fetch(`/api/patients/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error('Delete API failed');
          return res.json();
        })
        .then(() => {
          setPatients(prev => prev.filter((_, idx) => idx !== index));
          setSelectedPatientIndex(0);
          setResultReady(true);
        })
        .catch(err => {
          console.error('Database delete failed, removing locally:', err);
          setPatients(prev => prev.filter((_, idx) => idx !== index));
          setSelectedPatientIndex(0);
          setResultReady(true);
        });
    }
  };

  const runFallbackSimulation = (data: typeof formName | any) => {
    const symptomsLower = data.symptoms.join(', ').toLowerCase();
    let score = 15;
    let status: 'CRITICAL' | 'MODERATE' | 'SAFE' = 'SAFE';
    let color = 'emerald';
    let bp = '120/80 mmHg';
    let hr = 72;
    let spo2 = 98;
    let temp = '36.6°C';
    let detectedRisks = ['Stable metabolic indicators', 'Low clinical markers detected'];
    let reasoning = 'Patient exhibits normal physiological baseline. Triage category: low risk.';
    let pathway = ['Advise rest and standard primary care follow-up.'];

    if (
      symptomsLower.includes('chest') || 
      symptomsLower.includes('heart') || 
      symptomsLower.includes('breath') || 
      symptomsLower.includes('breathing') || 
      symptomsLower.includes('dizziness') || 
      symptomsLower.includes('stroke')
    ) {
      score = Math.floor(Math.random() * 18) + 80;
      status = 'CRITICAL';
      color = 'rose';
      bp = '165/105 mmHg';
      hr = 104;
      spo2 = 92;
      detectedRisks = ['Acute Cardiorespiratory Warning', 'Physiological Telemetry Threshold Breach'];
      reasoning = `Patient reports acute cardio-pulmonary symptoms (${data.symptoms.join(', ')}). Telemetry indicates significant cardiac workload with a blood pressure of ${bp} and heart rate of ${hr} bpm. Immediate provider triage is required. (Simulated AI evaluation)`;
      pathway = [
        'Initiate continuous ECG telemetry monitoring immediately.',
        'Order stat Troponin blood draw and metabolic panels.',
        'Ready oxygen delivery system and notify cardiology consult.'
      ];
    } else if (
      symptomsLower.includes('fever') || 
      symptomsLower.includes('pain') || 
      symptomsLower.includes('rash') || 
      symptomsLower.includes('vomit') || 
      symptomsLower.includes('nausea') || 
      symptomsLower.includes('cough')
    ) {
      score = Math.floor(Math.random() * 30) + 35;
      status = 'MODERATE';
      color = 'amber';
      bp = '130/84 mmHg';
      hr = 88;
      temp = '38.4°C';
      detectedRisks = ['Mild systemic inflammatory response', 'Standard triage diagnostic schedule advised'];
      reasoning = `Patient reports symptoms including ${data.symptoms.join(', ')}. Febrile indicators are present at ${temp}. Heart rate is slightly elevated at ${hr} bpm. Baseline risk factors suggest outpatient evaluation. (Simulated AI evaluation)`;
      pathway = [
        'Administer antipyretics to manage body temperature.',
        'Check blood glucose if history of metabolic disorder exists.',
        'Refer to primary care clinic for review within 24 to 48 hours.'
      ];
    }

    return {
      ...data,
      riskScore: score,
      status,
      detectedRisks,
      color,
      vitals: { bp, hr, spo2, temp },
      reasoning,
      pathway
    };
  };

  useEffect(() => {
    if (!scanning) return;

    const stages = [
      'Extracting clinical NLP tags...',
      'Mapping symptoms against ICD-11...',
      'Analyzing cross-medication interactions...',
      'Simulating cardiovascular risk factors...',
      'Finalizing predictive diagnostic report...',
    ];

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 2;
        const stageIndex = Math.min(Math.floor(next / 20), stages.length - 1);
        setScanStage(stages[stageIndex]);
        setAnimatedScore(Math.floor((next / 100) * activePatient.riskScore));

        if (next >= 100) {
          clearInterval(interval);
          setScanning(false);
          setResultReady(true);
          setAnimatedScore(activePatient.riskScore);
          return 100;
        }
        return next;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [scanning, activePatient]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Patient Selector Side */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-500 mb-1">Interactive Screening Demo</span>
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white">Patient Queue</h3>
            <button
              onClick={() => {
                setShowIntakeForm(true);
                setScanning(false);
                setResultReady(false);
              }}
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Patient</span>
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select standard profiles or create a custom patient record below.</p>
        </div>

        <div className="flex flex-col gap-3 mt-2 overflow-y-auto max-h-[300px] pr-1">
          {patients.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPatient(idx)}
              className={`p-4 rounded-xl border text-left transition-all duration-350 shrink-0 ${
                selectedPatientIndex === idx && !showIntakeForm
                  ? 'border-cyan-500/50 bg-cyan-500/10 dark:bg-cyan-500/5 shadow-md shadow-cyan-500/5'
                  : 'border-slate-200 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-display font-semibold text-slate-800 dark:text-slate-100">{p.name}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  p.status === 'CRITICAL' 
                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    : p.status === 'MODERATE'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {p.status}
                </span>
              </div>
              <div className="flex gap-2 text-xs text-slate-400 mt-1">
                <span>{p.gender}, {p.age} yrs</span>
                <span>•</span>
                <span className="truncate max-w-[150px]">{p.symptoms.join(', ')}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={startAnalysis}
          disabled={scanning || showIntakeForm || patients.length === 0}
          className="mt-2 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {scanning ? (
            <>
              <Cpu className="w-5 h-5 animate-spin" />
              <span>Analyzing Patient Data...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Run AI Diagnostics</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Display Screen */}
      <div className="lg:col-span-8">
        <GlassCard 
          glowColor={showIntakeForm ? 'indigo' : activePatient.color === 'rose' ? 'rose' : activePatient.color === 'amber' ? 'indigo' : 'teal'} 
          className="h-full flex flex-col border border-white/5 relative p-6 sm:p-8 min-h-[440px] justify-between"
        >
          
          {/* Header Bar */}
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {showIntakeForm ? 'PATIENT INTAKE FORM' : 'MEDGUARD CORE v4.12'}
              </span>
            </div>
            {!showIntakeForm && resultReady && patients.length > 0 && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleDeletePatient(activePatient.id, selectedPatientIndex)}
                  className="text-xs text-rose-500/85 hover:text-rose-500 flex items-center gap-1.5 transition-colors font-semibold"
                >
                  Delete File
                </button>
                <span className="text-slate-200 dark:text-slate-800 text-xs">|</span>
                <button 
                  onClick={() => handleSelectPatient(selectedPatientIndex)}
                  className="text-xs text-slate-400 dark:text-slate-555 hover:text-cyan-500 dark:hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            )}
            {showIntakeForm && (
              <button 
                onClick={() => handleSelectPatient(selectedPatientIndex)}
                className="text-xs text-slate-400 dark:text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 flex items-center gap-1.5 transition-colors font-bold"
              >
                Cancel
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {/* Custom Intake Form View */}
            {showIntakeForm && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={handleAddPatientSubmit}
                className="flex-1 flex flex-col justify-between"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  {/* Age & Gender Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Age</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="120"
                        placeholder="42"
                        value={formAge}
                        onChange={e => setFormAge(e.target.value)}
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wide">Gender</label>
                      <select
                        value={formGender}
                        onChange={e => setFormGender(e.target.value)}
                        className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Symptoms Input */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide flex justify-between">
                      <span>Active Symptoms</span>
                      <span className="text-[10px] lowercase text-slate-400 dark:text-slate-500 font-normal italic">separated by commas</span>
                    </label>
                    <div className="relative flex items-center w-full">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chest pain, difficulty breathing, dizziness"
                        value={formSymptoms}
                        onChange={e => setFormSymptoms(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 pl-3.5 pr-10 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
                      />
                      <button
                        type="button"
                        onClick={startSpeechRecognition}
                        className={`absolute right-3 p-1.5 rounded-lg transition-all cursor-pointer ${
                          isListening 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : 'text-slate-400 hover:text-cyan-500 dark:text-slate-500 dark:hover:text-cyan-400'
                        }`}
                        title="Dictate symptoms"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Medical History Input */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wide">Medical History & Allergies</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Allergy to Penicillin, family history of hypertension"
                      value={formHistory}
                      onChange={e => setFormHistory(e.target.value)}
                      className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                    />
                  </div>
                </div>

                {/* Form CTA */}
                <button
                  type="submit"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/10"
                >
                  <UserPlus className="w-4.5 h-4.5" />
                  <span>Register & Analyze Patient</span>
                </button>
              </motion.form>
            )}

            {scanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center items-center py-12"
              >
                {/* Custom Heartbeat waveforms animating */}
                <div className="relative w-48 h-20 mb-6 flex items-center justify-center">
                  <svg className="w-full h-full text-cyan-500/30 dark:text-cyan-500/20" viewBox="0 0 100 30">
                    <path
                      d="M0,15 L30,15 L35,5 L40,25 L45,15 L50,15 L53,10 L56,20 L59,15 L100,15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <motion.svg 
                    className="absolute inset-0 w-full h-full text-cyan-500 dark:text-cyan-400" 
                    viewBox="0 0 100 30"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  >
                    <path
                      d="M0,15 L30,15 L35,5 L40,25 L45,15 L50,15 L53,10 L56,20 L59,15 L100,15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </motion.svg>
                  <Heart className="absolute w-6 h-6 text-rose-500 animate-heartbeat" />
                </div>

                <span className="text-xl font-display font-semibold text-slate-700 dark:text-slate-200">
                  {animatedScore}% Screened
                </span>
                
                <span className="text-sm text-cyan-500 font-mono mt-2 h-5 text-center animate-pulse">
                  {scanStage}
                </span>

                {/* Progress bar */}
                <div className="w-64 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-6">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </motion.div>
            )}

            {!scanning && !resultReady && !showIntakeForm && patients.length > 0 && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center items-center py-12 text-center"
              >
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 mb-4">
                  <Activity className="w-8 h-8 animate-pulse text-cyan-500" />
                </div>
                <h4 className="font-display font-bold text-lg text-slate-800 dark:text-slate-200">Diagnostics Pending</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-2">
                  Ready to analyze profile for <strong className="text-slate-700 dark:text-slate-350">{activePatient.name}</strong>. Click 'Run AI Diagnostics' to initiate medical scan.
                </p>
              </motion.div>
            )}

            {resultReady && !scanning && !showIntakeForm && patients.length > 0 && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col gap-6"
              >
                {/* Upper Section: Patient Identity & Vitals telemetry */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
                  {/* Left Column: Basic demographics */}
                  <div className="md:col-span-5 text-left flex flex-col justify-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-550">Active Patient File</span>
                    <h4 className="font-display font-extrabold text-2xl text-slate-800 dark:text-white mt-0.5">{activePatient.name}</h4>
                    <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                      <span>Age: {activePatient.age} yrs</span>
                      <span>•</span>
                      <span>Gender: {activePatient.gender}</span>
                    </div>
                  </div>

                  {/* Right Column: Vitals Telemetry board */}
                  <div className="md:col-span-7 grid grid-cols-4 gap-2 bg-slate-100/50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                    <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-white dark:bg-slate-950">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">BP</span>
                      <span className="text-xs font-mono font-extrabold text-slate-800 dark:text-slate-200 mt-1">{activePatient.vitals.bp}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-white dark:bg-slate-950">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">HR</span>
                      <span className="text-xs font-mono font-extrabold text-rose-500 mt-1 flex items-center gap-0.5">
                        <HeartPulse className="w-3.5 h-3.5 inline animate-heartbeat text-rose-500 shrink-0" />
                        {activePatient.vitals.hr}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-white dark:bg-slate-950">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">SpO2</span>
                      <span className="text-xs font-mono font-extrabold text-cyan-500 dark:text-cyan-400 mt-1">{activePatient.vitals.spo2}%</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-white dark:bg-slate-950">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">TEMP</span>
                      <span className="text-xs font-mono font-extrabold text-amber-500 mt-1">{activePatient.vitals.temp}</span>
                    </div>
                  </div>
                </div>

                {/* Lower Section: Clinical Report Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 text-left">
                  {/* Left Column: Symptoms, History & NLP reasoning */}
                  <div className="md:col-span-7 flex flex-col gap-4">
                    <div>
                      <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Subjective Symptoms</h5>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {activePatient.symptoms.map((s, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Clinical Intake History</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 font-semibold leading-relaxed bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded-lg border border-slate-200/30 dark:border-slate-800/20">
                        {activePatient.history}
                      </p>
                    </div>

                    <div>
                      <h5 className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Clinical NLP Diagnostic Reasoning</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-normal">
                        {activePatient.reasoning}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: AI Score Gauge, Alert Markers & Suggested Care Pathway */}
                  <div className="md:col-span-5 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-5 flex flex-col justify-between gap-4">
                    
                    {/* Diagnostic Score & Badge */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                            <path
                              className="text-slate-200 dark:text-slate-850"
                              strokeWidth="3"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <motion.path
                              className={`${
                                activePatient.status === 'CRITICAL' 
                                  ? 'text-rose-500'
                                  : activePatient.status === 'MODERATE'
                                  ? 'text-amber-500'
                                  : 'text-emerald-500'
                              }`}
                              strokeWidth="3.5"
                              strokeDasharray={`${animatedScore}, 100`}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              initial={{ strokeDasharray: "0, 100" }}
                              animate={{ strokeDasharray: `${animatedScore}, 100` }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="absolute font-display font-extrabold text-[13px] text-slate-855 dark:text-white">
                            {animatedScore}%
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Risk Index</span>
                          <span className="font-display font-bold text-xs text-slate-700 dark:text-slate-350 mt-1 leading-none">Triage Rating</span>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        activePatient.status === 'CRITICAL' 
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : activePatient.status === 'MODERATE'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}>
                        {activePatient.status === 'CRITICAL' && <ShieldAlert className="w-3 h-3 animate-pulse" />}
                        {activePatient.status === 'MODERATE' && <AlertTriangle className="w-3 h-3" />}
                        {activePatient.status === 'SAFE' && <CheckCircle className="w-3 h-3" />}
                        {activePatient.status}
                      </span>
                    </div>

                    {/* Care Pathway Checklist */}
                    <div className="flex flex-col gap-2 pt-3 border-t border-slate-200 dark:border-slate-850/80">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider mb-0.5">Recommended Care Pathway</span>
                      {activePatient.pathway.map((path, index) => (
                        <div key={index} className="flex items-start gap-2 text-[11px] text-slate-750 dark:text-slate-300 leading-normal">
                          <CheckCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            activePatient.status === 'CRITICAL' 
                              ? 'text-rose-500' 
                              : activePatient.status === 'MODERATE' 
                              ? 'text-amber-500' 
                              : 'text-emerald-500'
                          }`} />
                          <span className="font-semibold">{path}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {!scanning && !showIntakeForm && patients.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center items-center py-12 text-center"
              >
                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-450 mb-4">
                  <Plus className="w-8 h-8 text-cyan-500 animate-pulse" />
                </div>
                <h4 className="font-display font-bold text-lg text-slate-850 dark:text-slate-200">Patient Queue Empty</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-2">
                  No patient clinical records exist in the triage database. Click "+ New Patient" to enter a record.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </GlassCard>
      </div>
    </div>
  );
}
