# API验签组件

> Since 2.0.0

## 简介

为确保接口调用者的身份合法性并防止请求篡改，项目对外提供的接口通常需要添加验签处理。当前组件定义了一套签名规则，接口提供方可轻松接入以保护接口安全。

## 签名流程概述

应用接入方在使用接口前，需先向接口提供方申请一对 **AccessKey** 和 **SecretKey** 作为身份凭证。

在每次调用接口时，接入方需根据请求参数构建签名串，使用 MD5 算法生成签名值。签名值将与其他认证信息一同添加至 HTTP 请求头中。

### 签名串构建规则

签名串是生成签名值的核心数据，需按照以下顺序和规则拼接各参数：

1. **HTTP Method**

   请求的 HTTP 方法，大写字母形式（如：`POST`、`GET`）。

2. **HTTP Request** **URI**

   请求的 URI，包括查询字符串（Query String）部分，但不包含域名。

   例如：对于 `http://www.xxx.com/order?name=zhangsan` ，Request URI 为 `/order?name=zhangsan`。

3. **Request Body**

   请求体内容。若请求没有 Body，则该参数和分隔符 `#` 均不参与签名。

4. **Timestamp**

   请求发起时的 UNIX 时间戳（从1970年1月1日 00:00:00 UTC 起的总毫秒数）。平台将拒绝处理超时请求，确保系统时间准确。

5. **Nonce**

   随机生成的 32 位字符串，用于防止重放攻击。

6. **AccessKey**

   接入方的访问标识，由平台提供。

7. **SecretKey**

   访问密钥，用于签名生成，但 **不** 在请求中携带。

### 签名值计算

将按上述顺序拼接好的签名串，使用 MD5 算法进行摘要计算，得到小写签名值。

签名串的格式为：

```
{HTTP_METHOD}#{HTTP_URI}#{RequestBody}#{Timestamp}#{Nonce}#{AccessKey}#{SecretKey}
```

### 请求头设置

签名计算完成后，将以下参数添加至 HTTP 请求头：

- **X-Access-Key**：申请到的 AccessKey
- **X-Timestamp**：请求的时间戳
- **X-Nonce**：32 位随机字符串
- **X-Signature**：MD5 计算得到的签名值

## 具体示例

### 请求参数

假设以下请求参数：

- **HTTP_METHOD**: `GET`
- **HTTP_URI**: `/product/add`
- **RequestBody**: `{"productId":1}`
- **Timestamp**: `1710924789130`
- **Nonce**: `Js3eTl1I7oP5g8YpDnYX2danVrqRrqZg`
- **SecretKey**: `0cec22334545eea97776c7d5e39`

### 签名计算

拼接后的签名串为：

```Plain
GET#/product/add#{"productId":1}#1710924789130#Js3eTl1I7oP5g8YpDnYX2danVrqRrqZg#0cecd9245cc1107d8eea97776c7d5e39#0cec22334545eea97776c7d5e39
```

MD5 计算后的签名值为：

```Plain
0cecd9245cc1107d8eea97776c7d5e39
```

### 最终请求头

设置 HTTP 请求头如下：

```Plain
X-Access-Key: 0d30cfd0929a46ffb1200955d35bf18f
X-Timestamp: 1710924789130
X-Nonce: Js3eTl1I7oP5g8YpDnYX2danVrqRrqZg
X-Signature: 0cecd9245cc1107d8eea97776c7d5e39
```

## 组件接入

### 依赖引入

组件已经推送到私服，可以直接按坐标引入，下面提供了 maven 的引入示例：

spring boot 环境下，可以直接引入 ballcat-spring-boot-starter-apisignature 依赖包，该 starter 会在应用启动时进行自动配置。

```XML

<dependency>
    <groupId>org.ballcat</groupId>
    <artifactId>ballcat-spring-boot-starter-apisignature</artifactId>
</dependency>
```

### 代码实现

组件中有两个重要的实体，需要开发者自行实现，并注册到 Spring 容器中：

**ApiKeyManager**

对于 **AccessKey** 、 **SecretKey 、Subject** 的一个管理类，`Subject` 是调用方主体的一个抽象表示。在验签过程中，需要根据  *
*AccessKey** 查找到对应的 `Subject` ，再根据 `Subject`  获取到对应的  **SecretKey**，进行签名校验。

```
  public interface ApiKeyManager {
      /**
       * 根据传入的 Access Key 获取用户主体信息
       * @param accessKey Access Key
       * @return subject
       */
      Object getSubject(String accessKey);
  
      /**
       * 根据用户主体获取到对应的 secretKey.
       * @param subject 用户主体
       * @return 如果找到对应的 secretKey，则返回该 secretKey；否则返回 null
       */
      String getSecretKey(Object subject);
  }
```

**NonceStore**
用于存储随机和校验字符串，防止请求重放。

```Java
  public interface NonceStore {
      /**
       * 存储随机字符串，如果其不存在的话。
       * @param nonce 随机字符串
       * @param timeout 存储的过期时长
       * @param timeUnit 过期时长的单位
       * @return 如果当前随机字符串已存在，则返回 false.
       */
      boolean storeIfAbsent(String nonce, Long timeout, TimeUnit timeUnit);
  }
```

`Subject` 的具体类型和实现由开发者自行定义，`Subject` 会在验签成功后存入线程上线文，开发者可以通过 `SubjectHolder`
随时获取主体信息。所以建议在主体对象中存储一些常用的主体属性，如userId 等。

### 组件配置

| 配置项                                         | 数据类型         | 默认值              | 描述                                               |
|---------------------------------------------|--------------|------------------|--------------------------------------------------|
| `ballcat.api.signature.include-url-pattens` | List\<String\> | `["/**"]`        | 需要进行签名校验的 URL 规则列表。                              |
| `ballcat.api.signature.exclude-url-pattens`      | List\<String\> | `[]`             | 不需要进行签名校验的 URL 规则列表，优先级高于 `include-url-pattens`。 |
| `ballcat.api.signature.uri-prefix`               | String       | 无                | 请求 URI 的前缀字符串，当经过网关或 Nginx 时，恢复被重写的 URI。         |
| `ballcat.api.signature.signature-header`         | String       | `X-Signature`    | 存放签名信息的请求头名称。                                    |
| `ballcat.api.signature.timestamp-header`         | String       | `X-Timestamp`    | 存放请求时间戳的请求头名称。                                   |
| `ballcat.api.signature.nonce-header`             | String       | `X-Nonce`        | 存放32位随机字符串的请求头名称。                                |
| `ballcat.api.signature.access-key-header`        | String       | `X-Access-Key`   | 存放请求方标识的请求头名称。                                   |
| `ballcat.api.signature.timestamp-diff-threshold` | long         | `300000` (5 分钟)  | 请求时间戳和服务器时间戳允许的最大时间差（毫秒）。                        |
| `ballcat.api.signature.nonce-timeout`            | long         | `900000` (15 分钟) | `nonce` 随机字符串的存储过期时长（毫秒）。                        |
| `ballcat.api.signature.nonce-timeout-unit`       | TimeUnit     | `MILLISECONDS`   | `nonce-timeout` 的时间单位，默认为毫秒。                     |