# OAuth2 服务器

目前文档内容对标 ballcat v0.2.0 以上版本

## 授权服务器

Ballcat 中的授权服务器是基于 **spring-security-oauth2** 项目实现的，~~该项目现已被 Spring 标记为弃用，但是新的授权服务器 Spring 团队还在孵化中，未达到生产可用状态，所以暂时无法更新。~~

新的授权服务器已经发布，使用相关请移步 [Ballcat Spring Authorization Server](./sas-server)

首先，**根据 OAuth2 中的定义，授权服务器本身也可以是一个资源服务器**。

在使用 ballcat 构建的单体应用中，授权服务器和资源服务器肯定是在一起的，但是为了方便扩展，在代码层面，Ballcat 将授权服务器和资源服务的代码做了分离：



核心模块 **ballcat-common-security** 模块中，是对于 spring-security 使用的基本封装，OAuth2User 实体的定义等双方需要共享的部分，授权服务器和资源服务器都会使用。

> 由于资源服务器的配置较少，所以其相关代码也在 **common-security**  中，但默认是不开启的。



ballcat 中关于授权服务器的代码处理在以下模块中：

```
ballcat-auth
|-ballcat-auth-biz		 // 授权服务的相关配置、Token 增强、异常处理等
|-ballcat-auth-controller  // 登出接口
```

引入上述依赖后，通过在配置上添加 `@EnableOauth2AuthorizationServer` 注解以达到自动开启授权服务器相关配置的功能。

> 目前授权服务器强关联 ballcat-system 相关业务模块



### 验证码开关

授权服务器默认集成了基于 anji-captch 的登录验证码，用户可以通过以下配置关闭验证码的校验：

```yaml
ballcat:
	security:
		oauth2:
			authorizationserver:
				login-captcha-enabled: false  # 登录验证码开关，默认开启
```



### 登录返回信息

spring-security-oauth2 的令牌端点地址为：”/oauth/token“，其默认的返回数据仅仅只有以几个：

```json
{
    "access_token":"2YotnFZFEjr1zCsicMWpAA",
    "token_type":"example",
    "expires_in":3600,
    "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
    "scope": "server"
}
```

实际在业务开发中，我们还会有需要一些其他的信息，需要在登陆时返回，Ballcat 默认提供的 `CustomTokenEnhancer` 类中，额外添加了 用户的 权限，角色，以及用户自身的一些附属属性：

```json
{
    "access_token":"2YotnFZFEjr1zCsicMWpAA",
    "token_type":"example",
    "expires_in":3600,
    "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
    "scope": "server",
    "attributes": {    // 用户附加属性
        "permissions": [  // 权限
            "system:role:grant",
            "notify:announcement:edit",
            "notify:announcement:read",
        ],
        "roles": [   // 角色
            "ROLE_ADMIN",
        ]
    },
    "info": {		// 用户信息
        "userId": 1,
        "username": "admin",
        "nickname": "超管牛逼",
        "avatar": "sysuser/1/avatar/20200226/ab6bd5221afe4238ae4987f278758113.jpg",
        "organizationId": 11,
        "type": 1
    }
}
```

用户可以通过自定义 `TokenEnhancer` 类，来覆盖 Ballcat 的默认行为，对登录的返回信息进行增删处理。



### 自省返回信息

spring-security-oauth2 的令牌自省端点地址为：”/oauth/check_token“

其返回信息也可以通过自定义 `AccessTokenConverter` 来进行定制处理，Ballcat 默认提供的`CustomAccessTokenConverter` 中，主要是针对客户端的权限，来控制是否将用户的所有 attributes 返回。





## 资源服务器

授权服务器是基于 spring-security 5.x 实现的，理论上来说，可以对接任何遵守 OAuth2 协议的资源服务器，Ballcat 在 security 之上针对自己的授权服务器和业务做了一些调整。



资源服务器的配置仅仅依赖于 **ballcat-common-security** ，引入此依赖后，通过 `@EnableOauth2ResourceServer` 即可开启授权服务器相关配置。



### 自定义配置

资源服务器提供了以下配置文件：

```yaml
ballcat:
  security:
    oauth2:
      resourceserver:
      	## 是否禁止嵌入 iframe
      	iframe-deny: true
      	## 是否与资源服务器，共享token存储环境
      	shared-stored-token: true
      	## 不共享 token 存储环境时，需要远程鉴权
      	opaque-token：
      		# 客户端id
      		client-id:
            # 客户端密钥
      		client-secret:
      		# 令牌自省端点：授权服务器暴露出来的一个 url, 用于获取指定 token 的信息
      		introspection-uri: 
        ## 忽略鉴权的 url 列表，即允许匿名访问
        ignore-urls:
          - /public/**
```

- ballcat.security.oauth2.resourceserver.shared-stored-token

  在单体应用，或者某些微服务架构下，授权服务器和资源服务器是共享 token 存储的。

  也就是说授权服务器将登录的 token 存储在数据库或者 redis 中，而资源服务器使用的是相同的数据库或者 redis，资源服务器又是知道授权服务器的存储格式的，这时为了减少资源服务器和授权服务器的交互开销，资源服务器可以不向授权服务器发起请求，而是自己直接去存储环境中读取对应的 token 信息。

- ballcat.security.oauth2.resourceserver.opaque-token 

  - client-id
  - client-secret
  - introspection-uri

  在授权服务器和资源服务器环境隔离的情况下，当用户携带 token 向资源服务器请求受保护的资源，资源服务器为了验证 token 的有效性，以及获取到 token 对应的一些用户信息，就需要向授权服务器发起 token 的自省请求。

  资源服务器本身也是一个客户端，配置的 client-id 和 client-secret 确定了其在 OAuth2 中的身份，资源服务器接收自省请求前会校验 client-id 和 client-secret 的有效性。

  introspection-uri 即是授权服务器的自省端点地址，ballcat 的授权服务器是基于 spring-security-oauth2 的，其默认的自省端点为
  ”/oauth/check_token“

> 注意，仅当 ballcat.oauth2.resourceserver.shared-stored-token 为 false 时，自省端点的配置才会生效



### Token 解析器

#### 共享 Token 解析

在共享 token 存储时，ballcat 将会默认注册 `SharedStoredOpaqueTokenIntrospector` 解析器，其内部利用 spring-security-oauth2 提供的 TokenStroe ，调用  `TokenStore#readAccessToken` 方法直接进行 token 信息的解析。

#### 自省端点解析

当配置为自省端点时，ballcat 将会注册 `RemoteOpaqueTokenIntrospector`，其内部会根据 `check_token` 端点的返回值，进行 token 信息的构建

#### 自定义解析

用户可以根据自己的需要定制自己的解析器，只需实现 `OpaqueTokenIntrospector`, 并注册到 spring 中即可

