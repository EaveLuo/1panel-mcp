import { BaseAPI } from "./base.js";

export class DashboardAPI extends BaseAPI {
  /**
   * 获取仪表盘基础信息
   */
  async getBaseInfo(): Promise<any> {
    return this.request("/api/v2/dashboard/base", { method: "GET" });
  }

  /**
   * 获取仪表盘当前信息
   */
  async getCurrentInfo(): Promise<any> {
    return this.request("/api/v2/dashboard/current", { method: "GET" });
  }

  /**
   * 获取备忘录
   */
  async getMemo(): Promise<any> {
    return this.request("/api/v2/dashboard/memo", { method: "GET" });
  }

  /**
   * 更新备忘录
   */
  async updateMemo(content: string): Promise<any> {
    return this.post("/api/v2/dashboard/memo", { content });
  }
}
