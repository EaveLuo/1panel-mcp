#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createHash } from "crypto";

// 1Panel API Configuration
interface OnePanelConfig {
  host: string;
  port: number;
  apiKey: string;
  protocol?: string;
}

class OnePanelClient {
  private config: OnePanelConfig;

  constructor(config: OnePanelConfig) {
    this.config = { protocol: "http", ...config };
  }

  private generateToken(): { token: string; timestamp: string } {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const token = createHash("md5")
      .update(`1panel${this.config.apiKey}${timestamp}`)
      .digest("hex");
    return { token, timestamp };
  }

  private async request(path: string, options: RequestInit = {}): Promise<any> {
    const { token, timestamp } = this.generateToken();
    const url = `${this.config.protocol}://${this.config.host}:${this.config.port}${path}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "1Panel-Token": token,
        "1Panel-Timestamp": timestamp,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`1Panel API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listContainers(): Promise<any> {
    return this.request("/api/v2/containers/search");
  }

  async startContainer(id: string): Promise<any> {
    return this.request("/api/v2/containers/operate", {
      method: "POST",
      body: JSON.stringify({ id, operation: "start" }),
    });
  }

  async stopContainer(id: string): Promise<any> {
    return this.request("/api/v2/containers/operate", {
      method: "POST",
      body: JSON.stringify({ id, operation: "stop" }),
    });
  }

  async restartContainer(id: string): Promise<any> {
    return this.request("/api/v2/containers/operate", {
      method: "POST",
      body: JSON.stringify({ id, operation: "restart" }),
    });
  }

  async listImages(): Promise<any> {
    return this.request("/api/v2/containers/image");
  }

  async pullImage(name: string): Promise<any> {
    return this.request("/api/v2/containers/image/pull", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  async listInstalledApps(): Promise<any> {
    return this.request("/api/v2/apps/installed/search");
  }

  async listAppStore(): Promise<any> {
    return this.request("/api/v2/apps/search");
  }

  async listFiles(path: string): Promise<any> {
    return this.request(`/api/v2/files?path=${encodeURIComponent(path)}`);
  }

  async getSystemInfo(): Promise<any> {
    return this.request("/api/v2/toolbox/device/base");
  }

  async getSystemMonitor(): Promise<any> {
    return this.request("/api/v2/toolbox/device/monitor");
  }

  async listWebsites(): Promise<any> {
    return this.request("/api/v2/websites/search");
  }

  async listDatabases(type: string): Promise<any> {
    return this.request(`/api/v2/databases/${type}/search`);
  }

  async listComposes(): Promise<any> {
    return this.request("/api/v2/containers/compose/search");
  }

  async listCertificates(): Promise<any> {
    return this.request("/api/v2/websites/ssl/search");
  }
}

// MCP Server
const server = new Server(
  { name: "1panel-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const config: OnePanelConfig = {
  host: process.env.ONEPANEL_HOST || "localhost",
  port: parseInt(process.env.ONEPANEL_PORT || "8080"),
  apiKey: process.env.ONEPANEL_API_KEY || "",
  protocol: process.env.ONEPANEL_PROTOCOL || "http",
};

if (!config.apiKey) {
  console.error("Error: ONEPANEL_API_KEY environment variable is required");
  process.exit(1);
}

const client = new OnePanelClient(config);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "list_containers", description: "List all Docker containers", inputSchema: { type: "object", properties: {} } },
    { name: "start_container", description: "Start a container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "stop_container", description: "Stop a container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "restart_container", description: "Restart a container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "list_images", description: "List Docker images", inputSchema: { type: "object", properties: {} } },
    { name: "pull_image", description: "Pull a Docker image", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } },
    { name: "list_installed_apps", description: "List installed apps", inputSchema: { type: "object", properties: {} } },
    { name: "list_app_store", description: "List app store", inputSchema: { type: "object", properties: {} } },
    { name: "list_files", description: "List files", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
    { name: "get_system_info", description: "Get system info", inputSchema: { type: "object", properties: {} } },
    { name: "get_system_monitor", description: "Get system monitor data", inputSchema: { type: "object", properties: {} } },
    { name: "list_websites", description: "List websites", inputSchema: { type: "object", properties: {} } },
    { name: "list_databases", description: "List databases", inputSchema: { type: "object", properties: { type: { type: "string", enum: ["mysql", "postgresql", "redis"] } }, required: ["type"] } },
    { name: "list_composes", description: "List compose projects", inputSchema: { type: "object", properties: {} } },
    { name: "list_certificates", description: "List SSL certificates", inputSchema: { type: "object", properties: {} } },
  ],
}));

// Tool handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    let result: any;
    switch (name) {
      case "list_containers": result = await client.listContainers(); break;
      case "start_container": result = await client.startContainer(args?.id as string); break;
      case "stop_container": result = await client.stopContainer(args?.id as string); break;
      case "restart_container": result = await client.restartContainer(args?.id as string); break;
      case "list_images": result = await client.listImages(); break;
      case "pull_image": result = await client.pullImage(args?.name as string); break;
      case "list_installed_apps": result = await client.listInstalledApps(); break;
      case "list_app_store": result = await client.listAppStore(); break;
      case "list_files": result = await client.listFiles(args?.path as string); break;
      case "get_system_info": result = await client.getSystemInfo(); break;
      case "get_system_monitor": result = await client.getSystemMonitor(); break;
      case "list_websites": result = await client.listWebsites(); break;
      case "list_databases": result = await client.listDatabases(args?.type as string); break;
      case "list_composes": result = await client.listComposes(); break;
      case "list_certificates": result = await client.listCertificates(); break;
      default: throw new Error(`Unknown tool: ${name}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("1Panel MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});