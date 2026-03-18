import { BaseAPI } from "./base.js";

export class RuntimeAPI extends BaseAPI {
  async list(type: string): Promise<any> {
    return this.post("/api/v2/runtimes/search", { type, page: 1, pageSize: 100 });
  }

  async install(type: string, config: any): Promise<any> {
    return this.post("/api/v2/runtimes", { type, ...config });
  }

  async uninstall(type: string, id: number): Promise<any> {
    return this.post("/api/v2/runtimes/del", { type, id });
  }
}
