import { BaseAPI } from "./base.js";

export interface DiskMountRequest {
  /** 设备路径 */
  path: string;
  /** 挂载点 */
  mountPoint: string;
  /** 文件系统类型 */
  fsType?: string;
  /** 选项 */
  options?: string;
}

export interface DiskPartitionRequest {
  /** 设备路径 */
  path: string;
  /** 分区类型 */
  type?: string;
}

export class DiskAPI extends BaseAPI {
  /**
   * 获取磁盘信息
   */
  async list(): Promise<any> {
    return this.request("/api/v2/host/disks", { method: "GET" });
  }

  /**
   * 获取完整磁盘信息
   */
  async getFullInfo(): Promise<any> {
    return this.request("/api/v2/host/disks/info", { method: "GET" });
  }

  /**
   * 挂载磁盘
   */
  async mount(params: DiskMountRequest): Promise<any> {
    return this.post("/api/v2/host/disks/mount", params);
  }

  /**
   * 分区磁盘
   */
  async partition(params: DiskPartitionRequest): Promise<any> {
    return this.post("/api/v2/host/disks/partition", params);
  }

  /**
   * 卸载磁盘
   */
  async unmount(mountPoint: string): Promise<any> {
    return this.post("/api/v2/host/disks/umount", { path: mountPoint });
  }
}
