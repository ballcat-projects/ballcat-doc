## 前言

`BallCat` 致力于简化开发流程，开箱即用，只需专注于业务开发，避免重复劳作

喜欢的朋友动动小手点个 star 哈，感谢~~
另外有任何问题欢迎提 issues，或者邮件沟通，也接受通用的功能请求


## 简介

基于`SpringBoot` + `Ant Design Vue`的前后端分离应用。  
目前支持代码生成，前后台用户分离，权限控制，定时任务，访问日志，操作日志，异常日志，统一异常处理，XSS过滤，SQL防注入等功能

- 前端ui git地址： https://github.com/Hccake/ballcat-ui-vue
- 预览地址： http://preview.ballcat.cn

## 结构

- 后端：

```
.
|-- ballcat-admin
|   |-- ballcat-admin-core          -- 后台管理核心模块（权限控制，字典，Oauth2等）
|   `-- ballcat-admin-websocket     -- 后台管理 websocket 支持插件（公告和字典等同步）
|-- ballcat-codegen             -- 代码生成器
|-- ballcat-common			   
|   |-- ballcat-common-conf		        -- web公用配置
|   |-- ballcat-common-core             -- 核心组件
|   |-- ballcat-common-model            -- 公用的一些模型
|   |-- ballcat-common-util             -- 公用的工具类
|   `-- ballcat-common-desensitize		-- 脱敏工具类
|-- ballcat-dependencies        -- ballcat项目本身各子模块的依赖管理，以及第三方模块的依赖管理
|-- ballcat-samples				
|   |-- ballcat-sample-admin-application  -- 集成admin的项目示例（swagger聚合者）
|   |-- ballcat-sample-monitor			  -- SpringBootAdmin监控server端集成示例
|   |-- ballcat-sample-pay			      -- 虚拟货币支付示例
|   `-- ballcat-sample-swagger-provider	  -- 无注册中心的swagger-provider提供示例	
|-- ballcat-starters
|   |-- ballcat-spring-boot-starter-datascope  -- 数据权限控制
|   |-- ballcat-spring-boot-starter-dingtalk   -- 钉钉集成工具
|   |-- ballcat-spring-boot-starter-easyexcel  -- 通过注解快速导出excle（easyexcel）
|   |-- ballcat-spring-boot-starter-job        -- 定时任务集成（目前仅xxl-job）
|   |-- ballcat-spring-boot-starter-kafka      -- 消息队列 kafka 集成
|   |-- ballcat-spring-boot-starter-log		   -- 访问日志，操作日志，TraceId注入
|   |-- ballcat-spring-boot-starter-mail	   -- 邮件发送
|   |-- ballcat-spring-boot-starter-pay	       -- 虚拟货币支付
|   |-- ballcat-spring-boot-starter-redis      -- 提供注解使用redis, 分布式锁，防击穿，全局key前缀等功能
|   |-- ballcat-spring-boot-starter-sms        -- 短信接入 starter
|   |-- ballcat-spring-boot-starter-storage    -- 文件存储（暂时只集成了aliyunOss）
|   |-- ballcat-spring-boot-starter-swagger    -- swagger文档配置（提供无注册中心的文档聚合方案）
|   `-- ballcat-spring-boot-starter-websocket  -- websocket 集成
`-- doc        -- 初始化数据库脚本

```



- 前端：

```
.
|-- public   -- 依赖的静态资源存放
`-- src           
    |-- api      -- 和服务端交互的请求方法
    |-- assets   --  本地静态资源
    |-- ballcat   --  项目定制css和常量
    |-- components  -- 通用组件
    |-- config     -- 框架配置
    |-- core       -- 项目引导, 全局配置初始化，依赖包引入等
    |-- layouts    -- 布局
    |-- locales    -- 国际化
    |-- mixins     -- 增删改查页面的抽取模板
    |-- router     -- 路由相关
    |-- store      -- 数据存储相关
    |-- utils      -- 工具类
    |-- views      -- 页面
    |-- App.Vue    -- Vue 模板入口
    |-- main.js    -- Vue 入口js
    `-- permission.js   -- 路由守卫 权限控制
    
```

## 依赖

- 后端

| 依赖                   | 版本          | 官网                                             |
| ---------------------- | ------------- | ------------------------------------------------ |
| Spring Boot            | 2.4.3         | https://spring.io/projects/spring-boot#learn     |
| Spring Security OAuth2 | 2.3.8.RELEASE | https://spring.io/projects/spring-security-oauth |
| Mybatis Plus           | 3.4.3         | https://mp.baomidou.com/                         |
| XXL-JOB                | 2.3.0         | http://www.xuxueli.com/xxl-job                   |
| Hutool                 | 5.5.8         | https://www.hutool.cn/                           |


- 前端

| 依赖               | 版本   | 官网                   |
| ------------------ | ------ | ---------------------- |
| Vue                | 2.6.12 | https://cn.vuejs.org/  |
| Ant Design Vue     | 1.7.2  | https://www.antdv.com  |
| Ant Design Vue Pro | 2.0.2  | https://pro.loacg.com/ |
