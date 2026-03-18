import { BaseAPI } from "./base.js";

export class SSHAPI extends BaseAPI {
  async getConfig(): Promise<any> {
    return this.get("/api/v2/hosts/ssh/conf");
  }

  async updateConfig(config: any): Promise<any> {
    return this.post("/api/v2/hosts/ssh/conf", config);
  }
}
