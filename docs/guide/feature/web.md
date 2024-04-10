# web

## 简介

ballcat 在 spring-boot-starter-web 组件上进行了进一步的封装，以便更为便捷的进行 web 开发，包含的功能点如下：

- 可选的访问日志记录功能
- 全局 TraceId 生成，放入 slf4j 的 MDC 中，并在响应时追加到响应头中
- 提供针对 actuator 端点的安全拦截
- 针对 javax validation 相关注解的 message 扩展，事其支持使用 {} 占位替换默认消息
- 调整了部分 spring boot 中对于 jackson 的默认配置，同时提供了脱敏模块
- 提供了分页查询参数 PageParam 的参数解析器，消减分页查询时被 SQL 注入的风险
- 为 SpringUtils 工具类注入应用上下文

## 依赖安装

组件已经推送到 Maven 中央仓库，使用 maven 或 gradle 等包管理工具时，可以直接按坐标引入，下面提供了 maven 的引入示例：

spring boot 环境下，可以直接引入 ballcat-spring-boot-starter-web 依赖包，该 starter 会在应用启动时进行自动配置。

```xml-vue
<dependency>
    <groupId>org.ballcat</groupId>
    <artifactId>ballcat-spring-boot-starter-web</artifactId>
    <version>{{ $frontmatter.ballcatVersion }}</version>
</dependency>
```

非 spring boot 环境，或需要进行配置的深度定制，可仅引入 ballcat-spring-boot-web，在此基础上进行手动配置。

```xml-vue
<dependency>
    <groupId>org.ballcat</groupId>
    <artifactId>ballcat-spring-boot-web</artifactId>
    <version>{{ $frontmatter.ballcatVersion }}</version>
</dependency>
```

## 访问日志

访问日志功能默认为关闭状态，需要在 application.yml/properties 配置文件中，将 `ballcat.web.accesslog.enabled` 属性设置为
true。

### 配置列表

| 配置项                                                                | 默认值 | 描述                                                                      |
| --------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------- |
| ballcat.web.accesslog.enabled                                         | false  | 是否开启访问日志记录                                                      |
| ballcat.web.accesslog.filter-order                                    | -1000  | 访问日志过滤器的优先级                                                    |
| ballcat.web.accesslog.filter-auto-register                            | true   | 自动注册访问日志过滤器                                                    |
| ballcat.web.accesslog.default-record-options                          |        | 访问日志记录的默认选项，当请求路径无法在 rules 中匹配时，默认使用该配置项 |
| ballcat.web.accesslog.default-record-options.ignored                  | false  | 是否忽略记录                                                              |
| ballcat.web.accesslog.default-record-options.include-query-string     | true   | 是否记录查询字符串                                                        |
| ballcat.web.accesslog.default-record-options.include-request-body     | false  | 是否记录请求体                                                            |
| ballcat.web.accesslog.default-record-options.include-response-body    | false  | 是否记录响应体                                                            |
| ballcat.web.accesslog.default-record-options.max-request-body-length  | 256    | 记录的最大请求体字符长度，-1 表示不限制长度                               |
| ballcat.web.accesslog.default-record-options.max-response-body-length | 256    | 记录的最大响应体字符长度，-1 表示不限制长度                               |
| ballcat.web.accesslog.rules                                           |        | 访问日志记录规则                                                          |
| ballcat.web.accesslog.rules[x].url-pattern                            |        | 当前设置匹配的 URL 规则（Ant 风格）                                       |
| ballcat.web.accesslog.rules[x].record-options                         |        | 同 default-record-options                                                 |

### 配置示例

```yaml
ballcat:
  web:
    accesslog:
      enabled: true     # 开启访问日志记录
      default-record-options: # 默认的访问日志记录喧嚣
        ignored: false                    # 不忽略记录
        include-query-string: true        # 记录 query string 信息
        include-request-body: false       # 记录请求体
        include-response-body: false      # 记录响应体
      rules:
        - url-pattern: /test/ignored    # 针对指定 url 的配置
          record-options:
            ignored: true                 # 忽略访问日志记录
        - url-pattern: /test/record-all
          record-options:
            ignored: false
            include-query-string: true
            include-request-body: true
            include-response-body: true
            max-request-body-length: -1 # 记录所有请求体
            max-response-body-length: 512 # 记录最大 512 字符的响应体
```

### 记录选项

除了在配置文件中对指定 url 进行访问日志的记录选项设置，也可以使用 `@AccessLoggingRule` 注解进行记录选项的设置。

```java
@AccessLoggingRule(includeQueryString = true, includeRequestBody = true，includeResponseBody = true)
@RequestMapping("/test")
@RestController
public class TestController {
 
    // 走方法上注解，只记录 QueryString 和 ResponseBody
    @AccessLoggingRule(includeQueryString = true, includeResponseBody = true)
    @PostMapping("/annotation")
    public String annotation(@RequestBody String prefix) {
        return prefix + " Hello, World!";
    }

    // 走类上注解，记录 QueryString、RequestBody 和 ResponseBody
    @PostMapping("/record-all")
    public String recordAll(@RequestBody String prefix) {
        return prefix + " Hello, World!";
    }
}
```

::: warning 注意事项

1. 当类和方法上同时存在 `@AccessLoggingRule` 注解时，将会优先应用方法上注解规则
2. 当配置文件和注解所获取的 url-pattern 相同时，优先应用注解规则
3. rules 规则以当前 request uri 匹配中的第一个规则为准，所以通用性的规则应放在最后一项, 例如 /a/b 应在 /a/** 之前
   :::

>
本节的示例代码，可以在 [ballcat-spring-boot-starter-web](https://github.com/ballcat-projects/ballcat/tree/master/web/ballcat-spring-boot-starter-web/src/test/java/org/ballcat/autoconfigure/web/accesslog)
模块的单元测试用例中查看。

### 日志过滤器

日志过滤器 `AccessLogFilter` 是一个空接口，`AbstractAccessLogFilter` 抽象类实现了该接口，并完成了大部分的访问日志逻辑，该抽象类中包含了两个抽象方法：

```java
// 请求前处理
protected abstract void beforeRequest(HttpServletRequest request, AccessLogRecordOptions recordOptions);

// 请求后处理
protected abstract void afterRequest(HttpServletRequest request, HttpServletResponse response, Long executionTime,
        Throwable throwable, AccessLogRecordOptions recordOptions);
```

子类需要实现这两个抽象方法，以完成最终的访问日志输出/存储逻辑。

ballcat 默认注册的日志过滤器 `DefaultAccessLogFilter` 会通过 slf4j 在请求前后以 DEBUG 级别输出访问日志。

如果需要修改访问日志的输出/存储逻辑，例如保存到数据库/ES中，可以通过注册自己的日志过滤器到 spring 容器中，来覆盖默认行为。

## 全局 TraceID

ballcat 通过 TraceIdFilter 进行全局 traceId 的生成以及响应， 如果当前请求头中携带了 traceId，则使用该 traceId，否则生成一个新的
traceId。

### 配置列表

| 配置项                              | 默认值        | 描述                |
|----------------------------------|------------|-------------------|
| ballcat.web.trace-id-header-name | X-Trace-Id | traceId 的请求/响应头名称 |

### 生成器

TraceID 生成时默认使用 ObjectId 进行生成，如果需要修改该生成逻辑，例如从 skywalking 中获取 TraceID,
则可以注册自己的 `TraceIdGenerator` 到 spring 容器中，即可覆盖默认行为。

`TraceIdGenerator` 是一个 FunctionInterface 所以可以用 lambda 简化，如下是注册一个使用 UUID 的 `TraceIdGenerator` 示例：

```java 
	@Bean
    public TraceIdGenerator traceIdGenerator() {
        return () -> UUID.randomUUID().toString;
    }
```

## Jackson 配置

ballcat 完全支持 spring boot 提供的 jackson 配置属性，仅对于以下几个属性有所特殊：

```java
// 对于空对象的序列化不抛异常
objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
// 序列化时忽略未知属性
objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
// NULL值修改
objectMapper.setSerializerProvider(new NullSerializerProvider());
// 有特殊需要转义字符, 不报错
objectMapper.enable(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS.mappedFeature());
```

### NULL 值修改

其中 NULL 值修改这个是 ballcat 自定义的，主要在序列化时做了以下处理：

- String 类型，null 值转为 '' 输出
- 集合、数组，null 值转为 [] 输出
- Map 类型，null 值转为 {} 输出

### Jackson 脱敏支持

具体参看文档 [脱敏工具](./desensitization)


## 分页查询参数解析器

ballcat 推荐在系统中全局的分页参数都使用 `PageParam` 类进行接收，但是每个系统的分页参数可能不尽相同，为了保证 `PageParam`
参数的有效解析，提供了 `PageParamArgumentResolver` 组件进行处理。

```java
@Data
@Schema(title = "分页查询参数")
public class PageParam {
    
	@Schema(title = "当前页码", description = "从 1 开始", defaultValue = "1", example = "1")
	@Min(value = 1, message = "当前页不能小于 1")
	private long page = 1;

	@Schema(title = "每页显示条数", description = "最大值为系统设置，默认 100", defaultValue = "10")
	@Min(value = 1, message = "每页显示条数不能小于1")
	private long size = 10;

	@Schema(title = "排序规则")
	@Valid
	private List<Sort> sorts = new ArrayList<>();

	@Schema(title = "排序元素载体")
	@Getter
	@Setter
	public static class Sort {

		@Schema(title = "排序字段", example = "id")
		@Pattern(regexp = PageableConstants.SORT_FILED_REGEX, message = "排序字段格式非法")
		private String field;

		@Schema(title = "是否正序排序", example = "false")
		private boolean asc;

	}
}
```

### 配置列表
| 配置项                                  | 类型     | 默认值  | 描述        |
|--------------------------------------|--------|------|-----------|
| ballcat.pageable.page-parameter-name | string | page | 当前页数的参数名  |
| ballcat.pageable.size-parameter-name | string | size | 每页数据量的参数名 |
| ballcat.pageable.sort-parameter-name | string | sort | 排序规则的参数名  |
| ballcat.pageable.max-page-size       | int    | 100  | 每页最大数据量   |

### 映射规则

分页查询并未限制请求的 HTTP 方法，GET、POST 都可以，但是参数需要放在 QueryString 中，只有在 content-type 为 `application/x-www-form-urlencoded` 时，参数可以使用放在请求体中。

排序规则的格式为：property(,asc|desc)。默认为升序，支持传入多个排序字段。

以配置中的所有配置项的默认值为例，发起一个获取第二页的数据，每页数据为 10，数据查询时先按照 user_id 倒序再按 create_time 升序排序的分页请求的 url 如下所示:

`/user/page?page=2&size=10&sort=user_id,desc&sort=create_time` 

### SQL 防注入

在做请求参数到 `PageParam` 实例映射时，`PageParamArgumentResolver` 会对排序参数进行校验，如果参数不合法有 SQL 注入风险就会输出警告，并忽略该分页参数。


## Validation 消息扩展

我们以 `@NotNull` 注解为例，该注解的 message 属性默认值为 `javax.validation.constraints.NotNull.message`，
其对应中文值为 “不得为 null”.

```properties
#ValidationMessages_zh_CN.properties
javax.validation.constraints.NotNull.message = 不得为 null
```

如果我们在使用时不指定 message 的值，那么通常在获得异常信息时是无法知道是哪个属性为 null，所以我们一般需要覆盖默认的
message 属性：

```java
@Data
public class DemoData {
    @NotNull(message = "用户名：不能为 null")
    private String username;
}
```

而在使用 ballcat-spring-boot-starter-web 后，就可以将默认 message 提示简化为 "{}" 进行占位，在提示效率的同时，还能享受到
hibernate validator 对默认消息的国际化处理支持，更多国际化相关可以参看[国际化组件](./i18n)。

```java
@NotNull(message = "用户名：{}")
private String username;
```