import { BaseAPI } from "./base.js";

export interface SnapshotCreateRequest {
  /** 名称 */
  name: string;
  /** 描述 */
  description?: string;
  /** 是否包含 Docker */
  withDocker?: boolean;
}

export interface SnapshotImportRequest {
  /** 来源 */
  from: string;
  /** 名称列表 */
  names: string[];
}

export class SnapshotAPI extends BaseAPI {
  /**
   * 列出系统快照
   */
  async list(): Promise<any> {
    return this.post("/api/v2/settings/snapshot/search", { page: 1, pageSize: 100 });
  }

  /**
   * 创建系统快照
   */
  async create(params: SnapshotCreateRequest): Promise<any> {
    return this.post("/api/v2/settings/snapshot", params);
  }

  /**
   * 删除系统快照
   */
  async remove(ids: number[]): Promise<any> {
    return this.post("/api/v2/settings/snapshot/del", { ids });
  }

  /**
   * 更新快照描述
   */
  async updateDescription(id: number, description: string): Promise<any> {
    return this.post("/api/v2/settings/snapshot/description/update", { id, description });
  }

  /**
   * 导入系统快照
   */
  async import(params: SnapshotImportRequest): Promise<any> {
    return this.post("/api/v2/settings/snapshot/import", params);
  }

  /**
   * 加载快照数据
   */
  async load(id: number): Promise<any> {
    return this.post("/api/v2/settings/snapshot/load", { id });
  }

  /**
   * 恢复快照
   */
  async recover(id: number, isNewSnapshot: boolean = false): Promise<any> {
    return this.post("/api/v2/settings/snapshot/recover", { id, isNewSnapshot });
  }

  /**
   * 重新创建快照
   */
  async recreate(id: number): Promise<any> {
    return this.post("/api/v2/settings/snapshot/recreate", { id });
  }
}
