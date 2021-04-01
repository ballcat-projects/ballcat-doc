import{_ as t,o as a,c as l,e}from"./app-1d00ec13.js";const i={},n=e(`<h1 id="ballcat" tabindex="-1"><a class="header-anchor" href="#ballcat" aria-hidden="true">#</a> BallCat</h1><p>BallCat 组织旨在为项目快速开发提供一系列的基础能力，方便用户根据项目需求快速进行功能拓展。</p><h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p>以前在使用其他后台管理脚手架进行开发时，经常会遇到因为项目业务原因需要进行二开的情况，在长期的开发后，一旦源项目进行迭代升级，很难进行同步更新。</p><p>所以 BallCat 推荐开发项目时，以依赖的方式引入 BallCat 中提供的所有功能，这样后续跟随 BallCat 版本升级时只需要修改对应的依赖版本号即可完成同步。</p><p>BallCat 已将所有 JAR 包都推送至中央仓库，也会为每个版本升级提供 SQL 改动文件。</p><blockquote><p>如果在使用中遇到了必须通过二开修改源码才能解决的问题或功能时，欢迎提 issues，如果功能具有通用性，我们会为 BallCat 添加此能力，也欢迎直接 PR 你的改动。</p></blockquote><h2 id="相关仓库" tabindex="-1"><a class="header-anchor" href="#相关仓库" aria-hidden="true">#</a> 相关仓库</h2><table><thead><tr><th>项目</th><th>简介</th><th>gitee 地址</th><th>github 地址</th></tr></thead><tbody><tr><td>ballcat</td><td>核心项目组件</td><td>https://gitee.com/ballcat-projects/ballcat</td><td>https://github.com/ballcat-projects/ballcat</td></tr><tr><td>ballcat-ui-vue</td><td>管理后台前端 vue2 版本</td><td>https://gitee.com/ballcat-projects/ballcat-ui-vue</td><td>https://github.com/ballcat-projects/ballcat-ui-vue</td></tr><tr><td>ballcat-ui-react</td><td>管理后台前端 react 版本</td><td>https://gitee.com/ballcat-projects/ballcat-ui-react</td><td>https://github.com/ballcat-projects/ballcat-ui-react</td></tr><tr><td>ballcat-admin-ui-vue3</td><td>管理后台前端 vue3 版本</td><td>https://gitee.com/ballcat-projects/ballcat-admin-ui-vue3</td><td>https://github.com/ballcat-projects/ballcat-admin-ui-vue3</td></tr><tr><td>ballcat-codegen</td><td>代码生成器</td><td>https://gitee.com/ballcat-projects/ballcat-codegen</td><td>https://github.com/ballcat-projects/ballcat-codegen</td></tr><tr><td>ballcat-samples</td><td>使用示例</td><td>https://gitee.com/ballcat-projects/ballcat-samples</td><td>https://github.com/ballcat-projects/ballcat-samples</td></tr><tr><td>ballcat-boot</td><td>单体应用模板项目</td><td>https://gitee.com/ballcat-projects/ballcat-boot</td><td>https://github.com/ballcat-projects/ballcat-boot</td></tr></tbody></table><blockquote><p>注意 ballcat 是核心组件仓库，如果需要启动后端服务，请使用 ballcat-boot</p></blockquote><h2 id="地址链接" tabindex="-1"><a class="header-anchor" href="#地址链接" aria-hidden="true">#</a> 地址链接</h2><p><strong>管理后台预览</strong>：http://preview.ballcat.cn</p><blockquote><p>admin / a123456</p></blockquote><p><strong>代码生成器预览</strong>：http://codegen.ballcat.cn/</p><p><strong>文档地址</strong>：http://www.ballcat.cn/</p><h1 id="ballcat-1" tabindex="-1"><a class="header-anchor" href="#ballcat-1" aria-hidden="true">#</a> ballcat</h1><p>本仓库存放了 BallCat 提供的所有的基础 Jar 包。</p><p>如 <code>ballcat-admin-core</code> 依赖，用户引入此依赖并配合核心 SQL，即可获得用户管理，OAuth2，权限控制，字典等等后台管理相关的基础功能。</p><p><code>ballcat-admin-websocket</code> 依赖，用户引入后，后台管理即可获得 websocket 能力，对公告、字典、弹出选择框的修改可以及时通知到前端</p><p><code>ballcat-admin-i18n</code> 依赖，用户引入后，并执行对应的初始化 SQL，即可获得国际化的能力</p><p><code>ballcat-spring-boot-starter-datascope</code> 依赖，用户引入后，根据自己的业务进行定制，即可获得数据权限控制的能力</p><p>······ 等等</p><h2 id="项目结构" tabindex="-1"><a class="header-anchor" href="#项目结构" aria-hidden="true">#</a> 项目结构</h2><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>.
|-- ballcat-admin			-- 管理后台相关项目
|   |-- ballcat-admin-core              -- 后台管理核心模块（权限控制，字典，Oauth2等）
|   |-- ballcat-admin-i18n				-- 国际化使用方案
|   \`-- ballcat-admin-websocket			-- 后台管理 websocket 支持插件（公告和字典等同步）
|-- ballcat-common			-- 基础公用组件
|   |-- ballcat-common-core				-- 核心组件
|   |-- ballcat-common-desensitize		-- 脱敏基础组件
|   |-- ballcat-common-i18n				-- 国际化基础组件
|   |-- ballcat-common-idempoten		-- 幂等基础组件
|   |-- ballcat-common-log		        -- 日志基础组件
|   |-- ballcat-common-model			-- 公用的一些模型
|   |-- ballcat-common-redis			-- redis基础组件
|   |-- ballcat-common-security			-- 安全相关，以及资源服务器配置
|   |-- ballcat-common-util				-- 公用的工具
|   \`-- ballcat-common-websocket		-- 对于 spring websocket 的一些抽象封装
|-- ballcat-dependencies	-- ballcat项目本身各子模块的依赖管理，以及第三方模块的依赖管理
|-- ballcat-extends			-- 扩展模块，大多是对于一些第三方组件的扩展处理
|   |-- ballcat-extend-dingtalk			-- 钉钉的一些操作封装
|   |-- ballcat-extend-kafka			-- kafka 的一些操作扩展
|   |-- ballcat-extend-kafka-stream		-- kafka 流处理的一些操作扩展
|   |-- ballcat-extend-mybatis-plus		-- 基于 mybatis-plus 相关的一些扩展
|   |-- ballcat-extend-pay-ali			-- 针对支付宝支付的一些操作封装
|   |-- ballcat-extend-pay-virtual		-- 针对虚拟货币支付的一些操作封装
|   |-- ballcat-extend-pay-wx			-- 针对微信支付的一些操作封装
|   \`-- ballcat-extend-redis-module		-- redis module 的扩展功能（暂时只有布隆过滤器）
|-- ballcat-starters        -- 对于各种能力的增强 starter, 这些 starter 与业务无关，非 ballcat 项目都可引入使用
|   |-- ballcat-spring-boot-starter-datascope	-- 数据权限控制
|   |-- ballcat-spring-boot-starter-dingtalk	-- 钉钉集成工具
|   |-- ballcat-spring-boot-starter-easyexcel	-- 通过注解快速导入导出excle（easyexcel）
|   |-- ballcat-spring-boot-starter-i18n		-- 国际化方案
|   |-- ballcat-spring-boot-starter-job			-- 定时任务集成（目前仅xxl-job）
|   |-- ballcat-spring-boot-starter-kafka		-- 消息队列 kafka 集成
|   |-- ballcat-spring-boot-starter-log			-- 访问日志，操作日志，TraceId注入
|   |-- ballcat-spring-boot-starter-mail		-- 邮件发送
|   |-- ballcat-spring-boot-starter-oss			-- 对象存储（所有支持 AWS S3 协议的云存储，如阿里云，七牛云，腾讯云）
|   |-- ballcat-spring-boot-starter-pay			-- 支付相关
|   |-- ballcat-spring-boot-starter-redis		-- 提供注解使用redis, 分布式锁，防击穿，全局key前缀等功能
|   |-- ballcat-spring-boot-starter-sms			-- 短信接入 starter
|   |-- ballcat-spring-boot-starter-swagger		-- swagger文档配置（提供无注册中心的文档聚合方案）
|   |-- ballcat-spring-boot-starter-websocket	-- 基于 common-websocket 的自动配置
|   \`-- ballcat-spring-boot-starter-xss			-- xss 防注入相关
|
|
|-- ballcat-i18n			-- 国际化模块（业务），提供了国际化信息配置的动态加载能力
|   |-- ballcat-i18n-biz
|   |-- ballcat-i18n-controller
|   \`-- ballcat-i18n-model
|-- ballcat-log				-- 日志模块（业务），封装了基本的操作日志、访问日志、登录日志的保存查询等处理
|   |-- ballcat-log-biz
|   |-- ballcat-log-controller
|   \`-- ballcat-log-model
|-- ballcat-notify			-- 通知模块（业务），封装了公告信息部分功能（通知信息功能待扩展）
|   |-- ballcat-notify-biz
|   |-- ballcat-notify-controller
|   \`-- ballcat-notify-model
|-- ballcat-auth			-- auth 授权模块（业务），用于支撑 OAuth2 的授权服务器，集成了登录图像验证码，登录AES密码解密过滤器等相关功能
|   |-- ballcat-auth-biz
|   \`-- ballcat-auth-controller
|-- ballcat-system		    -- 系统模块（业务），封装了 RBAC 权限控制相关功能，以及组织机构功能
|   |-- ballcat-system-biz
|   |-- ballcat-system-controller
|   \`-- ballcat-system-model
\`-- doc  	 -- 初始化数据库脚本


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="快速搭建" tabindex="-1"><a class="header-anchor" href="#快速搭建" aria-hidden="true">#</a> 快速搭建</h2><p>参看官方文档 http://www.ballcat.cn/guide/quick-start.html</p><h2 id="交流群" tabindex="-1"><a class="header-anchor" href="#交流群" aria-hidden="true">#</a> 交流群</h2><p>群已达人数上限，可以扫右边我的个人微信二维码，或者添加我的微信号 <code>Hccake_</code>，我再邀请你入群</p><img src="https://hccake-img.oss-cn-shanghai.aliyuncs.com/ballcat/wechat-hccake.jpg" alt="微信" width="35%">`,29),c=[n];function d(s,r){return a(),l("div",null,c)}const o=t(i,[["render",d],["__file","index.html.vue"]]);export{o as default};
