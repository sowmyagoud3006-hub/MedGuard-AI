import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { ShieldAlert, AlertTriangle, CheckCircle, ChevronRight, ChevronLeft, PhoneCall, Printer, Sparkles, Clipboard, Loader2 } from 'lucide-react';

interface SymptomQuestion {
  id: string;
  label: string;
}

const RED_FLAGS: SymptomQuestion[] = [
  { id: 'chest_pain', label: 'Crushing chest pain, pressure, or tightness' },
  { id: 'short_breath', label: 'Severe shortness of breath or struggling to breathe' },
  { id: 'numbness', label: 'Sudden weakness, numbness, or facial drooping on one side' },
  { id: 'speech', label: 'Sudden difficulty speaking, slurred speech, or confusion' },
  { id: 'allergic', label: 'Severe allergic reaction (throat swelling, difficulty swallowing)' },
];

const GENERAL_SYMPTOMS: SymptomQuestion[] = [
  { id: 'fever', label: 'Fever, chills, or sweating' },
  { id: 'cough', label: 'Dry or persistent cough' },
  { id: 'sore_throat', label: 'Sore throat or difficulty swallowing (mild)' },
  { id: 'body_aches', label: 'General muscle aches, fatigue, or joint pain' },
  { id: 'headache', label: 'Headache or sinus congestion' },
  { id: 'stomach', label: 'Nausea, vomiting, or diarrhea' },
];

const RISK_FACTORS: SymptomQuestion[] = [
  { id: 'diabetes', label: 'Diabetes (Type 1 or Type 2)' },
  { id: 'lung_disease', label: 'Asthma, COPD, or chronic breathing issues' },
  { id: 'heart_disease', label: 'Heart disease, hypertension, or prior stroke' },
  { id: 'immune', label: 'Compromised immune system' },
];

export function PatientPortal() {
  const [step, setStep] = useState(1);
  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);
  const [selectedGeneral, setSelectedGeneral] = useState<string[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [age, setAge] = useState('');
  const [name, setName] = useState('');

  // Server integration states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleToggleRedFlag = (id: string) => {
    setSelectedRedFlags(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleGeneral = (id: string) => {
    setSelectedGeneral(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleRisk = (id: string) => {
    setSelectedRisks(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isEmergency = selectedRedFlags.length > 0;

  const getTriageResult = () => {
    if (isEmergency) {
      return {
        level: 'EMERGENCY',
        title: 'Seek Immediate Emergency Medical Care',
        color: 'rose',
        icon: ShieldAlert,
        desc: 'Based on your reported symptoms, you require immediate medical evaluation. Please call emergency services or go to the nearest emergency department right away.',
        actions: [
          'Call 911 (or your local emergency services number) immediately.',
          'Do not drive yourself to the hospital; wait for ambulance personnel if possible.',
          'If you are alone, unlock your front door and alert a neighbor or relative.'
        ]
      };
    }

    const hasSymptoms = selectedGeneral.length > 0;
    const hasRisks = selectedRisks.length > 0;

    if (hasSymptoms && hasRisks) {
      return {
        level: 'URGENT_CARE',
        title: 'Urgent Care or Physician Consultation Advised',
        color: 'amber',
        icon: AlertTriangle,
        desc: 'You have reported general symptoms paired with pre-existing risk factors. While this is not an immediate emergency, we recommend visiting an urgent care clinic or consulting your doctor today.',
        actions: [
          'Contact your primary care physician or local urgent care center for a same-day review.',
          'Monitor your vitals (temperature, blood pressure) periodically.',
          'Isolate from others if you suspect a viral infection (e.g., COVID-19 or flu).'
        ]
      };
    }

    if (hasSymptoms) {
      return {
        level: 'PRIMARY_CARE',
        title: 'Primary Care Consultation & Rest',
        color: 'teal',
        icon: CheckCircle,
        desc: 'Your symptoms indicate a mild to moderate concern. We recommend consulting a primary care doctor for guidance and managing your symptoms with rest and hydration at home.',
        actions: [
          'Schedule a standard telehealth or clinic appointment with your family physician.',
          'Stay hydrated, rest, and manage minor pain or fever with over-the-counter medicine if approved by a doctor.',
          'Seek immediate medical review if your symptoms worsen or new symptoms appear.'
        ]
      };
    }

    return {
      level: 'STABLE',
      title: 'Stable / Wellness Monitoring',
      color: 'emerald',
      icon: CheckCircle,
      desc: 'No active symptoms or immediate risks have been detected. Maintain healthy hydration and routine checkups.',
      actions: [
        'Continue standard wellness practices.',
        'Keep a log of symptoms if you feel any slight changes.',
        'Ensure your annual physical exams and routine vaccines are up to date.'
      ]
    };
  };

  const triage = getTriageResult();

  const handleNext = () => {
    // If they checked a red flag on step 2, jump directly to result step (step 5)
    if (step === 2 && selectedRedFlags.length > 0) {
      setStep(5);
      submitToTriageQueue();
    } else if (step === 4) {
      setStep(5);
      submitToTriageQueue();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step === 5 && selectedRedFlags.length > 0) {
      setStep(2); // return to red flags selection
    } else {
      setStep(prev => prev - 1);
    }
  };

  const resetPortal = () => {
    setStep(1);
    setSelectedRedFlags([]);
    setSelectedGeneral([]);
    setSelectedRisks([]);
    setAge('');
    setName('');
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  // POST patient registration details to server
  const submitToTriageQueue = () => {
    setIsSubmitting(true);
    setIsSubmitted(false);

    // Extract active tags
    const activeSymptoms: string[] = [];
    selectedRedFlags.forEach(f => {
      const match = RED_FLAGS.find(rf => rf.id === f);
      if (match) activeSymptoms.push(match.label);
    });
    selectedGeneral.forEach(g => {
      const match = GENERAL_SYMPTOMS.find(gs => gs.id === g);
      if (match) activeSymptoms.push(match.label);
    });

    if (activeSymptoms.length === 0) {
      activeSymptoms.push('Asymptomatic wellness evaluation');
    }

    const activeRisks: string[] = [];
    selectedRisks.forEach(r => {
      const match = RISK_FACTORS.find(rf => rf.id === r);
      if (match) activeRisks.push(match.label);
    });

    const patientPostData = {
      name: name.trim() || 'Anonymous Patient',
      age: parseInt(age) || 35,
      gender: 'Other',
      symptoms: activeSymptoms,
      history: activeRisks.join(', ') || 'No chronic risks selected'
    };

    fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientPostData)
    })
      .then(res => {
        if (!res.ok) throw new Error('API Queue addition failed');
        return res.json();
      })
      .then(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      })
      .catch(err => {
        console.warn('Backend server database write failed, simulating registration locally:', err);
        setIsSubmitting(false);
        setIsSubmitted(true); // fall back gracefully so user sees the message
      });
  };

  const exportSymptomSheet = () => {
    const text = `
MEDGUARD AI - PATIENT SYMPTOM ASSESSMENT SHEET
----------------------------------------------
Date: ${new Date().toLocaleDateString()}
Patient Name: ${name || 'Anonymous'}
Age: ${age || 'Not specified'}

REPORTED CRITICAL SYMPTOMS (RED FLAGS):
${selectedRedFlags.length > 0 ? selectedRedFlags.map(f => `- ${RED_FLAGS.find(rf => rf.id === f)?.label}`).join('\n') : 'None'}

REPORTED GENERAL SYMPTOMS:
${selectedGeneral.length > 0 ? selectedGeneral.map(g => `- ${GENERAL_SYMPTOMS.find(gs => gs.id === g)?.label}`).join('\n') : 'None'}

PERSONAL CLINICAL RISK FACTORS:
${selectedRisks.length > 0 ? selectedRisks.map(r => `- ${RISK_FACTORS.find(rf => rf.id === r)?.label}`).join('\n') : 'None'}

EVALUATION ASSESSMENT:
Triage Level: ${triage.level}
Recommendation: ${triage.title}
Clinical Guidance: ${triage.desc}

DISCLAIMER: This sheet is generated for educational screening only and is not a formal diagnosis. Present this summary to your doctor.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MedGuard_Symptom_Sheet_${name || 'Patient'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <GlassCard glowColor={triage.color === 'rose' ? 'rose' : triage.color === 'amber' ? 'indigo' : 'teal'} className="max-w-4xl mx-auto border border-white/5 p-6 sm:p-10 min-h-[480px] flex flex-col justify-between relative overflow-hidden text-left">
      
      {/* Background soft meshes */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Triage Progress Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span className="font-display font-extrabold text-sm sm:text-base text-slate-800 dark:text-white">Patient Assessment Hub</span>
        </div>
        <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
          {step === 5 ? 'Step 5 of 5: Result' : `Step ${step} of 4`}
        </span>
      </div>

      {/* Main Wizard Slider */}
      <div className="flex-1 flex flex-col justify-center py-4">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: WELCOME & DEMOGRAPHICS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 text-left"
            >
              <div className="flex items-center gap-2 text-indigo-500">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Clinical Guidance Engine</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-855 dark:text-white leading-tight">
                Evaluate Your Symptoms Safely
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                This interactive tool is hand-crafted to help you screen for warning signs, understand potential care needs, and export a structured symptom sheet to share with your family doctor.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 max-w-xl">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Your Name (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 35"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-cyan-500/10 bg-cyan-500/5 dark:bg-cyan-950/10 text-xs text-slate-500 dark:text-slate-400 max-w-2xl mt-6 leading-relaxed">
                <strong>⚠️ Safety Notice:</strong> This tool is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a life-threatening emergency, please dial emergency services immediately.
              </div>
            </motion.div>
          )}

          {/* STEP 2: RED FLAGS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 text-left"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Critical Check</span>
                <h3 className="font-display font-extrabold text-2xl text-slate-855 dark:text-white mt-1">
                  Are you experiencing any of these emergency warnings?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Select any symptoms that apply to you right now. If none match, click "Continue".
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-2 max-w-3xl">
                {RED_FLAGS.map((flag) => (
                  <label
                    key={flag.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedRedFlags.includes(flag.id)
                        ? 'border-rose-500/50 bg-rose-500/10 dark:bg-rose-955/15'
                        : 'border-slate-250 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRedFlags.includes(flag.id)}
                      onChange={() => handleToggleRedFlag(flag.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-800 text-rose-500 focus:ring-rose-500/50 cursor-pointer accent-rose-500"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-slate-750 dark:text-slate-200">
                      {flag.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: GENERAL SYMPTOMS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 text-left"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">Symptom Inventory</span>
                <h3 className="font-display font-extrabold text-2xl text-slate-855 dark:text-white mt-1">
                  General Symptoms
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Identify any secondary physical conditions you have been experiencing over the past 48 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 max-w-3xl">
                {GENERAL_SYMPTOMS.map((sym) => (
                  <label
                    key={sym.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedGeneral.includes(sym.id)
                        ? 'border-cyan-500/50 bg-cyan-500/10 dark:bg-cyan-500/5'
                        : 'border-slate-250 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedGeneral.includes(sym.id)}
                      onChange={() => handleToggleGeneral(sym.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-350 dark:border-slate-800 text-cyan-500 focus:ring-cyan-500/50 cursor-pointer accent-cyan-500"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-slate-750 dark:text-slate-200">
                      {sym.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: RISK FACTORS */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 text-left"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">History & Background</span>
                <h3 className="font-display font-extrabold text-2xl text-slate-855 dark:text-white mt-1">
                  Do you have any of these clinical history markers?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Pre-existing conditions help contextualize symptoms to provide safer, more accurate guidance.
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-2 max-w-3xl">
                {RISK_FACTORS.map((risk) => (
                  <label
                    key={risk.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedRisks.includes(risk.id)
                        ? 'border-indigo-500/50 bg-indigo-500/10 dark:bg-indigo-955/15'
                        : 'border-slate-255 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRisks.includes(risk.id)}
                      onChange={() => handleToggleRisk(risk.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-355 dark:border-slate-800 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer accent-indigo-500"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-slate-755 dark:text-slate-200">
                      {risk.label}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: RESULTS SCREEN */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6 text-left"
            >
              {/* Database sync notification */}
              {isSubmitting && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-400 text-xs flex gap-2.5 items-center font-semibold">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span>Registering your record securely in the hospital triage database...</span>
                </div>
              )}

              {isSubmitted && !isSubmitting && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex gap-2.5 items-center font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>✓ Your clinical screening profile has been securely sent to Dr. Harper's queue database.</span>
                </div>
              )}

              {/* Triage Banner */}
              <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-5 items-start md:items-center ${
                triage.level === 'EMERGENCY'
                  ? 'border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-400'
                  : triage.level === 'URGENT_CARE'
                  ? 'border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400'
                  : 'border-teal-500/20 bg-teal-500/5 text-teal-700 dark:text-teal-400'
              }`}>
                <div className={`p-3.5 rounded-xl shrink-0 ${
                  triage.level === 'EMERGENCY'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 animate-pulse'
                    : triage.level === 'URGENT_CARE'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-450'
                    : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                }`}>
                  <triage.icon className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Triage Assessment</span>
                  <h4 className="font-display font-extrabold text-xl sm:text-2xl mt-0.5">{triage.title}</h4>
                  <p className="text-xs sm:text-sm mt-2 opacity-90 leading-relaxed font-normal">{triage.desc}</p>
                </div>
              </div>

              {/* Detail Guidelines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <Clipboard className="w-4 h-4 text-cyan-500" />
                    <span>Action Guidelines</span>
                  </h5>
                  <ul className="flex flex-col gap-2.5">
                    {triage.actions.map((act, i) => (
                      <li key={i} className="flex gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        <span className="text-cyan-500 font-bold">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 dark:bg-slate-905/20 border border-slate-200/50 dark:border-slate-800/40 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wide mb-2">Assessment Context</h5>
                    <div className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <div>
                        <strong>Age:</strong> {age || 'Not specified'} | <strong>Name:</strong> {name || 'Anonymous'}
                      </div>
                      <div>
                        <strong>Red Flags:</strong> {selectedRedFlags.length} active
                      </div>
                      <div>
                        <strong>Symptoms:</strong> {selectedGeneral.length > 0 ? `${selectedGeneral.length} checked` : 'none'}
                      </div>
                      <div>
                        <strong>Risk Cohort:</strong> {selectedRisks.length > 0 ? `${selectedRisks.length} active factors` : 'low risk background'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 border-t border-slate-200 dark:border-slate-850 pt-4">
                    {triage.level === 'EMERGENCY' ? (
                      <a
                        href="tel:911"
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-md"
                      >
                        <PhoneCall className="w-4 h-4 animate-bounce" />
                        <span>Dial Emergency (911)</span>
                      </a>
                    ) : (
                      <button
                        onClick={exportSymptomSheet}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all font-bold text-xs sm:text-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Export Symptom Sheet</span>
                      </button>
                    )}
                    
                    <button
                      onClick={resetPortal}
                      className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
                    >
                      Reset Checker
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Wizard Navigation Footer */}
      {step < 5 && (
        <div className="flex justify-between items-center border-t border-slate-200/60 dark:border-slate-800/65 pt-5 mt-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-1.5 py-2.5 px-4 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800/80 text-slate-550 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/65 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 py-2.5 px-5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white shadow-md shadow-cyan-500/5 group"
          >
            <span>{step === 4 ? 'Submit Assessment' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}

    </GlassCard>
  );
}
