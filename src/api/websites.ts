import { BaseAPI } from "./base.js";

// ==================== Domain ====================

export interface DomainCreateRequest {
  /** 网站ID */
  websiteId: number;
  /** 域名 */
  domain: string;
  /** 端口 */
  port?: number;
}

export interface DomainDeleteRequest {
  /** 域名ID */
  id: number;
}

export interface DomainUpdateRequest {
  /** 域名ID */
  id: number;
  /** 网站ID */
  websiteId: number;
  /** 域名 */
  domain?: string;
  /** 端口 */
  port?: number;
}

// ==================== SSL ====================

export interface SSLObtainRequest {
  /** SSL ID */
  ID: number;
  /** 域名列表 */
  domains: string[];
  /** 密钥类型 */
  keyType: string;
  /** 时长 */
  time?: number;
  /** 单位 */
  unit?: string;
  /** 是否强制 HTTPS */
  autoRenew?: boolean;
}

export interface SSLRenewRequest {
  /** SSL ID */
  ID: number;
}

export interface SSLApplyRequest {
  /** 网站ID */
  websiteId: number;
  /** SSL ID */
  websiteSSLId?: number;
  /** 证书类型: existed, auto, manual */
  type: "existed" | "auto" | "manual";
  /** 是否启用 HTTPS */
  enable: boolean;
  /** HTTP 配置: HTTPSOnly, HTTPAlso, HTTPToHTTPS */
  httpConfig?: "HTTPSOnly" | "HTTPAlso" | "HTTPToHTTPS";
  /** 私钥 */
  privateKey?: string;
  /** 证书 */
  certificate?: string;
  /** 算法 */
  algorithm?: string;
  /** HSTS */
  hsts?: boolean;
  /** HSTS 包含子域名 */
  hstsIncludeSubDomains?: boolean;
  /** HTTP/3 */
  http3?: boolean;
  /** HTTPS 端口 */
  httpsPorts?: number[];
}

// ==================== HTTPS ====================

export interface HTTPSGetRequest {
  /** 网站ID */
  id: number;
}

// ==================== Nginx ====================

export interface NginxUpdateRequest {
  /** 网站ID */
  id: number;
  /** 配置内容 */
  content: string;
}

export class WebsiteAPI extends BaseAPI {
  // ==================== Website ====================

  /**
   * 列出网站
   */
  async list(): Promise<any> {
    return this.request("/api/v2/websites/list", { method: "GET" });
  }

  /**
   * 创建网站
   */
  async create(site: any): Promise<any> {
    return this.post("/api/v2/websites", site);
  }

  /**
   * 获取网站详情
   */
  async getDetail(id: number): Promise<any> {
    return this.request(`/api/v2/websites/${id}`, { method: "GET" });
  }

  /**
   * 删除网站
   */
  async remove(id: number): Promise<any> {
    return this.post("/api/v2/websites/del", { id });
  }

  /**
   * 更新网站
   */
  async update(site: any): Promise<any> {
    return this.post("/api/v2/websites/update", site);
  }

  // ==================== Domain ====================

  /**
   * 获取网站域名列表
   */
  async listDomains(websiteId: number): Promise<any> {
    return this.request(`/api/v2/websites/domains/${websiteId}`, { method: "GET" });
  }

  /**
   * 添加域名
   */
  async createDomain(params: DomainCreateRequest): Promise<any> {
    return this.post("/api/v2/websites/domains", params);
  }

  /**
   * 删除域名
   */
  async deleteDomain(params: DomainDeleteRequest): Promise<any> {
    return this.post("/api/v2/websites/domains/del", params);
  }

  /**
   * 更新域名
   */
  async updateDomain(params: DomainUpdateRequest): Promise<any> {
    return this.post("/api/v2/websites/domains/update", params);
  }

  // ==================== SSL ====================

  /**
   * 列出 SSL 证书
   */
  async listCertificates(): Promise<any> {
    return this.post("/api/v2/websites/ssl/search", { page: 1, pageSize: 100 });
  }

  /**
   * 获取 SSL 证书详情
   */
  async getCertificate(id: number): Promise<any> {
    return this.request(`/api/v2/websites/ssl/${id}`, { method: "GET" });
  }

  /**
   * 创建 SSL 证书
   */
  async createCertificate(cert: any): Promise<any> {
    return this.post("/api/v2/websites/ssl", cert);
  }

  /**
   * 删除 SSL 证书
   */
  async deleteCertificate(id: number): Promise<any> {
    return this.post("/api/v2/websites/ssl/del", { id });
  }

  /**
   * 申请 SSL 证书 (Let's Encrypt)
   */
  async obtainSSL(params: SSLObtainRequest): Promise<any> {
    return this.post("/api/v2/websites/ssl/obtain", params);
  }

  /**
   * 续签 SSL 证书
   */
  async renewSSL(params: SSLRenewRequest): Promise<any> {
    return this.post("/api/v2/websites/ssl/renew", params);
  }

  /**
   * 解析 SSL 证书
   */
  async resolveSSL(params: { websiteSSLId: number }): Promise<any> {
    return this.post("/api/v2/websites/ssl/resolve", params);
  }

  /**
   * 上传 SSL 证书
   */
  async uploadSSL(params: any): Promise<any> {
    return this.post("/api/v2/websites/ssl/upload", params);
  }

  /**
   * 获取网站 SSL 证书
   */
  async getWebsiteSSL(websiteId: number): Promise<any> {
    return this.request(`/api/v2/websites/ssl/website/${websiteId}`, { method: "GET" });
  }

  // ==================== HTTPS ====================

  /**
   * 获取 HTTPS 配置
   */
  async getHTTPS(id: number): Promise<any> {
    return this.request(`/api/v2/websites/${id}/https`, { method: "GET" });
  }

  /**
   * 更新 HTTPS 配置
   */
  async updateHTTPS(params: SSLApplyRequest): Promise<any> {
    return this.post(`/api/v2/websites/${params.websiteId}/https`, params);
  }

  /**
   * 应用 SSL 到网站
   */
  async applySSL(params: SSLApplyRequest): Promise<any> {
    return this.post("/api/v2/websites/ssl/apply", params);
  }

  // ==================== Nginx ====================

  /**
   * 获取 Nginx 配置
   */
  async getNginxConf(id: number): Promise<any> {
    return this.request(`/api/v2/websites/nginx/${id}`, { method: "GET" });
  }

  /**
   * 更新 Nginx 配置
   */
  async updateNginxConf(params: NginxUpdateRequest): Promise<any> {
    return this.post("/api/v2/websites/nginx/update", params);
  }

  // ==================== AntiLeech (XPack) ====================

  /**
   * 获取防盗链配置
   */
  async getAntiLeechConf(websiteId: number): Promise<any> {
    return this.request(`/api/v2/websites/leech/${websiteId}`, { method: "GET" });
  }

  /**
   * 更新防盗链配置
   */
  async updateAntiLeech(params: any): Promise<any> {
    return this.post("/api/v2/websites/leech/update", params);
  }
}
