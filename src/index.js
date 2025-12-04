// name: abdul-salam bdaiwi, leah kang, parsa salah
// student id: bdaiwia, leahyk, salahshp
// main server file

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Orchestrator } from './orchestrator.js';
import { getUsageStats } from './utils/modelTracker.js';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ✅ Check OpenAI API key instead of Anthropic
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OPENAI_API_KEY not found in environment variables');
  console.error('Please create a .env file with your OpenAI API key');
  process.exit(1);
}

// Initialize orchestrator with OpenAI key
const orchestrator = new Orchestrator(process.env.OPENAI_API_KEY);

// main endpoint to generate code from requirements
app.post('/generate', async (req, res) => {
  try {
    const { requirements } = req.body;

    if (!requirements) {
      return res.status(400).json({
        success: false,
        error: 'Requirements are required'
      });
    }

    console.log('Received code generation request');
    console.log('Requirements:', requirements.substring(0, 100) + '...');

    // Process the requirements
    const result = await orchestrator.processRequirements(requirements);

    console.log('Processing complete, success:', result.success);

    if (result.success) {
      // Get usage statistics
      const usage = getUsageStats();

      console.log('Sending response to client');

      res.json({
        success: true,
        codeFile: result.codeFile,
        testFile: result.testFile,
        code: result.code,
        tests: result.tests,
        usage: usage
      });
    } else {
      console.log('Processing failed:', result.error);
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error in /generate endpoint:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// endpoint to get model usage stats
app.get('/usage', (req, res) => {
  try {
    const usage = getUsageStats();
    res.json(usage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('AI Coder - Multi-Agent Code Generator (OpenAI)');
  console.log('='.repeat(50));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Open your browser and navigate to the URL above');
  console.log('='.repeat(50));
});
