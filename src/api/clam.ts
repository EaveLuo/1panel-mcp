import { BaseAPI } from "./base.js";

export interface ClamCreateRequest {
  /** 名称 */
  name: string;
  /** 路径 */
  path: string;
  /** 描述 */
  description?: string;
}

export interface ClamUpdateRequest {
  /** ID */
  id: number;
  /** 名称 */
  name?: string;
  /** 路径 */
  path?: string;
  /** 描述 */
  description?: string;
}

export class ClamAPI extends BaseAPI {
  /**
   * 列出 ClamAV 配置
   */
  async list(): Promise<any> {
    return this.post("/api/v2/toolbox/clam/search", { page: 1, pageSize: 100 });
  }

  /**
   * 获取 ClamAV 基础信息
   */
  async getBaseInfo(): Promise<any> {
    return this.request("/api/v2/toolbox/clam/base", { method: "GET" });
  }

  /**
   * 创建 ClamAV 配置
   */
  async create(params: ClamCreateRequest): Promise<any> {
    return this.post("/api/v2/toolbox/clam", params);
  }

  /**
   * 更新 ClamAV 配置
   */
  async update(params: ClamUpdateRequest): Promise<any> {
    return this.post("/api/v2/toolbox/clam/update", params);
  }

  /**
   * 删除 ClamAV 配置
   */
  async remove(id: number): Promise<any> {
    return this.post("/api/v2/toolbox/clam/del", { id });
  }

  /**
   * 获取 ClamAV 文件配置
   */
  async getFile(): Promise<any> {
    return this.request("/api/v2/toolbox/clam/file", { method: "GET" });
  }

  /**
   * 更新 ClamAV 文件配置
   */
  async updateFile(content: string): Promise<any> {
    return this.post("/api/v2/toolbox/clam/file", { content });
  }

  /**
   * 执行 ClamAV 扫描
   */
  async scan(id: number): Promise<any> {
    return this.post("/api/v2/toolbox/clam/scan", { id });
  }

  /**
   * 获取 ClamAV 扫描记录
   */
  async getRecords(): Promise<any> {
    return this.post("/api/v2/toolbox/clam/record/search", { page: 1, pageSize: 100 });
  }

  /**
   * 清理 ClamAV 记录
   */
  async cleanRecords(): Promise<any> {
    return this.post("/api/v2/toolbox/clam/record/clean", {});
  }

  /**
   * 更新 ClamAV 状态
   */
  async updateStatus(status: string): Promise<any> {
    return this.post("/api/v2/toolbox/clam/status", { status });
  }
}
