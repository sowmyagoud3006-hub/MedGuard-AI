import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'medguard.db');

let db;

export async function initDB() {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create patients table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      symptoms TEXT NOT NULL,       -- Saved as JSON string array
      history TEXT,
      risk_score INTEGER NOT NULL,
      status TEXT NOT NULL,
      detected_risks TEXT,          -- Saved as JSON string array
      bp TEXT,
      hr INTEGER,
      spo2 INTEGER,
      temp TEXT,
      reasoning TEXT,
      pathway TEXT,                 -- Saved as JSON string array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if patients table is empty, if so, seed initial data
  const count = await db.get('SELECT COUNT(*) as count FROM patients');
  if (count.count === 0) {
    console.log('Seeding initial clinical database records...');
    
    const seedData = [
      {
        name: 'John Anderson',
        age: 58,
        gender: 'Male',
        symptoms: JSON.stringify(['Chest pain', 'Dizziness', 'Shortness of breath']),
        history: 'Hypertension, High Cholesterol',
        risk_score: 92,
        status: 'CRITICAL',
        detected_risks: JSON.stringify(['Hypertensive Crisis (Stage 2)', 'Ischemic Cardiac Markers', 'Beta-Blocker Therapy Contraindication']),
        bp: '178/112 mmHg',
        hr: 108,
        spo2: 91,
        temp: '36.8°C',
        reasoning: 'Patient reports acute chest discomfort and dizziness. Vitals telemetry reports systemic hypertensive crisis (178/112 mmHg) and tachycardia (108 bpm) coupled with mild blood oxygen desaturation (91%). Cross-reference suggests immediate cardiac assessment is required.',
        pathway: JSON.stringify([
          'Order emergency 12-lead ECG and continuous cardiac monitor telemetry.',
          'Obtain blood panel: Troponin-I, metabolic profile, and coagulation index.',
          'Start low-flow oxygen protocol if SpO2 drops below 92%.',
          'Prepare emergency cardiac referral team.'
        ])
      },
      {
        name: 'Sarah Jenkins',
        age: 34,
        gender: 'Female',
        symptoms: JSON.stringify(['Mild fatigue', 'Slight nausea']),
        history: 'None, seasonal allergies',
        risk_score: 18,
        status: 'SAFE',
        detected_risks: JSON.stringify(['Normal vitals baseline', 'Seasonal allergen correlation', 'Hydration recommendation']),
        bp: '118/76 mmHg',
        hr: 72,
        spo2: 99,
        temp: '36.5°C',
        reasoning: 'Subjective complaints of fatigue and nausea. Vitals demonstrate complete hemodynamic stability. Symptoms map to seasonal environmental allergen baselines without organ system distress indicators.',
        pathway: JSON.stringify([
          'Encourage standard fluid intake and rest.',
          'Advise standard non-drowsy antihistamines for seasonal allergy symptoms.',
          'Clear for discharge with primary physician follow-up as needed.'
        ])
      },
      {
        name: 'Marcus Chen',
        age: 45,
        gender: 'Male',
        symptoms: JSON.stringify(['Joint pain', 'Mild fever', 'Rash']),
        history: 'Type 2 Diabetes',
        risk_score: 54,
        status: 'MODERATE',
        detected_risks: JSON.stringify(['Hyperglycemic correlation', 'Systemic inflammation check', 'Drug interaction warning']),
        bp: '135/88 mmHg',
        hr: 85,
        spo2: 97,
        temp: '38.2°C',
        reasoning: 'Patient exhibits febrile markers (38.2°C) alongside joint pain and dermal rash. Background of Type 2 Diabetes compounds infection risks. Vitals show mild blood pressure elevation, with normal cardiopulmonary status.',
        pathway: JSON.stringify([
          'Obtain capillary blood glucose check (monitor glycemic fluctuations).',
          'Administer acetaminophen for fever control and joint discomfort.',
          'Refer to outpatient dermatology/primary care review within 48 hours.'
        ])
      }
    ];

    for (const p of seedData) {
      await db.run(`
        INSERT INTO patients (name, age, gender, symptoms, history, risk_score, status, detected_risks, bp, hr, spo2, temp, reasoning, pathway)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [p.name, p.age, p.gender, p.symptoms, p.history, p.risk_score, p.status, p.detected_risks, p.bp, p.hr, p.spo2, p.temp, p.reasoning, p.pathway]);
    }
  }

  console.log('Database initialized successfully.');
  return db;
}

export async function getAllPatients() {
  const rows = await db.all('SELECT * FROM patients ORDER BY id ASC');
  return rows.map(row => ({
    ...row,
    symptoms: JSON.parse(row.symptoms),
    detectedRisks: JSON.parse(row.detected_risks),
    vitals: {
      bp: row.bp,
      hr: row.hr,
      spo2: row.spo2,
      temp: row.temp
    },
    pathway: JSON.parse(row.pathway)
  }));
}

export async function insertPatient(p) {
  const result = await db.run(`
    INSERT INTO patients (name, age, gender, symptoms, history, risk_score, status, detected_risks, bp, hr, spo2, temp, reasoning, pathway)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    p.name,
    p.age,
    p.gender,
    JSON.stringify(p.symptoms),
    p.history,
    p.riskScore,
    p.status,
    JSON.stringify(p.detectedRisks),
    p.vitals.bp,
    p.vitals.hr,
    p.vitals.spo2,
    p.vitals.temp,
    p.reasoning,
    JSON.stringify(p.pathway)
  ]);
  
  return { id: result.lastID, ...p };
}

export async function deletePatient(id) {
  await db.run('DELETE FROM patients WHERE id = ?', [id]);
}
