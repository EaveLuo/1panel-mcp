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
    { name: "get_website", description: "Get website details", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "update_website", description: "Update website", inputSchema: { type: "object", properties: { site: { type: "object" } }, required: ["site"] } },
    { name: "delete_website", description: "Delete website", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    // Website Domains
    { name: "list_website_domains", description: "List website domains", inputSchema: { type: "object", properties: { websiteId: { type: "number" } }, required: ["websiteId"] } },
    { name: "create_website_domain", description: "Add domain to website", inputSchema: { type: "object", properties: { websiteId: { type: "number" }, domain: { type: "string" }, port: { type: "number" } }, required: ["websiteId", "domain"] } },
    { name: "delete_website_domain", description: "Remove domain from website", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "update_website_domain", description: "Update website domain", inputSchema: { type: "object", properties: { id: { type: "number" }, websiteId: { type: "number" }, domain: { type: "string" }, port: { type: "number" } }, required: ["id", "websiteId"] } },
    // SSL Certificates
    { name: "list_certificates", description: "List SSL certificates", inputSchema: { type: "object", properties: {} } },
    { name: "get_certificate", description: "Get SSL certificate details", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "create_certificate", description: "Create SSL certificate", inputSchema: { type: "object", properties: { cert: { type: "object" } }, required: ["cert"] } },
    { name: "delete_certificate", description: "Delete SSL certificate", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "obtain_ssl", description: "Obtain SSL certificate (Let\'s Encrypt)", inputSchema: { type: "object", properties: { ID: { type: "number" }, domains: { type: "array", items: { type: "string" } }, keyType: { type: "string" }, time: { type: "number" }, unit: { type: "string" }, autoRenew: { type: "boolean" } }, required: ["ID", "domains", "keyType"] } },
    { name: "renew_ssl", description: "Renew SSL certificate", inputSchema: { type: "object", properties: { ID: { type: "number" } }, required: ["ID"] } },
    { name: "resolve_ssl", description: "Resolve SSL certificate", inputSchema: { type: "object", properties: { websiteSSLId: { type: "number" } }, required: ["websiteSSLId"] } },
    { name: "upload_ssl", description: "Upload SSL certificate", inputSchema: { type: "object", properties: { cert: { type: "object" } }, required: ["cert"] } },
    { name: "get_website_ssl", description: "Get website SSL certificate", inputSchema: { type: "object", properties: { websiteId: { type: "number" } }, required: ["websiteId"] } },
    // HTTPS
    { name: "get_https", description: "Get HTTPS configuration", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "update_https", description: "Update HTTPS configuration", inputSchema: { type: "object", properties: { websiteId: { type: "number" }, type: { type: "string", enum: ["existed", "auto", "manual"] }, enable: { type: "boolean" }, httpConfig: { type: "string", enum: ["HTTPSOnly", "HTTPAlso", "HTTPToHTTPS"] }, privateKey: { type: "string" }, certificate: { type: "string" }, algorithm: { type: "string" }, hsts: { type: "boolean" }, hstsIncludeSubDomains: { type: "boolean" }, http3: { type: "boolean" }, httpsPorts: { type: "array", items: { type: "number" } } }, required: ["websiteId", "type", "enable"] } },
    { name: "apply_ssl", description: "Apply SSL to website", inputSchema: { type: "object", properties: { websiteId: { type: "number" }, websiteSSLId: { type: "number" }, type: { type: "string", enum: ["existed", "auto", "manual"] }, enable: { type: "boolean" }, httpConfig: { type: "string" }, privateKey: { type: "string" }, certificate: { type: "string" } }, required: ["websiteId", "type", "enable"] } },
    // Nginx
    { name: "get_nginx_conf", description: "Get Nginx configuration", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "update_nginx_conf", description: "Update Nginx configuration", inputSchema: { type: "object", properties: { id: { type: "number" }, content: { type: "string" } }, required: ["id", "content"] } },
    // Databases - Basic
    { name: "list_databases", description: "List databases", inputSchema: { type: "object", properties: { type: { type: "string", enum: ["mysql", "postgresql", "redis"] } }, required: ["type"] } },
    { name: "create_database", description: "Create database", inputSchema: { type: "object", properties: { type: { type: "string" }, db: { type: "object" } }, required: ["type", "db"] } },
    { name: "delete_database", description: "Delete database", inputSchema: { type: "object", properties: { type: { type: "string" }, id: { type: "number" } }, required: ["type", "id"] } },
    { name: "get_database", description: "Get database details", inputSchema: { type: "object", properties: { type: { type: "string" }, id: { type: "number" } }, required: ["type", "id"] } },
    // Databases - MySQL
    { name: "mysql_bind_user", description: "MySQL: Bind/create user", inputSchema: { type: "object", properties: { database: { type: "string" }, db: { type: "string" }, username: { type: "string" }, password: { type: "string" }, permission: { type: "string" } }, required: ["database", "db", "username", "password", "permission"] } },
    { name: "mysql_change_password", description: "MySQL: Change user password", inputSchema: { type: "object", properties: { id: { type: "number" }, database: { type: "string" }, from: { type: "string" }, type: { type: "string" }, value: { type: "string" } }, required: ["id", "database", "from", "type", "value"] } },
    { name: "mysql_change_access", description: "MySQL: Change remote access", inputSchema: { type: "object", properties: { id: { type: "number" }, database: { type: "string" }, from: { type: "string" }, type: { type: "string" }, value: { type: "string" } }, required: ["id", "database", "from", "type", "value"] } },
    { name: "mysql_get_info", description: "MySQL: Get server info", inputSchema: { type: "object", properties: { from: { type: "string" } } } },
    { name: "mysql_get_remote_access", description: "MySQL: Get remote access config", inputSchema: { type: "object", properties: {} } },
    { name: "mysql_update_remote_access", description: "MySQL: Update remote access", inputSchema: { type: "object", properties: { privilege: { type: "boolean" } }, required: ["privilege"] } },
    { name: "mysql_get_status", description: "MySQL: Get server status", inputSchema: { type: "object", properties: {} } },
    { name: "mysql_get_variables", description: "MySQL: Get variables", inputSchema: { type: "object", properties: {} } },
    { name: "mysql_update_variables", description: "MySQL: Update variables", inputSchema: { type: "object", properties: { variables: { type: "object" } }, required: ["variables"] } },
    // Databases - PostgreSQL
    { name: "postgresql_bind_user", description: "PostgreSQL: Bind/create user", inputSchema: { type: "object", properties: { database: { type: "string" }, name: { type: "string" }, username: { type: "string" }, password: { type: "string" }, superUser: { type: "boolean" } }, required: ["database", "name", "username", "password"] } },
    { name: "postgresql_change_password", description: "PostgreSQL: Change password", inputSchema: { type: "object", properties: { id: { type: "number" }, database: { type: "string" }, from: { type: "string" }, type: { type: "string" }, value: { type: "string" } }, required: ["id", "database", "from", "type", "value"] } },
    { name: "postgresql_change_privileges", description: "PostgreSQL: Change privileges", inputSchema: { type: "object", properties: { id: { type: "number" }, database: { type: "string" }, from: { type: "string" }, type: { type: "string" }, value: { type: "string" } }, required: ["id", "database", "from", "type", "value"] } },
    { name: "postgresql_list_databases", description: "PostgreSQL: List databases", inputSchema: { type: "object", properties: {} } },
    // Databases - Redis
    { name: "redis_get_conf", description: "Redis: Get configuration", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "redis_update_conf", description: "Redis: Update configuration", inputSchema: { type: "object", properties: { id: { type: "number" }, content: { type: "string" } }, required: ["id"] } },
    { name: "redis_change_password", description: "Redis: Change password", inputSchema: { type: "object", properties: { id: { type: "number" }, value: { type: "string" } }, required: ["id", "value"] } },
    { name: "redis_get_status", description: "Redis: Get status", inputSchema: { type: "object", properties: {} } },
    { name: "redis_get_persistence_conf", description: "Redis: Get persistence config", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },
    { name: "redis_update_persistence_conf", description: "Redis: Update persistence", inputSchema: { type: "object", properties: { id: { type: "number" }, appendonly: { type: "string" }, appendfsync: { type: "string" }, save: { type: "string" } }, required: ["id"] } },
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
    // Backup Account
    { name: "list_backup_accounts", description: "List backup accounts", inputSchema: { type: "object", properties: {} } },
    { name: "get_backup_account_options", description: "Get backup account options", inputSchema: { type: "object", properties: {} } },
    { name: "get_backup_account_client_info", description: "Get backup account client info", inputSchema: { type: "object", properties: { clientType: { type: "string" } }, required: ["clientType"] } },
    { name: "create_backup_account", description: "Create backup account", inputSchema: { type: "object", properties: { type: { type: "string" }, name: { type: "string" }, vars: { type: "object" }, isDefault: { type: "boolean" } }, required: ["type", "name", "vars"] } },
    { name: "update_backup_account", description: "Update backup account", inputSchema: { type: "object", properties: { type: { type: "string" }, name: { type: "string" }, vars: { type: "object" }, isDefault: { type: "boolean" } }, required: ["type", "name", "vars"] } },
    { name: "delete_backup_account", description: "Delete backup account", inputSchema: { type: "object", properties: { type: { type: "string" }, name: { type: "string" } }, required: ["type"] } },
    { name: "check_backup_account", description: "Check backup account", inputSchema: { type: "object", properties: { type: { type: "string" }, vars: { type: "object" } }, required: ["type", "vars"] } },
    { name: "list_backup_account_files", description: "List files in backup account", inputSchema: { type: "object", properties: { backupAccountID: { type: "number" }, path: { type: "string" } }, required: ["backupAccountID"] } },
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
    // Fail2ban
    { name: "get_fail2ban_base_info", description: "Get Fail2ban base info", inputSchema: { type: "object", properties: {} } },
    { name: "get_fail2ban_conf", description: "Get Fail2ban configuration", inputSchema: { type: "object", properties: {} } },
    { name: "operate_fail2ban", description: "Operate Fail2ban (start/stop/restart)", inputSchema: { type: "object", properties: { operation: { type: "string", enum: ["start", "stop", "restart"] } }, required: ["operation"] } },
    { name: "operate_fail2ban_ssh", description: "Operate Fail2ban SSH (start/stop/restart)", inputSchema: { type: "object", properties: { operation: { type: "string", enum: ["start", "stop", "restart"] } }, required: ["operation"] } },
    { name: "search_fail2ban_banned_ips", description: "Search banned IPs in Fail2ban", inputSchema: { type: "object", properties: { page: { type: "number" }, pageSize: { type: "number" } } } },
    { name: "update_fail2ban_conf", description: "Update Fail2ban configuration", inputSchema: { type: "object", properties: { key: { type: "string" }, value: { type: "string" } }, required: ["key", "value"] } },
    { name: "update_fail2ban_conf_by_file", description: "Update Fail2ban configuration by file content", inputSchema: { type: "object", properties: { content: { type: "string" } }, required: ["content"] } },
    // Disk
    { name: "list_disks", description: "List disks", inputSchema: { type: "object", properties: {} } },
    { name: "get_disk_full_info", description: "Get full disk information", inputSchema: { type: "object", properties: {} } },
    { name: "mount_disk", description: "Mount disk", inputSchema: { type: "object", properties: { path: { type: "string" }, mountPoint: { type: "string" }, fsType: { type: "string" }, options: { type: "string" } }, required: ["path", "mountPoint"] } },
    { name: "partition_disk", description: "Partition disk", inputSchema: { type: "object", properties: { path: { type: "string" }, type: { type: "string" } }, required: ["path"] } },
    { name: "unmount_disk", description: "Unmount disk", inputSchema: { type: "object", properties: { mountPoint: { type: "string" } }, required: ["mountPoint"] } },
    // Dashboard
    { name: "get_dashboard_base_info", description: "Get dashboard base info", inputSchema: { type: "object", properties: {} } },
    { name: "get_dashboard_current_info", description: "Get dashboard current info", inputSchema: { type: "object", properties: {} } },
    { name: "get_dashboard_memo", description: "Get dashboard memo", inputSchema: { type: "object", properties: {} } },
    { name: "update_dashboard_memo", description: "Update dashboard memo", inputSchema: { type: "object", properties: { content: { type: "string" } }, required: ["content"] } },
    // Monitor
    { name: "get_monitor_data", description: "Get monitor data", inputSchema: { type: "object", properties: { startTime: { type: "string" }, endTime: { type: "string" } } } },
    { name: "get_monitor_setting", description: "Get monitor setting", inputSchema: { type: "object", properties: {} } },
    { name: "update_monitor_setting", description: "Update monitor setting", inputSchema: { type: "object", properties: { setting: { type: "object" } }, required: ["setting"] } },
    { name: "clean_monitor_data", description: "Clean monitor data", inputSchema: { type: "object", properties: {} } },
    // Device
    { name: "get_device_base_info", description: "Get device base info", inputSchema: { type: "object", properties: {} } },
    { name: "check_device_dns", description: "Check device DNS", inputSchema: { type: "object", properties: {} } },
    { name: "update_device", description: "Update device configuration", inputSchema: { type: "object", properties: { conf: { type: "object" } }, required: ["conf"] } },
    { name: "update_device_by_file", description: "Update device configuration by file", inputSchema: { type: "object", properties: { content: { type: "string" } }, required: ["content"] } },
    { name: "update_device_hosts", description: "Update device hosts", inputSchema: { type: "object", properties: { hosts: { type: "string" } }, required: ["hosts"] } },
    { name: "update_device_password", description: "Update device password", inputSchema: { type: "object", properties: { oldPass: { type: "string" }, newPass: { type: "string" } }, required: ["oldPass", "newPass"] } },
    { name: "update_device_swap", description: "Update device swap", inputSchema: { type: "object", properties: { swap: { type: "object" } }, required: ["swap"] } },
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
            // Files - Basic
            case "list_files":
                result = await client.listFiles(args?.path, args?.page, args?.pageSize);
                break;
            case "search_files":
                result = await client.searchFiles(args);
                break;
            case "get_file_content":
                result = await client.getFileContent(args?.path);
                break;
            case "save_file":
                result = await client.saveFile(args?.path, args?.content);
                break;
            case "delete_file":
                result = await client.deleteFile(args?.path, args?.forceDelete);
                break;
            case "create_dir":
                result = await client.createDir(args?.path);
                break;
            case "create_file":
                result = await client.createFile(args?.path);
                break;
            // Files - Compression
            case "compress_files":
                result = await client.compressFiles(args);
                break;
            case "decompress_file":
                result = await client.decompressFile(args);
                break;
            // Files - Move/Rename
            case "move_file":
                result = await client.moveFile(args);
                break;
            case "rename_file":
                result = await client.renameFile(args);
                break;
            // Files - Permissions
            case "chmod_file":
                result = await client.chmodFile(args);
                break;
            case "chown_file":
                result = await client.chownFile(args);
                break;
            // Files - Info
            case "check_file":
                result = await client.checkFile(args?.path);
                break;
            case "get_file_size":
                result = await client.getFileSize(args?.path);
                break;
            case "get_file_tree":
                result = await client.getFileTree(args?.path);
                break;
            // Files - Transfer
            case "download_file":
                result = await client.downloadFile(args?.path);
                break;
            case "wget_file":
                result = await client.wgetFile(args?.url, args?.path, args?.ignoreCertificate);
                break;
            // Websites
            case "list_websites":
                result = await client.listWebsites();
                break;
            case "create_website":
                result = await client.createWebsite(args?.site);
                break;
            case "get_website":
                result = await client.getWebsite(args?.id);
                break;
            case "update_website":
                result = await client.updateWebsite(args?.site);
                break;
            case "delete_website":
                result = await client.deleteWebsite(args?.id);
                break;
            // Website Domains
            case "list_website_domains":
                result = await client.listWebsiteDomains(args?.websiteId);
                break;
            case "create_website_domain":
                result = await client.createWebsiteDomain(args);
                break;
            case "delete_website_domain":
                result = await client.deleteWebsiteDomain(args);
                break;
            case "update_website_domain":
                result = await client.updateWebsiteDomain(args);
                break;
            // SSL Certificates
            case "list_certificates":
                result = await client.listCertificates();
                break;
            case "get_certificate":
                result = await client.getCertificate(args?.id);
                break;
            case "create_certificate":
                result = await client.createCertificate(args?.cert);
                break;
            case "delete_certificate":
                result = await client.deleteCertificate(args?.id);
                break;
            case "obtain_ssl":
                result = await client.obtainSSL(args);
                break;
            case "renew_ssl":
                result = await client.renewSSL(args);
                break;
            case "resolve_ssl":
                result = await client.resolveSSL(args);
                break;
            case "upload_ssl":
                result = await client.uploadSSL(args);
                break;
            case "get_website_ssl":
                result = await client.getWebsiteSSL(args?.websiteId);
                break;
            // HTTPS
            case "get_https":
                result = await client.getHTTPS(args?.id);
                break;
            case "update_https":
                result = await client.updateHTTPS(args);
                break;
            case "apply_ssl":
                result = await client.applySSL(args);
                break;
            // Nginx
            case "get_nginx_conf":
                result = await client.getNginxConf(args?.id);
                break;
            case "update_nginx_conf":
                result = await client.updateNginxConf(args);
                break;
            // Databases - Basic
            case "list_databases":
                result = await client.listDatabases(args?.type);
                break;
            case "create_database":
                result = await client.createDatabase(args?.type, args?.db);
                break;
            case "delete_database":
                result = await client.deleteDatabase(args?.type, args?.id);
                break;
            case "get_database":
                result = await client.getDatabase(args?.type, args?.id);
                break;
            // Databases - MySQL
            case "mysql_bind_user":
                result = await client.mysqlBindUser(args);
                break;
            case "mysql_change_password":
                result = await client.mysqlChangePassword(args);
                break;
            case "mysql_change_access":
                result = await client.mysqlChangeAccess(args);
                break;
            case "mysql_get_info":
                result = await client.mysqlGetInfo(args?.from);
                break;
            case "mysql_get_remote_access":
                result = await client.mysqlGetRemoteAccess();
                break;
            case "mysql_update_remote_access":
                result = await client.mysqlUpdateRemoteAccess(args?.privilege);
                break;
            case "mysql_get_status":
                result = await client.mysqlGetStatus();
                break;
            case "mysql_get_variables":
                result = await client.mysqlGetVariables();
                break;
            case "mysql_update_variables":
                result = await client.mysqlUpdateVariables(args?.variables);
                break;
            // Databases - PostgreSQL
            case "postgresql_bind_user":
                result = await client.postgresqlBindUser(args);
                break;
            case "postgresql_change_password":
                result = await client.postgresqlChangePassword(args);
                break;
            case "postgresql_change_privileges":
                result = await client.postgresqlChangePrivileges(args);
                break;
            case "postgresql_list_databases":
                result = await client.postgresqlListDatabases();
                break;
            // Databases - Redis
            case "redis_get_conf":
                result = await client.redisGetConf(args?.id);
                break;
            case "redis_update_conf":
                result = await client.redisUpdateConf(args);
                break;
            case "redis_change_password":
                result = await client.redisChangePassword(args);
                break;
            case "redis_get_status":
                result = await client.redisGetStatus();
                break;
            case "redis_get_persistence_conf":
                result = await client.redisGetPersistenceConf(args?.id);
                break;
            case "redis_update_persistence_conf":
                result = await client.redisUpdatePersistenceConf(args?.id, args);
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
            // Backup Account
            case "list_backup_accounts":
                result = await client.listBackupAccounts();
                break;
            case "get_backup_account_options":
                result = await client.getBackupAccountOptions();
                break;
            case "get_backup_account_client_info":
                result = await client.getBackupAccountClientInfo(args?.clientType);
                break;
            case "create_backup_account":
                result = await client.createBackupAccount(args);
                break;
            case "update_backup_account":
                result = await client.updateBackupAccount(args);
                break;
            case "delete_backup_account":
                result = await client.deleteBackupAccount(args);
                break;
            case "check_backup_account":
                result = await client.checkBackupAccount(args);
                break;
            case "list_backup_account_files":
                result = await client.listBackupAccountFiles(args?.backupAccountID, args?.path);
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
            // Fail2ban
            case "get_fail2ban_base_info":
                result = await client.getFail2BanBaseInfo();
                break;
            case "get_fail2ban_conf":
                result = await client.getFail2BanConf();
                break;
            case "operate_fail2ban":
                result = await client.operateFail2Ban(args);
                break;
            case "operate_fail2ban_ssh":
                result = await client.operateFail2BanSSH(args);
                break;
            case "search_fail2ban_banned_ips":
                result = await client.searchFail2BanBannedIPs(args);
                break;
            case "update_fail2ban_conf":
                result = await client.updateFail2BanConf(args);
                break;
            case "update_fail2ban_conf_by_file":
                result = await client.updateFail2BanConfByFile(args?.content);
                break;
            // Disk
            case "list_disks":
                result = await client.listDisks();
                break;
            case "get_disk_full_info":
                result = await client.getDiskFullInfo();
                break;
            case "mount_disk":
                result = await client.mountDisk(args);
                break;
            case "partition_disk":
                result = await client.partitionDisk(args);
                break;
            case "unmount_disk":
                result = await client.unmountDisk(args?.mountPoint);
                break;
            // Dashboard
            case "get_dashboard_base_info":
                result = await client.getDashboardBaseInfo();
                break;
            case "get_dashboard_current_info":
                result = await client.getDashboardCurrentInfo();
                break;
            case "get_dashboard_memo":
                result = await client.getDashboardMemo();
                break;
            case "update_dashboard_memo":
                result = await client.updateDashboardMemo(args?.content);
                break;
            // Monitor
            case "get_monitor_data":
                result = await client.getMonitorData(args);
                break;
            case "get_monitor_setting":
                result = await client.getMonitorSetting();
                break;
            case "update_monitor_setting":
                result = await client.updateMonitorSetting(args?.setting);
                break;
            case "clean_monitor_data":
                result = await client.cleanMonitorData();
                break;
            // Device
            case "get_device_base_info":
                result = await client.getDeviceBaseInfo();
                break;
            case "check_device_dns":
                result = await client.checkDeviceDNS();
                break;
            case "update_device":
                result = await client.updateDevice(args?.conf);
                break;
            case "update_device_by_file":
                result = await client.updateDeviceByFile(args?.content);
                break;
            case "update_device_hosts":
                result = await client.updateDeviceHosts(args?.hosts);
                break;
            case "update_device_password":
                result = await client.updateDevicePassword(args?.oldPass, args?.newPass);
                break;
            case "update_device_swap":
                result = await client.updateDeviceSwap(args?.swap);
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