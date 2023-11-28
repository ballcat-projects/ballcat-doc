# 脱敏工具

为防止隐私或敏感数据的泄露，项目开发中经常需要对特定的数据进行脱敏处理，BallCat 为此提供了一个脱敏工具包


## 1. 简介

根据不同的脱敏方式，BallCat 划分出了三种脱敏类型

- Simple（简单脱敏）：

  只需根据原始数据即可推出脱敏后的数据的处理方式。

  > 例如简单粗暴的将数据替换为 6个* 号的处理方式：`a1234` => `******`

- Regex （正则脱敏）：

  将原始数据根据正则表达式进行替换处理。

  > 例如邮箱处理后第一个字符和'@'之后的原文显示，中间的显示为4个*：`12123124213@qq.com` => `1****@qq.com`

- Slide（滑动脱敏）

  根据设置的左右明文数来控制明文展示，剩余的全部替换为 *，好处在于会保留原始数据位数，提升辨析度。

  > 例如手机号处理，明文保持前三后二：`15805516789` => `158******89`

在实际使用中，可以根据需求进行额外的拓展处理



## 2. 依赖安装

此工具包已发布到 Maven 中央仓库，可以将以下内容添加到您的 POM 文件中以使用

```xml-vue
<dependency>
  <groupId>org.ballcat</groupId>
  <artifactId>ballcat-desensitize</artifactId>
  <version>{{ $frontmatter.ballcatVersion }}</version>
</dependency>
```



## 3. 基本使用

### 3.1 脱敏处理器

BallCat 提供了 `DesensitizationHandlerHolder` 类，来对系统内的所有脱敏处理器进行归集，方便使用的时候直接获取，而不必再创建新的对象。

### 3.2 简单脱敏

对于简单脱敏类型，BallCat 只内置了一种脱敏处理器：`SixAsteriskDesensitizationHandler`，不管原文是什么，一律返回6个 *。

使用示例：

```java
		// 获取简单脱敏处理器
		SimpleDesensitizationHandler desensitizationHandler = 
				DesensitizationHandlerHolder.getSimpleHandler(SixAsteriskDesensitizationHandler.class);
		String origin = "你好吗？";  // 原始字符串
		String target = desensitizationHandler.handle(origin); // 替换处理
		System.out.println(target);  // 结果：******
```

如需定制自己的简单脱敏处理器，参看扩展使用。



### 3.3 正则脱敏

正则脱敏使用时，除了原始字符串之外，还需要提供正则表达式，以及占位替换表达式，以便处理数据。

使用示例：

```java
		// 获取正则脱敏处理器
		RegexDesensitizationHandler desensitizationHandler =
				DesensitizationHandlerHolder.getRegexDesensitizationHandler();
		String origin = "12123124213@qq.com"; // 原始字符串
		String regex = "(^.)[^@]*(@.*$)";    // 正则表达式
		String replacement = "$1****$2";     // 占位替换表达式
		String target = desensitizationHandler.handle(origin, regex, replacement); // 替换处理
		System.out.println(target);  // 结果：1****@qq.com
```

由于 BallCat 默认提供了 Email 类型的脱敏正则，所以可以使用以下代码来简化正则的定义：

```java
		// 使用内置的正则脱敏类型
		String target2 = desensitizationHandler.handle(origin, RegexDesensitizationTypeEnum.EMAIL);
		System.out.println(target2);  // 结果：1****@qq.com
```



### 3.4 滑动脱敏

滑动脱敏则除了原始字符串之外，还需要提供左边和右边各自需要展示的明文数量，明文数量可以为 0。

使用示例：

```java
		// 获取滑动脱敏处理器
		SlideDesensitizationHandler desensitizationHandler =
				DesensitizationHandlerHolder.getSlideDesensitizationHandler();
		String origin = "15805516789"; // 原始字符串
		String target1 = desensitizationHandler.handle(origin, 3, 2); // 替换处理
		System.out.println(target1);  // 结果：158******89
```

和正则脱敏一样，由于 BallCat 默认提供了 PhoneNumber 类型的滑动规则，所以可以使用以下代码来简化：

```java
		// 使用内置的滑动脱敏规则
		String target2 = desensitizationHandler.handle(origin, SlideDesensitizationTypeEnum.PHONE_NUMBER);
		System.out.println(target2); // 结果：158******89
```



## 4. 脱敏注解

### 4.1 注解分类

在 web 服务中，服务端的响应数据很多情况下都是 json 数据，为了更方便的进行数据脱敏，BallCat 提供了以下三种脱敏注解。

> 目前 json 处理基于 Jackson，因为 springMvc 默认的 json 处理是使用 jackson

- `@JsonSimpleDesensitize` ：简单类型脱敏
- `@JsonRegexDesensitize`：正则类型脱敏
- `@JsonSlideDesensitize`：滑动类型脱敏

### 4.2 定义 Json 序列化修改器

如果需要使用 json 注解脱敏，则需要将 BallCat 提供的 `JsonSerializerModifier` 注册到 Jackson 的 `ObjectMapper` 中。

示例如下：

```java
    //1.创建Object对象
    ObjectMapper objectMapper = new ObjectMapper();
    //2.实例化JsonSerializerModifier
    JsonSerializerModifier modifier = new JsonSerializerModifier();
    //3.将自定义序列化构建器 注册进ObjectMapper
    objectMapper.setSerializerFactory(objectMapper.getSerializerFactory().withSerializerModifier(modifier));
```

如果是 spring-boot 项目，推荐使用以下方式进行 JSON 脱敏序列化修改器的注册：

```java
	/**
	 * 注册 Jackson 的脱敏模块
	 * @return JsonDesensitizeModule
	 */
	@Bean
	public JsonDesensitizeModule jsonDesensitizeModule() {
		JsonDesensitizeSerializerModifier desensitizeModifier = new JsonDesensitizeSerializerModifier();
		return new JsonDesensitizeModule(desensitizeModifier);
	}
```



### 4.3 注解添加

在需要进行脱敏处理的实体属性上添加对应的脱敏注解：

```java
@Data
@Accessors(chain = true)
public class DesensitizationUser {

	/**
	 * 用户名，不脱敏
	 */
	private String username;

	/**
	 * 密码脱敏
	 */
	@JsonRegexDesensitize(type = RegexDesensitizationTypeEnum.ENCRYPTED_PASSWORD)
	private String password;

	/**
	 * 邮件
	 */
	@JsonRegexDesensitize(type = RegexDesensitizationTypeEnum.EMAIL)
	private String email;

	/**
	 * 手机号
	 */
	@JsonSlideDesensitize(type = SlideDesensitizationTypeEnum.PHONE_NUMBER)
	private String phoneNumber;

	/**
	 * 测试自定义脱敏
	 */
	@JsonSimpleDesensitize(handler = TestDesensitizationHandler.class)
	private String testField;

}
```

### 4.4 JSON 脱敏

在 SpringMvc（Spring-Boot） 项目中，在 ObjectMapper 中完成了注册并在实体字段上添加了对应注解，就已经完成了脱敏处理。

当响应的 Json 数据类型为该 实体时，即会自动进行脱敏处理。

> 注意，这里需要保证 SpringMvc 中使用的 ObjectMapper 注册了脱敏处理器

如果需要手动处理数据，则可以使用依赖注入获取到对应 ObjectMapper：

```java
@Autowired
private ObjectMapper objectMapper;

void test(){
   DesensitizationUser user = new DesensitizationUser()
        .setEmail("chengbohua@foxmail.com")
        .setUsername("xiaoming")
		.setPassword("admina123456")
        .setPhoneNumber("15800000000")
        .setTestField("这是测试属性");
	String value = objectMapper.writeValueAsString(user);
    Assert.isTrue("{\"username\":\"xiaoming\",\"password\":\"adm****56\",\"email\":\"c****@foxmail.com\",\"phoneNumber\":\"158******00\",\"testField\":\"TEST-这是测试属性\"}"
						.equals(value));
}
```



## 5. 扩展使用

### 5.1 自定义简单类型脱敏处理器

a) 首先定义自己的 `SimpleDesensitizationHandler` 实现类:

```java
public class SimpleDesensitizatioHanderSPIExample implements SimpleDesensitizationHandler {
    @Override
    public String handle(String s) {
        return "------";
    }
}
```

b) BallCat 会利用 java 的 SPI 机制来加载简单脱敏处理器

所以只需在项目的 `resources/META-INF/services` 目录下新建名为

`org.ballcat.desensitize.handler.SimpleDesensitizationHandler` 的文件。

文件内容为自定义的脱敏处理器的全类名，多个实现则每个实现类名单独一行。

c) 使用示例

获取自定义处理器，入参为该处理器类目

```java
		// 获取简单脱敏处理器
		SimpleDesensitizationHandler desensitizationHandler = 
				DesensitizationHandlerHolder.getSimpleHandler(SimpleDesensitizatioHanderSPIExample.class);
```

配合 JSON 注解使用时，只需指定 Handler 类型为该类即可

```java
        /**
         * 测试自定义脱敏
         */
        @JsonSimpleDesensitize(handler = SimpleDesensitizatioHanderSPIExample.class)
        private String testField;
```



### 5.2 JSON 处理时，根据某些逻辑判断是否需要脱敏

需要用户进行脱敏策略接口的实现：

```java
    public interface DesensitizeStrategy {
        /**
         * 判断是否忽略字段
         * @param fieldName {@code 当前字段名称}
         * @return @{code true 忽略 |false 不忽略}
         */
        boolean ignoreField(String fieldName);
    }
```

在注册脱敏修改器的时候，进行

```java
	// 自定义策略，当前用户是管理员时忽略 phoneNumber 字段的脱敏处理
    DesensitizeStrategy strategy = (fieldName) -> {
        return fieldName.equals("phoneNumber") && isAdmin;
    };
    JsonSerializerModifier modifier = new JsonSerializerModifier(strategy);
```



### 5.3 自定义 JSON 脱敏注解示例

#### 5.3.1 新增自定义注解

```java
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CustomerDesensitize {
	/**
	 * 类型字段
	 * @return type
	 */
	String type();
}
```

#### 5.3.2 注册自定义脱敏类型处理器

```java
//实现自定义脱敏处理器
CustomDesensitisedHandler customDesensitisedHandler = new CustomDesensitisedHandler();
//将自定义脱敏处理器绑定	
DesensitizationHandlerHolder.addHandler(CustomDesensitisedHandler.class, customDesensitisedHandler);
```

#### 5.3.3 注册注解处理器

```java
//注册注解 处理器
AnnotationHandlerHolder.addHandleFunction(CustomerDesensitize.class, (annotation, value) -> {
    CustomerDesensitize customerDesensitize= (CustomerDesensitize) annotation;
    String type = customerDesensitize.type();
    log.info("注解上的参数{}",type);
    CustomDesensitisedHandler handler = (CustomDesensitisedHandler) DesensitizationHandlerHolder.getHandler(CustomDesensitisedHandler.class);
    return handler.handle(value);
});
```

#### 5.3.4 在实体字段上指定自定义注解

```java
	@CustomerDesensitize(type = "自定义注解")
	private String customDesensitize;
```
