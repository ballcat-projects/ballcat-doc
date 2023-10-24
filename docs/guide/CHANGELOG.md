# 更新日志

## [1.x 版本 Redis 全局前缀失效问题]

1.x 版本 ballcat 切换了默认的验证码为 tianai，而 tianai-captcha 的自动配置中直接 import 了 SpringBoot Redis 的自动配置类，
导致 Ballcat Redis 的自动配置被覆盖，现在需要将配置添加到启动服务中，以提高 Bean 的优先级。

参考配置文件如下：
```java
import com.hccake.ballcat.common.redis.prefix.IRedisPrefixConverter;
import com.hccake.ballcat.common.redis.serialize.PrefixJdkRedisSerializer;
import com.hccake.ballcat.common.redis.serialize.PrefixStringRedisSerializer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
* @author hccake
*/
@RequiredArgsConstructor
@Configuration(proxyBeanMethods = false)
public class RedisConfiguration {

   private final RedisConnectionFactory redisConnectionFactory;

   @Bean
   public StringRedisTemplate stringRedisTemplate(IRedisPrefixConverter redisPrefixConverter) {
       StringRedisTemplate template = new StringRedisTemplate();
       template.setConnectionFactory(redisConnectionFactory);
       template.setKeySerializer(new PrefixStringRedisSerializer(redisPrefixConverter));
       return template;
   }

   @Bean
   public RedisTemplate<Object, Object> redisTemplate(IRedisPrefixConverter redisPrefixConverter) {
       RedisTemplate<Object, Object> template = new RedisTemplate<>();
       template.setConnectionFactory(redisConnectionFactory);
       template.setKeySerializer(new PrefixJdkRedisSerializer(redisPrefixConverter));
       return template;
   }
}
```

## [1.4.1] 2023-10-23

### ⭐ Features

#### Redis
- :sparkles: 添加 DistributedLock 在获取锁失败时可以进行自旋重试的能力。
- :sparkles: @Cached 注解默认进行 3 次自旋尝试，可通过属性 retryCount 进行修改。

## [1.4.0] 2023-05-31

### 💛 Warning

- TraceId 过滤器从日志模块迁移到了 ballcat-spring-boot-starter-web 模块中
- TraceId 请求响应头的 name 修改为可配置，默认值为 `X-Trace-Id`，之前为 `traceId`，注意调整代码或修改配置（ballcat.web.trace-id-header-name）

### ⭐ Features

#### 日志模块
- :sparkles: (Log) 新增 `ballcat.log.access.filter-order` 用于配置访问日志的过滤器优先级，默认值 -1000
- :art: (Log) 默认的访问日志处理器，抽取请求响应体是否应该记录的判断方法，方便用户继承重写
- :recycle: 重构 TraceId 相关代码
  - 迁移 TraceIdFilter 到 web 模块中
  - TraceId 先从请求头中读取，没有的话再进行生成
  - TraceId 响应头的 name 修改为可配置，默认值为 X-Trace-Id
  - 抽取 TraceIdGenerator 接口，方便用户覆盖默认的 TraceId 生成逻辑

#### OAuth2
- :zap: 优化资源所有者授权模式登陆时的错误提示信息

#### 业务模块
- :pencil2: 错别字修正，登陆 -> 登录

### 🔨 Dependency
- :arrow_up: bump easyexcel from 3.1.5 to 3.3.2


## [1.3.0] 2023-05-23

### 💛 Warning

- 修改了 user 表中的字段名称, 使其更具规范性，sex -> gender, phone -> phone_number
- 修改了所有业务表的主键 id 类型，从 integer 调整为 long 类型

### ⭐ Features

#### 通用模块
涉及模块：**ballcat-common-core**、**ballcat-common-model**、**ballcat-common-util**
- :sparkles: 添加系统命令执行工具类
- :sparkles: 添加等待队列, 无限等待至队列中存在值
- :sparkles: 添加线程池工具类
- :sparkles: 添加布尔工具类
- :sparkles: 添加StopWatch用于计算执行耗时
- :zap: 切换动态定时器队列到线程安全队列

#### OAuth2
- :sparkles: (OAuth2) 抽象资源所有者授权模型，方便用户扩展登陆方式
- :bug: (OAuth2) fix refresh token 未持久化导致无法使用的问题
- :zap: 允许用户仅通过实现 OAuth2TokenResponseEnhancer 接口进行覆盖默认 Token 响应增强的行为
- :zap: 补充登陆时返回的用户信息，额外返回手机号、邮箱、性别

#### 数据权限
涉及模块：**ballcat-spring-boot-starter-datascope**
- :sparkles: (数据权限) DataPermissionUtils#executeWithDataPermissionRule 支持返回值

#### 钉钉通知
涉及模块：**ballcat-extend-dingtalk**
- :sparkles: 添加钉钉负载发送类

#### GRPC 
涉及模块：**ballcat-spring-boot-starter-grpc**
- :sparkles: 添加 grpc starter 模块

#### 业务模块
- :bug: **(System)** 修复组织架构返回未按sort字段进行排序的问题 (#252)
- :zap: **(System)**  增加角色code检测,防止新增已存在的code时直接返回数据库异常 (#253)
- :recycle: 所有业务表主键修改为 Long 类型
- :recycle: sys_user 表中 sex 字段改为 gender, phone 改为 phone_number

### 🔨 Dependency
- :arrow_up: **spring-boot** from 2.7.11 to 2.7.12
- :arrow_up: bump flatten-maven-plugin from 1.3.0 to 1.5.0
- :arrow_up: bump maven-compiler-plugin from 3.10.1 to 3.11.0
- :arrow_up: bump maven-resource-plugin from 3.3.0 to 3.3.1
- :arrow_up: bump maven-release-plugin from 3.0.0-M7 to 3.0.0
- :arrow_up: bump maven-javadoc-plugin from 3.4.1 to 3.5.0
- :arrow_up: bump maven-source-plugin from 3.2.1 to 3.3.0
- :arrow_up: bump spring-javaformat-maven-plugin from 0.0.38 to 0.0.39
- :pushpin: remove s3-transfer-manager, s3-transfer-manager is released and can manage it with s3-bom


## [1.2.0] 2023-05-10

### 💛 Warning

- 移除了 ballcat-auth 模块以及所有 spring-security-oauth2 的相关代码

### ⭐ Features

- :art: 授权服务器和资源服务器配置切换到 `SecurityFilterChain`
- :fire: 移除授权服务器中的 `AuthenticationManagerConfiguration`
- :zap: (OAuth2) 密码模式改为直接使用 `DaoAuthenticationProvider` 进行认证操作，避免 `AuthenticationManager` 与 `Provider` 之间的循环依赖
- :sparkles: (OSS) 新增 `ballcat.oss.chunked-encoding` 配置，用于控制是否进行分块传输，默认为 false (#250)


## [1.1.0] 2023-04-24

### 💛 Warning

- 数据权限中 `DataScope` 不兼容更新，getTableNames 修改为 includes
- Redis 组件中的 `ballcat.redis.locked-time-out` 配置修改为`ballcat.redis.default-lock-timeout` 并修改默认值为 10s
- spring-javaformat 新版本优化了链式调用代码的格式化，更新后重新 format 代码，会导致大量文件更新。
- 授权服务器的登录验证码开关默认值切换为 false，开启了验证码校验的注意修改对应配置为 true.
- ballcat-admin-core 模块不再默认开启资源服务器的配置，需要用户在自己的配置类上手动添加 `@EnableOauth2ResourceServer` 注解。
- ballcat-admin-core 不再传递授权服务器的依赖，用户根据自己的需要在配置类上添加对应的注解，以及 pom.xml 中引入对应的依赖：
  - 切换到 spring authorization server
    ```xml
          <!-- 基于 spring authorization server 的授权服务器 -->
        <dependency>
            <groupId>com.hccake</groupId>
            <artifactId>ballcat-spring-security-oauth2-authorization-server</artifactId>
        </dependency>
    ```
    添加注解 `@org.ballcat.springsecurity.oauth2.server.authorization.annotation.EnableOauth2AuthorizationServer`

  - 或者继续使用 spring-oauth2
    ```xml
             <!-- 已废弃，基于 spring oauth2 的授权服务器 -->
         <dependency>
             <groupId>com.hccake</groupId>
             <artifactId>ballcat-auth-controller</artifactId>
             <scope>provided</scope>
         </dependency>
    ```
    添加注解 `@com.hccake.ballcat.auth.annotation.EnableOauth2AuthorizationServer`

- spring authorization server 的登陆和退出端点变更为 `/oauth2/token` 和 `/oauth2/revoke`，请求方式也略有不同，请注意同步前端更新

### ⭐ Features

#### 全局
- :fire: 移除 dynamic-datasource 和 jasypt 等未在 ballcat 仓库中直接使用的第三方工具的版本管理
- :sparkles: 版本统一由ballcat-dependencies模块管理,顶级父工程不再重复管理
- :rotating_light: 处理部分 SonarLint Error



#### OAuth2 授权服务器
涉及模块：**ballcat-spring-security-oauth2-authorization-server**

- :sparkles: 使用 accessTokenResponseHandler 方式配置 token 增强，方便作用于所有的 grant_type
- :zap: 授权服务器的登录验证码开关默认值设置为 false
- :sparkles: 提供默认的 `BallcatOAuth2TokenCustomizer`，方便做远程 token 自省
- :sparkles: (授权服务器) 不再自动配置，改为使用 `@EnableOauth2AuthorizationServer` 注解显式开启
- :sparkles: 添加 `AnonymousForeverAuthenticationProvider`，用于在使用错误 token 的访问资源时不终止流程，而是切换身份到匿名用户访问
- :white_check_mark: (OAuth2) 添加授权服务器部分功能的单元测试
- :sparkles: 提供了 `OAuth2AuthorizationObjectMapperCustomizer` 类，方便用户扩展 OAuth2Authorization 的序列化逻辑


#### OAuth2 资源服务器：

涉及模块：**ballcat-spring-security-oauth2-resource-server**
- :zap: (资源服务器) 远程不透明令牌自省器从 nimbus 实现迁移到 spring 实现，并移除 nimbus 依赖
- :zap: (资源服务器) 优化远程自省时解析的 attributes，只保留必要属性
- :zap: 删除手动指定鉴权管理器操作，开启资源服务器后默认会创建




#### 后台管理模块
- :bug: fix 角色分页查询条件错误添加了 code 的问题




#### 通用模块
涉及模块：**ballcat-common-core**、**ballcat-common-model**、**ballcat-common-util**
- :recycle: BooleanEnum 重构, 同时管理 boolean 类型和对应的 int 类型值, 使用包装类, 方便与包装类进行 equals 判断, 避免拆箱的空指针
- :recycle: 重载部分R对象方法
- :art: 精简依赖范围 ballcat-common-util 的依赖 hutool-extra 缩小为 hutool-core
- :sparkles: 添加 array 工具类
- :sparkles: 添加https部分静态实现
- :bug: 修复 AbstractQueueThread 线程被中断的情况下, 未正确调用 shutdown 方法的问题
- :zap: 补充部分工具类
- :sparkles: 添加spring 环境工具类
- :sparkles: 添加LocalDateTime工具类
- :zap: markdown支持代码写入
- :sparkles: 添加指定动态休眠的定时器



#### 脱敏工具
涉及模块：**ballcat-common-desensitize**
- :zap: Holder 中的数据存储从静态常量修改为实例属性
- :white_check_mark: 修复在不同顺序下执行测试用例导致结果不同的问题



#### IP 组件
涉及模块：**ballcat-spring-boot-starter-ip2region**
- :sparkles: Ip工具类添加两个静默查询方法



#### Redis 组件
涉及模块：**ballcat-common-redis**、**ballcat-spring-boot-starter-redis**
- :sparkles: 缓存锁添加几个超时时间的重载方法，方便用户自己控制锁释放时间
- :recycle: 分布式锁使用spring内置断言替代hutool断言
- :zap: `ballcat.redis.locked-time-out` 配置修改为`ballcat.redis.default-lock-timeout` 并修改默认值为 10s
- :zap: CacheLock 类移动到 lock 包下，同时移除内部 redisTemplate 的引用，改为使用 RedisHelper
- :sparkles: redis 支持对redis的新增、修改、删除、过期的监听




#### 数据权限
涉及模块：**ballcat-spring-boot-starter-datascope**
- :sparkles: 新增 `DataPermissionUtils#executeAndIgnoreAll` 方法，方便忽略数据权限进行方法执行

- :boom: `DataScope` 使用 `includes` 方法替换原 `getTableNames` 方法，以便支持更加多元化的方式来判断是否需要控制当前表



#### mybatis
涉及模块：**ballcat-extend-mybatis-plus**
- :sparkles: LambdaQueryWrapperX#isPresent 添加对 Optional 和 Map 的判空支持



#### NTP 服务
涉及模块：**ballcat-extend-ntp**
- :sparkles: 添加ntp模块, 添加 NtpCn 类便于国内使用



#### 钉钉通知
涉及模块：**ballcat-extend-dingtalk**
- :zap: 钉钉消息发送模块请求工具转为okhttp
- :bug: 修复 MarkDown 引用文本换行异常
- :zap: MarkDown 添加支持多行引用文本的方法
- :white_check_mark: 添加钉钉消息发送测试用例



### 🔨 Dependency

- :arrow_up: **commons-net**  from 3.8.0 to 3.9.0
- :arrow_up: **springdoc-openapi** from 1.6.13 to 1.7.0
- :arrow_up: **spring-boot** from 2.7.6 to 2.7.11
- :arrow_up:  **easyexcel** from 3.1.2 to 3.1.5
- :arrow_up:  **hutool** from 5.8.10 to 5.8.16
- :arrow_up:  **mybatis-plus** from 3.5.2 to 3.5.3.1
- :arrow_up:  **spring-authorization-server** from 0.4.0 to 0.4.2
- :arrow_up:  **spring-javaformat** from 0.0.35 to 0.0.38
- :arrow_up:  **xxl-job** from 2.3.1 to 2.4.0
- :arrow_up:  **lombok** from 1.18.24 to 1.18.26
- :arrow_up: **ip2region** from 2.6.6 to 2.7.0




## [1.0.3] 2022-12-05

### 💛 Warning

此版本移除了 ballcat 的 pom 中配置的 maven resource filter 控制，会导致 application.yml 中的 `@profiles.active@`
等占位符无法正确解析替换，注意在自己项目的 pom.xml 中添加对应的 maven resource filter 配置。

配置方式参看: [Maven 占位符配置](/guide/other/maven-resource-filter.html)

### ⭐ Features

#### 全局
- :fire: 移除 ballcat pom.xml 中对于 maven resource 的过滤配置，交由项目自己控制
- :rotating_light: fix some java doc warning
- :construction_worker: 明确指定 **maven-surefire-plugin** 插件的版本以及执行的字符集为 UTF-8
- :construction_worker: 取消 maven 编译插件编译时跳过 test class 的配置
- :white_check_mark: 修复单元测试在 maven test 命令时不执行或者执行报错的问题

#### 定时任务组件
涉及模块：**ballcat-spring-boot-starter-job**
- :bug: (定时任务) 修复xxl-job执行器存在默认名称导致自动注册spring应用名失败

#### IP 组件
涉及模块：**ballcat-spring-boot-starter-ip2region**
- :bug: 修复用户在启用资源过滤的情况下 ip2region 数据文件损坏的问题

#### Redis 组件
涉及模块：**ballcat-common-redis**、**ballcat-spring-boot-starter-redis**
- :zap: 明确指定下 Ballcat Redis 自动配置的顺序，需要在 spring-boot 的自动配置之前
- :bug: 修复 RedisHelper#setExAt 的过期时间设置不正确的问题
- :bug: 修复 RedisHelper#incrByAndExpire 序列化异常与 lua 脚本错误问题

#### 数据权限
涉及模块：**ballcat-spring-boot-starter-datascope**
- :sparkles: 添加只有 JOIN 关键字的连表 sql 处理支持
- :bug: 修复在排除部分 DataScope 后剩余的 DataScope 没有匹配中当前 sql，导致后续不排除 DataScope 再执行时跳过了数据权限的问题
- :bug: 修复在 DataScope 内部又进行了 SQL 查询导致数据权限控制递归调用时，导致的空指针问题

#### Excel 组件

涉及模块：**ballcat-spring-boot-starter-easyexcel**

- :sparkles: Excel 导出支持动态 sheet 数量，不必指定 sheet 属性
- :sparkles: Excel 导出支持指定 fill 填充模式
- :zap: 添加 `@ResponseExcel` 导出的校验：fill 属性必须配合 template 使用
- :sparkles: 添加 `EmptyHeadGenerator` 组件，用来忽略 excel 头生成
- :art: Excel 导出部分过期方法替换
- :bug: 修复 Excel 导出名称有空格时变成 + 号的问题
- :white_check_mark: 添加 Excel 基础功能的测试方法
- :white_check_mark: 添加导出时不写入头信息的单元测试用例


### 🔨 Dependency

- :arrow_up: **hutool** from 5.8.9 to 5.8.10
- :arrow_up: **ip2region** from 2.6.5 to 2.6.6
- :arrow_up: **s3** from 2.18.6 to 2.18.20
- :arrow_up: **spring-boot** from 2.7.5 to 2.7.6
- :pushpin: **spring-authorization-server** from 0.4.0-M2 to 0.4.0


## [1.0.1] 2022-11-16

### 💛 Warning

此版本移除了 `@EnableAccessLog` 和 `@EnableOperationLog` 注解，访问日志和操作日志将默认启用，用户可以使用
`ballcat.log.access.enabled=false` 和 `ballcat.log.operation.enabled=false` 配置来进行关闭

### ⭐ Features

- :sparkles: (Log) 使用配置替换注解来控制日志的开启和关闭
- :bug: 修复 MdcTaskDecorator 清除子线程 MDC 上下文时机不对
- :bug: 修复 LambdaAliasWrapper 构建嵌套条件时，生成的 SQL 条件对应值为 null 的问题
- :fire: 删除 AbstractIdTreeNode，防止用户使用不当造成一些一场问题

## [1.0.0] 2022-11-08

### 💛 Warning

- ~~**ballcat-auth**~~ 相关组件标记为过期，授权服务器将于下个版本切换到 **spring-authorization-server**
- OAuth2 授权码流程现在使用无状态登录，需要配合前端页面改动（注意升级前端页面）
- ~~`OssClient`~~ 过期，现在推荐使用 `OssTemplate` 组件
- oss 移除 `domain` 属性配置，可用 `endpoint` 属性配置替代，`endpoint` 属性配置兼容端点与自定义域名
- oss `endpoint` 属性配置需配置协议头，例如：`http://s3-cn-east-1.qiniucs.com`
- oss 移除 `rootPath` 属性配置(可用 `object-key-prefix` 属性配置替代)
- xxl-job 相关配置添加前缀 `ballcat`
- 日志组件的配置现在默认集成到 **ballcat-admin-core** 中，在不修改的默认实现的情况下无需自己添加配置类了
- ~~**ballcat-common-security**~~ 组件移除，部分类的包名有变动
- 验证码组件切换到了 tianai-captcha，如果想继续使用原 anji-captcha, 注意前后端验证码相关代码都不要改动

### ⭐ Features

#### 全局优化

- :rotating_light: fix some javadoc warning
- :green_heart: 移除 git 换行符配置避免， git 换行符处理导致的 jpg 文件损坏
- :pushpin: 统一使用 jakarta 替换 javax
- :zap: 优化 maven 依赖配置：
    - 移除 `spring-boot-configuration-processor` 的依赖传递
    - 清理 IDEA 自动生成的部分无用配置
    - 格式化 pom 文件，依赖、模块引入等按照字母顺序排列

#### 业务模块

- :bug: **(Notify)**   修复可以查询到已删除公告的问题
- :bug: **(System)** 修复多管理员同时删除角色造成的空指针问题
- :zap: **(System)**  对字典的新建修改添加校验
- :sparkles: **(System)** 允许用户新建菜单时不指定 id, 而是使用自增的方式 (gh-220)
- :zap: **(System)** 字典项修改时状态可以不传

#### ballcat-admin-core

:sparkles: 内置默认的日志配置类，并根据当前使用的授权服务器注入不同的登陆处理器

#### Redis 组件

涉及模块：**ballcat-common-redis**、**ballcat-spring-boot-starter-redis**

- :sparkles: `@CacheDel` 注解增强为可重复注解
- :sparkles: `RedisHelper` 几个带过期时间的方法添加过期时间单位支持
- ✨ `@CacheDel` 注解添加 `allEntries` 属性，支持删除同一个命名空间下所有相关key

#### mybatis-plus 相关

涉及模块：**ballcat-extend-mybatis-plus**

- :sparkles: `WrapperX` 组件新增  `lambdaUpdate` 方法

#### OpenAPI 组件

涉及模块：**ballcat-extend-openapi**

- :bug: fix 在 webflux 环境下无法启动的问题

#### ballcat-common-core

- :sparkles: 添加上下文组件, 以及上下文组件接入 spring
- :art: 现有线程顶级类使用上下文组件的方式接入 spring
- :sparkles: `SpringUtils` 添加一个 publishEvent 发布事件方法
- :sparkles: validate 注解支持使用 {} 替换非占位符的 default message

#### ballcat-common-model

- :art: `SystemResultCode` 添加部分常用状态码
- :art: 修改 SelectData 属性 extendObj 为 attributes

#### ballcat-common-util

- :art: 修改 TreeNode 定义，使用 key 和 parentKey 做为父子节点的关联属性，更普适化
- :sparkles: 添加 TreeUtils#forEachDFS 方法，深度优先遍历树节点

#### IP 组件

- :sparkles: 添加 `ballcat-spring-boot-starter-ip2region` 模块，方便快速集成 `Ip2region`

#### 定时任务组件

涉及模块：**ballcat-spring-boot-starter-job**

- :boom: 调整 xxl-job 配置添加 ballcat 前缀
- :recycle: 优化 xxl-job 的自动配置
- :fire: 移除 `@EnableXxlJob` 注解, 用户现在可以通过 `ballcat.xxl.job.enabled` 为 `false` 来关闭 xxl-job 的使用

#### 幂等组件

涉及模块：**ballcat-common-idempotent**、**ballcat-spring-boot-starter-idempotent**

- :sparkles: 添加幂等组件 starter
- :recycle: 抽象幂等 key 前缀生成器
- :recycle: 优化幂等插件包结构
- :truck: `KeyGenerator` 接口修改为 `IdempotentKeyGenerator`, 防止自动配置和别的组件的 keyGenerator 重名导致的注册失败

#### OSS 组件

涉及模块：**ballcat-spring-boot-starter-oss**

- :boom: 重新实现的 OSS 操作，部分兼容老版API，并补全许多 S3 原生操作封装支持
- :boom: oss 移除 `domain` 属性配置(可用 `endpoint` 属性替代, `endpoint` 兼容端点与自定义域名)
- :boom: oss `endpoint` 属性配置需配置协议头
- :boom: oss 移除`rootPath`属性配置 (可用 `object-key-prefix` 属性配置替代)
- :sparkles: oss 新增`enabled`属性配置，用于控制oss是否启用
- :sparkles: 新增 `OssTemplate` 组件，用以替代原 `OssClient` 组件
- :sparkles: 新增 `ObjectWithGlobalKeyPrefixOssTemplate` 支持原 OssClient 中配置的全局 key 前缀

#### Security 相关

- :recycle: 对 `ballcat-common-security` 模块进行拆分
- :sparkles: 添加 `ballcat-security-core` 模块，验证码 validator 迁入此模块方便复用
- :fire: 移除过时的忽略鉴权路径，使用 `ballcat.security.oauth2.resourceserver.ignore-urls` 配置
- :zap: `AuthenticationManager` 交由授权服务器注册

#### ballcat-auth

- :zap: 密码解密判断在非密码模式下直接跳过
- :sparkles: 使用 scope 来控制客户端是否跳过验证码以及密码解密
- :art: 客户端登录验证 client id 和 client secret
- :fire:  移除弃用的测试客户端判断方法
- :recycle: 表单登录的配置从资源服务器迁移到授权服务器
- :art: 缩小 auth 模块的包扫描范围
- :sparkles: 对于授权码流程使用 STATELESS 无状态登录模式

#### Excel 模块

涉及组件：**ballcat-spring-boot-starter-excel**

- :sparkles: `DefaultAnalysisEventListener` 添加 set 方法，便于 excel 导入时指定表头行数
- :sparkles: `@RequestExcel` 注解添加 headRowNumber 属性方便指定 Excel Head 行数
- :adhesive_bandage: 临时使用覆盖 class 的方式修复 easyexcel 导入 excel 时，在 Listener 的 invokeHead 中修改头信息不生效的问题

#### Web 相关

涉及模块：**ballcat-spring-boot-starter-web**

- :rewind: 为了兼容部分客户端软件，回退使用 `application/json;charset=UTF-8` 的 `content-type`
- :bulb: 修复 `PageParamArgumentResolverSupport` 类中一个错误的注释
- :sparkles: 异常通知支持同时发送给多个渠道, 旧配置方法过期
- :fire: 移除无用的 `additional-spring-configuration-metadata.json` 文件
- :zap: 优化 `SpringUtils` 中的 ApplicationContext 注入时机

#### 日志组件

涉及模块：**ballcat-common-log**、**ballcat-spring-boot-starter-log**

- :art: 提高 access log filter order，以便在 security filter chain 之前调用
- :zap: LoginLogUtils 抽取
- :sparkles: 内置默认的日志配置类，并根据当前使用的授权服务器注入不同的登陆处理器
- :fire: 移除 LogUtils 中无用代码

### 🔨 Dependency

- :pushpin: 使用 springdoc-openapi bom 进行相关依赖管理

- 依赖：

    - 【修改】使用 jakarta 相关依赖替换 javax
    - 【升级】awssdk from 2.18.2 to 2.18.6
    - 【升级】easyexcel from 3.1.1 to 3.1.2
    - 【升级】flatten-maven-plugin from 1.2.5 to 1.3.0
    - 【升级】hutool from 5.8.5 to 5.8.9
    - 【升级】jsoup from 1.15.2 to 1.15.3
    - 【升级】swagger from 1.5.21 to 1.6.8
    - 【升级】swagger-v3 from 2.2.0 to 2.2.4
    - 【升级】spring-boot from 2.7.3 to 2.7.5
    - 【升级】spring-security-oauth2 from 2.3.8.RELEASE to 2.5.2.RELEASE
    - 【升级】springdoc-openapi from 1.6.11 to 1.6.12

- 插件：

    - 【升级】spring-javaformat from 0.0.34 to 0.0.35
    - 【升级】maven-compiler-plugin from 3.8.0 to 3.10.1
    - 【升级】maven-source-plugin from 3.1.0 to 3.2.1
    - 【升级】maven-javadoc-plugin from 3.1.1 to 3.4.1
    - 【升级】nexus-staging-maven-plugin from 1.6.8 to 1.6.13

## [0.9.0] 2022-08-31

### ⭐ Features

#### Common 相关

涉及模块：**ballcat-common-core** **ballcat-common-util**

- :bug: 修复 `AbstractQueueThread` 中 getPollTimeoutMs 修饰符错误导致无法被子类覆写
- 🌟 新增系统工具类, 完善多个工具类方法.
- 🌟 新增 `AbstractTimer` 定时器线程
- :bug: 修复部分情况下, 临时文件夹被删除导致文件处理失败

#### WebSocket 相关

涉及模块：**ballcat-common-websocket** **ballcat-spring-boot-starter-websocket**

- ⚡ 减少获取 sessionKey 时发生 NPE 的可能性

- 🌟 新增使用 `RocketMQ` 做为消息分发器的相关代码

#### Redis 相关

涉及模块：**ballcat-common-redis** **ballcat-spring-boot-starter-redis**

- ⚡ 优化 `CacheLock` 的 RedisScript 使用单例模式，防止产生不同的 sha 值
- ♻ `RedisHelper` 方法名重构，命名规则修改参考 redis 原生命令
- 🌟 `RedisHelper` 添加 `Stream` 流相关使用方法以及其他数据结构的常用方法

#### OpenAPI 文档

涉及模块：**ballcat-extend-openapi**

- 🐛 修复 swagger-ui 中分页查询 sort 参数无法添加多个的问题
- 🐛 修复 sort 的正则中.未加转义字符，导致校验不严谨的问题
- 🐛 修复使用 jar 包运行时无法正确显示分页参数的问题

#### Log 日志相关

涉及模块：**ballcat-common-log**  **ballcat-log-biz** **ballcat-spring-boot-starter-log**

- :zap: 操作日志相关注解的 type 属性从枚举修改为 int，方便用户扩展
- :zap: 只在用户名密码方式鉴权失败时进行登录失败的日志记录

#### mybatis 相关

涉及模块：**ballcat-extend-mybatis-plus**

- 🐛 修复 EnumNameTypeHandler 为默认枚举类型处理器时 处理实现IEnum的枚举值获取异常

### 🔨 Dependency

- 【升级】spring-boot from 2.7.1 to 2.7.3
- 【升级】jsoup from 1.14.3 to 1.15.2
- 【升级】hutool from 5.8.3 to 5.8.5
- 【升级】springdoc-openapi from 1.6.9 to 1.6.11
- 【升级】spring-javaformat from 0.0.31 to 0.0.34
- 【升级】mapstruct from 1.4.2.final to 1.5.2.final

## [0.8.0] 2022-07-12

### ⚠ Warning

- 分页参数的默认参数名修改为 page，前端注意对应更新, 也可以通过配置 `ballcat.pageable.page-parameter-name` 修改为之前版本的参数名
  current
- 验证码 anji-captch 相关的配置以及依赖移除，用户根据自己需求按需添加。（相关代码示例，在 ballcat-admin-sample 和
  ballcat-boot 模板仓库中可以查看）
- `UpmsProperties` 更名为 `SystemProperties`, `ballcat.upms` 下指定超级管理员的 id 和 username
  的配置，移动到 `ballcat.system` 下了
- 分页上限配置 `ballcat.web.max-page-size` 现在改为 `ballcat.pageable.max-page-size`

### ⭐ Features

#### 全局调整

- 🎨 使用 `@SneakyThrows` 注解使用时显示指定异常类型
- 🌟 全局 starter 支持 **spring-boot 2.7.x** 后使用的  **AutoConfiguration.imports** 的方式进行自动配置的加载  
  （目前依然兼容低版本 springboot 使用 spring.factories 的自动注册方法）

#### 短信相关改动 ballcat-spring-boot-starter-sms

- 🌟 整合 aliyun 短信服务
- 🌟 调整腾讯云 sdk 版本，解决与 aliyun 依赖冲突问题

#### 文件上传 ballcat-spring-boot-starter-file

- 🎨 FTP 文件上传切换使用 hutool 工具类实现
- 🐞 修复本地文件上传时返回的路径错误问题
- ♻ 重构 File 模块的代码结构

#### 国际化 ballcat-i18n

- 🐞 修复 `I18nData` 的 resultMap 中，字段 remark 多加了一个 s 的问题
- 🌟 `@I18nField` 注解的 code 值支持使用 **SPEL 表达式**
- 🌟 添加 `@I18nIgnore` 注解，可以添加在 controller 的方法上，用于指定忽略 I18n 处理

#### 数据权限 ballcat-spring-boot-starter-datascope

- ⚡ 优化 `DataPermissionRule` 的构建方式，添加有参构造，以及支持链式调用
- ⚡ 将编程式数据权限控制的方法从 `DataPermissionHandler` 的实例方法，抽取为 `DataPermissionUtils` 的一个静态方法，使用更加简单便捷
- 🐞 修复在 `DataScope` 中执行 sql 导致嵌套执行拦截器，出现匹配计数空指针的问题
- ✅ add jsqlparse table alias test

#### 密码相关 **ballcat-system** **ballcat-auth** **ballcat-common-security**

- 🌟 系统用户新建和修改密码时使用 **PasswordEncoder** 进行加密处理，方便使用者更换密码算法
- 🌟 系统用户的密码正则规则支持使用 yml 配置进行自定义：`ballcat.system.password-rule`
- 🔥 移除 `PasswordUtils` 的 `encode` 以及 `matches` 等方法，防止用户错误使用.
- 🎨 `PasswordUtils#createDelegatingPasswordEncoder` 修改为 public 方法，方便外部调用
- 🎨 优化下修改密码时，密码异常的错误提示

#### 分页查询相关 ballcat-spring-boot-starter-web **ballcat-common-model**

- 🌟 排序参数兼容使用尾缀 `[]` 的方式进行传参，例如 `sort` 和 `sort[]` 都可以做为排序参数
- 🎨 默认的当前页参数由 current 修改为 page，后续版本中将移除 PageParam 的 current 属性
- 🌟 分页参数支持自定义参数名:
  ```yaml
  ballcat:
    pageable:
      page-parameter-name: page # 不想改动前端，这里可以修改为 current
      size-parameter-name: size
      sort-parameter-name: sort #同时会自动支持尾缀[]的参数形式，如 sort[]
      max-page-size: 100
  ```

#### OpenAPI 文档 ballcat-extend-openapi

- 🌟 添加对于动态分页参数的支持，会自动根据配置进行切换文档中的分页查询属性  
  （在引入了 **ballcat-spring-boot-starter-web** 的情况下）

#### Redis 相关

- 🌟 缓存/缓存更新注解增强: 增加时长单位

#### mybatis-plus-extend

- 🐞 修复 `LambdaAliasQueryWrapperX` 嵌套构建条件语句时别名丢失的问题
- ✅ 添加 `LambdaAliasQueryX` 的测试用例
- 🎨 `OtherTableColumnAliasFunction` 类更名为 `ColumnFunction`
- 🌟 添加 `ColumnFunction#create` 方法，在进行连表查询时，构建第三方表的列名更方便

#### 校验 Validator

- 新增枚举以及值范围检验的自定义注解
    - `@OneOfStrings` 校验值是否是指定的字符串之一
    - `@OneOfInts` 校验值是否是指定的 int 值之一
    - `@OneOfClasses ` 校验值是否是指定的 class 类型之一
    - `@ValueOfEnum` 校验值是否满足于指定的 Enum

#### Xss 防注入相关 ballcat-spring-boot-starter-xss

- 🐞 修复反序列化时携带了错误的 json 可能出现的异常问题

#### 系统管理相关

- 🌟 添加用户新建和修改时的数据校验
- 🐞 修复用户新建时无法指定为锁定状态的问题

#### OAuth2 ballcat-auth-biz

- 🐞 修复客户端登录模式使用 from 传参不走自定义异常处理的问题
- 🌟 验证码校验逻辑抽象，方便用户切换验证码的底层依赖
- 🔥 移除了默认的 anji-captcha 相关的依赖以及配置，用户按需添加

### 🔨 Dependency

- 【移除】移除了对 spring-boot-admin 的依赖管理
- 【修改】取消 spring-boot-starter-web 强制剔除 tomcat 的配置，容器选择权交给用户
- 【升级】spring-boot from 2.6.6 to 2.7.1
- 【升级】kafka from 2.5.0 to 2.6.3
- 【升级】dynamic-datasource-spring-boot-starter from 3.5.0 to 3.5.1
- 【升级】hutool from 5.7.22 to 5.8.3
- 【升级】fastjson from 1.2.79 to 1.2.80
- 【升级】springdoc-openapi from 1.6.7 to 1.6.9
- 【升级】 mybatis from 3.5.9 to 3.5.10
- 【升级】 mybatis-plus from 3.5.1 to 3.5.2
- 【升级】 xxl-job from 2.3.0 to 2.3.1
- 【升级】easyexcel from 3.0.5 to 3.1.1

## [0.7.1] 2022-04-19

依赖修复版本：**主要修复了 v0.7.0 版本 OpenAPI 依赖冲突的问题**

### ⭐ Features

**OpenAPI 相关改动** **ballcat-extend-openapi**

- 🐞 swagger-api 版本冲突，依赖管理 到 2.2.0，保持和 springdoc-openapi 一致

- 🔥 弃用 ~~ballcat.openapi.security-schemes~~ 配置，现在使用 `ballcat.openapi.components.security-schemes`

- 🔥 弃用 ~~ballcat.openapi.global-security-requirements~~，现在使用 `ballcat.openapi.security` 属性替代
- 🩹 修复部分属性 ide 中没有提示的问题

**Web 相关改动** **ballcat-spring-boot-starter-web**

- 🐞 修复 null 值序列化处理不支持 @JsonInclude 注解的问题
- ✅ 添加 jackson null 值序列化器的测试用例
- 🌟 异常通知消息添加 RequestURI 的信息输出
- 🌟 全局异常日志打印请求URI

## [0.7.0] 2022-04-13

### :warning: Warning

- 此版本操作日志表有字段新增，升级前注意**先执行对应的增量 SQL**

- 访问日志的忽略 url 现在只需填写 servlet 内的路径了，升级后请注意调整，防止失效

- openapi 的配置文件调整:

    - 现在文档基本信息的属性添加了一个 info 的前缀

    - 安全相关配置 ~~`ballcat.openapi.global-security-requirements`~~
      弃用，使用 `ballcat.openapi.components.security-schemes`

- WebSocket 组件中的 `AbstractJsonWebSocketMessage` 改名为 `JsonWebSocketMessage`，升级时如遇到 class import 失败，请注意对应修改类名

- **由于 spring-javaformat 组件的升级，现在如果在 jdk8 环境下，请在项目跟目录新建一个名为 `.springjavaformatconfig`
  的文件**，文件内容如下：
  ```
  java-baseline=8
  ```

### ⭐ Features

#### **日志相关改动** **ballcat-common-log** **spring-boot-starter-log**

- 🌟 访问日志的忽略 url 现在只需填写 servlet 内的路径了
- 🌟 操作日志注解增强：用户可以指定是否记录当前操作方法的参数和返回值
- 🐞 抛 `BusinessException` 异常时，日志记录丢失 `traceId` 的问题
- 🐞 `CustomAccessLogHandler#getParams` 改变不可变的 parameterMap 集合问题
- 🐞 修复公告图片上传时的操作日志记录异常问题

#### **国际化** **ballcat-common-i18n**

- 🌟 优化下细节：在 i18n 处理失败时，也正常响应

#### web 服务 **ballcat-spring-boot-starter-web**

- 🌟 actuator 拦截器现在只在引入了 actuator 时开启，且拦截地址跟随 actuator 的 base-path 配置
- 🐞 修复默认配置下仅引入 ballcat-spring-boot-starter-web 时启动异常的问题

#### **分页查询调整** **ballcat-common-core**

- 🌟 分页参数 `PageParam` 的 valid 校验支持
- 🌟 `PageParam` 分页条数上限可通过配置 `ballcat.web.page-size-limit` 动态修改，默认值 100
- 🌟 所有分页接口，添加 PageParam 的入参校验
- 🌟 支持带表别名的排序列
- 🌟 分页查询新增参数 sort 设置排序规则，格式为：property(,asc|desc)，支持传入多个排序字段

#### 缓存工具 **ballcat-spring-boot-starter-redis**

- 🌟 redis 相关 bean 添加 @ConditionalOnMissBean 注解，方便用户替换
- 🌟 `RedisHelper` 工具类添加 zset 的基本操作
- 🐞 修复在没有配置 `ballcat.redis.key-prefix` 属性时启动报错的问题

#### 系统管理 **ballcat-system**

- 🌟 组织机构树查询支持模糊查询名称
- 🌟 新增组织机构列表查询
- 🌟 菜单和组织机构的筛选都移交到前端处理了
- 🎨 解耦 system 和 websocket 模块（notify 解耦未完成，后续重构通知时处理）

#### **Tree** 工具相关改动 **ballcat-common-util**

- 🌟 `TreeUtils` 新增剪枝方法 `pruneTree`
- 🌟 `TreeUtils` 泛型调整
- 🎨 `SimpleTreeNode.getChildren` 方法重写，方便直接获取对应的类型数据

#### 数据权限组件 **ballcat-spring-boot-starter-datascope**

- 🐞 修复 `DataPermissionAnnotationHolder` 只清空了 deque，没有 remove 的问题
- 🌟 添加编程式数据权限规则控制支持，可与 `@DataPermission` 注解嵌套使用
  :::tip 数据权限规则优先级，由高到低：
    1. 编程式规则
    2. 当前方法的注解规则
    3. 当前类的注解规则
    4. 调用者使用的权限规则
    5. 全局默认规则
       :::

#### 长连接组件 **ballcat-common-websocket** **ballcat-spring-boot-starter-websocket**

- 🌟 优化下 UserSessionKeyGenerator 的 Conditional 判断，方便用户替换
- 🌟 WebSocket 的 session 存储角色，从 `WebSocketSessionHolder` 修改为 `WebSocketSessionStore`
- 🌟 现在不再默认覆盖同一 sessionKey 的 wsSession 了，方便用户进行全客户端推送
- 🌟 新增`AbstractMessageDistributor`， 将`MessageDistributor`的 default 方法下沉到该抽象类中
- 🌟 跨域配置添加 `allowed-origin-patterns` 属性
- 🌟 添加 SockJs 的支持
- 🎨 优化下 `RedisMessageListener` 的注册方式，防止误扫描导致的 bean 注册异常
- 🎨 优化 ballcat-spring-boot-starter-websocket 的配置类结构
- 🎨 精简代码层级，将接口 `JsonWebSocketMessage` 删除，原抽象类 `AbstractJsonWebSocketMessage`
  改名为 `JsonWebSocketMessage`

#### 幂等组件 ballcat-common-idemptent

- 🌟 幂等控制注解增强：可以指定消息单位以及幂等拦截时的错误提示了
- 🌟 幂等组件允许用户控制是否再异常时删除幂等标识，方便有些不允许重试的方法进行幂等控制
- ✅ 添加幂等组件的一些测试用例

#### 接口文档 ballcat-extend-openapi

- 🌟 添加部分 OpenAPI 配置
- 🌟 文档信息的配置下沉到 info 前缀下
- 🔥 属性 ~~`ballcat.openapi.global-security-requirements`~~
  弃用，可使用新增的 `ballcat.openapi.components.security-schemes` 进行配置

### 🐞 **Bug Fix**

- 🐞 调整 ProviderManager 的层级，以解决错误的 token 会触发两次鉴权失败异常的问题
- 🐞 修复 OSS 上传文件时不主动关闭临时的流. 导致大量文件上传时出现异常
- 🐞 公告信息分页查询 bug
- 🐞 fix jdk11 下打包异常的问题

### 🔨 Dependency Upgrades

- 【升级】spring-boot from 2.6.2 to 2.6.6，且后续使用官方 dependencies 进行依赖管理
- 【升级】spring-boot-admin from 2.6.0 to 2.6.6
- 【升级】spring-javaformat from 0.0.29 to 0.0.31
- 【升级】hutool from 5.7.12 to 5.7.19
- 【升级】mybatis-plus from 3.5.0 to 3.5.1
- 【升级】springdoc-openapi from 1.6.4 to 1.6.7
- 【升级】software.amazon.awssdk from 2.16.61 tp 2.17.154

## [0.6.0] 2022-01-20

### :warning: Warning

- Swagger2 相关注解迁移到 OpenAPI3，由于使用了 springdoc-openapi，且该项目当前版本的一些问题，如果没有在 服务中引入
  **springdoc-openapi-ui** 的依赖，或者配置中添加 `springdoc.api-docs.enabled=false` 的配置，则会导致启动报错
- 删除了 knife4j-ui 的版本管理，对于 OpenAPI3，请使用 knife4j 的 3.x 版本
- springfox 组件未适配 springboot 2.6.2 版本，如需继续使用
  springfox，请添加 `spring.mvc.pathmatch.matching-strategy=ant-path-matcher`
  配置，以及注册 `SpringfoxHandlerProviderBeanPostProcessor` 到 spring 容器中
- springboot 2.6.x
  默认禁止循环依赖，如有循环依赖启动将会报错，请注意修改代码，或者添加配置 `spring.main.allow-circular-references = true ` (
  不建议)
- `IPageArgumentResolver` 移除，如果直接使用 mybatisPlus 的 IPage 做为查询入参会有 SQL 注入风险，请注意修改！！！
- `IPageArgumentResolver` 移除，如果直接使用 mybatisPlus 的 IPage 做为查询入参会有 SQL 注入风险，请注意修改！！！
- `IPageArgumentResolver` 移除，如果直接使用 mybatisPlus 的 IPage 做为查询入参会有 SQL 注入风险，请注意修改！！！

### ⭐ New Features

- 【修改】修改 jackson 脱敏支持的模块添加方式，使用为注册 `JsonDesensitizeModule` 的形式，以便复用 spring-boot 默认的 module
  注册。
- 【修改】调整 `CustomJavaTimeModule` 的注册方式，防止被 JSR310 的 `JavaTimeModule` 覆盖
- 【删除】移除过时已久的 `IPageArgumentResolver`，让 starter-web 和 mybatis-plus 模块解耦。
- 【删除】移除过时的 Lov 相关代码。
- 【修改】Swagger2 相关注解迁移到 OpenAPI3
- 【修改】文档底层支持从 springfox 迁移到 springdoc-openapi
- 【添加】对于 GET 请求的入参封装类，如 xxQO，添加 `@ParameterObject` 注解，以便在文档上正确展示查询入参
- 【修改】由于 springfox 长久不更新，弃用基于该框架的 **ballcat-spring-boot-starter-swagger** 组件
- 【新增】添加 **ballcat-extend-openapi**，模块，基于 springdoc-openapi
  做了部分扩展，参看[文档](http://www.ballcat.cn/guide/feature/openapi.html)
- 【删除】删除 knife4j-ui 的版本管理
- 【修改】代码优化，显示指定部分参数或返回值的泛型
- 【修改】Sonarlint 部分代码警告处理
- 【删除】移除 dependencies pom 中无用的 pluginManagement 部分
- 【修改】hutool 依赖管理改为使用 hutool 官方提供的 bom
- 【新增】添加 **ballcat-extend-tesseract** 扩展模块，用于 OCR 文字识别工具的调用封装
- 【修改】字典相关逻辑调整
    - 去除字典只读/可写的属性控制
    - 字典项增加启用/禁用的状态属性
    - 字典现在在有字典项的情况下不允许删除（之前会自动级联删除）
- 【修改】同步 mybtais-plus 升级 3.5.x 后，AbstractMethod 的方法名获取做的调整
- 【修改】**ballcat-spring-boot-starter-oss** 更新 oss 相关方法与变量. 由 path 变为 key. 符合 oss 规范，原 rootPath
  属性标记为过期，修改为 objectKeyPrefix
- 【添加】**ballcat-spring-boot-starter-oss** 新增根据 `File`  直接上传的方法
- 【修改】`StreamUtils` 克隆流方法优化. 使用 FileOutStream 保证不会因为文件过大而内存溢出
- 【修改】`OssDisabledException` 父类由 `Exception` 修改为 `RuntimeException`
- 【修改】**ballcat-common-idempotent** 幂等组件微调
    - `RedisIdempotentKeyStore` 的 stringRedisTemplate 属性，改为构造器注入
    - 取消 `IdempotentAspect` 切面的 @Component 注解，防止误注册

### 🐞 Bug Fixes

- 【修复】修复删除字典项时没有将变动通知到前端的问题
- 【修复】修复 `FileUtils#updateTmpDir` 方法中文件夹创建异常的问题

### 🔨 Dependency Upgrades

- 【升级】spring-boot from 2.5.6 to 2.6.2
- 【升级】lombok from 1.18.20 to 1.18.22
- 【升级】spring-javaformat from 0.0.28 to 0.0.29
- 【升级】hutool from 5.7.12 to 5.7.19
- 【升级】dynamic-datasource from 3.4.1 to 3.5.0
- 【升级】jasypt from 3.0.3 to 3.0.4
- 【升级】jsoup from 1.14.2 to 1.14.3
- 【升级】mybatis-plus from 3.4.3.4 to 3.5.0
- 【升级】mybatis from 3.5.7 to 3.5.9
- 【升级】jsqlparse from 4.2 to 4.3
- 【升级】fastjson from 1.2.76 to 1.2.79
- 【升级】spring-boot-admin from 2.5.4 to 2.6.0

## [0.5.0] 2021-12-03

### :warning: Warning

- 由于业务实体类的统一修改，其对应的表结构发生了变化
- 批量方法从 `saveBatchSomeColumn` 切换到 `saveBatch` 后，注意项目中的 jdbcUrl 配置，需要添加
  rewriteBatchedStatements=true 条件，否则插入效率降低

### ⭐ New Features

- 【修改】 业务实体类添加父类 `LogicDeletedBaseEntity`，统一支持逻辑删除
- 【修改】 业务实体类统一修改描述、备注等属性名为 remarks
- 【修改】 业务代码批量插入部分方法从 `saveBatchSomeColumn` 切换到 `saveBatch`， 经实测，开启批处理事务以及 jdbcUrl
  连接添加`rewriteBatchedStatements=true` 后, 循环 insert into 批量提交比 insert into values 语法速度更快。
- 【新增】 **ballcat-spring-boot-starter-file** 组件，支持 local 本地 和 ftp 文件上传操作
- 【添加】 `TreeUtils#treeToList()` 方法，支持将树平铺为列表
- 【添加】 `ImageUtils#mixResolveClone()` 方法，先使用快速解析，若失败回退到正常解析方法
- 【新增】 `FileUtils` 工具类
- 【新增】 `BaseEntity` 和 `LogicDeletedBaseEntity` 实体类基类
- 【新增】 支持定制 Redis Key 前缀的生成规则
- 【新增】 `DistributeLock` , 更加方便的进行分布式锁的使用
- 【新增】 `AbstractMessageEventListener` 类，提供默认的消息序列化处理
- 【添加】 `ExtendService#saveBatch()` 方法
- 【新增】 多线程对同一 websocket session 进行发送操作的支持
- 【修改】 默认提供的 MybatisPlusConfig 配置类中的自动填充处理类的条件注解修改，方便用户替换为自己的 `MetaObjectHandler`
- 【新增】 线程池配置 `@Async` 异步线程日志支持 traceId 输出
- 【添加】 `TokenGrantBuilder#getAuthenticationManager()` 方法，方便子类继承时获取 AuthenticationManager (#133)
- 【修改】 `FileService` ，OssClient 不再为必须依赖，当没有配置 Oss 时，默认回退使用 FileClient，根据配置走本地存储或者FTP
- 【修改】 `MappedStatementIdsWithoutDataScope` 的 `WITHOUT_MAPPED_STATEMENT_ID_MAP` 属性类型为 `ConcurrentHashMap`
- 【修改】 `TraceIdFilter` 默认在响应头中返回 TraceId 参数，方便排查问题
- 【修改】 `UserInfoCoordinator` 从类调整为接口，并提供默认实现 `DefaultUserInfoCoordinatorImpl`

### 🐞 Bug Fixes

- 【修复】 数据权限使用 JDK动态代理或者桥接方法时无法正确找到 `@DataPermission` 注解的问题
- 【修复】 数据权限在 SQL 右连接，内连接失效的问题
- 【修复】 数据权限对于使用括号包裹的 sql 解析失效的问题
- 【修复】 在仅使用  `ballcat.swagger.enabled=false` 的情况下，swagger 没有正常关闭的问题
- 【修复】 由于跨域问题，导致 swagger 无法在聚合者 Aggregator 中对 文档提供者 Provider 进行调试的问题
- 【修复】 WebSocket 在接收普通文本属性时的异常问题，现在会回退使用 `PlanTextMessageHandler` 进行处理
- 【修复】 查询指定名称的组织时构建树失败的问题

### 🔨 Dependency Upgrades

- 【升级】 spring-boot from 2.5.4 to 2.5.6
- 【升级】 spring-boot-admin from 2.5.1 to 2.5.4

## [0.4.0] 2021-10-15

### Warning

- mybatis-plus 升级，其对应一些 count 方法，返回值修改为了 Long 类型，项目中有使用的地方需要对应修改
- 默认登录时返回的 token 属性有所变更，原 roles 修改为 roleCodes，前端注意对应升级
- websocket 默认使用 local 进行分发，这将导致集群状态下的数据推送异常，如需集群部署，请修改对应配置
- websocket 相关接口 MessageSender 移除，该接口并入 MessageDistributor ，注意修改对应依赖引入类型

### Added

- feat：**ballcat-auth** 授权服务器定制增强：
    - 允许用户自定义 `AccessTokenConverter`，修改自省端点 `/check_token` 的返回值
    - 允许用户定制授权处理器或者新增授权处理器，用户可以通过覆盖 `TokenGrantBuilder` 实现
    - 允许用户添加自己的 `AuthenticationProvider` 方便处理自定义的 grant_type
    - 添加 OAuth2ClientConfigurer 抽象接口，方便用户替换 ClientDetailsService 的配置方式
    - 和 **ballcat-system** 模块解耦，方便复用 **ballcat-auth** 快速搭建一个授权服务器，例如 C 端用户 和
      后台用户分离登陆系统，各搭建一套基于 OAuth2 的登录。
    - 根据 OAuth2 规范，调整 check_token 端点响应，在 token 不正确时响应 200，响应体为 `{ active: false }`，而不是返回 400
- feat：数据权限对于 jsqlparse 4.2 后，连表使用尾缀多个 OnExpression 方式的 SQL 解析支持
- feat：角色添加 scopeResource 属性，以便支持自定义数据权限设置一些信息
- feat：默认的 jackson 时间序列化添加了 `Instant` 类型支持，防止在使用时出现异常 InvalidDefinitionException: Java 8
  date/time type `java.time.Instant` not supported by default

### Changed

- refactor：资源服务器对于客户端凭证生产的token 解析支持，对应的 userdetails 为 `ClientPrincipal`

- refactor：授权服务器自省端点的 scope 属性响应调整，根据 OAuth2 自省端点协议，scope 应返回字符串，用空格间隔

- refactor：数据权限调整

    - 问题修复： fix 数据权限在表名使用 `` 转义字符时失效的问题
    - 性能优化：对于无需数据权限控制的 sql 在解析一次后进行记录，后续不再进行解析处理
    - 结构调整：防止误用以及避免歧义，DataScopeHolder 修改为 DataScopeSqlProcessor 的私有内部类

- refactor：SelectData 试图对象中的 value 修改为 Object 类型，selected 和 disabled 修改为 Boolean 类型

- refactor：系统用户相关的 service 和 mapper 层，修改使用 Collection 接收参数，方便使用

- refactor：TokenAttributeNameConstants 常量类拆分

- refactor：UserInfoDTO 属性调整，新增了 menus 用于存储用户拥有的菜单对象集合，修改 roles 属性用于存储用户拥有的角色对象集合，原
  roles 属性修改为 roleCodes 存储角色标识集合

- refactor：为避免歧义，登录和自省端点返回信息中的属性名称 roles 修改为 roleCodes

- bug：修复使用 **ballcat-spring-boot-starter-web** 时，若没有引入 security 依赖则启动异常的问题

- refactor： system 相关事件优化调整
    1. 用户组织变动时发布 UserOrganizationChangeEvent 事件
    2. 用户新建的事件由 UserChangeEvent 修改为 UserCreatedEvent
    3. system 的 event 类从 biz 迁移到 model 模块中

- refactor：**ballcat-common-websocket** 移除 MessageSender 接口，将其并入消息分发器 MessageDistributor

- refactor：**ballcat-spring-boot-starter-websocket** 与 redis 解耦，将默认注册的消息分发器由 redis 改为 local，基于内存分发。可通过
  ballcat.websocket.message-distributor 属性修改为 redis 或者 custom，值为 custom 表示，用户自己定制
  MessageDistributor（如修改为使用 mq，可用性更高）

  ```yaml
  ballcat:
  	websocket:
  		# 默认为 local 仅支持单节点使用，redis 基于 PUB/SUB 消息订阅支持了集群下的消息推送问题
  		message-distributor: redis # local | redis | custom
  ```

- refactor：**ballcat-spring-boot-starter-redis** 调整 AddMessageEventListenerToContainer 的注册方式，防止用户配置包扫描导致的加载顺序异常

- refactor：有用户绑定组织时，不允许删除组织

### Dependency

- Bump spring-boot from 2.4.8 to 2.5.5
- Bump lombok from 1.18.16 to 1.18.20
- Bump mybatis-plus 3.4.4 to 3.4.3.4
- Bump mybatis 3.5.6 to 3.5.7
- Bump jsqlparser 4.0 to 4.2
- Bump flatten-maven-plugin from 1.2.5 to 1.2.7
- Bump spring-javaformat from 0.0.27 to 0.0.28
- Bump hutool from 5.7.3 to 5.7.12
- Bump spring-boot-admin from 2.4.2 to 2.5.1
- Bump dynamic-datasource-spring-boot-starter from 3.3.2 to 3.4.1

## [0.3.0] 2021-09-09

### Warning

- 多个模块包名调整，注意重新 import 对应路径
- 国际化重构，改动较大，注意对应代码调整。国际化使用文档参看：http://www.ballcat.cn/guide/feature/i18n.html
- 由于 **ballcat-common-conf** 的删除，非 admin 服务中的 mybatis-plus 的相关配置，如分页插件，批量插入方法的注入，需要按需添加。
- 操作日志优化，修改了 `OperationLogHandler` 的相关方法，如果有自定义 OperationLogHandler ，需要注意同步更新
- 现在资源服务器默认关闭了表单登录功能，可通过配置开启表单登录并指定登录页地址

### Added

- feat: 国际化功能的默认支持，新增 **ballcat-i18n** 相关模块，以便提供默认的业务国际化实现方式

- feat: 登录用户名密码错误时的错误消息国际化处理

- feat: **ballcat-common-redis** 针对 PUB/SUB 新增 `MessageEventListener` 接口，**ballcat-spring-boot-starter-redis**
  中会自动注册所有实现 `MessageEventListener` 接口的监听器

- feat:  **ballcat-common-redis** 中的 `@CacheDel` 注解，新增 multiDel 属性，方便批量删除缓存

- feat: 新增 **ballcat-common-idempotent** 幂等模块

- feat: 针对 hibernate-validation 校验的提示消息，支持使用 {}，占位替代 defaultMessage

- feat:  **ballcat-common-core** 中默认新增了 `CreateGroup` 和 `UpdateGroup` 接口，方便分组校验使用

- feat:  新增 **ballcat-spring-boot-starter-web** 模块，该模块基于 `spring-boot-starter-web`, 并使用 undertow
  作为默认的嵌入式容器，且将 **ballcat-common-conf** 中对 web 应用的配置增强，如全局异常管理，以及 Sql 防注入处理，jackson
  的默认配置等配置移动到此项目中

- feat: **ballcat-extend-mybatis-plus** 模块中，为了支持连表查询的条件构建，新增 `OtherTableColumnAliasFunction`
  ，方便使用  `LambdaAliasQueryWrapperX` 进行关联表查询条件的构建

- feat: **ballcat-spring-boot-starter-easyexcel** 支持导出时进行 Excel 头信息的国际化处理，使用 `{}` 进行占位表示，使用示例可参看
  I18nData 的导出使用

- feat: **ballcat-spring-boot-starter-swagger** 配置的扫描路径 `basePackage` ，支持使用 `,`  进行多包名的分割扫描

- feat: **ballcat-spring-boot-starter-datascope** 中的数据权限控制注解 @DataPermission 扩展支持在 Mapper
  之外使用，且支持方法嵌套调用时使用不同的 @DataPermission 环境

- feat: **ballcat-common-security** 中资源服务器配置不再默认开启表单登录，新增两个配置属性用于开启并指定登录页地址：

  ```yaml
  ballcat:
  	security:
  		oauth2:
  			resourceserver:
  				# 是否开启表单登录，默认 false
  				enable-form-login: true
  				# 登录页地址，开启表单登录时生效，不配置则默认为 /login
  				form-login-page: http://login-domin
  ```

### Changed

- refactor: **ballcat-common-conf** 内原先对于 mybati-plus 的自动填充、分页插件、以及批量插入方法注入的配置移动到 **
  ballcat-admin-core** 中

- refactor:  `SpELUtils` 改名为 `SpelUtils`，并移动到 **ballcat-common-util** 模块中

- refactor:  `ApplicationContextHolder` 改名为 `SpringUtils`，并移动到 **ballcat-common-util** 模块中

- refactor: **ballcat-spring-boot-starter-log** 中拆分出 **ballcat-common-log** 模块，解决在 log-biz 模块中需要引入
  starter 的问题，部分代码的包名有变更

- refactor: **ballcat-spring-boot-starter-redis** 中拆分出 **ballcat-common-redis** 模块

- refactor: 重构原先的国际化 i18n 功能，新增 **ballcat-common-i18n** 模块，移除原先的 **ballcat-extend-i18n** 模块

- pref: 取消 **ballcat-spring-boot-starter-web** 中 **spring-security-core** 的传递依赖

- fix: 修复当查询一个不存在的系统配置后，由于缓存空值，导致添加配置后依然查询不到的问题

- pref: 菜单查询的返回类型修改为 SysMenuPageVO

- fix: 修复 excel 导出的 content-type 和实际文件类型不匹配的问题

- fix: 提高缓存切面的 Order，使其在事务提交后执行更新或删除操作，防止并发导致缓存数据错误

- pref: 菜单支持删除 icon

- fix: 修复当菜单 id 修改时，未级联修改其子菜单的父级 id 的问题

- pref: 优化操作日志，改为在方法执行前获取方法参数信息，防止用户在执行方法时将方法入参修改了

- pref: **ballcat-admin-core** 中默认扩展 springboot 默认的 TaskExecutor 配置，将拒绝策略从抛出异常修改为使用当前线程执行

- refactor:  移动 TreeNode 模型到 common-util 包中，以便减少 common-util 包的依赖

- refactor: **ballcat-spring-boot-starter-xss** 抽象出 XssCleaner 角色，用于控制 Xss 文本的清除行为，方便用户自定义

- pref: 用户登陆时的错误信息返回原始的细节信息，而不是全部返回用户名密码错误

- fix:  **ballcat-system-biz** websocket 包名拼写错误修复

### Removed

- 移除 **ballcat-common-conf**，相关代码拆分入 **ballcat-spring-boot-starter-web** 和 **ballcat-admin-core**

### Dependency

- Bump jsoup from 1.13.1 to 1.14.2

## [0.2.0] 2021-08-11

### Added

- feat: 新增 ballcat-extend-redis-module 模块，提供对布隆过滤器的操作
- feat: 新建用户时可以直接绑定用户角色，而不必分两次操作了
- feat: 支持修改菜单ID，方便转移菜单位置时，保持菜单 ID 规则
- feat: **新增 ballcat-common-security 模块**
    - 新增 CustomRedisTokenStore 用于在序列化异常时，直接清除缓存。避免每次修改 UserDetails 时都需要用户手动去删除所有缓存信息
    - 迁移 PasswordUtils 从 common-util 到 common-security，且 PasswordEncoder 使用 DelegatingPasswordEncoder,
      方便未来切换密码加密算法
    - 迁移 OAuth 相关的异常处理，从 ballcat-oauth-controller 到 common-secutiy
    - 新增 ResourceServer 相关配置以及基础组件，基于 SpringSecurity 5.X
    - SysUserDetails rename to User, sysUser 中的相关属性，现在直接写在 User 类中，同时删除了 userResource 和
      userAttributes 属性，新增了 attributes 属性。

### Changed

- refactor: 数据权限 dataScopes 通过 ThreadLocal 进行方法间传递
- refactor: 拆分 admin-websocket 模块，方便用户剔除不需要的组件.
- refactor: ballcat-spring-boot-starter-websocket 模块中 websocket 相关的封装代码抽取到 **ballcat-commo-websocket**
  模块，starter 仅保留自动配置相关代码
- pref: 菜单的逻辑删除属性使用 mybatis-plus 的自动填充功能，且当菜单 ID 已使用时提示详情
- pref: 精简了一些 common 模块中不需要的依赖
- refactor: OAuth2 ResourceServer 底层从 spring-security-oauth2 依赖迁移至 SpringSecurity 5.x
- pref: common-conf 中现在默认注册 jackson 的脱敏序列化器了，用户可以通过注册 name 为 ”desensitizeCustomizer“ 的
  Jackson2ObjectMapperBuilderCustomizer bean，覆盖默认配置
- refactor: ballcat-spring-boot-starter-log 和业务解耦，操作日志的生产和存储全部交由业务项目自己处理，ballcat-log-biz
  模块中提供了默认的操作日志实体类，以及 OperationLogHandler 的默认实现
- refactor: 由于 common-security 的抽取， ballcat-oauth 模块只剩下了授权相关，故更名为
  ballcat-auth，同时做了一些结构上的调整，方便后续独立部署授权服务器。
    - 配置 `ballcat.upms.loginCaptchaEnabled`
      现在调整为 `ballcat.security.oauth2.authorizationserver.loginCaptchaEnabled` ，用以控制登录验证码的开关
    - 配置 `ballcat.security.ignoreUrls` 现在调整为 `ballcat.security.oauth2.resourceserver.ignoreUrls` 用以控制资源服务器对部分
      url 的鉴权忽略
    - 配置 `ballcat.security.iframeDeny` 现在调整为  `ballcat.security.oauth2.resourceserver.iframeDeny` 用于开启资源服务器的嵌入
      iframe 允许
    - 新增 `@EnableOauth2AuthorizationServer` 注解，用以开启授权服务器 (ballcat-admin-core 模块中默认开启）

### Removed

- 移除 ballcat-oauth-model，相关代码迁入 ballcat-common-security

### Dependency

- Bump spring-boot from 2.4.3 to 2.4.8
- knife4j from 2.0.8 to 2.0.9
- hutool from 5.5.8 to 5.7.3
- fastjson from 1.2.75 to 1.2.76
- dynamic-datasource from 3.3.1 to 3.3.2
- spring-boot-admin from 2.4.1 to 2.4.2
- anji-captcha from 1.2.8 to 1.2.9

## [0.1.0] 2021-06-28

### Warning

- 此版本重构了前端路由部分，服务端权限表 sys_permission 改为 sys_menu，改动较大，迁移时建议先备份原始数据，执行增量 sql
  后若出现问题，再进行比对处理
- 调整了模块名，sys => system，后续包名也都尽量不再使用缩写，注意修改对应类的引用包路径
- 项目部分配置添加 ballcat. 前缀
    - 文件存储现在修改为了对象存储（OssProperties.java），配置前缀为 ballcat.oss
    - 登录验证码开关和超级管理员指定的配置（UpmsProperties.java），前缀为 ballcat.upms
    - 登录密码的 AES 加解密密钥，忽略鉴权的 url 列表，iframe 嵌入配置开关等安全相关的配置 （SecurityProperties.java），前缀为
      ballcat.security
- 模块拆分重构，原 `admin.modules` 下的 `log`、`system`、`notify` 相关代码，全部独立模块。目前拆分为 `model`，`biz`
  ，`controller` 三层，方便按需引入。`ballcat-admin-core` 依然默认集成所有模块
    - log 模块涉及的表名以及类名修改，原 AdminXXXLog 类，全部去除 Admin 开头。表名前缀由 `admin_` 修改为 `log_`
    - log 中的登录日志也不再默认开启，需要登录日志，可手动注册 `LoginLogHandler` 类，代码示例可参考 `ballcat-sample-admin`
      项目中的  `LogHandlerConfig`。
    - 同样访问日志和操作日志也需对应注册 handler，且在启动类上添加 @EnableXXXLog 注解
    - mapper.xml 文件移动，由于模块拆分，目前各模块的 mapper.xml 直接放置在了 mapper
      文件夹下，对应的文件扫描配置 `mybatis-plus.mapper-locations` 需要修改为 `classpath*:/mapper/**/*Mapper.xml`
      ```yml
      mybatis-plus:
        mapper-locations: classpath*:/mapper/**/*Mapper.xml
      ```

### Added

- feat: 新增了国际化插件 i18n extend 和 i18n starter
- feat: BusinessException 的错误消息支持占位符了
- feat: PageParam 分页查询参数对象，支持用户自定义其子类以便做额外的功能处理
- feat: TreeUtils 现在构建树时，支持传入 Comprator，进行自定义排序
- feat: 新增 SmsUtils，以及 GSMCharst 类，用于短信长度计算
- feat: 新增了一个根据用户id查询 UserInfo 的接口
- feat: ballcat-extend-mybatis-plus 模块中添加普通枚举类型处理. 根据 name() 返回值判断枚举值
- feat: ballcat-spring-boot-starter-easyexcel 新增 @RequestExcel 注解，方便导入 excel 直接解析为实体对象
- feat: 新增了一个接口用于组织机构树形层级和深度的错误数据校正

### Changed

- refactor: SysPermission 移除，新增 SysMenu 类，相关关联类同步修改，减少了大部分的配置属性，转交由前端处理
- refactor: Lov 实体修改为 SysLov
- refactor: 移除 AdminRuleProperties.java，adminRule 相关配置与登陆验证码开关控制一并合入 UpmsProperties, 密码加密密钥配置并入
  SecurityProperties，并将其配置前缀统一添加 ballcat.
- refactor: SysUserDetailsServiceImpl.getUserDetailsByUserInfo 方法调整为 public 级别, 便于以api方式登录的请求注入用户信息
- refactor: 重构了 excel 自定义头生成器的使用方式
- refactor: 修改 AbstractRedisThread.getObjType 默认实现, 使其更符合大多数情况(获取失败的情况下子类重写此方法)
- refactor: 文件存储 starter-storage 重构，修改为对象存储，使用 S3 协议和云端交互，所有支持 S3 协议的云存储都可以使用，如亚马逊、阿里云、腾讯云、七牛云
- refactor: 移除 userInfoDTO 中的 roleIds 属性
- refactor: 系统配置添加缓存注解，提升查询效率，更新和删除修改为使用 confKey, 而不是 ID
- pref: 根据 mapstruct 官方文档，调整了 lombok 和 mapstruct 的依赖引入方式
- pref: 所有 @RequestParam 和 @PathVariable 注解，指定 value 值，避免因环境问题，编译未保存参数名称，导致的参数绑定异常
- pref: 简化微信原生支付方法
- pref: 前后端交互密码解密异常时的错误日志以及响应信息优化
- fix: 禁止删除有子节点的组织，以及不能修改父组织为自己的子组织
- fix: 修复由于 mapstruct 的引入方式修改，导致 yml 中配置信息不提示的问题
- fix: 修复 easyexcel 添加 password 后会导致 excel 文件打开异常的问题
- pref: starter-log 和 starter-oss 模块包名拼写错误修复，commom -> common
- refactor: AccessLogSaveThread 不再默认启动，AbstractQueueThread 中对非活动状态的线程进行启动，避免重复启动异常
- fix: 修复组织架构移动到子层级时，导致其他节点的层级和深度被错误修改的问题（之前的错误数据可用此版本新增的校正功能修复）
- fix: 修复操作日志添加参数忽略类型的异常问题

### Dependency

- Bump spring-boot-admin from 2.3.1 to 2.4.1
- Bump virtual-currency from 0.4.1 to 0.4.2

## [0.0.9] 2021-04-28

### Warning

- 由于用户属性和用户资源类的抽象，更新版本后，需要删除原来缓存的用户数据，否则会造成反序列化移除
- ExtendService#selectByPage 方法移除，原本使用此方法的分页查询，需要更改为使用 baseMapper#selectPage
- 部分类路径有修改，注意迁移
- 代码生成器独立到新的仓库：https://github.com/ballcat-projects/ballcat-codegen
- 示例使用迁移到新的仓库：https://github.com/ballcat-projects/ballcat-samples

### Added

- feat: RedisHelper 工具类新增 list 的 rightPush 和 leftPop 方法
- feat: 新增了一个基于 Redis 的线程队列
- feat: 新增解绑用户角色关联关系的功能
- feat: `ExtendService#saveBatchSomeColumn` 现在支持分批批量插入了
- feat: admin-websocket 新增了 Lov 弹窗选择器修改时的 websocket 推送

### Changed

- refactor: 用户属性和用户资源抽象出接口，不再使用 Map 存储，具体使用类交由使用方进行构造，类似于` UserDetails`
- refactor: common-desensitize 优化，支持自定义注解脱敏

- refactor: 抽象 `AbstractThread` 类. 让下级自定义 poll 和 put 方法.
- refactor: `AbstractQueueThread` 添加程序关闭时的处理方法，防止停机时的数据丢失问题
- refactor: 简化了支付宝和微信的回调类，并添加了验签方法
- refactor: 使用 `Jackson2ObjectMapperBuilder` 构造 `ObjectMapper`，保留使用配置文件配置 jackson 属性的能力，以及方便用户增加自定义配置
- refactor: xss 防注入重构，抽取成一个 starter，限制基于 jsoup 的白名单过滤，可自定义排除路径和请求类型的配置，admin-core
  包现在默认集成此 starter
- refactor: 工具类添加 finnal 关键字和私有构造
- refactor:  修改 extends 下的三个支付模块的类路径, 把 starter 修改为 extend
- refactor:  优化 JsonUtils 的类型转换
- fix: 修复 `LambdaQueryWrapperX#inIfPresent` 参数错误处理成流，导致的 sql 拼接异常
- fix: 修复当没有字典项时，无法正常删除字典的 bug
- fix: 修复几次版本更新导致的代码生成器的各种 bug，如目录项拖动，以及zip 文件流末端损坏等
- fix: 操作日志记录时，参数为 null 导致的空指针问题

### Removed

- 移除新酷卡短信组件
- 移除 mybatis-plus-extend 中的 selectByPage 方法，因为其无法真正修改返回类型，现在使用 `page.convert` 进行 数据转换

### Dependency

- Bump virtual-currency from 0.3.2 to 0.4.1
- Bump spring-boot-admin from 2.4.0 to 2.3.1

## [0.0.8] 2021-03-04

### Warning

- 更新了 Service 层的父类，现在无法直接使用 service 对象，进行 Wrapper 条件构造
- 更新了分页查询的排序参数，前端需要对应升级
- commom-model和common-util的抽离，导致部分工具类和部分通用实体包名修改, 请注意替换

### Added

- feat: Swagger3 支持，文档地址更新为 /swagger-ui/index.html
- feat: 剥离全局异常捕获中请求方法和请求媒体类型不支持的异常，方便生产环境排查问题
- feat: 新增 common-desensitize 脱敏模块，默认提供了部分常用脱敏类型，且支持SPI形式追加用户自定义脱敏处理器
- feat: 新增 pay-ali 模块，用于支持支付宝支付
- feat: 新增图形验证码开关配置，默认开启
- feat: 分页查询出入参封装，提供 PageParam 作为入参，PageResult 作为出参，不再用 Page 贯穿
- feat: 密码在日志中的存储脱敏
- feat: 数据权限注解提供对于指定 Mapper类，或指定方法的数据权限关闭功能
- feat: 添加 JsonUtils 根据依赖执行对应的json处理方法
- feat: 添加 RedisHelper 提供对redis的常用方法支持
- test: 对 client test 跳过登陆验证和密码解密，便于测试，注意生产环境不要开启 test client

### Changed

- refactor: 取消了项目文件格式化指定换行符使用 LF 的限制
- refactor: 分页查询的排序参数属性修改，用于支持多列排序
- refactor: mybatis-plus-extend 扩展包调整
    - 新增 LambdaQueryWrapperX ，提供 ifPresent 方法，用于简化条件判断
    - 新增 LambdaAliasQueryWrapperX 用于构造带别名的条件语句和查询sql
    - ExtendMapper 新增 selectByPage 方法，扩展自 selectPage 方法，支持查询数据直接转换为 VO 的映射
    - ExtendMapper 新增 insertBatchSomeColumn，使用 insert into 方式进行插入，提升批量插入效率
    - ExtendService 扩展自 IService，但是取消所有对外暴露 Wrapper 参数的方法，便于规范代码分层
- refactor: 所有 Service 改为继承 ExtendService，所有 Mapper 改为继承 ExtendMapper，且所有查询 条件构造下沉入DAO 层
- refactor:  部分方法名修改，查询方法返回结果为集合时，方法名使用 list 开头
- refactor: 钉钉消息通知优化，每次通知使用新的 request 实例
- refactor: 访问日志默认忽略验证码获取请求，操作日志忽略 MutipartFile 类型的参数记录
- refactor: 用户密码在 service 使用明文密码交互，AES 加解密在 controller 或者过滤器中完成
- refactor: 密码加解密密钥的配置添加 ballcat 前缀：ballcat.password.secret-key
- refactor: hutool 改为按需引入
- refactor: 取消代码文件换行符强制使用 LF 的限制
- refactor: 取消 jackson 配置中，全局 Null 值转 '' 的处理，但是以下对 类型 Null 值特殊处理
    - String Null 转 ''
    - Array 和 Collection Null 转 []
    - Map Null 转 {}
- refactor: 从 common-core 中剥离出 common-util 和 common-model

### Removed

- 移除 mybatis-plus-extend-mysql 扩展包，相关方法移入 mybatis-plus-extend 扩展中
- 移除 model 的 AR 模式支持
- 移除 hibernate-validator 的版本指定，改为跟随 spring-boot 的依赖版本
- 移除 JacksonUtils

### Dependency

- Bump spring-boot from 2.4.1 to 2.4.3
- Bump mapstruct from 1.4.1.final to 1.4.2.final
- Bump spring-javaformat-maven-plugin 0.0.26 to 0.0.27
- Bump hutool from 5.5.7 from 5.5.8
- Bump mybatis-plus from 3.4.1 to 3.4.2
- Bump dynamic-datasource from 3.2.0 to 3.3.1
- Bump spring-boot-admin from 2.3.1 to 2.4.0
- Bump oss.aliyun from 3.8.0 to 3.11.3
- Bump anji-captcha 1.2.5 to 1.2.8

## [0.0.7] 2021-01-19

### Added

- feat: 多页签导出支持每个页签不同头类型
- feat: 新增创建人和更新人的自动填充支持
- feat: 提供ExcelWriterBuilder，使用者可以复写此接口方法，来对excel导出做自定义处理
- feat: 数据权限注解 @DataPermission 提供方法级别的忽略支持
- add: 新增 HtmlUtil，方便快捷提取 html 中的纯文本，且保留换行结构
- feat: 代码编辑器的模板编辑框提供全屏功能
- feat:  新增用户成的发布事件
- feat:  新增登陆时的图形验证码校验，提升安全性
- feat:  新增虚拟货币的支付stater支持
- feat:  新增基于 websocket-starter，方便系统集成 websocket 使用
- feat: 新增系统公告，支持多种方式指定接收人，以及多种公告推送方式
- feat:  新增 admin-websocket 插件包，引入此依赖，可获得实时的站内公告推送以及字典项更新推送能力，默认使用redis发布订阅进行集群支持，用户可通过自定义
  MessageDistributor 来更换消息分发模式，比如使用专业的消息队列，也提供了 LocalMessageDistributor，在单节点时使用此分发器，更高效稳定

### Changed

- refactor:  代码格式化强制换行符使用 LF，保证跨系统协同开发的统一性
- refactor:  mail-stater 的结构微调，修改了部分类名
- refactor：调整了系统的依赖结构，将 spring 相关依赖版本管理由父工程移动到 ballcat-dependencies 中

### Bug

- fix: 修复由于SpringMvc5.3版本后的跨域通配符使用方式导致 swagger 跨域配置 * 号无法生效的问题
- fix: 修复字典项删除时未更新hashcode 导致的前台缓存问题
- fix: 添加依赖，修复高版本 lombok 和 mapstruct 的冲突问题
- fix: 修复代码生成器模板生成失败以及无法平移文件的问题
- fix: 修复操作日志在记录入参时，若参数中含有 request 或 response 导致的堆栈溢出问题

### Dependency

- Bump spring-boot from 2.4.0 to 2.4.1
- Bump mapstruct from 1.3.1.final to 1.4.1.final
- Bump spring-javaformat-maven-plugin 0.0.25 to 0.0.26

## [0.0.6] 2020-12-03

### Warning

- 更新了 UserDetail，缓存反序列化将会出现问题，更新版本前需要清除对应缓存
- 返回体结构修改，属性 msg 修改为 message，可能影响前端信息展示，接入系统的第三方的响应数据接收，升级前需提前沟通

### Added

- feat: 新增组织机构(部门)，用户与组织机构为一对一的关系
- feat: 数据权限，利用 mybatis 拦截器对 sql 进行拦截约束，约束规则支持自定义，适用于大部分数据权限控制。
- feat: 角色新增 scopeType，暂时支持全部，本人，本部门，本人及子部门等几种范围类型
- feat: 新增短信发送 stater
- feat: excel导出支持自定义头信息
- feat: 新增 JacksonUtils，方便全局统一 objectMapper 配置

### Changed

- fix: 修复没有提供默认 profile，导致用户不指定 profile 时，全局异常处理无法正常初始化的问题
- refactor:  Lov 模块调整
- refactor: lovBody 和 lovSearch 关联属性由 lovId 更改为 keyword
- refactor: UserDetails 属性重构，抽象出用户资源(userResources)和用户属性(userAttributes)，默认将用户的角色和权限作为资源存入userResources.
  可以重写UserInfoCoordinator类，来根据业务调整用户资源和用户属性
- refactor: kafka 消费者配置提供
- refactor: 返回体结构修改，属性 msg 修改为 message
- refactor: xss 和 monitor auth 过滤器提供开关，并调整了配置前缀
- refactor: 用户角色，角色权限的关联，由 role_id 修改为使用 role_code
- fix: 系统用户查询时组织机构ID为空不为null时导致的异常
- refactor: 字典附加属性，value值修改为object类型
- fix: 修复用户在容器初始化前使用缓存注解时，CacheLock未初始化导致的异常问题
- fix: 移除 hutool json 的使用（该工具类部分情况下可能导致栈溢出）
- refactor:  支持用户select数据查询接口使用 userTypes 进行多类型筛选，删除原先的地址栏占位符查询方式

### Dependency

- Bump spring-boot from 2.3.4 to 2.4.0

## [0.0.5] 2020-09-18

### Added

- Lov 模块
- 字典相关
    - feat: DictItemVO 新增 id 属性
    - feat: 字典项新增 attributes 属性，用于定制额外的非必须属性，如颜色等供前端使用

### Changed

- refactor: ApplicationContextUtil 更名为 SpringUtil

- refactor: LogUtil#isMultipart 去除只判断 POST 请求的限制

- 全局异常&异常通知

    - fix: 修复异常通知 message 为 null 时导致的异常

    - fix: 修复类校验失败时，无法正常返回错误信息的
    - feat: 异常通知添加 hostname 和 ip 信息
    - fix: 捕获空指针异常时，会导致异常通知空指针的问题
    - fix: 异常通知 cpu 占用过高问题
    - feat: 添加忽略指定异常类的配置
    - refactor: 优化钉钉通知的http请求方式
    - style: 通知信息中的英文冒号转为中文冒号
    - refactor: 除未知异常外，取消全局异常捕获时的异常打印，如需详细堆栈可以在异常处理类中进行处理

- feat: AbstractQueueThread#preProcessor 修改为 public，便于子类重写

- fix: 修复包装 RequestBody 导致，表单数据无法正常读取的bug

- fix: 修复在前台页面新建权限时无法指定主键 Id 的异常

- feat: extend-mybatis-plus 中批量插入方法，将生产的主键回填到实体中

- refactor: 登陆日志和操作日志分离

- fix: 修复用户登陆后将密文密码返回前台的安全隐患问题

- style: 代码生成器样式微调

### Dependency

- Bump spring-boot from 2.3.1 to 2.3.4
- Bump mybatis-plus from 3.3.2 to 3.4.0
- Bump hutool from 5.3.10 to 5.4.1
- Bump spring-java-format from 0.0.22 to 0.0.25

## [0.0.4] 2020-08-14

### Added

- 新增 kafka stater 模块
- 新增 mybatis-extends 扩展，添加批量插入方法
- accesslog 提供 responseWrapper，方便记录响应数据
- swagger stater 新增 additionalModelPackage 属性，用于扫描一些额外的 swaggerModel
- 异常捕获新增对 MethodArgumentTypeMismatchException 的处理
- 新增 Security 是否开启禁止 iframe 嵌入的配置控制

### Changed

- AbstractQueueThread 提高默认的批处理大小
- 代码生成器移除加载动态数据源时指定的 driverClassName
- 移除 admin-core 默认引入的 swagger 依赖，现在用户可以在自己的项目中选择引入
- 移除 JacksonConfig#ObjectMapper 的 @Primary 注解，便于用户自定义
- 数据字典优化，支持批量请求，接口地址调整
- 调整前后端传输密码使用的 AES Padding mode 为 PKCS5Padding
- 修复因 TokenStore 与 cachePropertiesHolder 加载顺序导致的启动异常
- 修复 codegen 无法选择 master 之外的数据源进行代码生成的bug
- 当使用 DingTalk 异常通知时，会 @所有人
- 字典添加值类型字段，便于前端回显，以及后续校验控制

### Dependency

- swagger up to 1.5.21
- dynamic-datasource up to 3.2.0
- spring-boot-admin up to 2.2.4
- easyexcel up to 2.2.6

## [0.0.3] 2020-07-06

### Added

- 重构代码生成器

    - 前端使用 ant-design-vue 重构，支持单体应用以及前后端分离两种部署方式
    - 多数据源支持，动态添加删除，生成时选择对应数据源进行代码生成
    - 代码生成结构调整，支持自定义代码生成结构
    - 支持在线模板编辑
    - 支持自定义模板属性，定制模板

- 提供 dingTalk-starter，简化 dingTalk 接入

- 提供 kafka 扩展，以及kafka流式处理扩展包

- 记录登陆登出日志

- 自动填充（逻辑删除标识），新建时增加对字段名为 `deleted` 且 类型为`Long`的属性填充，填充值为 0

- 超级管理员配置，可根据userid 或 username 指定当前项目的超级管理员（即最多可配置两个超级管理员），超级管理员默认拥有所有权限，不可删除，仅自己可以修改自己的信息
  如下配置：指定了 userId 为 1 或者 username 为 admin 的用户为超级管理员

    ```yaml
    ballcat:
        admin:
            rule: 
                userId: 1  
                username: admin
    ```

### Changed

- 访问日志忽略路径修改为可配置

- 角色新增类型属性，对于系统类型角色，不允许删除

- 更新逻辑删除不能使用 unique key 的问题，逻辑删除使用时间戳，未删除为0，删除则为删除的时间戳，实体类字段同一使用Long，数据库使用bigint。

    - 配置文件添加如下配置：

      ```yaml
      mybatis-plus:
        global-config:
          db-config:
            logic-delete-value: "NOW()" # 逻辑已删除值(使用当前时间标识)
            logic-not-delete-value: 0 # 逻辑未删除值(默认为 0)
      ```

### Dependency

- mybatis-plus 版本升级至 3.3.2
- spring-boot 版本升级至 2.3.1.RELEASE
- spring-security-oauth2 升级至 2.3.8.RELEASE

## [0.0.2] 2020-06-04

### Added

- 更新系统配置表，重命名为 sys_config, 并调整包位置，并入sys模块下。

- 模块重构，调整部分common下的模块，修改放入starter

- 合并 simple-cache，后续直接引入`ballcat-spring-boot-starter-redis`模块，即可开启全局key前缀，以及缓存注解功能

- traceId跟踪，引入`ballcat-spring-boot-starter-log`，会自动为每个请求的日志上下文中注入TraceId

- operation_log、admin_access_log表新增字段 trace_id，类型char(24).

- logback-spring.xml 彩色日志模板中，加入`%clr([%X{traceId}]){faint}`，文件日志模板加入`[%X{traceId}]`，用于打印traceId

- 移除api_access_log表，以及相关代码

- 更新日志，追加追踪ID，操作类型

- core项目更新为自动装配，可以删除项目Application中的
  `@ServletComponentScan("com.hccake.ballcat.admin.oauth.filter")` 注解。

  `@MapperScan("com.hccake.ballcat.**.mapper")`
  `@ComponentScan("com.hccake.ballcat.admin")`
  注解上的这两个包扫描也可去掉。
