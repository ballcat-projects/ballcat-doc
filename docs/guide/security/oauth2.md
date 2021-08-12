# OAuth 2.0

这里只摘抄了部分文档，以便大家粗略了解 OAuth2 的 4 种授权类型。

更多内容可阅读 [OAuth2 RFC6749](https://datatracker.ietf.org/doc/html/rfc6749)，中文翻译参看 [RFC6749 中文](https://www.bookstack.cn/read/RFC6749.zh-cn/SUMMARY.md)。



## 简介

OAuth 2.0 是一种授权协议。

在 OAuth 2.0 协议中，客户端在请求受保护的资源时，会通过一个 access token（一个代表特定的作用域、生命周期以及其他访问属性的字符串）来作为凭证，access token 由授权服务器在资源所有者认可的情况下颁发给第三方客户端。



先扔一张 OAuth 2.0 的 4 中授权许可的总结表格，防止下面文章太长不看：

![OAuth2](https://hccake-img.oss-cn-shanghai.aliyuncs.com/md-source/OAuth2.png)



## 角色

OAuth 中定义了 4 种角色：

-  **资源所有者**   `resource owner`：

  能够授予对受保护资源的访问权的实体。 当资源所有者是人时，它被称为  end-user。  

- **资源服务器**   `reosource server`：

  存放受保护资源的服务器，能够通过 access token 来请求和响应这些受保护的资源。

- **客户端**   `client`：

  请求受保护资源的的一方就可以被看作一个客户端。（这个客户端只是一个概念，具体实现可以是服务器，应用程序，或者 Html 网页 等等，一个资源服务器在请求另一个资源服务器的受保护资源时，其也被视为一个客户端）

- **授权服务器**   `authorization server`：

  当客户端成功通过认证后，向其颁发 token 的服务器



## 协议流程

整体的协议流程大致可以抽象为下图所示，实际的执行流程，根据不同的授权方式，会各有不同。

```
     +--------+                               +---------------+
     |        |--(A)- Authorization Request ->|   Resource    |
     |        |                               |     Owner     |
     |        |<-(B)-- Authorization Grant ---|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(C)-- Authorization Grant -->| Authorization |
     | Client |                               |     Server    |
     |        |<-(D)----- Access Token -------|               |
     |        |                               +---------------+
     |        |
     |        |                               +---------------+
     |        |--(E)----- Access Token ------>|    Resource   |
     |        |                               |     Server    |
     |        |<-(F)--- Protected Resource ---|               |
     +--------+                               +---------------+
```

- (A)  客户端向资源所有者请求授权。 授权请求可以直接向资源所有者发出(例如密码模式，资源所有者会直接将自己的用户名密码授予给客户端)，但是推荐客户端经由授权服务器作为中转向资源所有者发出(例如授权码模式)

- (B)  客户端收到授权许可，这是一个代表资源所有者的授权的凭据，使用本规范中定义的四种许可类型之一或者使用扩展许可类型表示。授权许可类型取决于客户端请求授权所使用的方法以及授权服务器支持的类型。

- (C)  客户端与授权服务器进行身份认证并出示授权许可来请求 access token 。

- (D)  授权服务器验证客户端以及授权许可，如果授权许可有效，则发出 access token 。  
- (E)  客户端向资源服务器请求受保护的资源，并携带 access token 以进行身份验证。  
- (F)  资源服务器验证 access token ，如果有效，则返回其请求的受保护资源。  



## 授权许可

授权许可是一个代表资源所有者授权（访问受保护资源）的凭据，客户端用它来获取访问令牌。

OAuth 定义了四种许可类型——授权码、隐式许可、资源所有者密码凭据和客户端凭据——以及用于定义其他类型的可扩展性机制。



### 授权码 Authorization Code

grant_type：code

授权码许可类型中，客户端不会直接向资源所有者申请授权，而是通过授权服务中介处理的。整个流程基于重定向，要求客户端必须能够与资源所有者的用户代理（通常是 web 浏览器）进行交互并能够接收来自授权服务器的传入请求（通过重定向）。



```
     +----------+
     | Resource |
     |   Owner  |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier      +---------------+
     |         -+----(A)-- & Redirection URI ---->|               |
     |  User-   |                                 | Authorization |
     |  Agent  -+----(B)-- User authenticates --->|     Server    |
     |          |                                 |               |
     |         -+----(C)-- Authorization Code ---<|               |
     +-|----|---+                                 +---------------+
       |    |                                         ^      v
      (A)  (C)                                        |      |
       |    |                                         |      |
       ^    v                                         |      |
     +---------+                                      |      |
     |         |>---(D)-- Authorization Code ---------'      |
     |  Client |          & Redirection URI                  |
     |         |                                             |
     |         |<---(E)----- Access Token -------------------'
     +---------+       (w/ Optional Refresh Token)
     
     						授权码流程图
```

注：说明步骤（A）、（B）和（C）的直线因为通过用户代理而被分为两部分。



- （A）客户端通过将资源所有者的用户代理定向到授权端点来启动流程。 客户端包括其客户端标识符、请求的范围、本地状态和重定向URI，授权服务器将在授予(或拒绝)访问后将用户代理发送回该重定向URI。  
- （B）授权服务器(通过用户代理)对资源所有者进行身份验证，并确定资源所有者是授予还是拒绝客户端的访问请求。  
- （C）假设资源所有者授予访问权，授权服务器使用先前提供的重定向URI(在请求中或在客户端注册期间提供)将用户代理重定向回客户端。 重定向URI的参数中包括一个授权代码和前面客户机提供的任何本地状态。  
- （D）客户端通过包含上一步中收到的授权码从授权服务器的令牌端点请求 access token。当发起请求时，客户端与授权服务器进行身份验证。客户端包含用于获得授权码的重定向URI来用于验证。
- （E）授权服务器对客户端进行身份验证，验证授权代码，并确保接收的重定向URI与在步骤（C）中用于重定向（资源所有者的用户代理）到客户端的URI相匹配。如果通过，授权服务器响应返回 access token 与可选的 refresh token



#### 授权请求

客户端向授权端点发起请求时，其 URI 中的 QueryString，必须添加以下参数

| 参数          | 必传 | 描述                                                     |
| ------------- | ---- | -------------------------------------------------------- |
| response_type | 是   | 值必须是 "code"                                          |
| client_id     | 是   | 客户端标识                                               |
| redirect_uri  | 否   | 重定向地址，如果客户端在授权服务器中注册时已提供则可不传 |
| scope         | 否   | 请求访问的范围。                                         |
| state         | 否   | 推荐携带此值，用于防止跨站请求伪造                       |

请求示例：

```http
GET /authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
Host: server.example.com
```

授权服务器验证该请求，确保所有需要的参数已提交且有效。如果请求是有效的，授权服务器对资源所有者进行身份验证并获得授权决定（通过询问资源所有者或通过经由其他方式确定批准）。

当确定决定后，授权服务器使用HTTP重定向响应向提供的客户端重定向URI定向用户代理，或者通过经由用户代理至该URI的其他可行方法。



#### 授权响应

如果资源所有者许可访问请求，授权服务器颁发授权码，通过向重定向URI的查询部分添加下列参数传递授权码至客户端：

| 参数  | 必传 | 描述                                                         |
| ----- | ---- | ------------------------------------------------------------ |
| code  | 是   | 授权码必须在颁发后很快过期以减小泄露风险。推荐的最长的授权码生命周期是10分钟。客户端不能使用授权码超过一次。如果一个授权码被使用一次以上，授权服务器必须拒绝该请求并应该撤销（如可能）先前发出的基于该授权码的所有令牌。授权码与客户端标识和重定向URI绑定。 |
| state | 否   | 当授权请求携带此参数时则必传，值原封不动回传                 |

 例如，授权服务器通过发送以下HTTP响应重定向用户代理：

```http
HTTP/1.1 302 Found
Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA&state=xyz
```

客户端必须忽略无法识别的响应参数。 OAuth 未定义授权代码字符串的大小。 客户端应该避免对授权码的大小做出假设。 授权服务器应该记录它发出的任何值的大小。  



#### 访问令牌请求

客户端发起向授权服务器的令牌端点发起一个 POST 请求，其 Content-type 必须为 “application/x-www-form-urlencoded”，并在其请求体中需要包含以下参数：

| 参数         | 必传 | 描述                                                         |
| ------------ | ---- | ------------------------------------------------------------ |
| grant_type   | 是   | 值必须是 “authorization_code”                                |
| code         | 是   | 值为上一步从授权服务器中收到的授权码                         |
| redirect_uri | 是   | 如果授权请求中携带了redirect_uri参数，则这里的值必须其相同   |
| client_id    | 是   | 如果客户端没有和授权服务器进行过 Client Credentials 的身份验证，则必须携带 |



如果客户端类型为机密或客户端颁发了客户端凭据(或分配了其他认证要求)，则客户端必须向授权服务器进行 Client Credentials 的身份验证。  

例如：

```http
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
     &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
```



授权服务器必须：

- 要求机密客户端或任何被颁发了客户端凭据（或有其他身份验证要求）的客户端进行客户端身份验证，
- 若包括了客户端身份验证，验证客户端身份，
- 确保授权码颁发给了通过身份验证的机密客户端，或者如果客户端是公开的，确保代码颁发给了请求中的“client_id”，
- 验证授权码是有效的，并
- 确保给出了 “redirect_uri” 参数，若 “redirect_uri” 参数包含在初始授权请求中，确保它们的值是相同的。



#### 访问令牌响应

如果访问令牌请求有效且已授权，授权服务器将发出访问令牌和可选的刷新令牌。 如果请求客户端认证失败或无效，授权服务器将返回一个错误响应。  

成功响应示例：

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
    "access_token":"2YotnFZFEjr1zCsicMWpAA",
    "token_type":"example",
    "expires_in":3600,
    "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
    "example_parameter":"example_value"
}
```







### 隐式授权 Implicit

grant_type：token

隐式授权是为用如 JavaScript 等脚本语言在浏览器种实现的客户端而优化的一种简化的授权码流程。在隐式授权流程种，不再给客户端办法授权码，而是直接给客户端颁发一个 access token。



```
     +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          ^
          |
         (B)
     +----|-----+          Client Identifier     +---------------+
     |         -+----(A)-- & Redirection URI --->|               |
     |  User-   |                                | Authorization |
     |  Agent  -|----(B)-- User authenticates -->|     Server    |
     |          |                                |               |
     |          |<---(C)--- Redirection URI ----<|               |
     |          |          with Access Token     +---------------+
     |          |            in Fragment
     |          |                                +---------------+
     |          |----(D)--- Redirection URI ---->|   Web-Hosted  |
     |          |          without Fragment      |     Client    |
     |          |                                |    Resource   |
     |     (F)  |<---(E)------- Script ---------<|               |
     |          |                                +---------------+
     +-|--------+
       |    |
      (A)  (G) Access Token
       |    |
       ^    v
     +---------+
     |         |
     |  Client |
     |         |
     +---------+
```

- (A)  客户端通过将资源所有者的用户代理定向到授权端点来启动流程。 客户端包括其客户端标识符、请求的范围、本地状态和重定向URI，授权服务器将在授予(或拒绝)访问后将用户代理发送回该重定向URI。  

- (B)  授权服务器(通过用户代理)对资源所有者进行身份验证，并确定资源所有者是授予还是拒绝客户端的访问请求。  

- (C)  假设资源所有者授予访问权，授权服务器使用先前提供的重定向URI(在请求中或在客户端注册期间提供)将用户代理重定向回客户端。 **重定向URI 的 Hash** 中将包含 access token。

- (D) 用户代理遵循重定向指令，向 web-hosted 的客户端资源发出请求（根据 [RFC2616]，URI 中的 Hash 部分不会携带在请求 URI 中携带）。用户代理将 Hash 中的参数取出并保存。  

- (E)  web-hosted 的客户端资源返回一个web页面(通常是一个带有嵌入式脚本的HTML文档)，该页面能够访问完整的重定向URI，包括用户代理保留的片段，并提取片段中包含的访问令牌(和其他参数)。  

- (F)  用户代理在本地执行由 web-hosted 的客户端资源提供的脚本，从而提取访问令牌。  

- (G)  用户代理将访问令牌传递给客户端。  



> (D) (E) 为非必选步骤，主要用于当用户代理不支持在 response header 的 Location 属性中包含 Hash 片段时，通过返回一个内嵌 javascript 的 html 页面，页面内引导用户点击按钮跳转向 redirect_url



#### 授权请求

客户端向授权端点发起请求时，其 URI 中的 QueryString，必须添加以下参数

| 参数          | 必传 | 描述                                                     |
| ------------- | ---- | -------------------------------------------------------- |
| response_type | 是   | 值必须是 "token"                                         |
| client_id     | 是   | 客户端标识                                               |
| redirect_uri  | 否   | 重定向地址，如果客户端在授权服务器中注册时已提供则可不传 |
| scope         | 否   | 请求访问的范围。                                         |
| state         | 否   | 推荐携带此值，用于防止跨站请求伪造                       |

请求示例：

```http
GET /authorize?response_type=token&client_id=s6BhdRkqt3&state=xyz&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
Host: server.example.com
```

授权服务器验证该请求，确保所有需要的参数已提交且有效。授权服务器必须验证它将访问令牌重定向到的重定向URI与客户端注册的重定向URI匹配。

如果请求是有效的，授权服务器对资源所有者进行身份验证并获得授权决定（通过询问资源所有者或通过经由其他方式确定批准）。

当确定决定后，授权服务器使用HTTP重定向响应向提供的客户端重定向URI定向用户代理，或者通过经由用户代理至该URI的其他可行方法。



#### 授权响应

如果资源所有者许可访问请求，授权服务器直接颁发访问令牌，通过向重定向URI的 Hash 部分添加下列参数传递 access token 至客户端：

| 参数         | 必传 | 描述                                                         |
| ------------ | ---- | ------------------------------------------------------------ |
| access_token | 是   | 授权服务器颁发的访问令牌。                                   |
| token_type   | 是   | 颁发的令牌的类型，其值是大小写不敏感的。（一般是 Bearer）    |
| expires_in   | 否   | 推荐的。以秒为单位的访问令牌生命周期。例如，值“3600”表示访问令牌将在从生成响应时的1小时后到期。如果省略，则授权服务器应该通过其他方式提供过期时间，或者记录默认值。 |
| scope        | 否   | 若与客户端请求的 scope 范围相同则可以不传，否则必需返回此值。 |
| state        | 否   | 当授权请求携带此参数时则必传，值原封不动回传                 |

 例如，授权服务器通过发送以下HTTP响应重定向用户代理：

```http
HTTP/1.1 302 Found
Location: http://example.com/cb#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600
```

开发人员应注意，一些用户代理不支持在HTTP“Location”HTTP响应标头字段中包含片段组成部分。这些客户端需要使用除了3xx重定向响应以外的其他方法来重定向客户端——-例如，返回一个HTML页面，其中包含一个具有链接到重定向URI的动作的“继续”按钮。

客户端必须忽略无法识别的响应参数。 OAuth 未定义授权代码字符串的大小。 客户端应该避免对授权码的大小做出假设。 授权服务器应该记录它发出的任何值的大小。  









### 资源所有者密码凭证 Resource Owner Password Credentials

grant_type：password

资源所有者密码凭据许可类型适合于资源所有者与客户端具有信任关系的情况，如设备操作系统或高级特权应用。当启用这种许可类型时授权服务器应该特别关照且只有当其他流程都不可用时才可以。

这种许可类型适合于能够获得资源所有者凭据（用户名和密码，通常使用交互的形式）的客户端。通过转换已存储的凭据至访问令牌，它也用于迁移现存的使用如HTTP基本或摘要身份验证的直接身份验证方案的客户端至OAuth。

```
     +----------+
     | Resource |
     |  Owner   |
     |          |
     +----------+
          v
          |    Resource Owner
         (A) Password Credentials
          |
          v
     +---------+                                  +---------------+
     |         |>--(B)---- Resource Owner ------->|               |
     |         |         Password Credentials     | Authorization |
     | Client  |                                  |     Server    |
     |         |<--(C)---- Access Token ---------<|               |
     |         |    (w/ Optional Refresh Token)   |               |
     +---------+                                  +---------------+
```

- (A) 资源所有者提供给客户端它的用户名和密码。

- (B) 通过包含从资源所有者处接收到的凭据，客户端从授权服务器的令牌端点请求访问令牌。当发起请求时，客户端与授权服务器进行身份验证。

- (C)  授权服务器对客户端进行身份验证，验证资源所有者的凭证，如果有效，颁发访问令牌。




#### 授权请求和响应

客户端获取资源所有者凭据 (用户名/密码) 的方法超出了本规范的范围。 一旦获得了访问令牌，客户端必须丢弃凭据。

  

#### 访问令牌请求

客户端向授权服务器的令牌端点发起一个 POST 请求，其 Content-type 必须为 “application/x-www-form-urlencoded”，并在其请求体中需要包含以下参数：

| 参数       | 必传 | 描述                 |
| ---------- | ---- | -------------------- |
| grant_type | 是   | 值必须是 “password”  |
| username   | 是   | 资源所有者的用户名。 |
| password   | 是   | 资源所有者的密码。   |
| scope      | 是   | 请求访问的范围       |

如果客户端类型是机密的或客户端被颁发了客户端凭据，则客户端必须要与授权服务器进行身份验证（request header 中携带 Authorization，值为 Base64(clientId:clientSecret) ）。

例如：

```http
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded
grant_type=password&username=johndoe&password=A3ddj3w
```

授权服务器必须：

- 要求机密客户端或任何被颁发了客户端凭据（或有其他身份验证要求）的客户端进行客户端身份验证，
- 若包括了客户端身份验证，验证客户端身份
- 使用它现有的密码验证算法验证资源所有者的密码凭据。

由于这种访问令牌请求使用了资源所有者的密码，授权服务器必须保护端点防止暴力攻击（例如，使用速率限制或生成警报）。



#### 访问令牌响应

如果访问令牌请求有效且已授权，授权服务器将发出访问令牌和可选的刷新令牌。 如果请求客户端认证失败或无效，授权服务器将返回一个错误响应。  一个成功响应的示例如下:

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "access_token":"2YotnFZFEjr1zCsicMWpAA",
  "token_type":"example",
  "expires_in":3600,
  "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
  "example_parameter":"example_value"
}
```







### 客户端凭证 Client Credentials

grant_type:  client_credentials

当客户端请求访问它所控制的，或者事先与授权服务器协商（所采用的方法超出了本规范的范围）的其他资源所有者的受保护资源，客户端可以只使用它的客户端凭据（或者其他受支持的身份验证方法）请求访问令牌。

客户端凭据许可类型必须只能由机密客户端使用。

```
     +---------+                                  +---------------+
     |         |                                  |               |
     |         |>--(A)- Client Authentication --->| Authorization |
     | Client  |                                  |     Server    |
     |         |<--(B)---- Access Token ---------<|               |
     |         |                                  |               |
     +---------+                                  +---------------+
```

- （A）客户端与授权服务器进行身份验证并向令牌端点请求访问令牌。
- （B）授权服务器对客户端进行身份验证，如果有效，颁发访问令牌。



#### 授权请求和响应

由于客户端身份验证被用作授权许可，所以不需要其他授权请求。



#### 访问令牌请求

客户端向授权服务器的令牌端点发起一个 POST 请求，其 Content-type 必须为 “application/x-www-form-urlencoded”，并在其请求体中需要包含以下参数：

| 参数       | 必传 | 描述                          |
| ---------- | ---- | ----------------------------- |
| grant_type | 是   | 值必须是 “client_credentials” |
| scope      | 是   | 请求访问的范围                |

一个请求示例如下：

```http
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
```

授权服务器必须验证客户端身份。  



#### 访问令牌响应

如果访问令牌请求有效且已授权，授权服务器将发出访问令牌，但并不包含刷新令牌。 如果请求客户端认证失败或无效，授权服务器将返回一个错误响应。  

一个成功响应的示例如下:

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
    "access_token":"2YotnFZFEjr1zCsicMWpAA",
    "token_type":"example",
    "expires_in":3600,
    "example_parameter":"example_value"
}
```







## 可扩展性

### 自定义访问令牌类型

### 自定义新的端点参数

### 自定义新的授权许可类型

比如手机号登录，我们就可以扩展一个 mobile 的 grant_type，来处理手机验证码登录的授权流程

### 自定义新的授权端点响应类型

### 自定义其他错误码
