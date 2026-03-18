import { BaseAPI } from "./base.js";

export class FirewallAPI extends BaseAPI {
  async listRules(): Promise<any> {
    return this.post("/api/v2/toolbox/firewall/search", { page: 1, pageSize: 100 });
  }

  async createRule(rule: any): Promise<any> {
    return this.post("/api/v2/toolbox/firewall", rule);
  }

  async removeRule(id: number): Promise<any> {
    return this.post("/api/v2/toolbox/firewall/del", { id });
  }
}
