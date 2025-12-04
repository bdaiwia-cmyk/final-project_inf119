// name: abdul-salam bdaiwi, leah kang, parsa salah
// student id: bdaiwia, leahyk, salahshp
// agent that generates code


import { MCPClient } from '../mcp/mcpClient.js';
import { trackApiCall } from '../utils/modelTracker.js';
import OpenAI from 'openai';

export class TesterAgent {
  constructor(apiKey) {
    this.mcpClient = new MCPClient('tester', {
      role: 'test_generator',
      description: 'Generates test cases for code'
    });

    this.openai = new OpenAI({
      apiKey
    });

    this.modelName = 'gpt-4.1';
  }

  async generateTests(code, requirements) {
    try {
      console.log('Tester: Generating tests...');

      const completion = await this.openai.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: 'user',
            content: `
Generate a full Python unittest file.

CODE UNDER TEST:
\`\`\`python
${code}
\`\`\`

REQUIREMENTS:
${requirements.parsed}

RULES:
- Include imports
- Paste code under test INTO the test file
- Then write unittest classes
- At least 10 tests
- ONLY return Python code
`
          }
        ]
      });

      const tests = completion.choices[0].message.content;

      trackApiCall(this.modelName, completion.usage.total_tokens);

      console.log('Tester: Tests generated successfully');
      return tests;
    } catch (error) {
      console.error('Tester: Error generating tests:', error);
      throw error;
    }
  }

  async listen() {
    console.log('Tester: Listening for requests...');
  }

  async processRequest(request) {
    if (request.type === 'generate_tests') {
      const tests = await this.generateTests(request.code, request.requirements);

      this.mcpClient.send('coordinator', {
        type: 'tests_ready',
        tests
      });
    }
  }
}
