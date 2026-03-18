import { BaseAPI } from "./base.js";

export class AppAPI extends BaseAPI {
  async listInstalled(): Promise<any> {
    return this.post("/api/v2/apps/installed/search", { page: 1, pageSize: 100 });
  }

  async listStore(): Promise<any> {
    return this.post("/api/v2/apps/search", { page: 1, pageSize: 100 });
  }

  async install(app: any): Promise<any> {
    return this.post("/api/v2/apps/installed", app);
  }

  async uninstall(id: number): Promise<any> {
    return this.post("/api/v2/apps/installed/del", { id });
  }

  async update(id: number): Promise<any> {
    return this.post("/api/v2/apps/installed/upgrade", { id });
  }
}
