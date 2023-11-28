# web

## 简介

## 使用方式

### 依赖引入

```xml-vue
<dependency>
    <groupId>org.ballcat</groupId>
    <artifactId>ballcat-spring-boot-starter-web</artifactId>
    <version>{{ $frontmatter.ballcatVersion }}</version>
</dependency>
```

## 访问日志

### 配置示例

```yaml
ballcat:
  web:
    accesslog:
      enabled: true
      default-record-options:
        ignored: false
        include-query-string: true
        include-request-body: false
        include-response-body: false
      rules:
        - url-pattern: /test/ignored
          record-options:
            ignored: true
        - url-pattern: /test/record-all
          record-options:
            ignored: false
            include-query-string: true
            include-request-body: true
            include-response-body: true
```

### 配置解析

| 配置项                                                                | 默认值   | 描述                                       |
|--------------------------------------------------------------------|-------|------------------------------------------|
| ballcat.web.accesslog.enabled                                      | false | 是否开启访问日志记录                               |
| ballcat.web.accesslog.default-record-options                       |       | 访问日志记录的默认选项，当请求路径无法在 rules 中匹配时，默认使用该配置项 |
| ballcat.web.accesslog.default-record-options.ignored               | false | 是否忽略记录                                   |
| ballcat.web.accesslog.default-record-options.include-query-string  | true  | 是否记录查询字符串                                |
| ballcat.web.accesslog.default-record-options.include-request-body  | false | 是否记录请求体                                  |
| ballcat.web.accesslog.default-record-options.include-response-body | false | 是否记录响应体                                  |
| ballcat.web.accesslog.rules                                        |       | 访问日志记录规则                                 |
| ballcat.web.accesslog.rules[0].url-pattern                         |       | 当前设置匹配的 URL 规则（Ant风格）                    |
| ballcat.web.accesslog.rules[0].record-options                      |       | 同default-record-options                  |

### 使用示例

可以通过使用**注解**或通过**配置文件**来进行使用，使用注解 **@AccessLoggingRule** 可以标记在类或者方法上，当类和方法上同时存在该注解时，将会优先应用方法上注解。

#### 使用注解

```java

@RequestMapping("/test")
@RestController
public class TestController {

    @GetMapping()
    public String testMethod() {
        return "Hello, World!";
    }

    @GetMapping("/ignored")
    public String ignoreLog() {
        return "Hello, World!";
    }

    @AccessLoggingRule(includeQueryString = true, includeResponseBody = true)
    @PostMapping("/annotation")
    public String annotation(@RequestBody String prefix) {
        return prefix + " Hello, World!";
    }

    @PostMapping("/record-all")
    public String recordAll(@RequestBody String prefix) {
        return prefix + " Hello, World!";
    }

}
```

::: tip 示例源码

本节的示例代码，可以在 [ballcat-spring-boot-starter-web](https://github.com/ballcat-projects/ballcat/tree/master/web/ballcat-spring-boot-starter-web/src/test/java/org/ballcat/autoconfigure/web/accesslog)
模块的单元测试用例中查看。

:::

### 注意事项

1. 当类和方法上同时存在该注解时，将会优先应用方法上注解规则
2. 当配置文件和注解所获取的 url-pattern 相同时，优先应用注解规则
3. rules 规则以当前 request uri 匹配中的第一个规则为准，所以通用性的规则应放在最后一项, 例如 /a/b 应在 /a/** 之前




