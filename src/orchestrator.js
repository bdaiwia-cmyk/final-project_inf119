// name: abdul-salam bdaiwi, leah kang, parsa salah
// student id: bdaiwia, leahyk, salahshp
// orchestrates all the agents

import { CoordinatorAgent } from './agents/coordinatorAgent.js';
import { CoderAgent } from './agents/coderAgent.js';
import { TesterAgent } from './agents/testerAgent.js';
import { saveUsageToFile, resetTracking } from './utils/modelTracker.js';
import fs from 'fs';
import path from 'path';

// orchestrator - runs the whole system
export class Orchestrator {
  constructor(apiKey) {
    // Initialize all agents
    this.coordinator = new CoordinatorAgent(apiKey);
    this.coder = new CoderAgent(apiKey);
    this.tester = new TesterAgent(apiKey);

    console.log('Orchestrator: All agents initialized');
  }

  // process requirements and generate code + tests
  async processRequirements(requirements) {
    try {
      console.log('Orchestrator: Starting process...');

      // Reset tracking for this run
      resetTracking();

      // Step 1: Parse requirements using coordinator
      console.log('Orchestrator: Step 1 - Parsing requirements');
      const parsedReqs = await this.coordinator.parseRequirements(requirements);
      console.log('Orchestrator: Requirements parsed, moving to code generation');

      // Step 2: Generate code using coder agent
      console.log('Orchestrator: Step 2 - Generating code');
      const code = await this.coder.generateCode(parsedReqs);
      console.log('Orchestrator: Code generated, moving to test generation');

      // Step 3: Generate tests using tester agent
      console.log('Orchestrator: Step 3 - Generating tests');
      const tests = await this.tester.generateTests(code, parsedReqs);
      console.log('Orchestrator: Tests generated, saving files');

      // Step 4: Save generated files
      const timestamp = Date.now();
      const codeFilePath = path.join('output', `code_${timestamp}.py`);
      const testFilePath = path.join('output', `tests_${timestamp}.py`);

      // create output directory if it doesnt exist
      if (!fs.existsSync('output')) {
        fs.mkdirSync('output');
      }

      // Clean the code (remove markdown code blocks if present)
      let cleanCode = code;
      if (cleanCode.includes('```python')) {
        cleanCode = cleanCode.split('```python')[1].split('```')[0].trim();
      } else if (cleanCode.includes('```')) {
        cleanCode = cleanCode.split('```')[1].split('```')[0].trim();
      }

      // Clean the tests
      let cleanTests = tests;
      if (cleanTests.includes('```python')) {
        cleanTests = cleanTests.split('```python')[1].split('```')[0].trim();
      } else if (cleanTests.includes('```')) {
        cleanTests = cleanTests.split('```')[1].split('```')[0].trim();
      }

      // Write files
      fs.writeFileSync(codeFilePath, cleanCode);
      fs.writeFileSync(testFilePath, cleanTests);

      console.log(`Orchestrator: Code saved to ${codeFilePath}`);
      console.log(`Orchestrator: Tests saved to ${testFilePath}`);

      // Step 5: Save model usage statistics
      saveUsageToFile('model_usage.json');

      return {
        success: true,
        codeFile: codeFilePath,
        testFile: testFilePath,
        code: cleanCode,
        tests: cleanTests
      };

    } catch (error) {
      console.error('Orchestrator: Error during processing:', error.message);

      // Still save usage stats even if there was an error
      saveUsageToFile('model_usage.json');

      return {
        success: false,
        error: error.message
      };
    }
  }
}
