#!/usr/bin/env node
import { Command } from "commander";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
  .name("1panel-mcp")
  .description("MCP server for 1Panel - Manage your 1Panel through AI agents")
  .version("1.0.0");

program
  .command("start")
  .description("Start the 1Panel MCP server")
  .option("-h, --host <host>", "1Panel host", process.env.ONEPANEL_HOST || "localhost")
  .option("-p, --port <port>", "1Panel port", process.env.ONEPANEL_PORT || "8080")
  .option("-k, --key <key>", "1Panel API key", process.env.ONEPANEL_API_KEY)
  .option("-s, --secure", "Use HTTPS", process.env.ONEPANEL_PROTOCOL === "https")
  .action((options) => {
    // Set environment variables
    process.env.ONEPANEL_HOST = options.host;
    process.env.ONEPANEL_PORT = options.port;
    if (options.key) process.env.ONEPANEL_API_KEY = options.key;
    process.env.ONEPANEL_PROTOCOL = options.secure ? "https" : "http";

    if (!process.env.ONEPANEL_API_KEY) {
      console.error("Error: ONEPANEL_API_KEY is required");
      console.error("Use --key option or set ONEPANEL_API_KEY environment variable");
      process.exit(1);
    }

    // Start the MCP server
    const serverPath = join(__dirname, "index.js");
    const child = spawn("node", [serverPath], {
      stdio: "inherit",
      env: process.env,
    });

    child.on("exit", (code) => {
      process.exit(code || 0);
    });
  });

program
  .command("config")
  .description("Show configuration guide")
  .action(() => {
    console.log(`
1Panel MCP Configuration
========================

Environment Variables:
  ONEPANEL_HOST     - 1Panel host (default: localhost)
  ONEPANEL_PORT     - 1Panel port (default: 8080)
  ONEPANEL_API_KEY  - 1Panel API key (required)
  ONEPANEL_PROTOCOL - http or https (default: http)

Usage Examples:
  # Using environment variables
  export ONEPANEL_API_KEY=your-api-key
  1panel-mcp start

  # Using command line options
  1panel-mcp start --host 192.168.1.100 --port 8080 --key your-api-key

  # Using HTTPS
  1panel-mcp start --host panel.example.com --secure --key your-api-key

Get API Key:
  1. Login to 1Panel web interface
  2. Go to Profile → API
  3. Generate or copy your API key
`);
  });

program
  .command("tools")
  .description("List available tools")
  .action(() => {
    console.log(`
Available Tools (264 total)
===========================

Core:
  - Container management (22 tools)
  - Image management (10 tools)
  - Network & Volume (6 tools)
  - Docker Compose (9 tools)

Applications:
  - App store & management (5 tools)
  - Runtime environments (3 tools)
  - PHP extensions (9 tools)
  - Node modules (3 tools)

Files & Backup:
  - File management (20 tools)
  - Backup & restore (12 tools)
  - Recycle bin (4 tools)
  - System snapshots (8 tools)

Database:
  - MySQL, PostgreSQL, Redis (19 tools)

Website:
  - Website management (16 tools)
  - SSL certificates (9 tools)
  - Nginx config (2 tools)
  - AntiLeech (2 tools)

System:
  - System info & monitor (14 tools)
  - Process management (2 tools)
  - Cronjobs (3 tools)
  - Firewall (3 tools)
  - Fail2ban (7 tools)
  - Disk management (5 tools)
  - Device management (7 tools)

Security:
  - SSH management (2 tools)
  - Terminal (1 tool)
  - ClamAV antivirus (11 tools)

AI & Advanced:
  - AI Agent management (20 tools)
  - MCP Server (9 tools)
  - Ollama models (7 tools)
  - GPU monitoring (2 tools)
  - OpenResty (8 tools)

Host Management:
  - Remote hosts (20 tools)
  - SSH keys (5 tools)
`);
  });

program.parse();
