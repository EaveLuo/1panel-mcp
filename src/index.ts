#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { OnePanelClient, Config } from "./client.js";

const config: Config = {
  host: process.env.ONEPANEL_HOST || "localhost",
  port: parseInt(process.env.ONEPANEL_PORT || "8080"),
  apiKey: process.env.ONEPANEL_API_KEY || "",
  protocol: process.env.ONEPANEL_PROTOCOL || "http",
};

if (!config.apiKey) {
  console.error("Error: ONEPANEL_API_KEY required");
  process.exit(1);
}

const client = new OnePanelClient(config);
const server = new Server({ name: "1panel-mcp", version: "1.0.0" }, { capabilities: { tools: {} } });

const tools = [
  // Containers
  { name: "list_containers", description: "List Docker containers", inputSchema: { type: "object", properties: {} } },
  { name: "start_container", description: "Start container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "stop_container", description: "Stop container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "restart_container", description: "Restart container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "remove_container", description: "Remove container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  { name: "get_container_logs", description: "Get container logs", inputSchema: { type: "object", properties: { id: { type: "string" }, tail: { type: "number" } }, required: ["id"] } },
  // Images
  { name: "list_images", description: "List Docker images", inputSchema: { type: "object", properties: {} } },
  { name: "pull_image", description: "Pull image", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } },
  { name: "remove_image", description: "Remove image", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  // Networks
  { name: "list_networks", description: "List networks", inputSchema: { type: "object", properties: {} } },
  { name: "create_network", description: "Create network", inputSchema: { type: "object", properties: { name: { type: "string" }, driver: { type: "string" } }, required: ["name"] } },
  { name: "remove_network", description: "Remove network", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  // Volumes
  { name: "list_volumes", description: "List volumes", inputSchema: { type: "object", properties: {} } },
  { name: "create_volume", description: "Create volume", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } },
  { name: "remove_volume", description: "Remove volume", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
  // Compose
  { name: "list_composes", description: "List compose projects", inputSchema: { type: "object", properties: {} } },
  { name: "create_compose", description: "Create compose", inputSchema: { type: "object", properties: { name: { type: "string" }, content: { type: "string" } }, required: ["name", "content"] } },
  { name: "remove_compose", description: "Remove compose", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
  { name: "start_compose", description: "Start compose", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
  { name: "stop_compose", description: "Stop compose", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
  { name: "restart_compose", description: "Restart compose", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
  // Apps
  { name: "list_installed_apps", description: "List installed apps", inputSchema: { type: "object", properties: {} } },
  { name: "list_app_store", description: "List app store", inputSchema: { type: "object", properties: {} } },
  { name: "install_app", description: "Install app", inputSchema: { type: "object", properties: { app: { type: "object" } }, required: ["app"] } },
  { name: "uninstall_app", description: "Uninstall app", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
  { name: "update_app", description: "Update app", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
  // Files
  { name: "list_files", description: "List files", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "get_file_content", description: "Get file content", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "save_file", description: "Save file", inputSchema: { type: "object", properties: { path: { type: "string" }, content: { type: "string" } }, required: ["path", "content"] } },
  { name: "delete_file", description: "Delete file", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  { name: "create_dir", description: "Create directory", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
  // Websites
  { name: "list_websites", description: "List websites", inputSchema: { type: "object", properties: {} } },
  { name: "create_website", description: "Create website", inputSchema: { type: "object", properties: { site: { type: "object" } }, required: ["site"] } },
  { name: "delete_website", description: "Delete website", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
  // Certificates
  { name: "list_certificates", description: "List certificates", inputSchema: { type: "object", properties: {} } },
  { name: "create_certificate", description: "Create certificate", inputSchema: { type: "object", properties: { cert: { type: "object" } }, required: ["cert"] } },
  { name: "delete_certificate", description: "Delete certificate", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
  // Databases
  { name: "list_databases", description: "List databases", inputSchema: { type: "object", properties: { type: { type: "string", enum: ["mysql", "postgresql", "redis"] } }, required: ["type"] } },
  { name: "create_database", description: "Create database", inputSchema: { type: "object", properties: { type: { type: "string" }, db: { type: "object" } }, required: ["type", "db"] } },
  { name: "delete_database", description: "Delete database", inputSchema: { type: "object", properties: { type: { type: "string" }, id: { type: "number" } }, required: ["type", "id"] } },
  // System
  { name: "get_system_info", description: "Get system info", inputSchema: { type: "object", properties: {} } },
  { name: "get_system_monitor", description: "Get system monitor", inputSchema: { type: "object", properties: {} } },
  // Cronjobs
  { name: "list_cronjobs", description: "List cronjobs", inputSchema: { type: "object", properties: {} } },
  { name: "create_cronjob", description: "Create cronjob", inputSchema: { type: "object", properties: { job: { type: "object" } }, required: ["job"] } },
  { name: "delete_cronjob", description: "Delete cronjob", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
  // Firewall
  { name: "list_firewall_rules", description: "List firewall rules", inputSchema: { type: "object", properties: {} } },
  { name: "create_firewall_rule", description: "Create firewall rule", inputSchema: { type: "object", properties: { rule: { type: "object" } }, required: ["rule"] } },
  { name: "delete_firewall_rule", description: "Delete firewall rule", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    let result: any;
    switch (name) {
      // Containers
      case "list_containers": result = await client.listContainers(); break;
      case "start_container": result = await client.startContainer(args?.id as string); break;
      case "stop_container": result = await client.stopContainer(args?.id as string); break;
      case "restart_container": result = await client.restartContainer(args?.id as string); break;
      case "remove_container": result = await client.removeContainer(args?.id as string); break;
      case "get_container_logs": result = await client.getContainerLogs(args?.id as string, args?.tail as number); break;
      // Images
      case "list_images": result = await client.listImages(); break;
      case "pull_image": result = await client.pullImage(args?.name as string); break;
      case "remove_image": result = await client.removeImage(args?.id as string); break;
      // Networks
      case "list_networks": result = await client.listNetworks(); break;
      case "create_network": result = await client.createNetwork(args?.name as string, args?.driver as string); break;
      case "remove_network": result = await client.removeNetwork(args?.id as string); break;
      // Volumes
      case "list_volumes": result = await client.listVolumes(); break;
      case "create_volume": result = await client.createVolume(args?.name as string); break;
      case "remove_volume": result = await client.removeVolume(args?.id as string); break;
      // Compose
      case "list_composes": result = await client.listComposes(); break;
      case "create_compose": result = await client.createCompose(args?.name as string, args?.content as string, args?.path as string); break;
      case "remove_compose": result = await client.removeCompose(args?.id as number); break;
      case "start_compose": result = await client.startCompose(args?.id as number); break;
      case "stop_compose": result = await client.stopCompose(args?.id as number); break;
      case "restart_compose": result = await client.restartCompose(args?.id as number); break;
      // Apps
      case "list_installed_apps": result = await client.listInstalledApps(); break;
      case "list_app_store": result = await client.listAppStore(); break;
      case "install_app": result = await client.installApp(args?.app); break;
      case "uninstall_app": result = await client.uninstallApp(args?.id as number); break;
      case "update_app": result = await client.updateApp(args?.id as number); break;
      // Files
      case "list_files": result = await client.listFiles(args?.path as string); break;
      case "get_file_content": result = await client.getFileContent(args?.path as string); break;
      case "save_file": result = await client.saveFile(args?.path as string, args?.content as string); break;
      case "delete_file": result = await client.deleteFile(args?.path as string); break;
      case "create_dir": result = await client.createDir(args?.path as string); break;
      // Websites
      case "list_websites": result = await client.listWebsites(); break;
      case "create_website": result = await client.createWebsite(args?.site); break;
      case "delete_website": result = await client.deleteWebsite(args?.id as number); break;
      // Certificates
      case "list_certificates": result = await client.listCertificates(); break;
      case "create_certificate": result = await client.createCertificate(args?.cert); break;
      case "delete_certificate": result = await client.deleteCertificate(args?.id as number); break;
      // Databases
      case "list_databases": result = await client.listDatabases(args?.type as string); break;
      case "create_database": result = await client.createDatabase(args?.type as string, args?.db); break;
      case "delete_database": result = await client.deleteDatabase(args?.type as string, args?.id as number); break;
      // System
      case "get_system_info": result = await client.getSystemInfo(); break;
      case "get_system_monitor": result = await client.getSystemMonitor(); break;
      // Cronjobs
      case "list_cronjobs": result = await client.listCronjobs(); break;
      case "create_cronjob": result = await client.createCronjob(args?.job); break;
      case "delete_cronjob": result = await client.deleteCronjob(args?.id as number); break;
      // Firewall
      case "list_firewall_rules": result = await client.listFirewallRules(); break;
      case "create_firewall_rule": result = await client.createFirewallRule(args?.rule); break;
      case "delete_firewall_rule": result = await client.deleteFirewallRule(args?.id as number); break;
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
