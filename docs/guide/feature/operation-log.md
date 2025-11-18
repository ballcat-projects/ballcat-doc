# 操作日志组件


## 基础使用

### 依赖引入

```xml-vue
    <dependency>
        <groupId>org.ballcat</groupId>
        <artifactId>ballcat-spring-boot-starter-operation-log</artifactId>
        <version>{{ $frontmatter.ballcatVersion }}</version>
    </dependency>
```

### 添加操作日志注解

```Java
@OperationLog(bizType = "Order", subType="Submit", bizNo = "#{#order.id}", successMessage = "用户提交了订单 #{#order.id}")
public Boolean orderSubmit(Order order) {
    // do something
}
```

只需以上两步即可完成操作日志组件的集成与基础使用，当执行 **orderSubmit** 方法时，就会输出对应的操作日志。

注意， **@OperationLog** 中的许多属性值都支持使用 SpEL 模板表达式，允许文字文本与一个或多个解析块的混合，每个解析块使用 `＃{}` 包裹。

例如上面 `successMessage` 的属性的值：**"用户提交了订单 #{#order.id}"**，最终结果是文本 **”用户提交了订单 “** 和 Spel 表达式 **”#order.id“** 计算后的值进行拼接得到的字符串，例如：**“用户提交了订单 10001”**。

更多注解内的 SpEL 表达式模板使用规则相关参看 [注解SpEL表达式规则](#注解SpEL表达式规则)  一节。

## 功能特性

### 操作日志分类

在 **@OperationLog** 注解中提供了 `bizType` 和 `subType` 用于实现操作日志的分类。

这两个属性使用者可以根据自己的业务进行合理的搭配，例如 bizType 为 "订单" 时，其 subType 可以是 "订单提交"、"订单退款"等，

也可以 bizType 是"订单退款"，subType 为 "用户退款"、"商家退款"、“平台退款” 这种，具体组合由使用者自己决定。



除此之外，注解中还有一个 `bizNo` 的属性（支持 SpEL），可以用来存储当前业务的标识，如订单号，用户ID 等。

```Java
@OperationLog(bizType = "订单", subType="提交", bizNo = "#{#order.id}", successMessage = "用户提交了订单 #{#order.id}")
public Boolean orderSubmit(Order order) {
    // do something
}
```

### 操作的信息文本定制

在 **@OperationLog** 注解中提供了 `successMessage` 、`failureMessage`、 `errorMessage`  这三个属性分别用于定制操作日志在操作成功、操作失败以及操作异常情况下对应文本，这三个属性均支持 SpEL 表达式。

操作异常很好理解，在执行方法时抛出了异常，导致操作中断，操作成功和操作失败的划分比较模糊，默认情况下，只要方法正常执行完成，就算操作成功。通过配置注解中的属性 `successCondition` 的值，可以定制操作成功和操作失败的判定逻辑。

`successCondition` 支持 SpEl 表达式，默认为空，表示不抛异常即为成功，如果配置了该属性，其解析值必须是 boolean 类型。

```Java
@OperationLog(bizType = "订单", subType="提交", bizNo = "#{#order.id}", successMessage = "用户提交订单成功", failureMessage = "用户提交订单失败", errorMessage = "用户提交订单时发生异常", successCondition = "_ret==true")
public Boolean orderSubmit(Order order) {
    // do something
}
```

按照以上配置，有在方法返回值为 true 时会记录 “用户提交订单成功”，如果返回 false 则会记录“用户提交订单失败”，当方法执行异常时，则会记录“用户提交订单时发生异常”。

### 指定操作日志的记录条件

在 **@OperationLog** 注解中提供了 `condition` 属性，用于控制是否进行操作日志的记录。

`condition` 支持 SpEl 表达式，默认为空，表示任何时候都记录，如果配置了该属性，其解析值必须是 boolean 类型。

```Java
    @OperationLog(bizType = "订单", subType="提交", bizNo = "#{#order.id}", successMessage = "用户提交了订单 #{#order.id}", condition = "_result==true" )
    public Boolean orderSubmit(Order order) {
        // do something
    }
```

按照以上配置，则只有在方法返回值为 true 时，才会进行订单提交的操作日志记录。

### 控制是否记录方法出入参

在 **@OperationLog** 注解中提供了 `isRecordArgs` 和 `isRecordResult` 属性，用于控制是否进行操作日志的记录，默认都为 true。

> 注意由于操作日志记录是后置执行，如果在方法内修改了原参数的值，会导致记录的方法入参非原始值。

### 填充操作人

在 **@OperationLog** 注解中提供了 `operator`  属性，用于获取当前操作人。

```Java
    /**
     * 操作人信息，支持使用 SpEL 表达式， 用于标识触发该操作的用户或系统实体。
     */
    String operator() default "#{@defaultOperatorProvider.get()}";
```

其默认值为 **“#{@defaultOperatorProvider.get()}”** ，表示会从 Spring 容器中获取一个 beanName 为 **“defaultOperatorProvider”** 的 bean，调用其 get() 方法得到的返回值。

```Java
public class DefaultOperatorProvider implements OperatorProvider {
    @Override
    public String get() {
            return "";
    }
}
```

如上所示，组件默认提供的 **defaultOperatorProvider** bean 只会返回空字符串，所以如果用户需要记录操作人，可以定制自己的 OperatorProvider，注意 bean name 必须为 **defaultOperatorProvider**，这时就会覆盖默认行为。以下是一个示例：

```Java
@Component("defaultOperatorProvider")
public class LifeOperatorProvider implements OperatorProvider {
    @Override
    public String get() {
            return LoginUserInfoContext.getUserId();
    }
}
```

除了提供 defaultOperatorProvider，以便提供默认值以外，还可以为每个方法定制其获取 operator 值的逻辑，例如可以从入参中获取：

```Java
@OperationLog(bizType = "订单", subType="提交", bizNo = "#{#order.id}", successMessage = "用户提交了订单 #{#order.id}", operator="#{#order.userId}" )
public Boolean orderSubmit(Order order) {
    // do something
}
```

### 填充 TraceId

在 **@OperationLog** 注解中提供了 `traceId`  属性，用于获取追踪ID。

```Java
    /**
     * <p>
     * 追踪ID，支持使用 SpEL 表达式。
     * </p>
     * 默认通过 defaultTraceIdProvider 获取当前操作人信息。
     * @see org.ballcat.operationlog.provider.DefaultTraceIdProvider
     */
    String traceId() default "#{@defaultTraceIdProvider.get()}";
```

类似于 operator，traceId 默认使用 beanName 为 **“defaultTraceIdProvider”** 的 bean 的 get() 方法返回值。

```Java
public class DefaultTraceIdProvider implements TraceIdProvider {
    @Override
    public String get() {
            return MDC.get(MDCConstants.TRACE_ID_KEY);
    }
}
```

组件默认提供的 **“defaultTraceIdProvider”** 会从 MDC 上下文中提取 **"traceId"**，用户也可以参考 `operator`  属性的配置方式，定制自己的 traceId 获取逻辑。

### 定制日志处理方式

在 **@OperationLog** 注解中提供了 `logHandler`  属性，用于指定日志处理器。

```Java
    /**
     * OperationLogHandler 类型，处理操作日志进行输出或者持久化等操作。
     */
    Class<? extends OperationLogHandler> logHandler() default OperationLogHandler.class;
```

默认值为 OperationLogHandler.class，执行时会从 spring 容器中获取一个 OperationLogHandler 类型的 bean。

组件默认提供的日志处理器，会通过 Slf4J 输出操作日志信息，但是大部分业务场景下，我们需要对操作日志做持久化处理，这时就需要定制自己的日志处理器。

```Java
@Slf4j
public class DefaultOperationLogHandler implements OperationLogHandler {
    @Override
    public void handle(OperationLogInfo operationLogInfo) {
            log.info("Operation Log: {}", JsonUtils.toJson(operationLogInfo));
    }
}
```

用户可以继承 `DefaultOperationLogHandler`，重写自己的持久化逻辑，覆盖默认行为。

也可以直接实现 `OperationLogHandler` 接口，保留 DefaultOperationLogHandler，这时由于 OperationLogHandler.class 类型的 bean 在 Spring 容器中有多个，获取 bean 时会产生异常，所以用户还需要在自己的 bean 上添加 **@Primary** 注解。

```Java
@Component
@Primary
public class MyOperationLogHandler implements OperationLogHandler {
    @Override
    public void handle(OperationLogInfo operationLogInfo) {
            // 推送 MQ
    }
}
```

下附 `OperationLogInfo` 类的结构：

```Java
@Data
public class OperationLogInfo {

    /**
     * 业务标识。
     */
    private String bizNo;

    /**
     * 业务类型。
     */
    private String bizType;

    /**
     * 业务子类型。
     */
    private String subType;

    /**
     * 操作人。
     */
    private String operator;

    /**
     * 操作消息。
     */
    private String message;

    /**
     * 执行方法的所属的全限定类名。
     */
    private String className;

    /**
     * 执行方法的方法名。
     */
    private String methodName;

    /**
     * 执行方法的入参。
     */
    private String methodArgs;

    /**
     * 执行方法的返回值。
     */
    private String methodResult;

    /**
     * 错误堆栈。
     */
    private String errorStack;

    /**
     * 额外信息。
     */
    private String extra;

    /**
     * 追踪ID。
     */
    private String traceId;

    /**
     * 操作状态。 1：成功 0：失败 -1：执行异常
     * @see org.ballcat.operationlog.enums.OperationStatusEnum
     */
    private Integer status;

    /**
     * HTTP信息。
     */
    private HttpInfo httpInfo;

    /**
     * 执行时间。
     */
    private Long executionTime;

    /**
     * 操作时间。
     */
    private LocalDateTime operationTime;

    @Data
    public static class HttpInfo {

        /**
         * 请求地址。
         */
        private String requestUri;

        /**
         * 请求方式。
         */
        private String requestMethod;

        /**
         * 客户端IP。
         */
        private String clientIp;

        /**
         * 用户代理。
         */
        private String userAgent;

        /**
         * 请求来源。
         */
        private String referer;

    }
}
```

### HTTP 信息获取

如果当前操作处于 Web 环境下时，会记录当前操作的 HTTP 请求信息，

在 **@OperationLog** 注解中提供了 `httpInfoProvider`  属性，用于指定HTTP信息提供者。

```Java
/**
* HttpInfoProvider 类型，用于提供 HTTP 请求信息。
*/
Class<? extends HttpInfoProvider> httpInfoProvider() default HttpInfoProvider.class;
```

以下是默认的 HttpInfoProvider 逻辑：

```Java
public class DefaultHttpInfoProvider implements HttpInfoProvider {

        @Override
        public OperationLogInfo.HttpInfo get() {
                ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes == null) {
                        return null;
                }
                HttpServletRequest request = attributes.getRequest();
                OperationLogInfo.HttpInfo httpInfo = new OperationLogInfo.HttpInfo();
                httpInfo.setRequestUri(request.getRequestURI());
                httpInfo.setRequestMethod(request.getMethod());
                httpInfo.setClientIp(IpUtils.getIpAddr(request));
                httpInfo.setUserAgent(request.getHeader(HttpHeaders.USER_AGENT));
                httpInfo.setReferer(request.getHeader(HttpHeaders.REFERER));
                return httpInfo;
        }
}
```

`httpInfoProvider`  和 `logHandler`  的定制逻辑基本一致，这里不再赘述。

### 额外信息填充

```Java
    /**
     * 日志的额外信息，支持使用 SpEL 表达式.
     */
    String extra() default "";
```

如果想在 message 之外额外记录一些信息，注解中还提供了一个 extra 字段，用于扩展。

## 注解的 SpEL 支持

### 模板语法

SpEL 表达式语言支持以下功能

- 文字表达式
- 布尔和关系运算符
- 正则表达式
- 类表达式
- 访问 properties, arrays, lists, maps
- 方法调用
- 关系运算符
- 参数
- 调用构造函数
- Bean引用
- 构造Array
- 内嵌lists
- 内嵌maps
- 三元运算符
- 变量
- 用户定义的函数
- 集合投影
- 集合筛选
- 模板表达式

这些基础语法，不在这里赘述，可以查看 Spring 官方文档了解：[SpEL表达式](https://docs.spring.io/spring-framework/reference/core/expressions.html)

在 `@OperationLog` 注解中所有支持 SpEL 表达式的属性，其值都会被作为一个  SpEL 模板表达式进行解析，允许文字文本与一个或多个解析块的混合，每个解析块使用 `＃{}` 包裹。

例如可以写 **successMessage = "用户 #{queryUsername(#order.userId)} 提交了订单 #{#order.id}"**

### 表达式变量

SpEL 解析时，会有一个上下文的概念，该上下文中可以填充一些变量，在 SpEL 表达式中通过 # 前缀，就可以进行变量的调用。

#### 方法入参

组件默认会将方法的参数填充到 SpEL 表达式上下文中，分别会根据参数的顺序填充 p0、p1 的变量名，也会以参数名作为变量名填充。

```Java
@OperationLog(bizType = "订单", subType="提交",
              successMessage = "用户 #{#user.username} 提交了订单 #{#p0.id}")
public Boolean orderSubmit(Order order，User user) {
    // do something
}
```

上面的例子中，使用 #p0 或者 #order 都可以获取当前方法的第一个入参，#p1、#user 都可以获取第二个入参。

#### 默认变量

除了方法入参之外，组件还会注入几个默认变量：

- **"_ret"**:  方法返回值
- **"_errorMsg"**:  方法执行异常时的异常错误信息
- **"_request"**:   当前请求，HttpServletReuqest，只有在 Web 环境下才会填充。



#### 自定义变量

另外，还可以在方法执行过程中添加变量，然后 SpEL 表达式中引用。

```Java
@OperationLog(bizType = "商品", subType="修改", bizNo = "#{#newProduct.id}",
              successMessage = "商品产生了变更，变更明细：#{#productDiff}")
public Boolean productUpdate(Product newProduct) {
    Product oldProduct = queryProduct(newProduct.id);
    // 获取变更明细，并添加到局部变量中
    String productDiff = diff(oldProduct, newProduct);
    OperationLogContextHolder.putLocalVariable("productDiff", productDiff);
    return update(newProduct);
}
```

如上所示，可以在方法执行过程中调用 `OperationLogContextHolder#putLocalVariable` 添加了一个 **“productDiff”** 的变量，作为 successMessage 的一部分。

由于方法可能会嵌套调用，@OperationLog 注解的上下文也会产生嵌套，如果想要将一个内部方法的变量保留，使外部方法也可以进行使用，则需要使用 `OperationLogContextHolder#putGlobalVariable` 放置全局变量：

```Java
@OperationLog(bizType = "商品", subType="修改", bizNo = "#{#newProduct.id}",
              successMessage = "商品产生了变更，变更明细：#{#productDiff}, SKU 变更： #{#skuListDiff}")
public Boolean productUpdate(Product newProduct) {
    Porduct oldProduct = queryProduct(newProduct.id);
    // 获取变更明细，并添加到局部变量中
    String productDiff = diff(oldProduct, newProduct);
    OperationLogContextHolder.putLocalVariable("productDiff", productDiff);
    return update(newProduct);
}

@OperationLog(bizType = "SKU", subType="修改", successMessage = "SKU 产生了变更，变更明细：#{#skuListDiff}")
public Boolean skuUpdate(List<Sku> skuList) {
    OperationLogContextHolder.putGlobalVariable("skuListDiff", skuListDiff);
    return updateSkus(skuList);
}
```

### 根对象

SpEL 解析时会有一个 rootObject 的概念，该对象的值默认为当前方法的实例对象。

在编写表达式时，可以直接获取该实例对象的属性，以及调用该实例对象的方法，如下所示，successMessage 中对于用户名的拼接就调用了同类中的 queryUsername 方法。

```Java
@OperationLog(bizType = "订单", subType="提交", bizNo = "#{#order.id}",
              successMessage = "用户 #{queryUsername(#order.userId)} 提交了订单 #{#order.id}")
public Boolean orderSubmit(Order order) {
    // do something
}

public String queryUsername(String userId) {
    // do something
}
```

这里调用 queryUsername 方法，无需添加 # 前缀。

## 业务组件

TODO 文档撰写

## 参考

[美团技术团队 - 如何优雅地记录操作日志？](https://tech.meituan.com/2021/09/16/operational-logbook.html)