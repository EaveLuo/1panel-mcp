import { BaseAPI } from "./base.js";

export interface MonitorDataRequest {
  /** 开始时间 */
  startTime?: string;
  /** 结束时间 */
  endTime?: string;
}

export class MonitorAPI extends BaseAPI {
  /**
   * 获取监控数据
   */
  async getData(params: MonitorDataRequest = {}): Promise<any> {
    return this.post("/api/v2/monitor/data", params);
  }

  /**
   * 获取监控设置
   */
  async getSetting(): Promise<any> {
    return this.request("/api/v2/monitor/setting", { method: "GET" });
  }

  /**
   * 更新监控设置
   */
  async updateSetting(setting: any): Promise<any> {
    return this.post("/api/v2/monitor/setting", setting);
  }

  /**
   * 清理监控数据
   */
  async cleanData(): Promise<any> {
    return this.post("/api/v2/monitor/clean", {});
  }
}
