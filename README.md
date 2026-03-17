# 1Panel MCP Server

A Model Context Protocol (MCP) server for managing 1Panel through AI agents.

## Features

This MCP server provides tools for:

- **Container Management**: List, start, stop, restart Docker containers
- **Image Management**: List and pull Docker images
- **Application Management**: List installed apps and browse app store
- **File Management**: List files in directories
- **System Monitoring**: Get system info and monitoring data (CPU, memory, disk)
- **Website Management**: List websites and SSL certificates
- **Database Management**: List MySQL, PostgreSQL, and Redis databases
- **Compose Management**: List Docker Compose projects

## Installation

```bash
npm install
npm run build
```

## Configuration

Set the following environment variables:

```bash
export ONEPANEL_HOST="your-1panel-host"      # default: localhost
export ONEPANEL_PORT="8080"                   # default: 8080
export ONEPANEL_API_KEY="your-api-key"        # required
export ONEPANEL_PROTOCOL="http"               # default: http
```

### Getting your 1Panel API Key

1. Log in to your 1Panel dashboard
2. Go to **面板设置** (Panel Settings)
3. Enable API access and generate an API key
4. Add your IP to the whitelist (use `0.0.0.0/0` for all IPs)

## Usage with Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "1panel": {
      "command": "node",
      "args": ["/path/to/1panel-mcp/dist/index.js"],
      "env": {
        "ONEPANEL_HOST": "your-1panel-host",
        "ONEPANEL_PORT": "8080",
        "ONEPANEL_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Usage with OpenClaw

Add to your OpenClaw configuration:

```json
{
  "mcpServers": {
    "1panel": {
      "command": "node",
      "args": ["/path/to/1panel-mcp/dist/index.js"],
      "env": {
        "ONEPANEL_HOST": "your-1panel-host",
        "ONEPANEL_PORT": "8080",
        "ONEPANEL_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `list_containers` | List all Docker containers |
| `start_container` | Start a container by ID |
| `stop_container` | Stop a container by ID |
| `restart_container` | Restart a container by ID |
| `list_images` | List all Docker images |
| `pull_image` | Pull a Docker image |
| `list_installed_apps` | List installed applications |
| `list_app_store` | List available apps in store |
| `list_files` | List files in a directory |
| `get_system_info` | Get system information |
| `get_system_monitor` | Get CPU/memory/disk usage |
| `list_websites` | List all websites |
| `list_databases` | List databases (mysql/postgresql/redis) |
| `list_composes` | List Docker Compose projects |
| `list_certificates` | List SSL certificates |

## API Reference

This MCP server uses the 1Panel API v2. For complete API documentation, visit:
`http://your-1panel-host:port/1panel/swagger/index.html`

## Authentication

1Panel uses a custom token authentication:

```
Token = md5('1panel' + API-Key + UnixTimestamp)
```

The server automatically generates tokens for each request.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode with watch
npm run dev
```

## License

MIT
