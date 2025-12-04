// name: abdul-salam bdaiwi, leah kang, parsa salah
// student id: bdaiwia, leahyk, salahshp
// mcp client that agents use to talk

import { mcpServer } from './mcpServer.js';

// mcp client - each agent gets one of these
export class MCPClient {
  constructor(agentId, agentInfo) {
    this.agentId = agentId;

    // register with the server
    mcpServer.registerAgent(agentId, agentInfo);
  }

  // send message to another agent
  send(toAgentId, message) {
    return mcpServer.sendMessage(this.agentId, toAgentId, message);
  }

  // get messages for this agent
  receive() {
    return mcpServer.getMessages(this.agentId);
  }

  // see all agents
  listAgents() {
    return mcpServer.getAgents();
  }
}
