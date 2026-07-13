import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey && apiKey.trim().length > 0) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
    console.log('Gemini AI Engine successfully initialized using API Key.');
  } catch (error) {
    console.error('Failed to initialize GoogleGenAI client:', error);
  }
} else {
  console.warn('⚠️ GEMINI_API_KEY environment variable is empty. The backend will fall back to local rule-based simulation for testing.');
}

// 1. Triage Generator: Evaluates symptoms and history
export async function generateTriage(name, age, gender, symptoms, history) {
  if (!aiClient) {
    return runFallbackTriage(name, age, gender, symptoms, history);
  }

  const prompt = `
  You are an expert clinical machine learning assistant. Analyze the following patient record and output a structured triage evaluation.
  
  PATIENT DATA:
  - Name: ${name}
  - Age: ${age}
  - Gender: ${gender}
  - Symptoms: ${symptoms.join(', ')}
  - Medical History: ${history || 'No recorded history'}
  
  TASK:
  1. Calculate a risk score (0-100) representing critical triage priority (cardiovascular, respiratory, neurological, or diabetic emergencies).
  2. Assign status:
     - "CRITICAL" if risk score is >= 80 (e.g. crushing chest pain, slurred speech, acute desaturation).
     - "MODERATE" if risk score is 35-79 (e.g. high fever with diabetes, severe asthma flare without desaturation).
     - "SAFE" if risk score is < 35 (e.g. mild fatigue, minor sprain).
  3. Generate realistic mock physiological vitals (BP, HR, SpO2, Temperature) that correlate with the symptoms and severity level.
  4. Identify 2-3 specific detected risk markers (e.g., contraindications, vital alerts).
  5. Write a concise 2-3 sentence clinical reasoning summary explaining your diagnostic thoughts.
  6. Recommend a Care Pathway containing 3-4 specific clinical steps.
  
  RETURN VALUE REQUIREMENT:
  You must respond with a VALID JSON object ONLY. Do not wrap the JSON in markdown code blocks like \`\`\`json. The JSON must match this structure:
  {
    "riskScore": 92,
    "status": "CRITICAL",
    "detectedRisks": ["Hypertensive Crisis", "Cardiac Ischemia indicators"],
    "vitals": {
      "bp": "178/112 mmHg",
      "hr": 108,
      "spo2": 91,
      "temp": "36.8°C"
    },
    "reasoning": "Clinical rationale explanation here.",
    "pathway": ["Step 1", "Step 2", "Step 3"]
  }
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt
    });

    const text = response.text.trim();
    // Parse JSON safely, removing any potential markdown wrapper formatting just in case
    const cleanJsonText = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJsonText);
  } catch (error) {
    console.error('Gemini Triage API error, falling back to local simulation:', error);
    return runFallbackTriage(name, age, gender, symptoms, history);
  }
}

// 2. Chatbot Copilot Generator: Maintains conversational logs
export async function generateChatResponse(messages) {
  if (!aiClient) {
    return runFallbackChat(messages);
  }

  // Format messages into Gemini conversation structure
  const systemInstruction = `
  You are MedGuard AI, a friendly, caring medical and wellness assistant.
  
  YOUR ROLE:
  - Help users with health, wellness, elderly care, nutrition, and medical information.
  - Communicate like a warm, caring human assistant.
  - You can respond to simple greetings and daily wellness conversations.
  - If a user asks about food, sleep, exercise, or daily habits, respond naturally and encourage healthy choices.
  
  RULES:
  - Do not pretend to be a doctor.
  - Do not diagnose conditions with certainty.
  - Recommend consulting healthcare professionals for serious or concerning issues.
  - Avoid answering unrelated non-health questions (such as coding, history, general facts, math, or jokes that are not health-related). Focus exclusively on wellness and medical guidance.
  `;

  try {
    const contents = messages.map(msg => ({
      role: msg.sender === 'doctor' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction
      }
    });

    return response.text.trim();
  } catch (error) {
    console.error('Gemini Chat API error, falling back to local simulation:', error);
    return runFallbackChat(messages);
  }
}

// --- FALLBACK SIMULATION FUNCTIONS (Runs out-of-the-box when API key is empty) ---

function runFallbackTriage(name, age, gender, symptoms, history) {
  const symptomsLower = symptoms.join(', ').toLowerCase();
  
  let score = 15;
  let status = 'SAFE';
  let detectedRisks = ['Stable metabolic indicators', 'Low clinical markers detected'];
  let bp = '120/80 mmHg';
  let hr = 72;
  let spo2 = 98;
  let temp = '36.6°C';
  let reasoning = 'Patient exhibits normal physiological baseline. Triage category: low risk.';
  let pathway = ['Advise rest and standard primary care follow-up.'];

  if (
    symptomsLower.includes('chest') || 
    symptomsLower.includes('heart') || 
    symptomsLower.includes('breath') || 
    symptomsLower.includes('breathing') || 
    symptomsLower.includes('dizziness') || 
    symptomsLower.includes('stroke') ||
    symptomsLower.includes('unconscious')
  ) {
    score = Math.floor(Math.random() * 18) + 80;
    status = 'CRITICAL';
    bp = '165/105 mmHg';
    hr = 104;
    spo2 = 92;
    detectedRisks = [
      'Acute Cardiorespiratory Warning',
      'Physiological Telemetry Threshold Breach',
      'Emergency Doctor Notification Triggered'
    ];
    reasoning = `Patient reports acute cardio-pulmonary symptoms (${symptoms.join(', ')}). Telemetry indicates significant cardiac workload with a blood pressure of ${bp} and heart rate of ${hr} bpm. Immediate provider triage is required. (Simulated AI evaluation)`;
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
    symptomsLower.includes('headache') ||
    symptomsLower.includes('cough')
  ) {
    score = Math.floor(Math.random() * 30) + 35;
    status = 'MODERATE';
    bp = '130/84 mmHg';
    hr = 88;
    temp = '38.4°C';
    detectedRisks = [
      'Mild systemic inflammatory response',
      'Elevated physiological telemetry markers',
      'Standard triage diagnostic schedule advised'
    ];
    reasoning = `Patient reports symptoms including ${symptoms.join(', ')}. Febrile indicators are present at ${temp}. Heart rate is slightly elevated at ${hr} bpm. Baseline risk factors suggest outpatient evaluation. (Simulated AI evaluation)`;
    pathway = [
      'Administer antipyretics to manage body temperature.',
      'Check blood glucose if history of metabolic disorder exists.',
      'Refer to primary care clinic for review within 24 to 48 hours.'
    ];
  }

  return {
    riskScore: score,
    status,
    detectedRisks,
    vitals: { bp, hr, spo2, temp },
    reasoning,
    pathway
  };
}

function runFallbackChat(messages) {
  const lastMessage = messages[messages.length - 1].text.toLowerCase();
  
  if (lastMessage.includes('hello') || lastMessage.includes('hi') || lastMessage.includes('hey')) {
    return "Hello! I am MedGuard AI, your friendly medical and wellness assistant. How can I help you with your health, nutrition, or daily wellness today?";
  }
  
  if (lastMessage.includes('lunch') || lastMessage.includes('eat') || lastMessage.includes('food') || lastMessage.includes('diet')) {
    return "I don't eat food, but I hope you are having a healthy, balanced meal! Sticking to whole foods, greens, and lean proteins is a great way to keep your energy up. What did you have for lunch today?";
  }
  
  if (lastMessage.includes('headache') || lastMessage.includes('pain')) {
    return "I am sorry to hear you have a headache. Headaches can be caused by dehydration, stress, lack of sleep, or eye strain. I recommend drinking a large glass of water, resting in a quiet, dark room, and cooling your forehead. If it persists or is very severe, please consult a healthcare professional.";
  }

  if (lastMessage.includes('sleep') || lastMessage.includes('tired')) {
    return "Sleep is so important for your body to repair itself! Try to aim for 7-9 hours of restful sleep, and avoid screens for at least 30 minutes before bed. Creating a relaxing wind-down routine can make a big difference.";
  }

  return "I'm here to help with your wellness, nutrition, sleep, and medical questions! Please let me know how you are feeling or if you need any general health guidance.";
}
