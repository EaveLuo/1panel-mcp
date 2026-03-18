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
  // Files - Basic
  { name: "list_files", description: "List files in a directory", inputSchema: { type: "object", properties: { path: { type: "string", description: "Directory path" }, page: { type: "number", description: "Page number (default: 1)" }, pageSize: { type: "number", description: "Items per page (default: 100)" } }, required: ["path"] } },
  { name: "search_files", description: "Search files with keyword", inputSchema: { type: "object", properties: { path: { type: "string", description: "Search directory path" }, search: { type: "string", description: "Search keyword" }, page: { type: "number" }, pageSize: { type: "number" } }, required: ["path"] } },
  { name: "get_file_content", description: "Get file content", inputSchema: { type: "object", properties: { path: { type: "string", description: "File path" } }, required: ["path"] } },
  { name: "save_file", description: "Save file content", inputSchema: { type: "object", properties: { path: { type: "string", description: "File path" }, content: { type: "string", description: "File content" } }, required: ["path", "content"] } },
  { name: "delete_file", description: "Delete file or directory", inputSchema: { type: "object", properties: { path: { type: "string", description: "Path to delete" }, forceDelete: { type: "boolean", description: "Force delete without confirmation" } }, required: ["path"] } },
  { name: "create_dir", description: "Create directory", inputSchema: { type: "object", properties: { path: { type: "string", description: "Directory path" } }, required: ["path"] } },
  { name: "create_file", description: "Create empty file", inputSchema: { type: "object", properties: { path: { type: "string", description: "File path" } }, required: ["path"] } },
  // Files - Compression
  { name: "compress_files", description: "Compress files/directories to zip/tar/tar.gz", inputSchema: { type: "object", properties: { files: { type: "array", items: { type: "string" }, description: "Files/directories to compress" }, dst: { type: "string", description: "Destination directory" }, name: { type: "string", description: "Archive name" }, type: { type: "string", enum: ["zip", "tar", "tar.gz"], description: "Compression type" }, replace: { type: "boolean", description: "Replace existing file" }, secret: { type: "string", description: "Password (optional)" } }, required: ["files", "dst", "name", "type"] } },
  { name: "decompress_file", description: "Decompress zip/tar/tar.gz archive", inputSchema: { type: "object", properties: { path: { type: "string", description: "Archive path" }, dst: { type: "string", description: "Destination directory" }, type: { type: "string", enum: ["zip", "tar", "tar.gz"], description: "Archive type" }, secret: { type: "string", description: "Password (optional)" } }, required: ["path", "dst", "type"] } },
  // Files - Move/Rename
  { name: "move_file", description: "Move file/directory to new location", inputSchema: { type: "object", properties: { from: { type: "string", description: "Source path" }, to: { type: "string", description: "Destination path" }, overwrite: { type: "boolean", description: "Overwrite if exists" } }, required: ["from", "to"] } },
  { name: "rename_file", description: "Rename file/directory", inputSchema: { type: "object", properties: { path: { type: "string", description: "Current path" }, name: { type: "string", description: "New name" } }, required: ["path", "name"] } },
  // Files - Permissions
  { name: "chmod_file", description: "Change file/directory permissions (chmod)", inputSchema: { type: "object", properties: { path: { type: "string", description: "File/directory path" }, mode: { type: "string", description: "Permission mode (e.g., 755, 644)" }, sub: { type: "boolean", description: "Apply recursively to subdirectories" } }, required: ["path", "mode"] } },
  { name: "chown_file", description: "Change file/directory owner (chown)", inputSchema: { type: "object", properties: { path: { type: "string", description: "File/directory path" }, user: { type: "string", description: "Owner user" }, group: { type: "string", description: "Owner group" }, sub: { type: "boolean", description: "Apply recursively to subdirectories" } }, required: ["path", "user", "group"] } },
  // Files - Info
  { name: "check_file", description: "Check if file/directory exists", inputSchema: { type: "object", properties: { path: { type: "string", description: "Path to check" } }, required: ["path"] } },
  { name: "get_file_size", description: "Get file/directory size", inputSchema: { type: "object", properties: { path: { type: "string", description: "Path" } }, required: ["path"] } },
  { name: "get_file_tree", description: "Get directory tree structure", inputSchema: { type: "object", properties: { path: { type: "string", description: "Directory path" } }, required: ["path"] } },
  // Files - Transfer
  { name: "download_file", description: "Get download link for file", inputSchema: { type: "object", properties: { path: { type: "string", description: "File path" } }, required: ["path"] } },
  { name: "wget_file", description: "Download file from URL to server", inputSchema: { type: "object", properties: { url: { type: "string", description: "File URL" }, path: { type: "string", description: "Save path" }, ignoreCertificate: { type: "boolean", description: "Ignore SSL certificate errors" } }, required: ["url", "path"] } },
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
    let result: any;
    switch (name) {
      // Containers
      case "list_containers": result = await client.listContainers(); break;
      case "list_containers_simple": result = await client.listContainersSimple(); break;
      case "get_container": result = await client.getContainer(args?.id as string); break;
      case "inspect_container": result = await client.inspectContainer(args?.id as string); break;
      case "start_container": result = await client.startContainer(args?.id as string); break;
      case "stop_container": result = await client.stopContainer(args?.id as string); break;
      case "restart_container": result = await client.restartContainer(args?.id as string); break;
      case "pause_container": result = await client.pauseContainer(args?.id as string); break;
      case "unpause_container": result = await client.unpauseContainer(args?.id as string); break;
      case "kill_container": result = await client.killContainer(args?.id as string); break;
      case "remove_container": result = await client.removeContainer(args?.id as string); break;
      case "create_container": result = await client.createContainer(args?.config); break;
      case "update_container": result = await client.updateContainer(args?.id as string, args?.config); break;
      case "rename_container": result = await client.renameContainer(args?.id as string, args?.name as string); break;
      case "upgrade_container": result = await client.upgradeContainer(args?.id as string, args?.image as string); break;
      case "get_container_logs": result = await client.getContainerLogs(args?.id as string, args?.tail as number); break;
      case "get_container_stats": result = await client.getContainerStats(args?.id as string); break;
      case "get_container_status": result = await client.getContainerStatus(); break;
      case "prune_containers": result = await client.pruneContainers(); break;
      case "clean_container_log": result = await client.cleanContainerLog(args?.id as string); break;
      case "get_container_users": result = await client.getContainerUsers(args?.name as string); break;
      case "list_containers_by_image": result = await client.listContainersByImage(args?.image as string); break;
      case "commit_container": result = await client.commitContainer(args?.id as string, args?.repo as string, args?.tag as string); break;
      // Images
      case "list_images": result = await client.listImages(); break;
      case "list_all_images": result = await client.listAllImages(); break;
      case "search_images": result = await client.searchImages(); break;
      case "pull_image": result = await client.pullImage(args?.name as string); break;
      case "push_image": result = await client.pushImage(args?.name as string); break;
      case "remove_image": result = await client.removeImage(args?.id as string); break;
      case "build_image": result = await client.buildImage(args?.dockerfile as string, args?.name as string, args?.path as string); break;
      case "tag_image": result = await client.tagImage(args?.id as string, args?.repo as string, args?.tag as string); break;
      case "save_image": result = await client.saveImage(args?.names as string[]); break;
      case "load_image": result = await client.loadImage(args?.path as string); break;
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
      case "update_compose": result = await client.updateCompose(args?.id as number, args?.content as string); break;
      case "test_compose": result = await client.testCompose(args?.content as string); break;
      case "get_compose_env": result = await client.getComposeEnv(args?.id as number); break;
      case "clean_compose_log": result = await client.cleanComposeLog(args?.id as number); break;
      // Apps
      case "list_installed_apps": result = await client.listInstalledApps(); break;
      case "list_app_store": result = await client.listAppStore(); break;
      case "install_app": result = await client.installApp(args?.app); break;
      case "uninstall_app": result = await client.uninstallApp(args?.id as number); break;
      case "update_app": result = await client.updateApp(args?.id as number); break;
      // Files - Basic
      case "list_files": result = await client.listFiles(args?.path as string, args?.page as number, args?.pageSize as number); break;
      case "search_files": result = await client.searchFiles(args); break;
      case "get_file_content": result = await client.getFileContent(args?.path as string); break;
      case "save_file": result = await client.saveFile(args?.path as string, args?.content as string); break;
      case "delete_file": result = await client.deleteFile(args?.path as string, args?.forceDelete as boolean); break;
      case "create_dir": result = await client.createDir(args?.path as string); break;
      case "create_file": result = await client.createFile(args?.path as string); break;
      // Files - Compression
      case "compress_files": result = await client.compressFiles(args); break;
      case "decompress_file": result = await client.decompressFile(args); break;
      // Files - Move/Rename
      case "move_file": result = await client.moveFile(args); break;
      case "rename_file": result = await client.renameFile(args); break;
      // Files - Permissions
      case "chmod_file": result = await client.chmodFile(args); break;
      case "chown_file": result = await client.chownFile(args); break;
      // Files - Info
      case "check_file": result = await client.checkFile(args?.path as string); break;
      case "get_file_size": result = await client.getFileSize(args?.path as string); break;
      case "get_file_tree": result = await client.getFileTree(args?.path as string); break;
      // Files - Transfer
      case "download_file": result = await client.downloadFile(args?.path as string); break;
      case "wget_file": result = await client.wgetFile(args?.url as string, args?.path as string, args?.ignoreCertificate as boolean); break;
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
      // Process
      case "list_processes": result = await client.listProcesses(); break;
      case "kill_process": result = await client.killProcess(args?.pid as number); break;
      // SSH
      case "get_ssh_config": result = await client.getSSHConfig(); break;
      case "update_ssh_config": result = await client.updateSSHConfig(args?.config); break;
      // Terminal
      case "exec_command": result = await client.execCommand(args?.command as string, args?.cwd as string); break;
      // Backup
      case "list_backups": result = await client.listBackups(); break;
      case "create_backup": result = await client.createBackup(args?.backup); break;
      case "restore_backup": result = await client.restoreBackup(args?.id as number); break;
      case "delete_backup": result = await client.deleteBackup(args?.id as number); break;
      // Settings
      case "get_settings": result = await client.getSettings(); break;
      case "update_settings": result = await client.updateSettings(args?.settings); break;
      // Logs
      case "list_operation_logs": result = await client.listOperationLogs(); break;
      case "list_system_logs": result = await client.listSystemLogs(); break;
      // Runtime
      case "list_environments": result = await client.listEnvironments(args?.type as string); break;
      case "install_environment": result = await client.installEnvironment(args?.type as string, args?.config); break;
      case "uninstall_environment": result = await client.uninstallEnvironment(args?.type as string, args?.id as number); break;
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
