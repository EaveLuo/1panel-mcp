import { BaseAPI } from "./base.js";

export class WebsiteAPI extends BaseAPI {
  async list(): Promise<any> {
    return this.get("/api/v2/websites/list");
  }

  async create(site: any): Promise<any> {
    return this.post("/api/v2/websites", site);
  }

  async remove(id: number): Promise<any> {
    return this.post("/api/v2/websites/del", { id });
  }

  async listCertificates(): Promise<any> {
    return this.post("/api/v2/websites/ssl/search", { page: 1, pageSize: 100 });
  }

  async createCertificate(cert: any): Promise<any> {
    return this.post("/api/v2/websites/ssl", cert);
  }

  async deleteCertificate(id: number): Promise<any> {
    return this.post("/api/v2/websites/ssl/del", { id });
  }
}
