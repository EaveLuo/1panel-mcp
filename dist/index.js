#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { OnePanelClient } from "./client.js";
const config = {
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
    { name: "list_containers_simple", description: "List containers (simple)", inputSchema: { type: "object", properties: {} } },
    { name: "get_container", description: "Get container info", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "inspect_container", description: "Inspect container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "start_container", description: "Start container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "stop_container", description: "Stop container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "restart_container", description: "Restart container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "pause_container", description: "Pause container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "unpause_container", description: "Unpause container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "kill_container", description: "Kill container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "remove_container", description: "Remove container", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "create_container", description: "Create container", inputSchema: { type: "object", properties: { config: { type: "object" } }, required: ["config"] } },
    { name: "update_container", description: "Update container", inputSchema: { type: "object", properties: { id: { type: "string" }, config: { type: "object" } }, required: ["id", "config"] } },
    { name: "rename_container", description: "Rename container", inputSchema: { type: "object", properties: { id: { type: "string" }, name: { type: "string" } }, required: ["id", "name"] } },
    { name: "upgrade_container", description: "Upgrade container", inputSchema: { type: "object", properties: { id: { type: "string" }, image: { type: "string" } }, required: ["id", "image"] } },
    { name: "get_container_logs", description: "Get container logs", inputSchema: { type: "object", properties: { id: { type: "string" }, tail: { type: "number" } }, required: ["id"] } },
    { name: "get_container_stats", description: "Get container stats", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "get_container_status", description: "Get containers status", inputSchema: { type: "object", properties: {} } },
    { name: "prune_containers", description: "Prune containers", inputSchema: { type: "object", properties: {} } },
    { name: "clean_container_log", description: "Clean container log", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "get_container_users", description: "Get container users", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } },
    { name: "list_containers_by_image", description: "List containers by image", inputSchema: { type: "object", properties: { image: { type: "string" } }, required: ["image"] } },
    { name: "commit_container", description: "Commit container", inputSchema: { type: "object", properties: { id: { type: "string" }, repo: { type: "string" }, tag: { type: "string" } }, required: ["id", "repo", "tag"] } },
    // Images
    { name: "list_images", description: "List Docker images", inputSchema: { type: "object", properties: {} } },
    { name: "list_all_images", description: "List all Docker images", inputSchema: { type: "object", properties: {} } },
    { name: "search_images", description: "Search images", inputSchema: { type: "object", properties: {} } },
    { name: "pull_image", description: "Pull image", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } },
    { name: "push_image", description: "Push image", inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } },
    { name: "remove_image", description: "Remove image", inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] } },
    { name: "build_image", description: "Build image", inputSchema: { type: "object", properties: { dockerfile: { type: "string" }, name: { type: "string" }, path: { type: "string" } }, required: ["dockerfile", "name", "path"] } },
    { name: "tag_image", description: "Tag image", inputSchema: { type: "object", properties: { id: { type: "string" }, repo: { type: "string" }, tag: { type: "string" } }, required: ["id", "repo", "tag"] } },
    { name: "save_image", description: "Save image", inputSchema: { type: "object", properties: { names: { type: "array", items: { type: "string" } } }, required: ["names"] } },
    { name: "load_image", description: "Load image", inputSchema: { type: "object", properties: { path: { type: "string" } }, required: ["path"] } },
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
    { name: "update_compose", description: "Update compose", inputSchema: { type: "object", properties: { id: { type: "number" }, content: { type: "string" } }, required: ["id", "content"] } },
    { name: "test_compose", description: "Test compose", inputSchema: { type: "object", properties: { content: { type: "string" } }, required: ["content"] } },
    { name: "get_compose_env", description: "Get compose environment", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "clean_compose_log", description: "Clean compose log", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
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
    // Process
    { name: "list_processes", description: "List processes", inputSchema: { type: "object", properties: {} } },
    { name: "kill_process", description: "Kill process", inputSchema: { type: "object", properties: { pid: { type: "number" } }, required: ["pid"] } },
    // SSH
    { name: "get_ssh_config", description: "Get SSH config", inputSchema: { type: "object", properties: {} } },
    { name: "update_ssh_config", description: "Update SSH config", inputSchema: { type: "object", properties: { config: { type: "object" } }, required: ["config"] } },
    // Terminal
    { name: "exec_command", description: "Execute command", inputSchema: { type: "object", properties: { command: { type: "string" }, cwd: { type: "string" } }, required: ["command"] } },
    // Backup
    { name: "list_backups", description: "List backups", inputSchema: { type: "object", properties: {} } },
    { name: "create_backup", description: "Create backup", inputSchema: { type: "object", properties: { backup: { type: "object" } }, required: ["backup"] } },
    { name: "restore_backup", description: "Restore backup", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "delete_backup", description: "Delete backup", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    // Settings
    { name: "get_settings", description: "Get settings", inputSchema: { type: "object", properties: {} } },
    { name: "update_settings", description: "Update settings", inputSchema: { type: "object", properties: { settings: { type: "object" } }, required: ["settings"] } },
    // Logs
    { name: "list_operation_logs", description: "List operation logs", inputSchema: { type: "object", properties: {} } },
    { name: "list_system_logs", description: "List system logs", inputSchema: { type: "object", properties: {} } },
    // Runtime
    { name: "list_environments", description: "List environments", inputSchema: { type: "object", properties: { type: { type: "string" } }, required: ["type"] } },
    { name: "install_environment", description: "Install environment", inputSchema: { type: "object", properties: { type: { type: "string" }, config: { type: "object" } }, required: ["type", "config"] } },
    { name: "uninstall_environment", description: "Uninstall environment", inputSchema: { type: "object", properties: { type: { type: "string" }, id: { type: "number" } }, required: ["type", "id"] } },
];
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        let result;
        switch (name) {
            // Containers
            case "list_containers":
                result = await client.listContainers();
                break;
            case "list_containers_simple":
                result = await client.listContainersSimple();
                break;
            case "get_container":
                result = await client.getContainer(args?.id);
                break;
            case "inspect_container":
                result = await client.inspectContainer(args?.id);
                break;
            case "start_container":
                result = await client.startContainer(args?.id);
                break;
            case "stop_container":
                result = await client.stopContainer(args?.id);
                break;
            case "restart_container":
                result = await client.restartContainer(args?.id);
                break;
            case "pause_container":
                result = await client.pauseContainer(args?.id);
                break;
            case "unpause_container":
                result = await client.unpauseContainer(args?.id);
                break;
            case "kill_container":
                result = await client.killContainer(args?.id);
                break;
            case "remove_container":
                result = await client.removeContainer(args?.id);
                break;
            case "create_container":
                result = await client.createContainer(args?.config);
                break;
            case "update_container":
                result = await client.updateContainer(args?.id, args?.config);
                break;
            case "rename_container":
                result = await client.renameContainer(args?.id, args?.name);
                break;
            case "upgrade_container":
                result = await client.upgradeContainer(args?.id, args?.image);
                break;
            case "get_container_logs":
                result = await client.getContainerLogs(args?.id, args?.tail);
                break;
            case "get_container_stats":
                result = await client.getContainerStats(args?.id);
                break;
            case "get_container_status":
                result = await client.getContainerStatus();
                break;
            case "prune_containers":
                result = await client.pruneContainers();
                break;
            case "clean_container_log":
                result = await client.cleanContainerLog(args?.id);
                break;
            case "get_container_users":
                result = await client.getContainerUsers(args?.name);
                break;
            case "list_containers_by_image":
                result = await client.listContainersByImage(args?.image);
                break;
            case "commit_container":
                result = await client.commitContainer(args?.id, args?.repo, args?.tag);
                break;
            // Images
            case "list_images":
                result = await client.listImages();
                break;
            case "list_all_images":
                result = await client.listAllImages();
                break;
            case "search_images":
                result = await client.searchImages();
                break;
            case "pull_image":
                result = await client.pullImage(args?.name);
                break;
            case "push_image":
                result = await client.pushImage(args?.name);
                break;
            case "remove_image":
                result = await client.removeImage(args?.id);
                break;
            case "build_image":
                result = await client.buildImage(args?.dockerfile, args?.name, args?.path);
                break;
            case "tag_image":
                result = await client.tagImage(args?.id, args?.repo, args?.tag);
                break;
            case "save_image":
                result = await client.saveImage(args?.names);
                break;
            case "load_image":
                result = await client.loadImage(args?.path);
                break;
            // Networks
            case "list_networks":
                result = await client.listNetworks();
                break;
            case "create_network":
                result = await client.createNetwork(args?.name, args?.driver);
                break;
            case "remove_network":
                result = await client.removeNetwork(args?.id);
                break;
            // Volumes
            case "list_volumes":
                result = await client.listVolumes();
                break;
            case "create_volume":
                result = await client.createVolume(args?.name);
                break;
            case "remove_volume":
                result = await client.removeVolume(args?.id);
                break;
            // Compose
            case "list_composes":
                result = await client.listComposes();
                break;
            case "create_compose":
                result = await client.createCompose(args?.name, args?.content, args?.path);
                break;
            case "remove_compose":
                result = await client.removeCompose(args?.id);
                break;
            case "start_compose":
                result = await client.startCompose(args?.id);
                break;
            case "stop_compose":
                result = await client.stopCompose(args?.id);
                break;
            case "restart_compose":
                result = await client.restartCompose(args?.id);
                break;
            case "update_compose":
                result = await client.updateCompose(args?.id, args?.content);
                break;
            case "test_compose":
                result = await client.testCompose(args?.content);
                break;
            case "get_compose_env":
                result = await client.getComposeEnv(args?.id);
                break;
            case "clean_compose_log":
                result = await client.cleanComposeLog(args?.id);
                break;
            // Apps
            case "list_installed_apps":
                result = await client.listInstalledApps();
                break;
            case "list_app_store":
                result = await client.listAppStore();
                break;
            case "install_app":
                result = await client.installApp(args?.app);
                break;
            case "uninstall_app":
                result = await client.uninstallApp(args?.id);
                break;
            case "update_app":
                result = await client.updateApp(args?.id);
                break;
            // Files
            case "list_files":
                result = await client.listFiles(args?.path);
                break;
            case "get_file_content":
                result = await client.getFileContent(args?.path);
                break;
            case "save_file":
                result = await client.saveFile(args?.path, args?.content);
                break;
            case "delete_file":
                result = await client.deleteFile(args?.path);
                break;
            case "create_dir":
                result = await client.createDir(args?.path);
                break;
            // Websites
            case "list_websites":
                result = await client.listWebsites();
                break;
            case "create_website":
                result = await client.createWebsite(args?.site);
                break;
            case "delete_website":
                result = await client.deleteWebsite(args?.id);
                break;
            // Certificates
            case "list_certificates":
                result = await client.listCertificates();
                break;
            case "create_certificate":
                result = await client.createCertificate(args?.cert);
                break;
            case "delete_certificate":
                result = await client.deleteCertificate(args?.id);
                break;
            // Databases
            case "list_databases":
                result = await client.listDatabases(args?.type);
                break;
            case "create_database":
                result = await client.createDatabase(args?.type, args?.db);
                break;
            case "delete_database":
                result = await client.deleteDatabase(args?.type, args?.id);
                break;
            // System
            case "get_system_info":
                result = await client.getSystemInfo();
                break;
            case "get_system_monitor":
                result = await client.getSystemMonitor();
                break;
            // Cronjobs
            case "list_cronjobs":
                result = await client.listCronjobs();
                break;
            case "create_cronjob":
                result = await client.createCronjob(args?.job);
                break;
            case "delete_cronjob":
                result = await client.deleteCronjob(args?.id);
                break;
            // Firewall
            case "list_firewall_rules":
                result = await client.listFirewallRules();
                break;
            case "create_firewall_rule":
                result = await client.createFirewallRule(args?.rule);
                break;
            case "delete_firewall_rule":
                result = await client.deleteFirewallRule(args?.id);
                break;
            // Process
            case "list_processes":
                result = await client.listProcesses();
                break;
            case "kill_process":
                result = await client.killProcess(args?.pid);
                break;
            // SSH
            case "get_ssh_config":
                result = await client.getSSHConfig();
                break;
            case "update_ssh_config":
                result = await client.updateSSHConfig(args?.config);
                break;
            // Terminal
            case "exec_command":
                result = await client.execCommand(args?.command, args?.cwd);
                break;
            // Backup
            case "list_backups":
                result = await client.listBackups();
                break;
            case "create_backup":
                result = await client.createBackup(args?.backup);
                break;
            case "restore_backup":
                result = await client.restoreBackup(args?.id);
                break;
            case "delete_backup":
                result = await client.deleteBackup(args?.id);
                break;
            // Settings
            case "get_settings":
                result = await client.getSettings();
                break;
            case "update_settings":
                result = await client.updateSettings(args?.settings);
                break;
            // Logs
            case "list_operation_logs":
                result = await client.listOperationLogs();
                break;
            case "list_system_logs":
                result = await client.listSystemLogs();
                break;
            // Runtime
            case "list_environments":
                result = await client.listEnvironments(args?.type);
                break;
            case "install_environment":
                result = await client.installEnvironment(args?.type, args?.config);
                break;
            case "uninstall_environment":
                result = await client.uninstallEnvironment(args?.type, args?.id);
                break;
            default: throw new Error(`Unknown tool: ${name}`);
        }
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
    catch (error) {
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
//# sourceMappingURL=index.js.map