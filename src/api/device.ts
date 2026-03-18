import { BaseAPI } from "./base.js";

export class DeviceAPI extends BaseAPI {
  /**
   * 获取设备基础信息
   */
  async getBaseInfo(): Promise<any> {
    return this.request("/api/v2/host/tool/device", { method: "GET" });
  }

  /**
   * 检查 DNS 配置
   */
  async checkDNS(): Promise<any> {
    return this.post("/api/v2/host/tool/dns", {});
  }

  /**
   * 更新设备配置
   */
  async update(conf: any): Promise<any> {
    return this.post("/api/v2/host/tool/update", conf);
  }

  /**
   * 通过文件更新设备配置
   */
  async updateByFile(content: string): Promise<any> {
    return this.post("/api/v2/host/tool/update/byconf", { content });
  }

  /**
   * 更新 hosts
   */
  async updateHosts(hosts: string): Promise<any> {
    return this.post("/api/v2/host/tool/update/host", { hosts });
  }

  /**
   * 更新密码
   */
  async updatePassword(oldPass: string, newPass: string): Promise<any> {
    return this.post("/api/v2/host/tool/update/passwd", { oldPass, newPass });
  }

  /**
   * 更新 swap
   */
  async updateSwap(swap: any): Promise<any> {
    return this.post("/api/v2/host/tool/update/swap", swap);
  }
}
