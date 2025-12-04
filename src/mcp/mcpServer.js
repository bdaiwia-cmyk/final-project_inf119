// name: abdul-salam bdaiwi, leah kang, parsa salah
// student id: bdaiwia, leahyk, salahshp
// mcp server for agent communication

// mcp server - lets agents talk to each other
class MCPServer {
  constructor() {
    // keep track of all agents
    this.agents = new Map();

    // queue for messages between agents
    this.messageQueue = [];

    console.log('MCP Server initialized');
  }

  // register a new agent
  registerAgent(agentId, agentInfo) {
    this.agents.set(agentId, {
      ...agentInfo,
      registeredAt: new Date()
    });

    console.log(`Agent registered: ${agentId}`);
  }

  // send message from one agent to another
  sendMessage(fromAgentId, toAgentId, message) {
    // make sure both agents exist
    if (!this.agents.has(fromAgentId)) {
      throw new Error(`Sender agent ${fromAgentId} not registered`);
    }

    if (!this.agents.has(toAgentId)) {
      throw new Error(`Receiver agent ${toAgentId} not registered`);
    }

    // put message in the queue
    const messageObj = {
      id: Date.now(),
      from: fromAgentId,
      to: toAgentId,
      content: message,
      timestamp: new Date()
    };

    this.messageQueue.push(messageObj);

    console.log(`Message sent from ${fromAgentId} to ${toAgentId}`);

    return messageObj;
  }

  // get all messages for an agent
  getMessages(agentId) {
    // find messages for this agent
    const messages = this.messageQueue.filter(msg => msg.to === agentId);

    // remove messages we just got
    this.messageQueue = this.messageQueue.filter(msg => msg.to !== agentId);

    return messages;
  }

  // get list of all agents
  getAgents() {
    return Array.from(this.agents.keys());
  }

  // get info about a specific agent
  getAgentInfo(agentId) {
    return this.agents.get(agentId);
  }
}

// make one server for everyone to use
export const mcpServer = new MCPServer();
