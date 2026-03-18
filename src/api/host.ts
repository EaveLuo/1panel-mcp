import { BaseAPI } from "./base.js";

export interface HostCreateRequest {
  /** 主机名 */
  name: string;
  /** 主机地址 */
  addr: string;
  /** 端口 */
  port?: number;
  /** 用户名 */
  user?: string;
  /** 认证方式: password, key */
  authMode?: "password" | "key";
  /** 密码 */
  password?: string;
  /** 私钥 */
  privateKey?: string;
  /** 分组ID */
  groupID?: number;
  /** 描述 */
  description?: string;
}

export interface HostUpdateRequest {
  /** ID */
  id: number;
  /** 主机名 */
  name?: string;
  /** 主机地址 */
  addr?: string;
  /** 端口 */
  port?: number;
  /** 用户名 */
  user?: string;
  /** 分组ID */
  groupID?: number;
  /** 描述 */
  description?: string;
}

export interface GroupCreateRequest {
  /** 分组名 */
  name: string;
  /** 默认分组 */
  isDefault?: boolean;
}

export interface GroupUpdateRequest {
  /** ID */
  id: number;
  /** 分组名 */
  name?: string;
  /** 默认分组 */
  isDefault?: boolean;
}

export class HostAPI extends BaseAPI {
  // ==================== Host ====================

  /**
   * 列出主机
   */
  async list(): Promise<any> {
    return this.post("/api/v2/hosts/search", { page: 1, pageSize: 100 });
  }

  /**
   * 获取主机信息
   */
  async getHost(id: number): Promise<any> {
    return this.request(`/api/v2/hosts/${id}`, { method: "GET" });
  }

  /**
   * 创建主机
   */
  async create(params: HostCreateRequest): Promise<any> {
    return this.post("/api/v2/hosts", params);
  }

  /**
   * 更新主机
   */
  async update(params: HostUpdateRequest): Promise<any> {
    return this.post("/api/v2/hosts/update", params);
  }

  /**
   * 删除主机
   */
  async remove(id: number): Promise<any> {
    return this.post("/api/v2/hosts/del", { id });
  }

  /**
   * 测试主机连接
   */
  async testConnection(id: number): Promise<any> {
    return this.post("/api/v2/hosts/test/byid", { id });
  }

  /**
   * 测试主机连接 (通过信息)
   */
  async testConnectionByInfo(params: HostCreateRequest): Promise<any> {
    return this.post("/api/v2/hosts/test/byinfo", params);
  }

  /**
   * 获取主机树
   */
  async getTree(): Promise<any> {
    return this.request("/api/v2/hosts/tree", { method: "GET" });
  }

  /**
   * 更新主机分组
   */
  async updateHostGroup(id: number, groupID: number): Promise<any> {
    return this.post("/api/v2/hosts/group", { id, groupID });
  }

  // ==================== Group ====================

  /**
   * 列出分组
   */
  async listHostGroups(): Promise<any> {
    return this.request("/api/v2/hosts/groups", { method: "GET" });
  }

  /**
   * 创建分组
   */
  async createHostGroup(params: GroupCreateRequest): Promise<any> {
    return this.post("/api/v2/hosts/groups", params);
  }

  /**
   * 更新分组
   */
  async updateHostGroupByID(params: GroupUpdateRequest): Promise<any> {
    return this.post("/api/v2/hosts/groups/update", params);
  }

  /**
   * 删除分组
   */
  async deleteHostGroup(id: number): Promise<any> {
    return this.post("/api/v2/hosts/groups/del", { id });
  }

  // ==================== SSH ====================

  /**
   * 生成主机 SSH 密钥
   */
  async generateSSHKey(id: number): Promise<any> {
    return this.post("/api/v2/hosts/secret", { id });
  }

  /**
   * 获取主机 SSH 密钥
   */
  async getSSHKey(id: number): Promise<any> {
    return this.request(`/api/v2/hosts/secret/${id}`, { method: "GET" });
  }

  /**
   * 删除主机 SSH 密钥
   */
  async deleteSSHKey(id: number): Promise<any> {
    return this.post("/api/v2/hosts/secret/del", { id });
  }

  /**
   * 同步主机 SSH 密钥
   */
  async syncSSHKey(id: number): Promise<any> {
    return this.post("/api/v2/hosts/secret/sync", { id });
  }

  /**
   * 更新主机 SSH 密钥
   */
  async updateSSHKey(id: number, authMode: string, password?: string, privateKey?: string): Promise<any> {
    return this.post("/api/v2/hosts/secret/update", { id, authMode, password, privateKey });
  }

  /**
   * 获取主机 SSH 配置
   */
  async getSSHConf(): Promise<any> {
    return this.request("/api/v2/hosts/ssh/conf", { method: "GET" });
  }

  /**
   * 获取主机 SSH 日志
   */
  async getSSHLogs(): Promise<any> {
    return this.post("/api/v2/hosts/ssh/log", { page: 1, pageSize: 100 });
  }
}
