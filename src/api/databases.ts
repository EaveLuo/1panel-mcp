import { BaseAPI } from "./base.js";

export class DatabaseAPI extends BaseAPI {
  async list(type: string): Promise<any> {
    return this.post(`/api/v2/databases/${type}/search`, { page: 1, pageSize: 100 });
  }

  async create(type: string, db: any): Promise<any> {
    return this.post(`/api/v2/databases/${type}`, db);
  }

  async remove(type: string, id: number): Promise<any> {
    return this.post(`/api/v2/databases/${type}/del`, { id });
  }
}
