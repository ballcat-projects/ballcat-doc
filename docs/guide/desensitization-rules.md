# 脱敏使用规则

## 一、引入`ballcat-common-desensitize`坐标

```xml
  <dependency>
            <groupId>com.hccake</groupId>
            <artifactId>ballcat-common-desensitize</artifactId>
            <version>${version}</version>
  </dependency>
```

## 二、将`JsonSerializerModifier`引入到当前工程的ObjectMapper对象中

```java
//1.创建Object对象
ObjectMapper objectMapper = new ObjectMapper();
//2.实例化JsonSerializerModifier
JsonSerializerModifier modifier = new JsonSerializerModifier();
//3.将自定义序列化构建器 注册进ObjectMapper
objectMapper.setSerializerFactory(objectMapper.getSerializerFactory().withSerializerModifier(modifier));
```

## 三、新建实体类`DesensitizationUser`

```java
/**
 * @author Hccake 2021/1/23
 * @version 1.0
 */
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

## 四、执行序列化方法

```java
	DesensitizationUser user = new DesensitizationUser()
        .setEmail("chengbohua@foxmail.com")
        .setUsername("xiaoming")
		.setPassword("admina123456")
        .setPhoneNumber("15800000000")
        .setTestField("这是测试属性");
	String value = objectMapper.writeValueAsString(user);
    Assert.isTrue("{\"username\":\"xiaoming\",\"password\":\"adm****56\",\"email\":\"c****@foxmail.com\",\"phoneNumber\":\"158******00\",\"testField\":\"TEST-这是测试属性\"}"
						.equals(value));
```

## 附: 扩展方法

### 一、根据字段属性自定义是否进行脱敏

> 只需要修改`JsonSerializerModifier`实列方式,增加`DesensitizeHandler`实现类即可

```java
       //指定DesensitizeHandler 若ignore方法为true 则忽略脱敏 false 则启用脱敏
		JsonSerializerModifier modifier = new JsonSerializerModifier((fieldName) -> {
			log.info("当前字段名称{}",fieldName);
			return false;
		});
```



### 二、自定义注解与注解处理器

#### 一、新增自定义注解

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

#### 二、注册自定义脱敏类型处理器 

```java
//实现自定义脱敏处理器
CustomDesensitisedHandler customDesensitisedHandler = new CustomDesensitisedHandler();
//将自定义脱敏处理器绑定	
DesensitizationHandlerHolder.addHandler(CustomDesensitisedHandler.class,customDesensitisedHandler);

```

#### 三、注册注解处理器

> 若要高度扩展 可直接注册注解处理函数，省略第二步骤的自定义脱敏类型处理器

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

#### 四、在实体字段上指定自定义注解

```java
	@CustomerDesensitize(type = "自定义注解")
	private String customDesensitize;
```



#### 三、单元测试

```java
	@Test
	void desensitizedExtend() throws JsonProcessingException {
		//注册自定义脱敏类型处理器
		CustomDesensitisedHandler customDesensitisedHandler = new CustomDesensitisedHandler();
		DesensitizationHandlerHolder.addHandler(CustomDesensitisedHandler.class,customDesensitisedHandler);
		//注册注解 处理器
		AnnotationHandlerHolder.addHandleFunction(CustomerDesensitize.class, (annotation, value) -> {
			CustomerDesensitize customerDesensitize= (CustomerDesensitize) annotation;
			String type = customerDesensitize.type();
			log.info("注解上的参数{}",type);
			CustomDesensitisedHandler handler = (CustomDesensitisedHandler) DesensitizationHandlerHolder.getHandler(CustomDesensitisedHandler.class);
			return handler.handle(value);
		});
		// 初始化序列号modifier
		JsonSerializerModifier modifier = new JsonSerializerModifier();
		objectMapper.setSerializerFactory(objectMapper.getSerializerFactory().withSerializerModifier(modifier));

		DesensitizationUser user = new DesensitizationUser().setEmail("chengbohua@foxmail.com").setUsername("xiaoming")
				.setPassword("admina123456").setPhoneNumber("15800000000").setTestField("这是测试属性")
				.setCustomDesensitize("自定义属性");
		String value = objectMapper.writeValueAsString(user);
        Assert.isTrue(
        		"{\"username\":\"xiaoming\",\"password\":\"adm****56\",\"email\":\"c****@foxmail.com\",\"phoneNumber\":\"158******00\",\"testField\":\"TEST-这是测试属性\",\"customDesensitize\":\"customer rule自定义属性\"}"
		.equals(value));
		log.info("脱敏后的数据：{}", value);
	}
```

### 三、在Springboot配置脱敏

```java
	/**
	 * 注册 Jackson 的序列化器，用于处理 desensitized 类型参数
	 * @return Jackson2ObjectMapperBuilderCustomizer
	 */
	@Bean
	public Jackson2ObjectMapperBuilderCustomizer desensitizeJacksonCustomizer() {
		SimpleModule simpleModule = new SimpleModule();
        simpleModule.setSerializerModifier(new JsonSerializerModifier(fieldName -> {
            //进行字段级别控制 是否需要脱敏 true 忽略 false 脱敏
            return true;
        }));
		return builder -> builder.modules(simpleModule);
	}
```

### 四、SPI注册简单脱敏使用类型

#### 一、定义`SimpleDesensitizationHandler` 实现类handler

```java
public class SimpleDesensitizatioHanderSPIExample implements SimpleDesensitizationHandler {
    @Override
    public String handle(String s) {
        return "------";
    }
}
```

#### 二、注册实现类

> 在`resources` 下面新建META-INF/services目录

新建文件名称为接口的全限定类型`com.hccake.ballcat.common.desensitize.handler.SimpleDesensitizationHandler`

内容只需要指定接口实现类即可  多个实现用换行符分隔

```spi
com.moppo.lopmartech.admin.config.SimpleDesensitizatioHanderSPIExample
```

#### 三、在实体类上指定自定义简单处理器

```java
	/**
	 * 测试自定义脱敏
	 */
	@JsonSimpleDesensitize(handler = SimpleDesensitizatioHanderSPIExample.class)
	private String testField;
```

#### 四、编写单元测试

```java
@Test
void test() throws JsonProcessingException {
		ObjectMapper objectMapper = new ObjectMapper();
		JsonSerializerModifier modifier = new JsonSerializerModifier();
		objectMapper.setSerializerFactory(objectMapper.getSerializerFactory().withSerializerModifier(modifier));
		DesensitizationUser user = new DesensitizationUser().setEmail("chengbohua@foxmail.com").setUsername("xiaoming")
				.setPassword("admina123456").setPhoneNumber("15800000000").setTestField("这是测试属性")
				;
		String value = objectMapper.writeValueAsString(user);
		 

		Assert.isTrue(
				"{\"username\":\"xiaoming\",\"password\":\"adm****56\",\"email\":\"c****@foxmail.com\",\"phoneNumber\":\"158******00\",\"testField\":\"------\"}"
						.equals(value));

		log.info("脱敏后的数据：{}", value);

	}
```

