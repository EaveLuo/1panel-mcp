# 1Panel MCP

[![npm version](https://img.shields.io/npm/v/1panel-mcp.svg)](https://www.npmjs.com/package/1panel-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP (Model Context Protocol) server for 1Panel - Manage your 1Panel through AI agents like Claude, Cursor, or any MCP-compatible client.

## Features

- **264 Tools** covering 1Panel's complete API
- **100% Open Source** version coverage
- **~90% Professional (XPack)** version coverage
- Modular architecture with TypeScript

### Supported Modules

**Core:** Containers, Images, Networks, Volumes, Docker Compose
**Applications:** App Store, Runtime Environments, PHP, Node.js
**Files:** File Management, Backup, Recycle Bin, Snapshots
**Database:** MySQL, PostgreSQL, Redis
**Website:** Websites, SSL, Nginx, AntiLeech
**System:** Monitor, Processes, Cronjobs, Firewall, Fail2ban
**Security:** SSH, Terminal, ClamAV Antivirus
**AI & Advanced:** AI Agent, MCP Server, Ollama, GPU, OpenResty
**Host Management:** Remote Hosts, SSH Keys

## Installation

### Global Installation (Recommended)

```bash
npm install -g 1panel-mcp
```

### Local Installation

```bash
npm install 1panel-mcp
```

## Usage

### Quick Start

1. **Get your 1Panel API key:**
   - Login to 1Panel web interface
   - Go to Profile → API
   - Generate or copy your API key

2. **Start the MCP server:**

```bash
# Using environment variables
export ONEPANEL_API_KEY=your-api-key
export ONEPANEL_HOST=localhost
export ONEPANEL_PORT=8080
1panel-mcp start

# Using command line options
1panel-mcp start --host 192.168.1.100 --port 8080 --key your-api-key

# Using HTTPS
1panel-mcp start --host panel.example.com --secure --key your-api-key
```

### Commands

```bash
1panel-mcp --help              # Show help
1panel-mcp start --help        # Show start options
1panel-mcp config              # Show configuration guide
1panel-mcp tools               # List available tools
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ONEPANEL_HOST` | 1Panel host | `localhost` |
| `ONEPANEL_PORT` | 1Panel port | `8080` |
| `ONEPANEL_API_KEY` | 1Panel API key (required) | - |
| `ONEPANEL_PROTOCOL` | `http` or `https` | `http` |

## MCP Configuration

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "1panel": {
      "command": "1panel-mcp",
      "args": ["start"],
      "env": {
        "ONEPANEL_HOST": "localhost",
        "ONEPANEL_PORT": "8080",
        "ONEPANEL_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor

Add to Cursor MCP settings:

```json
{
  "mcpServers": {
    "1panel": {
      "command": "1panel-mcp",
      "args": ["start", "--host", "localhost", "--port", "8080", "--key", "your-api-key"]
    }
  }
}
```

## Development

```bash
# Clone the repository
git clone https://github.com/EaveLuo/1panel-mcp.git
cd 1panel-mcp

# Install dependencies
npm install

# Build
npm run build

# Development mode
npm run dev

# Start locally
npm start
```

## API Coverage

| Category | Tools | Coverage |
|----------|-------|----------|
| Open Source | 205 | 100% |
| XPack (Pro) | 59 | ~90% |
| **Total** | **264** | **~98%** |

## License

MIT

## Links

- [GitHub](https://github.com/EaveLuo/1panel-mcp)
- [npm](https://www.npmjs.com/package/1panel-mcp)
- [1Panel](https://1panel.cn/)
