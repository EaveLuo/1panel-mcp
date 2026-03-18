import { OnePanelConfig } from "./types/config.js";
import {
  ContainerAPI,
  ImageAPI,
  NetworkAPI,
  VolumeAPI,
  ComposeAPI,
  AppAPI,
  WebsiteAPI,
  FileAPI,
  DatabaseAPI,
  SystemAPI,
  CronjobAPI,
  FirewallAPI,
  ProcessAPI,
  SSHAPI,
  TerminalAPI,
  BackupAPI,
  SettingsAPI,
  LogsAPI,
  RuntimeAPI,
} from "./api/index.js";

export class OnePanelClient {
  private config: OnePanelConfig;

  // API modules
  public containers: ContainerAPI;
  public images: ImageAPI;
  public networks: NetworkAPI;
  public volumes: VolumeAPI;
  public composes: ComposeAPI;
  public apps: AppAPI;
  public websites: WebsiteAPI;
  public files: FileAPI;
  public databases: DatabaseAPI;
  public system: SystemAPI;
  public cronjobs: CronjobAPI;
  public firewall: FirewallAPI;
  public process: ProcessAPI;
  public ssh: SSHAPI;
  public terminal: TerminalAPI;
  public backup: BackupAPI;
  public settings: SettingsAPI;
  public logs: LogsAPI;
  public runtime: RuntimeAPI;

  constructor(config: OnePanelConfig) {
    this.config = { protocol: "http", ...config };

    // Initialize API modules
    this.containers = new ContainerAPI(this.config);
    this.images = new ImageAPI(this.config);
    this.networks = new NetworkAPI(this.config);
    this.volumes = new VolumeAPI(this.config);
    this.composes = new ComposeAPI(this.config);
    this.apps = new AppAPI(this.config);
    this.websites = new WebsiteAPI(this.config);
    this.files = new FileAPI(this.config);
    this.databases = new DatabaseAPI(this.config);
    this.system = new SystemAPI(this.config);
    this.cronjobs = new CronjobAPI(this.config);
    this.firewall = new FirewallAPI(this.config);
    this.process = new ProcessAPI(this.config);
    this.ssh = new SSHAPI(this.config);
    this.terminal = new TerminalAPI(this.config);
    this.backup = new BackupAPI(this.config);
    this.settings = new SettingsAPI(this.config);
    this.logs = new LogsAPI(this.config);
    this.runtime = new RuntimeAPI(this.config);
  }

  // Backward compatibility - delegate to modules
  // Containers
  listContainers = () => this.containers.list();
  listContainersSimple = () => this.containers.listSimple();
  getContainer = (id: string) => this.containers.get(id);
  inspectContainer = (id: string) => this.containers.inspect(id);
  startContainer = (id: string) => this.containers.start(id);
  stopContainer = (id: string) => this.containers.stop(id);
  restartContainer = (id: string) => this.containers.restart(id);
  pauseContainer = (id: string) => this.containers.pause(id);
  unpauseContainer = (id: string) => this.containers.unpause(id);
  killContainer = (id: string) => this.containers.kill(id);
  removeContainer = (id: string) => this.containers.remove(id);
  createContainer = (config: any) => this.containers.create(config);
  updateContainer = (id: string, config: any) => this.containers.update(id, config);
  renameContainer = (id: string, name: string) => this.containers.rename(id, name);
  upgradeContainer = (id: string, image: string) => this.containers.upgrade(id, image);
  getContainerLogs = (id: string, tail?: number) => this.containers.getLogs(id, tail);
  getContainerStats = (id: string) => this.containers.getStats(id);
  getContainerStatus = () => this.containers.getStatus();
  pruneContainers = () => this.containers.prune();
  cleanContainerLog = (id: string) => this.containers.cleanLog(id);
  getContainerUsers = (name: string) => this.containers.getUsers(name);
  listContainersByImage = (image: string) => this.containers.listByImage(image);
  commitContainer = (id: string, repo: string, tag: string) => this.containers.commit(id, repo, tag);

  // Images
  listImages = () => this.images.list();
  listAllImages = () => this.images.listAll();
  searchImages = () => this.images.search();
  pullImage = (name: string) => this.images.pull(name);
  pushImage = (name: string) => this.images.push(name);
  removeImage = (id: string) => this.images.remove(id);
  buildImage = (dockerfile: string, name: string, path: string) => this.images.build(dockerfile, name, path);
  tagImage = (id: string, repo: string, tag: string) => this.images.tag(id, repo, tag);
  saveImage = (names: string[]) => this.images.save(names);
  loadImage = (path: string) => this.images.load(path);

  // Networks
  listNetworks = () => this.networks.list();
  createNetwork = (name: string, driver?: string) => this.networks.create(name, driver);
  removeNetwork = (id: string) => this.networks.remove(id);

  // Volumes
  listVolumes = () => this.volumes.list();
  createVolume = (name: string) => this.volumes.create(name);
  removeVolume = (id: string) => this.volumes.remove(id);

  // Compose
  listComposes = () => this.composes.list();
  createCompose = (name: string, content: string, path?: string) => this.composes.create(name, content, path);
  removeCompose = (id: number) => this.composes.remove(id);
  startCompose = (id: number) => this.composes.start(id);
  stopCompose = (id: number) => this.composes.stop(id);
  restartCompose = (id: number) => this.composes.restart(id);
  updateCompose = (id: number, content: string) => this.composes.update(id, content);
  testCompose = (content: string) => this.composes.test(content);
  getComposeEnv = (id: number) => this.composes.getEnv(id);
  cleanComposeLog = (id: number) => this.composes.cleanLog(id);

  // Apps
  listInstalledApps = () => this.apps.listInstalled();
  listAppStore = () => this.apps.listStore();
  installApp = (app: any) => this.apps.install(app);
  uninstallApp = (id: number) => this.apps.uninstall(id);
  updateApp = (id: number) => this.apps.update(id);

  // Websites
  listWebsites = () => this.websites.list();
  createWebsite = (site: any) => this.websites.create(site);
  deleteWebsite = (id: number) => this.websites.remove(id);
  listCertificates = () => this.websites.listCertificates();
  createCertificate = (cert: any) => this.websites.createCertificate(cert);
  deleteCertificate = (id: number) => this.websites.deleteCertificate(id);

  // Files
  listFiles = (path: string, page?: number, pageSize?: number) => this.files.list(path, page, pageSize);
  searchFiles = (params: any) => this.files.search(params);
  getFileContent = (path: string) => this.files.getContent(path);
  saveFile = (path: string, content: string) => this.files.save(path, content);
  deleteFile = (path: string, forceDelete?: boolean) => this.files.delete(path, forceDelete);
  createDir = (path: string) => this.files.createDir(path);
  createFile = (path: string) => this.files.createFile(path);
  compressFiles = (params: any) => this.files.compress(params);
  decompressFile = (params: any) => this.files.decompress(params);
  moveFile = (params: any) => this.files.move(params);
  renameFile = (params: any) => this.files.rename(params);
  chmodFile = (params: any) => this.files.chmod(params);
  chownFile = (params: any) => this.files.chown(params);
  checkFile = (path: string) => this.files.check(path);
  getFileSize = (path: string) => this.files.getSize(path);
  getFileTree = (path: string) => this.files.getTree(path);
  downloadFile = (path: string) => this.files.download(path);
  uploadFile = (params: any) => this.files.upload(params);
  wgetFile = (url: string, path: string, ignoreCertificate?: boolean) => this.files.wget(url, path, ignoreCertificate);

  // Databases
  listDatabases = (type: string) => this.databases.list(type);
  createDatabase = (type: string, db: any) => this.databases.create(type, db);
  deleteDatabase = (type: string, id: number) => this.databases.remove(type, id);

  // System
  getSystemInfo = () => this.system.getInfo();
  getSystemMonitor = () => this.system.getMonitor();

  // Cronjobs
  listCronjobs = () => this.cronjobs.list();
  createCronjob = (job: any) => this.cronjobs.create(job);
  deleteCronjob = (id: number) => this.cronjobs.remove(id);

  // Firewall
  listFirewallRules = () => this.firewall.listRules();
  createFirewallRule = (rule: any) => this.firewall.createRule(rule);
  deleteFirewallRule = (id: number) => this.firewall.removeRule(id);

  // Process
  listProcesses = () => this.process.list();
  killProcess = (pid: number) => this.process.kill(pid);

  // SSH
  getSSHConfig = () => this.ssh.getConfig();
  updateSSHConfig = (config: any) => this.ssh.updateConfig(config);

  // Terminal
  execCommand = (command: string, cwd?: string) => this.terminal.execCommand(command, cwd);

  // Backup
  listBackups = () => this.backup.list();
  createBackup = (backup: any) => this.backup.create(backup);
  restoreBackup = (id: number) => this.backup.restore(id);
  deleteBackup = (id: number) => this.backup.remove(id);

  // Settings
  getSettings = () => this.settings.getSettings();
  updateSettings = (settings: any) => this.settings.update(settings);

  // Logs
  listOperationLogs = () => this.logs.listOperation();
  listSystemLogs = () => this.logs.listSystem();

  // Runtime
  listEnvironments = (type: string) => this.runtime.list(type);
  installEnvironment = (type: string, config: any) => this.runtime.install(type, config);
  uninstallEnvironment = (type: string, id: number) => this.runtime.uninstall(type, id);
}

export { OnePanelConfig } from "./types/config.js";
export type { OnePanelConfig as Config };
