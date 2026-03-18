# 1Panel MCP 功能增强实现计划

## 当前代码结构分析

```
src/
├── api/
│   ├── base.ts          # BaseAPI - HTTP 请求基类
│   ├── index.ts         # API 模块导出
│   ├── containers.ts    # 容器管理 (完整)
│   ├── images.ts        # 镜像管理 (完整)
│   ├── networks.ts      # 网络管理 (完整)
│   ├── volumes.ts       # 存储卷管理 (完整)
│   ├── composes.ts      # Compose 管理 (完整)
│   ├── apps.ts          # 应用管理 (完整)
│   ├── websites.ts      # 网站管理 (基础)
│   ├── files.ts         # 文件管理 (基础) ⭐ 需增强
│   ├── databases.ts     # 数据库管理 (基础) ⭐ 需增强
│   ├── system.ts        # 系统管理 (完整)
│   ├── cronjobs.ts      # 计划任务 (完整)
│   └── firewall.ts      # 防火墙 (完整)
├── types/
│   └── config.ts        # 配置类型
├── utils/
│   └── auth.ts          # 认证工具
├── client.ts            # OnePanelClient - API 聚合
└── index.ts             # MCP Server 入口
```

## 第一阶段：文件管理增强

### 需实现的接口 (从 API 文档提取)

1. **文件压缩/解压**
   - `POST /api/v2/files/compress` - Compress file
   - `POST /api/v2/files/decompress` - Decompress file

2. **文件移动/重命名**
   - `POST /api/v2/files/move` - Move file
   - `POST /api/v2/files/rename` - Change file name

3. **文件权限**
   - `POST /api/v2/files/mode` - Change file mode (chmod)
   - `POST /api/v2/files/owner` - Change file owner (chown)

4. **文件上传/下载**
   - `POST /api/v2/files/upload` - Upload file
   - `POST /api/v2/files/download` - Download file
   - `POST /api/v2/files/chunkupload` - Chunk upload (大文件)
   - `POST /api/v2/files/chunkdownload` - Chunk download (大文件)

5. **其他实用功能**
   - `POST /api/v2/files/size` - Get file size
   - `POST /api/v2/files/check` - Check file exist
   - `POST /api/v2/files/tree` - Get file tree

### 代码实现步骤

1. 更新 `src/api/files.ts` - 添加新方法
2. 更新 `src/client.ts` - 添加代理方法
3. 更新 `src/index.ts` - 添加 MCP tools 定义和 handler

## 第二阶段：数据库管理增强

### 需实现的接口

1. **MySQL 增强**
   - `POST /api/v2/databases/db` - Create database
   - `POST /api/v2/databases/db/del` - Delete database
   - `POST /api/v2/databases/bind` - Bind user
   - `POST /api/v2/databases/change/password` - Change password
   - `POST /api/v2/databases/change/access` - Change remote access
   - `POST /api/v2/databases/db/update` - Update database
   - `POST /api/v2/databases/db/del/check` - Check before delete
   - `GET /api/v2/databases/status` - Load status
   - `GET /api/v2/databases/variables` - Load variables

2. **PostgreSQL 增强**
   - `POST /api/v2/databases/pg` - Create PG database
   - `POST /api/v2/databases/pg/del` - Delete PG database
   - `POST /api/v2/databases/pg/bind` - Bind PG user
   - `POST /api/v2/databases/pg/password` - Change PG password
   - `POST /api/v2/databases/pg/privileges` - Change privileges

3. **Redis 增强**
   - `GET /api/v2/databases/redis/conf` - Load Redis conf
   - `POST /api/v2/databases/redis/conf/update` - Update Redis conf
   - `POST /api/v2/databases/redis/password` - Change Redis password
   - `GET /api/v2/databases/redis/status` - Load Redis status

### 代码实现步骤

1. 重构 `src/api/databases.ts` - 按类型拆分方法
2. 更新 `src/client.ts` - 添加代理方法
3. 更新 `src/index.ts` - 添加 MCP tools

## 第三阶段：网站管理增强

### 需实现的接口

1. **域名管理**
   - `POST /api/v2/websites/domains` - Add domain
   - `POST /api/v2/websites/domains/del` - Delete domain
   - `POST /api/v2/websites/domains/search` - List domains

2. **SSL 证书增强**
   - `POST /api/v2/websites/ssl/obtain` - Obtain SSL
   - `POST /api/v2/websites/ssl/renew` - Renew SSL
   - `POST /api/v2/websites/ssl/apply` - Apply SSL to website

3. **网站配置**
   - `GET /api/v2/websites/:id` - Get website detail
   - `POST /api/v2/websites/update` - Update website
   - `POST /api/v2/websites/config` - Update config

## 工程化改进

### 1. 类型安全增强
- 为每个 API 创建对应的 TypeScript 类型定义
- 统一请求/响应类型

### 2. 错误处理
- 统一错误格式
- 添加错误码映射

### 3. 代码组织
- 保持模块化结构
- 添加 JSDoc 注释
- 统一命名规范

### 4. 文档
- 每个 tool 添加清晰的 description
- inputSchema 添加详细的参数说明
