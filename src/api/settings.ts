import { BaseAPI } from "./base.js";

export class SettingsAPI extends BaseAPI {
  async getSettings(): Promise<any> {
    return this.request("/api/v2/settings/search", { method: "GET" });
  }

  async update(settings: any): Promise<any> {
    return this.post("/api/v2/settings/update", settings);
  }
}
