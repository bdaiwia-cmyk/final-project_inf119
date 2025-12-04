# AI Coder - Multi-Agent Code Generator with MCP

A multi-agent system that uses the Model Context Protocol (MCP) to generate executable code and test cases from natural language requirements.

**Group Members:**
- Abdul-Salam Bdaiwi
- Leah Kang
- Parsa Salah

### Coordinator Agent (Parsa Salah - @salahshp-source)

Parsa implemented the Coordinator Agent logic, which parses raw user requirements, structures them into purpose, features, and constraints, and sends them to the Coder and Tester agents. He contributed to refining the flow between agents, especially how the orchestrator performs requirement parsing and handles errors from the model.

### Coder & Tester Agents (Leah Kang - @leahkangg)

Leah developed the Coder Agent and Tester Agent. The Coder Agent transforms structured requirements into fully runnable Python programs using OpenAI. The Tester Agent generates unittest test suites that include both positive and negative test cases, embedding the generated code directly in the test file. Leah optimized prompt clarity, test coverage, and ensured that tests run as standalone files.

### Orchestrator & Web UI (Abdul-Salam Bdaiwi - @bdaiwia-cmyk)

Abdul implemented the Express server, the orchestrator logic that coordinates all three agents, and the complete web interface for submitting requirements and receiving generated code and tests. He integrated the agents, managed API flow, implemented output saving, and ensured end-to-end functionality.

## Overview

This system uses three specialized AI agents that communicate through MCP to:
1. Parse and understand software requirements
2. Generate executable Python code
3. Create comprehensive test cases

## Prerequisites

Before running this system, make sure you have:

- Node.js (version 16 or higher)
- Python 3.7 or higher
- An Anthropic API key

## Installation

1. **Clone or extract this repository**

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

## How to Run

1. **Start the server**
   ```bash
   npm start
   ```

2. **Open your browser**

   Navigate to: `http://localhost:3000`

3. **Enter your requirements**

   Type or paste your software requirements into the text area. For example:
   ```
   Create a calculator application that can perform basic arithmetic
   operations (addition, subtraction, multiplication, division).
   It should handle invalid inputs gracefully and support decimal numbers.
   ```

4. **Click "Generate Code"**

   Wait for the system to generate code and tests (this takes about 30-60 seconds)

5. **View the results**

   The system will display:
   - Generated Python code
   - Test cases (at least 10 tests)
   - Model usage statistics
   - Instructions on how to run the code and tests

## Running Generated Code

After code generation, you'll see two files in the `output/` directory:

**Run the generated code:**
```bash
python output/code_[timestamp].py
```

**Run the tests (Windows):**
```bash
python -m unittest output.tests_[timestamp]
```

**Run the tests (Mac/Linux):**
```bash
python -m unittest output/tests_[timestamp].py
```

Replace `[timestamp]` with the actual timestamp from your generated files.

## System Architecture

### Multi-Agent System

The system consists of three agents:

1. **Coordinator Agent** (`coordinatorAgent.js`)
   - Role: Workflow management
   - Responsibilities: Parses requirements, coordinates other agents
   - Model: Claude 3.5 Sonnet

2. **Coder Agent** (`coderAgent.js`)
   - Role: Code generation
   - Responsibilities: Generates executable Python code from requirements
   - Model: Claude 3.5 Sonnet

3. **Tester Agent** (`testerAgent.js`)
   - Role: Test generation
   - Responsibilities: Creates comprehensive test cases
   - Model: Claude 3.5 Sonnet

### Model Context Protocol (MCP)

MCP enables communication between agents:

- **MCP Server** (`mcpServer.js`): Central message broker
- **MCP Client** (`mcpClient.js`): Used by each agent to send/receive messages

Agents register with the MCP server and exchange messages through it, ensuring proper coordination.

## Project Structure

```
├── src/
│   ├── agents/
│   │   ├── coordinatorAgent.js   # Workflow coordinator
│   │   ├── coderAgent.js          # Code generator
│   │   └── testerAgent.js         # Test generator
│   ├── mcp/
│   │   ├── mcpServer.js           # MCP server implementation
│   │   └── mcpClient.js           # MCP client implementation
│   ├── utils/
│   │   ├── modelTracker.js        # Tracks model usage
│   │   └── errorHandler.js        # Error handling utilities
│   ├── orchestrator.js            # Main orchestration logic
│   └── index.js                   # Server entry point
├── public/
│   └── index.html                 # Web UI
├── generated_code/                # Generated code output directory
├── package.json
├── .env.example
└── README.md
```

## Model Usage Tracking

The system tracks all API calls and token usage. After each generation:

- View statistics in the web UI
- Find detailed JSON report in `model_usage.json`

Example format:
```json
{
  "claude-3-5-sonnet-20241022": {
    "numApiCalls": 3,
    "totalTokens": 5243
  }
}
```

## Error Handling

The system includes several fault-tolerance mechanisms:

1. **Try-catch blocks** around all API calls
2. **Validation** of required fields and inputs
3. **Graceful degradation** - errors are logged and reported to user
4. **Error messages** displayed in the UI

## Troubleshooting

**"ANTHROPIC_API_KEY not found" error:**
- Make sure you created a `.env` file
- Check that your API key is correct

**Port already in use:**
- Change the PORT in your `.env` file
- Or stop other applications using port 3000

**Generated code has errors:**
- This is expected - the system aims for functionality over perfection
- Most tests should still pass (80%+ success rate)

**Module not found errors:**
- Run `npm install` to install all dependencies

## Notes

- The system generates Python code by default
- Generated code is saved in the `output/` directory
- Each generation creates new files with timestamps
- Model usage is tracked automatically for every generation
