// name: abdul-salam bdaiwi, leah kang, parsa salah
// student id: bdaiwia, leahyk, salahshp
// agent that generates code
// CoderAgent: Generates runnable Python code based on structured requirements
// Core implementation by Leah Kang (@leahkangg)

import { MCPClient } from '../mcp/mcpClient.js';
import { trackApiCall } from '../utils/modelTracker.js';
import OpenAI from 'openai';

export class CoderAgent {
  constructor(apiKey) {
    this.mcpClient = new MCPClient('coder', {
      role: 'code_generator',
      description: 'Generates code from requirements'
    });

    this.openai = new OpenAI({
      apiKey
    });

    this.modelName = 'gpt-4.1'; // best for coding
  }

  async generateCode(requirements) {
    try {
      console.log('Coder: Generating code...');

      const completion = await this.openai.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: 'user',
            content: `You are a software developer. Generate Python code based on these requirements:

${requirements.parsed}

Important:
- Write complete runnable Python code
- Include imports
- Include comments
- Include main function or example usage
- NO explanations. Only code.`
          }
        ]
      });

      const code = completion.choices[0].message.content;

      trackApiCall(this.modelName, completion.usage.total_tokens);

      console.log('Coder: Code generated successfully');
      return code;
    } catch (error) {
      console.error('Coder: Error generating code:', error);
      throw error;
    }
  }

  async listen() {
    console.log('Coder: Listening for requests...');
  }

  async processRequest(request) {
    if (request.type === 'generate_code') {
      const code = await this.generateCode(request.requirements);

      this.mcpClient.send('coordinator', {
        type: 'code_ready',
        code
      });
    }
  }
}
