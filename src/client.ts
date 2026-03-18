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
  BackupAccountAPI,
  SettingsAPI,
  LogsAPI,
  RuntimeAPI,
  Fail2BanAPI,
  DiskAPI,
  DashboardAPI,
  MonitorAPI,
  DeviceAPI,
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
  public backupAccount: BackupAccountAPI;
  public settings: SettingsAPI;
  public logs: LogsAPI;
  public runtime: RuntimeAPI;
  public fail2ban: Fail2BanAPI;
  public disk: DiskAPI;
  public dashboard: DashboardAPI;
  public monitor: MonitorAPI;
  public device: DeviceAPI;

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
    this.backupAccount = new BackupAccountAPI(this.config);
    this.settings = new SettingsAPI(this.config);
    this.logs = new LogsAPI(this.config);
    this.runtime = new RuntimeAPI(this.config);
    this.fail2ban = new Fail2BanAPI(this.config);
    this.disk = new DiskAPI(this.config);
    this.dashboard = new DashboardAPI(this.config);
    this.monitor = new MonitorAPI(this.config);
    this.device = new DeviceAPI(this.config);
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
  getWebsite = (id: number) => this.websites.getDetail(id);
  updateWebsite = (site: any) => this.websites.update(site);
  deleteWebsite = (id: number) => this.websites.remove(id);

  // Website Domains
  listWebsiteDomains = (websiteId: number) => this.websites.listDomains(websiteId);
  createWebsiteDomain = (params: any) => this.websites.createDomain(params);
  deleteWebsiteDomain = (params: any) => this.websites.deleteDomain(params);
  updateWebsiteDomain = (params: any) => this.websites.updateDomain(params);

  // SSL Certificates
  listCertificates = () => this.websites.listCertificates();
  getCertificate = (id: number) => this.websites.getCertificate(id);
  createCertificate = (cert: any) => this.websites.createCertificate(cert);
  deleteCertificate = (id: number) => this.websites.deleteCertificate(id);
  obtainSSL = (params: any) => this.websites.obtainSSL(params);
  renewSSL = (params: any) => this.websites.renewSSL(params);
  resolveSSL = (params: any) => this.websites.resolveSSL(params);
  uploadSSL = (params: any) => this.websites.uploadSSL(params);
  getWebsiteSSL = (websiteId: number) => this.websites.getWebsiteSSL(websiteId);

  // HTTPS
  getHTTPS = (id: number) => this.websites.getHTTPS(id);
  updateHTTPS = (params: any) => this.websites.updateHTTPS(params);
  applySSL = (params: any) => this.websites.applySSL(params);

  // Nginx
  getNginxConf = (id: number) => this.websites.getNginxConf(id);
  updateNginxConf = (params: any) => this.websites.updateNginxConf(params);

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

  // Databases - Basic
  listDatabases = (type: string) => this.databases.list(type);
  createDatabase = (type: string, db: any) => this.databases.create(type, db);
  deleteDatabase = (type: string, id: number) => this.databases.remove(type, id);
  getDatabase = (type: string, id: number) => this.databases.getDetail(type, id);

  // Databases - MySQL
  mysqlBindUser = (params: any) => this.databases.mysqlBindUser(params);
  mysqlChangePassword = (params: any) => this.databases.mysqlChangePassword(params);
  mysqlChangeAccess = (params: any) => this.databases.mysqlChangeAccess(params);
  mysqlGetInfo = (from?: "local" | "remote") => this.databases.mysqlGetInfo(from);
  mysqlGetRemoteAccess = () => this.databases.mysqlGetRemoteAccess();
  mysqlUpdateRemoteAccess = (privilege: boolean) => this.databases.mysqlUpdateRemoteAccess(privilege);
  mysqlGetStatus = () => this.databases.mysqlGetStatus();
  mysqlGetVariables = () => this.databases.mysqlGetVariables();
  mysqlUpdateVariables = (variables: Record<string, string>) => this.databases.mysqlUpdateVariables(variables);

  // Databases - PostgreSQL
  postgresqlBindUser = (params: any) => this.databases.postgresqlBindUser(params);
  postgresqlChangePassword = (params: any) => this.databases.postgresqlChangePassword(params);
  postgresqlChangePrivileges = (params: any) => this.databases.postgresqlChangePrivileges(params);
  postgresqlListDatabases = () => this.databases.postgresqlListDatabases();

  // Databases - Redis
  redisGetConf = (id: number) => this.databases.redisGetConf(id);
  redisUpdateConf = (params: any) => this.databases.redisUpdateConf(params);
  redisChangePassword = (params: any) => this.databases.redisChangePassword(params);
  redisGetStatus = () => this.databases.redisGetStatus();
  redisGetPersistenceConf = (id: number) => this.databases.redisGetPersistenceConf(id);
  redisUpdatePersistenceConf = (id: number, params: any) => this.databases.redisUpdatePersistenceConf(id, params);

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

  // Backup Account
  listBackupAccounts = () => this.backupAccount.list();
  getBackupAccountOptions = () => this.backupAccount.getOptions();
  getBackupAccountClientInfo = (clientType: string) => this.backupAccount.getClientInfo(clientType);
  createBackupAccount = (params: any) => this.backupAccount.create(params);
  updateBackupAccount = (params: any) => this.backupAccount.update(params);
  deleteBackupAccount = (params: any) => this.backupAccount.delete(params);
  checkBackupAccount = (params: any) => this.backupAccount.check(params);
  listBackupAccountFiles = (backupAccountID: number, path?: string) => this.backupAccount.listFiles(backupAccountID, path);

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

  // Fail2ban
  getFail2BanBaseInfo = () => this.fail2ban.getBaseInfo();
  getFail2BanConf = () => this.fail2ban.getConf();
  operateFail2Ban = (params: any) => this.fail2ban.operate(params);
  operateFail2BanSSH = (params: any) => this.fail2ban.operateSSH(params);
  searchFail2BanBannedIPs = (params?: any) => this.fail2ban.searchBannedIPs(params);
  updateFail2BanConf = (params: any) => this.fail2ban.updateConf(params);
  updateFail2BanConfByFile = (content: string) => this.fail2ban.updateConfByFile(content);

  // Disk
  listDisks = () => this.disk.list();
  getDiskFullInfo = () => this.disk.getFullInfo();
  mountDisk = (params: any) => this.disk.mount(params);
  partitionDisk = (params: any) => this.disk.partition(params);
  unmountDisk = (mountPoint: string) => this.disk.unmount(mountPoint);

  // Dashboard
  getDashboardBaseInfo = () => this.dashboard.getBaseInfo();
  getDashboardCurrentInfo = () => this.dashboard.getCurrentInfo();
  getDashboardMemo = () => this.dashboard.getMemo();
  updateDashboardMemo = (content: string) => this.dashboard.updateMemo(content);

  // Monitor
  getMonitorData = (params?: any) => this.monitor.getData(params);
  getMonitorSetting = () => this.monitor.getSetting();
  updateMonitorSetting = (setting: any) => this.monitor.updateSetting(setting);
  cleanMonitorData = () => this.monitor.cleanData();

  // Device
  getDeviceBaseInfo = () => this.device.getBaseInfo();
  checkDeviceDNS = () => this.device.checkDNS();
  updateDevice = (conf: any) => this.device.update(conf);
  updateDeviceByFile = (content: string) => this.device.updateByFile(content);
  updateDeviceHosts = (hosts: string) => this.device.updateHosts(hosts);
  updateDevicePassword = (oldPass: string, newPass: string) => this.device.updatePassword(oldPass, newPass);
  updateDeviceSwap = (swap: any) => this.device.updateSwap(swap);
}

export { OnePanelConfig } from "./types/config.js";
export type { OnePanelConfig as Config };
