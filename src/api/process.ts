import { BaseAPI } from "./base.js";

export class ProcessAPI extends BaseAPI {
  async list(): Promise<any> {
    return this.post("/api/v2/processes/search", { page: 1, pageSize: 100 });
  }

  async kill(pid: number): Promise<any> {
    return this.post("/api/v2/processes/kill", { pid });
  }
}
