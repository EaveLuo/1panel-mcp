import { BaseAPI } from "./base.js";

export interface BackupAccountCreateRequest {
  /** 类型: LOCAL, OSS, S3, COS, KODO, MINIO, SFTP, WebDAV */
  type: "LOCAL" | "OSS" | "S3" | "COS" | "KODO" | "MINIO" | "SFTP" | "WebDAV";
  /** 名称 */
  name: string;
  /** 配置信息 */
  vars: Record<string, string>;
  /** 是否默认 */
  isDefault?: boolean;
}

export interface BackupAccountUpdateRequest {
  /** 类型 */
  type: string;
  /** 名称 */
  name: string;
  /** 配置信息 */
  vars: Record<string, string>;
  /** 是否默认 */
  isDefault?: boolean;
}

export interface BackupAccountDeleteRequest {
  /** 类型 */
  type: string;
  /** 名称 */
  name?: string;
}

export class BackupAccountAPI extends BaseAPI {
  /**
   * 列出备份账号
   */
  async list(): Promise<any> {
    return this.post("/api/v2/core/backups/search", { page: 1, pageSize: 100 });
  }

  /**
   * 获取备份账号选项
   */
  async getOptions(): Promise<any> {
    return this.request("/api/v2/core/backups/options", { method: "GET" });
  }

  /**
   * 获取备份账号基础信息
   */
  async getClientInfo(clientType: string): Promise<any> {
    return this.request(`/api/v2/core/backups/client/${clientType}`, { method: "GET" });
  }

  /**
   * 创建备份账号
   */
  async create(params: BackupAccountCreateRequest): Promise<any> {
    return this.post("/api/v2/core/backups", params);
  }

  /**
   * 更新备份账号
   */
  async update(params: BackupAccountUpdateRequest): Promise<any> {
    return this.post("/api/v2/core/backups/update", params);
  }

  /**
   * 删除备份账号
   */
  async delete(params: BackupAccountDeleteRequest): Promise<any> {
    return this.post("/api/v2/core/backups/del", params);
  }

  /**
   * 检查备份账号
   */
  async check(params: { type: string; vars: Record<string, string> }): Promise<any> {
    return this.post("/api/v2/core/backups/check", params);
  }

  /**
   * 列出备份账号中的文件
   */
  async listFiles(backupAccountID: number, path: string = "/"): Promise<any> {
    return this.post("/api/v2/core/backups/files", { backupAccountID, path });
  }
}
