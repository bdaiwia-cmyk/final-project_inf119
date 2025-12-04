// name: abdul-salam bdaiwi, leah kang, parsa salah
// student id: bdaiwia, leahyk, salahshp
// agent that generates code

import { MCPClient } from '../mcp/mcpClient.js';
import { trackApiCall } from '../utils/modelTracker.js';
import OpenAI from 'openai';

export class CoordinatorAgent {
  constructor(apiKey) {
    this.mcpClient = new MCPClient('coordinator', {
      role: 'coordinator',
      description: 'Coordinates workflow'
    });

    this.openai = new OpenAI({
      apiKey
    });

    this.modelName = 'gpt-4.1';
  }

  async parseRequirements(requirements) {
    console.log('Coordinator: Parsing requirements...');

    const completion = await this.openai.chat.completions.create({
      model: this.modelName,
      messages: [
        {
          role: 'user',
          content: `
Parse these requirements:

${requirements}

Extract into this format:

PURPOSE: ...
FEATURES:
- ...
CONSTRAINTS:
- ...
`
        }
      ]
    });

    const parsed = completion.choices[0].message.content;

    trackApiCall(this.modelName, completion.usage.total_tokens);

    return {
      raw: requirements,
      parsed
    };
  }

  async coordinateGeneration(requirements) {
    this.mcpClient.send('coder', {
      type: 'generate_code',
      requirements
    });

    await new Promise(r => setTimeout(r, 1000));

    const messages = this.mcpClient.receive();
    const codeResponse = messages.find((m) => m.from === 'coder');

    this.mcpClient.send('tester', {
      type: 'generate_tests',
      code: codeResponse.content.code,
      requirements
    });

    await new Promise(r => setTimeout(r, 1000));

    const testMessages = this.mcpClient.receive();
    const testResponse = testMessages.find((m) => m.from === 'tester');

    return {
      code: codeResponse.content.code,
      tests: testResponse.content.tests
    };
  }
}
