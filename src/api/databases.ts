import { BaseAPI } from "./base.js";

// ==================== MySQL ====================

export interface MySQLBindUserRequest {
  /** 数据库名称 */
  database: string;
  /** 数据库实例 */
  db: string;
  /** 用户密码 */
  password: string;
  /** 权限 (如: localhost, %, IP地址) */
  permission: string;
  /** 用户名 */
  username: string;
}

export interface MySQLChangePasswordRequest {
  /** 数据库名称 */
  database: string;
  /** 来源: local, remote */
  from: "local" | "remote";
  /** 数据库ID */
  id: number;
  /** 类型 */
  type: "mysql" | "mariadb";
  /** 新密码 */
  value: string;
}

export interface MySQLChangeAccessRequest {
  /** 数据库名称 */
  database: string;
  /** 来源: local, remote */
  from: "local" | "remote";
  /** 数据库ID */
  id: number;
  /** 类型 */
  type: "mysql" | "mariadb";
  /** 访问权限值 (如: localhost, %, 具体IP) */
  value: string;
}

// ==================== PostgreSQL ====================

export interface PostgreSQLBindUserRequest {
  /** 数据库名称 */
  database: string;
  /** 数据库实例名称 */
  name: string;
  /** 用户密码 */
  password: string;
  /** 是否超级用户 */
  superUser?: boolean;
  /** 用户名 */
  username: string;
}

export interface PostgreSQLChangePrivilegesRequest {
  /** 数据库名称 */
  database: string;
  /** 来源: local, remote */
  from: "local" | "remote";
  /** 数据库ID */
  id: number;
  /** 类型 */
  type: "postgresql";
  /** 权限值 */
  value: string;
}

// ==================== Redis ====================

export interface RedisChangePasswordRequest {
  /** 数据库实例ID */
  id: number;
  /** 新密码 */
  value: string;
}

export interface RedisConf {
  /** 配置内容 */
  content?: string;
  /** 数据库ID */
  id: number;
}

export class DatabaseAPI extends BaseAPI {
  // ==================== 通用 ====================

  /**
   * 列出数据库
   */
  async list(type: string): Promise<any> {
    return this.post(`/api/v2/databases/${type}/search`, { page: 1, pageSize: 100 });
  }

  /**
   * 创建数据库
   */
  async create(type: string, db: any): Promise<any> {
    return this.post(`/api/v2/databases/${type}`, db);
  }

  /**
   * 删除数据库
   */
  async remove(type: string, id: number): Promise<any> {
    return this.post(`/api/v2/databases/${type}/del`, { id });
  }

  /**
   * 获取数据库详情
   */
  async getDetail(type: string, id: number): Promise<any> {
    return this.request(`/api/v2/databases/${type}/${id}`, { method: "GET" });
  }

  // ==================== MySQL ====================

  /**
   * MySQL - 绑定用户
   */
  async mysqlBindUser(params: MySQLBindUserRequest): Promise<any> {
    return this.post("/api/v2/databases/bind", params);
  }

  /**
   * MySQL - 修改密码
   */
  async mysqlChangePassword(params: MySQLChangePasswordRequest): Promise<any> {
    return this.post("/api/v2/databases/change/password", params);
  }

  /**
   * MySQL - 修改远程访问权限
   */
  async mysqlChangeAccess(params: MySQLChangeAccessRequest): Promise<any> {
    return this.post("/api/v2/databases/change/access", params);
  }

  /**
   * MySQL - 获取数据库信息
   */
  async mysqlGetInfo(from: "local" | "remote" = "local"): Promise<any> {
    return this.post("/api/v2/databases/common/info", { from });
  }

  /**
   * MySQL - 获取远程访问配置
   */
  async mysqlGetRemoteAccess(): Promise<any> {
    return this.request("/api/v2/databases/remote", { method: "GET" });
  }

  /**
   * MySQL - 更新远程访问配置
   */
  async mysqlUpdateRemoteAccess(privilege: boolean): Promise<any> {
    return this.post("/api/v2/databases/remote", { privilege });
  }

  /**
   * MySQL - 获取状态信息
   */
  async mysqlGetStatus(): Promise<any> {
    return this.request("/api/v2/databases/status", { method: "GET" });
  }

  /**
   * MySQL - 获取变量信息
   */
  async mysqlGetVariables(): Promise<any> {
    return this.request("/api/v2/databases/variables", { method: "GET" });
  }

  /**
   * MySQL - 更新变量
   */
  async mysqlUpdateVariables(variables: Record<string, string>): Promise<any> {
    return this.post("/api/v2/databases/variables/update", { variables });
  }

  // ==================== PostgreSQL ====================

  /**
   * PostgreSQL - 绑定用户
   */
  async postgresqlBindUser(params: PostgreSQLBindUserRequest): Promise<any> {
    return this.post("/api/v2/databases/pg/bind", params);
  }

  /**
   * PostgreSQL - 修改密码
   */
  async postgresqlChangePassword(params: MySQLChangePasswordRequest): Promise<any> {
    return this.post("/api/v2/databases/pg/password", params);
  }

  /**
   * PostgreSQL - 修改权限
   */
  async postgresqlChangePrivileges(params: PostgreSQLChangePrivilegesRequest): Promise<any> {
    return this.post("/api/v2/databases/pg/privileges", params);
  }

  /**
   * PostgreSQL - 获取数据库列表
   */
  async postgresqlListDatabases(): Promise<any> {
    return this.request("/api/v2/databases/pg", { method: "GET" });
  }

  // ==================== Redis ====================

  /**
   * Redis - 获取配置
   */
  async redisGetConf(id: number): Promise<any> {
    return this.request(`/api/v2/databases/redis/conf/${id}`, { method: "GET" });
  }

  /**
   * Redis - 更新配置
   */
  async redisUpdateConf(params: RedisConf): Promise<any> {
    return this.post("/api/v2/databases/redis/conf/update", params);
  }

  /**
   * Redis - 修改密码
   */
  async redisChangePassword(params: RedisChangePasswordRequest): Promise<any> {
    return this.post("/api/v2/databases/redis/password", params);
  }

  /**
   * Redis - 获取状态
   */
  async redisGetStatus(): Promise<any> {
    return this.request("/api/v2/databases/redis/status", { method: "GET" });
  }

  /**
   * Redis - 获取持久化配置
   */
  async redisGetPersistenceConf(id: number): Promise<any> {
    return this.request(`/api/v2/databases/redis/persistence/conf/${id}`, { method: "GET" });
  }

  /**
   * Redis - 更新持久化配置
   */
  async redisUpdatePersistenceConf(
    id: number,
    params: { appendonly: string; appendfsync: string; save: string }
  ): Promise<any> {
    return this.post("/api/v2/databases/redis/persistence/update", { id, ...params });
  }
}
