import { BaseAPI } from "./base.js";

export class AIAPI extends BaseAPI {
  // ==================== Agent ====================

  /**
   * 列出 AI Agents
   */
  async listAgents(): Promise<any> {
    return this.post("/api/v2/ai/agents/search", { page: 1, pageSize: 100 });
  }

  /**
   * 创建 AI Agent
   */
  async createAgent(params: any): Promise<any> {
    return this.post("/api/v2/ai/agents", params);
  }

  /**
   * 更新 AI Agent
   */
  async updateAgent(params: any): Promise<any> {
    return this.post("/api/v2/ai/agents/update", params);
  }

  /**
   * 删除 AI Agent
   */
  async deleteAgent(id: number): Promise<any> {
    return this.post("/api/v2/ai/agents/del", { id });
  }

  /**
   * 重置 Agent Token
   */
  async resetAgentToken(id: number): Promise<any> {
    return this.post("/api/v2/ai/agents/reset", { id });
  }

  /**
   * 更新 Agent 模型配置
   */
  async updateAgentModel(id: number, params: any): Promise<any> {
    return this.post("/api/v2/ai/agents/model", { id, ...params });
  }

  // ==================== Agent Account ====================

  /**
   * 列出 Agent 账号
   */
  async listAgentAccounts(): Promise<any> {
    return this.post("/api/v2/ai/agents/accounts/search", { page: 1, pageSize: 100 });
  }

  /**
   * 创建 Agent 账号
   */
  async createAgentAccount(params: any): Promise<any> {
    return this.post("/api/v2/ai/agents/accounts", params);
  }

  /**
   * 更新 Agent 账号
   */
  async updateAgentAccount(params: any): Promise<any> {
    return this.post("/api/v2/ai/agents/accounts/update", params);
  }

  /**
   * 删除 Agent 账号
   */
  async deleteAgentAccount(id: number): Promise<any> {
    return this.post("/api/v2/ai/agents/accounts/delete", { id });
  }

  /**
   * 验证 Agent 账号
   */
  async verifyAgentAccount(params: any): Promise<any> {
    return this.post("/api/v2/ai/agents/accounts/verify", params);
  }

  // ==================== Channel Config ====================

  /**
   * 获取 Agent Browser 配置
   */
  async getAgentBrowserConfig(agentId: number): Promise<any> {
    return this.request(`/api/v2/ai/agents/${agentId}/browser`, { method: "GET" });
  }

  /**
   * 更新 Agent Browser 配置
   */
  async updateAgentBrowserConfig(agentId: number, params: any): Promise<any> {
    return this.post(`/api/v2/ai/agents/${agentId}/browser`, params);
  }

  /**
   * 获取 Agent Discord 配置
   */
  async getAgentDiscordConfig(agentId: number): Promise<any> {
    return this.request(`/api/v2/ai/agents/${agentId}/discord`, { method: "GET" });
  }

  /**
   * 更新 Agent Discord 配置
   */
  async updateAgentDiscordConfig(agentId: number, params: any): Promise<any> {
    return this.post(`/api/v2/ai/agents/${agentId}/discord`, params);
  }

  /**
   * 获取 Agent Feishu 配置
   */
  async getAgentFeishuConfig(agentId: number): Promise<any> {
    return this.request(`/api/v2/ai/agents/${agentId}/feishu`, { method: "GET" });
  }

  /**
   * 更新 Agent Feishu 配置
   */
  async updateAgentFeishuConfig(agentId: number, params: any): Promise<any> {
    return this.post(`/api/v2/ai/agents/${agentId}/feishu`, params);
  }

  /**
   * 获取 Agent Telegram 配置
   */
  async getAgentTelegramConfig(agentId: number): Promise<any> {
    return this.request(`/api/v2/ai/agents/${agentId}/telegram`, { method: "GET" });
  }

  /**
   * 更新 Agent Telegram 配置
   */
  async updateAgentTelegramConfig(agentId: number, params: any): Promise<any> {
    return this.post(`/api/v2/ai/agents/${agentId}/telegram`, params);
  }

  // ==================== MCP Server ====================

  /**
   * 列出 MCP Servers
   */
  async listMCPServers(): Promise<any> {
    return this.request("/api/v2/ai/mcp", { method: "GET" });
  }

  /**
   * 创建 MCP Server
   */
  async createMCPServer(params: any): Promise<any> {
    return this.post("/api/v2/ai/mcp", params);
  }

  /**
   * 更新 MCP Server
   */
  async updateMCPServer(id: number, params: any): Promise<any> {
    return this.post("/api/v2/ai/mcp/update", { id, ...params });
  }

  /**
   * 删除 MCP Server
   */
  async deleteMCPServer(id: number): Promise<any> {
    return this.post("/api/v2/ai/mcp/del", { id });
  }

  /**
   * 操作 MCP Server
   */
  async operateMCPServer(id: number, operation: string): Promise<any> {
    return this.post("/api/v2/ai/mcp/operate", { id, operation });
  }

  /**
   * 获取 MCP Server 域名
   */
  async getMCPDomain(): Promise<any> {
    return this.request("/api/v2/ai/mcp/domain", { method: "GET" });
  }

  /**
   * 绑定 MCP Server 域名
   */
  async bindMCPDomain(params: any): Promise<any> {
    return this.post("/api/v2/ai/mcp/domain/bind", params);
  }

  /**
   * 更新 MCP Server 域名
   */
  async updateMCPDomain(params: any): Promise<any> {
    return this.post("/api/v2/ai/mcp/domain/update", params);
  }
}
