# 幂等处理方案

## 使用方式

Spring Boot 项目，直接在项目中引入 starter 组件：

### 依赖引入

```xml-vue
<dependency>
    <groupId>org.ballcat</groupId>
    <artifactId>ballcat-spring-boot-starter-idempotent</artifactId>
    <version>{{ $frontmatter.ballcatVersion }}</version>
</dependency>
```

### 基本使用

引入依赖后，在需要幂等处理的Controller上添加```@Idempotent```注解即可。

该注解具有以下基本属性:


| 注解值                           | 默认值                               | 说明                          |
| ------------------------------- |-----------------------------------|-----------------------------|
| prefix| idem | 业务标识。作为幂等标识的前缀，可用于区分服务和业务，防止 key 冲突。完整的幂等标识 = {prefix}:{uniqueExpression.value} |
| uniqueExpression |  |  幂等的唯一性标识。值为 SpEL 表达式，从上下文中提取幂等的唯一性标识 |
| duration | 10分钟 |  幂等的控制时长。必须大于业务的处理耗时，其值为幂等 key 的标记时长，超过标记时间，则幂等 key 可再次使用，此时间需自行评估，保证过期时间大于业务执行时间|
| timeUnit | TimeUnit.SECONDS |  控制时长单位。默认为 SECONDS 秒|
| message | 重复请求，请稍后重试 |  正在执行中的提示信息|
| removeKeyWhenFinished | false(不处理) |  是否在业务完成后立刻清除幂等key。建议保持默认配置，即使业务执行完，也不删除key，强制锁expireTime的时间。预防出现第一个业务请求还在执行时，若前端未做遮罩，或者用户跳转页面后再回来做重复请求等短时间内重复发起请求的情况 |
| removeKeyWhenError | false(不处理) |  是否在业务执行异常时立刻清除幂等key|



### 扩展

### 异常返回结构定制

触发幂等拦截时会抛出```IdempotentException```,如果要进行友好提示的话通过Spring全局异常处理器拦截该异常即可。

### 幂等key编程式处理

默认情况下，程序的幂等key通过全局前缀```prefix```和SPEL表达式```uniqueExpression```合并计算而来。

如果要实现类似以下的一些需求:

- 同一个请求ip和接口，相同参数的请求，在expireTime内多次请求，只允许成功一次
- 同一个用户和接口，相同参数的请求，在expireTime内多次请求，只允许成功一次
- 同一个租户和接口，相同参数的请求，在expireTime内多次请求，只允许成功一次

此时，在每个```@Idempotent```注解上配置```prefix```或```uniqueExpression```就不合适了。
启动器提供了一个抽象函数式接口```org.ballcat.ballcat.common.idempotent.key.generator.KeyGenerator```用于处理幂等key的生成，默认逻辑见```DefaultKeyGenerator```,如果要在应用内进行一些全局幂等key实现，那么可以通过扩展```DefaultKeyGenerator```逻辑或者完全自定义逻辑。
具体代码类似于:
```java
public class IPKeyGenerator extends DefaultKeyGenerator {
    @Override
    public String generate(JoinPoint joinPoint, Idempotent idempotentAnnotation) {
        String clientIP = 获取IP的逻辑;
        return clientIP + ":" + super.generate(joinPoint, idempotentAnnotation);
    }
}
```

然后，将这个Bean注入Spring容器:

```java
@Configuration(proxyBeanMethods = false)
public class IdempotentConfiguration {
    /**
    * key 解析器
    * @return KeyResolver
    */
    @Bean
    public KeyGenerator keyResolver() {
        return new IPKeyGenerator();
    }
}

```

此时，你的应用生成的幂等key会全部带上请求者的IP。