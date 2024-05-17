# BallCat

BallCat 组织旨在为项目快速开发提供一系列的基础能力，方便用户根据项目需求快速进行功能拓展。

## 前言

以前在使用其他后台管理脚手架进行开发时，经常会遇到因为项目业务原因需要进行二开的情况，在长期的开发后，一旦源项目进行迭代升级，很难进行同步更新。

所以 BallCat 推荐开发项目时，以依赖的方式引入 BallCat 中提供的所有功能，这样后续跟随 BallCat 版本升级时只需要修改对应的依赖版本号即可完成同步。

BallCat 已将所有 JAR 包都推送至中央仓库，也会为每个版本升级提供 SQL 改动文件。

> 如果在使用中遇到了必须通过二开修改源码才能解决的问题或功能时，欢迎提 issues，如果功能具有通用性，我们会为 BallCat 添加此能力，也欢迎直接 PR 你的改动。


## 相关仓库

| 项目             | 简介              | gitee 地址                                          | github 地址                                          |
| ---------------- |-----------------| --------------------------------------------------- | ---------------------------------------------------- |
| ballcat          | 核心项目组件          | https://gitee.com/ballcat-projects/ballcat          | https://github.com/ballcat-projects/ballcat          |
| ballcat-ui-vue   | 管理后台前端 vue2 版本  | https://gitee.com/ballcat-projects/ballcat-ui-vue   | https://github.com/ballcat-projects/ballcat-ui-vue   |
| ballcat-ui-react | 管理后台前端 react 版本 | https://gitee.com/ballcat-projects/ballcat-ui-react | https://github.com/ballcat-projects/ballcat-ui-react |
| ballcat-admin-ui-vue3 | 管理后台前端 vue3 版本  | https://gitee.com/ballcat-projects/ballcat-admin-ui-vue3 | https://github.com/ballcat-projects/ballcat-admin-ui-vue3 |
| ballcat-codegen  | 代码生成器           | https://gitee.com/ballcat-projects/ballcat-codegen  | https://github.com/ballcat-projects/ballcat-codegen  |
| ballcat-samples  | 使用示例            | https://gitee.com/ballcat-projects/ballcat-samples  | https://github.com/ballcat-projects/ballcat-samples  |
| ballcat-boot     | 单体应用模板项目        | https://gitee.com/ballcat-projects/ballcat-boot     | https://github.com/ballcat-projects/ballcat-boot     |

> 注意 ballcat 是核心组件仓库，如果需要启动后端服务，请使用 ballcat-boot

## 地址链接

**管理后台预览**：http://preview.ballcat.cn

> admin / a123456

**代码生成器预览**：http://codegen.ballcat.cn/

**文档地址**：http://www.ballcat.cn/ 



# ballcat

本仓库存放了 BallCat 提供的所有的基础 Jar 包。提供了import `ballcat-dependencies` pom和继承`ballcat-parent` pom两种模式供二开用户选择。

如 `ballcat-admin-core` 依赖，用户引入此依赖并配合核心 SQL，即可获得用户管理，OAuth2，权限控制，字典等等后台管理相关的基础功能。

`ballcat-admin-websocket` 依赖，用户引入后，后台管理即可获得 websocket 能力，对公告、字典、弹出选择框的修改可以及时通知到前端

`ballcat-admin-i18n` 依赖，用户引入后，并执行对应的初始化 SQL，即可获得国际化的能力

`ballcat-spring-boot-starter-datascope` 依赖，用户引入后，根据自己的业务进行定制，即可获得数据权限控制的能力

······ 等等


## 项目结构

```
.
├── ballcat-dependencies                        -- BallCat依赖管理
├── ballcat-parent                              -- BallCat父项目
├── common                                      -- 基础公用组件
│   ├── ballcat-common-core                     -- 核心组件
│   ├── ballcat-common-model                    -- 公用的一些模型
│   └── ballcat-common-util				        -- 公用的工具
├── datascope
│   └── ballcat-spring-boot-starter-datascope   -- 数据权限控制starter
├── desensitize
│   └── ballcat-desensitize                     -- 数据脱敏
├── dingtalk
│   ├── ballcat-dingtalk                        -- 钉钉的一些操作封装
│   └── ballcat-spring-boot-starter-dingtalk    -- 基于 ballcat-dingtalk 的自动配置
├── excel
│   └── ballcat-spring-boot-starter-easyexcel   -- 通过注解快速导入导出excle（easyexcel）
├── file
│   └── ballcat-spring-boot-starter-file        -- 文件操作（本地文件、FTP、SFTP）自动配置
├── grpc
│   ├── ballcat-spring-boot-starter-grpc        -- grpc自动配置
│   ├── ballcat-spring-boot-starter-grpc-client -- grpc客户端自动配置
│   └── ballcat-spring-boot-starter-grpc-server -- grpc服务端自动配置
├── i18n
│   ├── ballcat-i18n                            -- 国际化方案
│   └── ballcat-spring-boot-starter-i18n        -- 基于 ballcat-i18n 的自动配置
├── idempotent
│   ├── ballcat-idempotent                      -- 幂等基础组件
│   └── ballcat-spring-boot-starter-idempotent  -- 基于 ballcat-idempotent 的自动配置
├── ip
│   └── ballcat-spring-boot-starter-ip2region   -- 基于 ip2region 离线IP地址查询的自动配置
├── job
│   ├── ballcat-spring-boot-starter-quartz      -- 定时任务quartz集成
│   └── ballcat-spring-boot-starter-xxljob      -- 定时任务xxl-job集成
├── kafka
│   ├── ballcat-kafka                           -- kafka 的一些操作扩展
│   ├── ballcat-kafka-stream                    -- kafka 流处理的一些操作扩展
│   └── ballcat-spring-boot-starter-kafka       -- 基于 ballcat-kafka 的自动配置
├── log
│   ├── ballcat-log                             -- 日志基础组件
│   └── ballcat-spring-boot-starter-log         -- 基于 ballcat-log 的自动配置
├── mail
│   └── ballcat-spring-boot-starter-mail        -- 邮件发送
├── mybatis-plus
│   ├── ballcat-mybatis-plus                    -- 基于 mybatis-plus 相关的一些扩展
│   └── ballcat-spring-boot-starter-mybatis-plus -- 基于ballcat-mybatis-plus 的自动配置
├── ntp
│   └── ballcat-ntp                             -- NTP 时间同步工具
├── openapi
│   └── ballcat-spring-boot-starter-openapi     -- swagger文档配置
├── oss
│   └── ballcat-spring-boot-starter-oss         -- 对象存储（所有支持 AWS S3 协议的云存储，如阿里云，七牛云，腾讯云）
├── pay
│   ├── ballcat-pay-ali                         -- 针对支付宝支付的一些操作封装
│   ├── ballcat-pay-virtual                     -- 针对虚拟货币支付的一些操作封装
│   ├── ballcat-pay-wx                          -- 针对微信支付的一些操作封装
│   └── ballcat-spring-boot-starter-pay         -- 基于 ballcat-pay-* 的自动配置
├── redis
│   ├── ballcat-redis                           -- redis基础组件
│   ├── ballcat-redis-module                    -- redis module 的扩展功能（暂时只有布隆过滤器）
│   └── ballcat-spring-boot-starter-redis       -- 基于 ballcat-redis 的自动配置
├── security
│   ├── ballcat-security-core                   -- 安全基础组件，与oauth2解藕
│   ├── ballcat-spring-security                 -- 基于 ballcat-security-core 的安全校验注解实现
│   ├── ballcat-spring-security-oauth2-authorization-server -- 基于 spring security oauth2 authorization server 的一些扩展，SAS模式
│   ├── ballcat-spring-security-oauth2-core     -- 基于 spring security oauth2 的一些扩展
│   └── ballcat-spring-security-oauth2-resource-server -- 基于 spring security oauth2 resource server 的一些扩展，SAS模式
├── sms
│   └── ballcat-spring-boot-starter-sms         -- 短信自动配置 starter
├── tesseract
│   └── ballcat-tesseract                       -- 基于tesseract OCR 识别工具
├── web
│   ├── ballcat-spring-boot-starter-web         -- 基于 ballcat-web 的自动配置
│   └── ballcat-web                             -- 对于 spring web 的一些抽象封装，访问日志、TraceId等
├── websocket
│   ├── ballcat-spring-boot-starter-websocket    -- 基于 ballcat-websocket 的自动配置
│   └── ballcat-websocket                        -- 对于 spring websocket 的一些抽象封装
└── xss
    └── ballcat-spring-boot-starter-xss          -- xss 防注入相关
```


## 快速搭建

参看官方文档 http://www.ballcat.cn/guide/quick-start.html


## 交流群

群已达人数上限，可以扫右边我的个人微信二维码，或者添加我的微信号 `Hccake_`，我再邀请你入群

<img src="https://hccake-img.oss-cn-shanghai.aliyuncs.com/ballcat/wechat-hccake.jpg" alt="微信" width="35%"/>
