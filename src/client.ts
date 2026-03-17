import { createHash } from "crypto";

export interface Config {
  host: string;
  port: number;
  apiKey: string;
  protocol?: string;
}

export class OnePanelClient {
  private config: Config;

  constructor(config: Config) {
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

  // Containers
  async listContainers(): Promise<any> { return this.request("/api/v2/containers/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100, state: "all", orderBy: "name", order: "ascending" }) }); }
  async startContainer(id: string): Promise<any> { return this.request("/api/v2/containers/operate", { method: "POST", body: JSON.stringify({ id, operation: "start" }) }); }
  async stopContainer(id: string): Promise<any> { return this.request("/api/v2/containers/operate", { method: "POST", body: JSON.stringify({ id, operation: "stop" }) }); }
  async restartContainer(id: string): Promise<any> { return this.request("/api/v2/containers/operate", { method: "POST", body: JSON.stringify({ id, operation: "restart" }) }); }
  async removeContainer(id: string): Promise<any> { return this.request("/api/v2/containers/del", { method: "POST", body: JSON.stringify({ id }) }); }
  async getContainerLogs(id: string, tail = 100): Promise<any> { return this.request(`/api/v2/containers/${id}/logs?tail=${tail}`); }

  // Images
  async listImages(): Promise<any> { return this.request("/api/v2/containers/image/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100, orderBy: "name", order: "ascending" }) }); }
  async pullImage(name: string): Promise<any> { return this.request("/api/v2/containers/image/pull", { method: "POST", body: JSON.stringify({ name }) }); }
  async removeImage(id: string): Promise<any> { return this.request("/api/v2/containers/image/del", { method: "POST", body: JSON.stringify({ id }) }); }

  // Networks
  async listNetworks(): Promise<any> { return this.request("/api/v2/containers/network/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async createNetwork(name: string, driver = "bridge"): Promise<any> { return this.request("/api/v2/containers/network", { method: "POST", body: JSON.stringify({ name, driver }) }); }
  async removeNetwork(id: string): Promise<any> { return this.request("/api/v2/containers/network/del", { method: "POST", body: JSON.stringify({ id }) }); }

  // Volumes
  async listVolumes(): Promise<any> { return this.request("/api/v2/containers/volume/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async createVolume(name: string): Promise<any> { return this.request("/api/v2/containers/volume", { method: "POST", body: JSON.stringify({ name }) }); }
  async removeVolume(id: string): Promise<any> { return this.request("/api/v2/containers/volume/del", { method: "POST", body: JSON.stringify({ id }) }); }

  // Compose
  async listComposes(): Promise<any> { return this.request("/api/v2/containers/compose/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async createCompose(name: string, content: string, path?: string): Promise<any> { return this.request("/api/v2/containers/compose", { method: "POST", body: JSON.stringify({ name, content, path }) }); }
  async removeCompose(id: number): Promise<any> { return this.request("/api/v2/containers/compose/del", { method: "POST", body: JSON.stringify({ id }) }); }
  async startCompose(id: number): Promise<any> { return this.request("/api/v2/containers/compose/operate", { method: "POST", body: JSON.stringify({ id, operation: "start" }) }); }
  async stopCompose(id: number): Promise<any> { return this.request("/api/v2/containers/compose/operate", { method: "POST", body: JSON.stringify({ id, operation: "stop" }) }); }
  async restartCompose(id: number): Promise<any> { return this.request("/api/v2/containers/compose/operate", { method: "POST", body: JSON.stringify({ id, operation: "restart" }) }); }

  // Apps
  async listInstalledApps(): Promise<any> { return this.request("/api/v2/apps/installed/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async listAppStore(): Promise<any> { return this.request("/api/v2/apps/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async installApp(app: any): Promise<any> { return this.request("/api/v2/apps/installed", { method: "POST", body: JSON.stringify(app) }); }
  async uninstallApp(id: number): Promise<any> { return this.request("/api/v2/apps/installed/del", { method: "POST", body: JSON.stringify({ id }) }); }
  async updateApp(id: number): Promise<any> { return this.request("/api/v2/apps/installed/upgrade", { method: "POST", body: JSON.stringify({ id }) }); }

  // Files
  async listFiles(path: string): Promise<any> { return this.request("/api/v2/files/search", { method: "POST", body: JSON.stringify({ path, page: 1, pageSize: 100 }) }); }
  async getFileContent(path: string): Promise<any> { return this.request("/api/v2/files/content", { method: "POST", body: JSON.stringify({ path }) }); }
  async saveFile(path: string, content: string): Promise<any> { return this.request("/api/v2/files", { method: "POST", body: JSON.stringify({ path, content }) }); }
  async deleteFile(path: string): Promise<any> { return this.request("/api/v2/files/del", { method: "POST", body: JSON.stringify({ path }) }); }
  async createDir(path: string): Promise<any> { return this.request("/api/v2/files/dir", { method: "POST", body: JSON.stringify({ path }) }); }

  // Websites
  async listWebsites(): Promise<any> { return this.request("/api/v2/websites/list"); }
  async createWebsite(site: any): Promise<any> { return this.request("/api/v2/websites", { method: "POST", body: JSON.stringify(site) }); }
  async deleteWebsite(id: number): Promise<any> { return this.request("/api/v2/websites/del", { method: "POST", body: JSON.stringify({ id }) }); }

  // Certificates
  async listCertificates(): Promise<any> { return this.request("/api/v2/websites/ssl/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async createCertificate(cert: any): Promise<any> { return this.request("/api/v2/websites/ssl", { method: "POST", body: JSON.stringify(cert) }); }
  async deleteCertificate(id: number): Promise<any> { return this.request("/api/v2/websites/ssl/del", { method: "POST", body: JSON.stringify({ id }) }); }

  // Databases
  async listDatabases(type: string): Promise<any> { return this.request(`/api/v2/databases/${type}/search`, { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async createDatabase(type: string, db: any): Promise<any> { return this.request(`/api/v2/databases/${type}`, { method: "POST", body: JSON.stringify(db) }); }
  async deleteDatabase(type: string, id: number): Promise<any> { return this.request(`/api/v2/databases/${type}/del`, { method: "POST", body: JSON.stringify({ id }) }); }

  // System
  async getSystemInfo(): Promise<any> { return this.request("/api/v2/toolbox/device/base"); }
  async getSystemMonitor(): Promise<any> { return this.request("/api/v2/toolbox/device/monitor"); }

  // Cronjobs
  async listCronjobs(): Promise<any> { return this.request("/api/v2/cronjobs/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async createCronjob(job: any): Promise<any> { return this.request("/api/v2/cronjobs", { method: "POST", body: JSON.stringify(job) }); }
  async deleteCronjob(id: number): Promise<any> { return this.request("/api/v2/cronjobs/del", { method: "POST", body: JSON.stringify({ id }) }); }

  // Firewall
  async listFirewallRules(): Promise<any> { return this.request("/api/v2/toolbox/firewall/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async createFirewallRule(rule: any): Promise<any> { return this.request("/api/v2/toolbox/firewall", { method: "POST", body: JSON.stringify(rule) }); }
  async deleteFirewallRule(id: number): Promise<any> { return this.request("/api/v2/toolbox/firewall/del", { method: "POST", body: JSON.stringify({ id }) }); }

  // Process Management
  async listProcesses(): Promise<any> { return this.request("/api/v2/toolbox/process/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async killProcess(pid: number): Promise<any> { return this.request("/api/v2/toolbox/process/kill", { method: "POST", body: JSON.stringify({ pid }) }); }

  // SSH Management
  async getSSHConfig(): Promise<any> { return this.request("/api/v2/toolbox/ssh", { method: "POST", body: JSON.stringify({}) }); }
  async updateSSHConfig(config: any): Promise<any> { return this.request("/api/v2/toolbox/ssh", { method: "POST", body: JSON.stringify(config) }); }

  // Terminal
  async execCommand(command: string, cwd?: string): Promise<any> { return this.request("/api/v2/terminal/exec", { method: "POST", body: JSON.stringify({ command, cwd }) }); }

  // Backup & Restore
  async listBackups(): Promise<any> { return this.request("/api/v2/settings/backup/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async createBackup(backup: any): Promise<any> { return this.request("/api/v2/settings/backup", { method: "POST", body: JSON.stringify(backup) }); }
  async restoreBackup(id: number): Promise<any> { return this.request("/api/v2/settings/backup/restore", { method: "POST", body: JSON.stringify({ id }) }); }
  async deleteBackup(id: number): Promise<any> { return this.request("/api/v2/settings/backup/del", { method: "POST", body: JSON.stringify({ id }) }); }

  // Settings
  async getSettings(): Promise<any> { return this.request("/api/v2/settings", { method: "POST", body: JSON.stringify({}) }); }
  async updateSettings(settings: any): Promise<any> { return this.request("/api/v2/settings", { method: "POST", body: JSON.stringify(settings) }); }

  // Logs
  async listOperationLogs(): Promise<any> { return this.request("/api/v2/logs/operation/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async listSystemLogs(): Promise<any> { return this.request("/api/v2/logs/system/search", { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }

  // Runtime Environments
  async listEnvironments(type: string): Promise<any> { return this.request(`/api/v2/runtimes/${type}/search`, { method: "POST", body: JSON.stringify({ page: 1, pageSize: 100 }) }); }
  async installEnvironment(type: string, config: any): Promise<any> { return this.request(`/api/v2/runtimes/${type}`, { method: "POST", body: JSON.stringify(config) }); }
  async uninstallEnvironment(type: string, id: number): Promise<any> { return this.request(`/api/v2/runtimes/${type}/del`, { method: "POST", body: JSON.stringify({ id }) }); }
}
