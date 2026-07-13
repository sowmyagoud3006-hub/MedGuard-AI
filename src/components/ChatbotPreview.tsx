import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ChevronRight } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface Message {
  sender: 'doctor' | 'ai';
  text: string;
  timestamp: string;
}

const PRESETS = [
  {
    prompt: "Explain John's critical risk score",
    response: "John Anderson (92% Risk) is flagged for immediate triage due to overlapping severe symptoms: acute chest pain and dizziness. Cross-referencing his history reveals a major contraindication: his current Beta-Blocker therapy may complicate acute vasodilation. Emergency cardiological review is strongly recommended.",
  },
  {
    prompt: "Check medication safety for Sarah",
    response: "Sarah Jenkins is currently evaluated as SAFE (18% Risk) with no chronic conditions. No critical drug interactions or allergy conflicts are detected. Standard prescription protocol may proceed safely.",
  },
  {
    prompt: "Show recommendations for Marcus Chen",
    response: "Marcus Chen (54% Moderate Risk) exhibits joint pain and a mild fever. Given his Type 2 Diabetes history, monitor blood glucose closely, as infections can cause glycemic spikes. Avoid prescribing NSAIDs if renal baseline markers are elevated.",
  }
];

export function ChatbotPreview() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'doctor',
      text: "Explain John Anderson's critical risk",
      timestamp: '14:32',
    },
    {
      sender: 'ai',
      text: "Patient John Anderson requires urgent clinical review due to detected emergency indicators. AI analysis flagged high probability cardiovascular distress (92% Risk Score) paired with active antihypertensive prescription contraindications. Recommend immediate cardiological consult and ECG.",
      timestamp: '14:32',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMsg: Message = {
      sender: 'doctor',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    // Call backend API endpoint
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: updatedMessages })
    })
      .then(res => {
        if (!res.ok) throw new Error('Backend chat API failed');
        return res.json();
      })
      .then(data => {
        setIsTyping(false);
        setMessages((prev) => [...prev, {
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
      })
      .catch(err => {
        console.warn('Chat server offline, running simulation fallback:', err);
        setTimeout(() => {
          const matchedPreset = PRESETS.find(p => p.prompt.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(p.prompt.toLowerCase()));
          const responseText = matchedPreset 
            ? matchedPreset.response
            : "I have processed your query regarding the patient's record. All active vitals have been reviewed. No critical contraindications were found outside of the flagged alerts on the main dashboard. Let me know if you would like me to compile a formal clinical report. (Simulated fallback response)";

          setIsTyping(false);
          setMessages((prev) => [...prev, {
            sender: 'ai',
            text: responseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }]);
        }, 1000);
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Suggestions and Info Panel */}
      <div className="lg:col-span-4 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-1">MedGuard Clinical Assistant</span>
          <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white">AI Medical Copilot</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Ask the AI Assistant questions about patient risks, drug contraindications, or to generate summarization reports instantly.
          </p>

          <div className="flex flex-col gap-2.5 mt-6">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Suggested Queries</span>
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleSend(preset.prompt)}
                disabled={isTyping}
                className="flex items-center justify-between text-left p-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-850 hover:border-indigo-500/30 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/5 transition-all text-slate-700 dark:text-slate-300 disabled:opacity-50 group"
              >
                <span>{preset.prompt}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 rounded-xl border border-indigo-500/10 bg-indigo-500/5 dark:bg-indigo-950/10 flex gap-3 items-start">
          <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300">HIPAA Compliant AI</span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              All interactions are encrypted and comply with medical data privacy frameworks. Patient identifiers are anonymized.
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface Panel */}
      <div className="lg:col-span-8">
        <GlassCard glowColor="indigo" className="h-[450px] flex flex-col p-0 border border-white/5 overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white">MedGuard Advisor AI</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Clinical Model Online</span>
                </div>
              </div>
            </div>
            
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-md">
              LLM-MED-v2
            </span>
          </div>

          {/* Messages Box */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'doctor' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center border ${
                  msg.sender === 'doctor' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    : 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/10'
                }`}>
                  {msg.sender === 'doctor' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl relative ${
                  msg.sender === 'doctor'
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                  <span className={`text-[9px] block mt-1.5 font-medium ${
                    msg.sender === 'doctor' ? 'text-indigo-200/90' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="p-2 rounded-xl border border-indigo-500/10 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0 h-9 w-9 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-855 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none p-4 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex gap-2.5"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask MedGuard Advisor..."
              disabled={isTyping}
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500/50 dark:focus:border-indigo-400/50 text-xs sm:text-sm px-4 py-3 rounded-xl focus:outline-none transition-colors text-slate-800 dark:text-slate-200"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-indigo-500/10"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
