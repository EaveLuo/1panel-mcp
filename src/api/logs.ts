import { BaseAPI } from "./base.js";

export class LogsAPI extends BaseAPI {
  async listOperation(): Promise<any> {
    return this.post("/api/v2/logs/operation/search", { page: 1, pageSize: 100 });
  }

  async listSystem(): Promise<any> {
    return this.post("/api/v2/logs/system/search", { page: 1, pageSize: 100 });
  }
}
