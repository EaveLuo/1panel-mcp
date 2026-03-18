import { BaseAPI } from "./base.js";

export class CronjobAPI extends BaseAPI {
  async list(): Promise<any> {
    return this.post("/api/v2/cronjobs/search", { page: 1, pageSize: 100 });
  }

  async create(job: any): Promise<any> {
    return this.post("/api/v2/cronjobs", job);
  }

  async remove(id: number): Promise<any> {
    return this.post("/api/v2/cronjobs/del", { id });
  }
}
