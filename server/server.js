import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB, getAllPatients, insertPatient, deletePatient } from './db.js';
import { generateTriage, generateChatResponse } from './ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database before starting the server
let dbInitialized = false;

async function startServer() {
  try {
    await initDB();
    dbInitialized = true;
    
    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`🚀 MedGuard AI Express Server running on port ${PORT}`);
      console.log(`🔗 API endpoint: http://localhost:${PORT}`);
      console.log(`==================================================`);
    });
  } catch (error) {
    console.error('Fatal error during server startup:', error);
    process.exit(1);
  }
}

// REST API Routes

// Middleware to verify database is loaded
app.use((req, res, next) => {
  if (!dbInitialized) {
    return res.status(503).json({ error: 'Database is still initializing. Please try again in a moment.' });
  }
  next();
});

// GET /api/patients - Fetch all records
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await getAllPatients();
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to retrieve patient files.' });
  }
});

// POST /api/patients - Create a patient record with real-time AI triage analysis
app.post('/api/patients', async (req, res) => {
  const { name, age, gender, symptoms, history } = req.body;

  if (!name || !age || !gender || !symptoms) {
    return res.status(400).json({ error: 'Missing required patient fields (name, age, gender, symptoms).' });
  }

  try {
    console.log(`[Triage Request] Analyzing patient symptoms for: ${name}...`);
    
    // 1. Run real/fallback Gemini AI diagnostic evaluation
    const aiResult = await generateTriage(name, age, gender, symptoms, history);
    
    // 2. Format database record
    const patientData = {
      name,
      age: parseInt(age),
      gender,
      symptoms,
      history: history || 'No active medical history recorded',
      riskScore: aiResult.riskScore,
      status: aiResult.status,
      detectedRisks: aiResult.detectedRisks,
      vitals: aiResult.vitals,
      reasoning: aiResult.reasoning,
      pathway: aiResult.pathway
    };

    // 3. Save to local SQLite database
    const savedRecord = await insertPatient(patientData);
    
    console.log(`[Triage Success] Saved record for ${name} with risk rating: ${aiResult.riskScore}% (${aiResult.status})`);
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error running patient triage:', error);
    res.status(500).json({ error: 'Clinical AI evaluation or database write failed.' });
  }
});

// DELETE /api/patients/:id - Delete a patient record
app.delete('/api/patients/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid patient ID.' });
  }

  try {
    await deletePatient(id);
    console.log(`[Database Delete] Removed patient ID: ${id}`);
    res.json({ success: true, message: `Patient ID ${id} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ error: 'Failed to delete patient file.' });
  }
});

// POST /api/chat - Query MedGuard Copilot chatbot
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid query request. Messages array required.' });
  }

  try {
    console.log(`[AI Copilot Request] Processing doctor dialogue query...`);
    const aiReply = await generateChatResponse(messages);
    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Error running AI Copilot:', error);
    res.status(500).json({ error: 'AI Assistant failed to generate a response.' });
  }
});

// POST /api/login - Authenticate clinical staff
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  // Demo credential verification
  if (
    (email === 'doctor' || email === 'doctor@medguard.ai') &&
    password === 'doctor123'
  ) {
    console.log(`[Clinical Login] Successful login for: ${email}`);
    return res.json({
      success: true,
      token: 'mock-jwt-token-clinical-access',
      user: {
        email,
        name: 'Dr. Evelyn Harper',
        role: 'Chief Medical Triage Officer'
      }
    });
  }

  console.log(`[Clinical Login Failed] Invalid attempt for: ${email}`);
  res.status(401).json({ error: 'Invalid clinical credentials. Access denied.' });
});

// Start the server
startServer();
