# Redis

目前文档内容对标 ballcat v0.4.0 以上版本



ballcat 中有以下两个模块和 redis 有关：

-  **ballcat-common-redis**

  基于 spring-data-redis，对 redis 的使用进行了二次封装

- **ballcat-spring-boot-starter-reids**

  SpringBoot 的 starter，依赖 **ballcat-common-redis**，提供了 redis 使用时的相关自动配置



## 使用方式

### 依赖引入

直接在项目中引入 starter 组件：

```xml
		<dependency>
			<groupId>com.hccake</groupId>
			<artifactId>ballcat-spring-boot-starter-redis</artifactId>
            <version>${lastedVersion}</version>
		</dependency>
```

### 配置属性

 spring-data-redis  的基本配置：

```yaml
spring:
  redis:
    host: your-host
    password: ''
    port: 6379
```

**ballcat-spring-boot-starter-redis** 的额外属性配置：

| 属性                                 | 描述                                             | 默认值 |
| ------------------------------------ | ------------------------------------------------ | ------ |
| ballcat.redis.keyPrefix          | redis 的全局  key 前缀                   | ""  |
| ballcat.redis.lockKeySuffix | 使用 redis 做分布式锁时，对应 key 的后缀 | "locked" |
| ballcat.redis.delimiter | reids key 的分隔符                       | ":" |
| ballcat.redis.nullValue | 空值标识                                 | "N_V" |
| ballcat.redis.expireTime | redis 缓存的默认超时时间(s) | 86400 |
| ballcat.redis.lockedTimeOut | redis 锁的超时时间(ms) | 1000 |

yml 配置示例：

```yaml
ballcat:
  reids:
  	key-prefix: 'ballcat:'
  	lock-key-suffix: 'locked'
  	delimiter: ':'
  	null-value: 'N_V'
    expire-time: 86400
    locked-time-out: 1000
```



## 基本功能

### 1. RedisHelper 操作类

**ballcat-spring-boot-starter-reids** 会自动注册该类。

RedisHelper 中的方法全部为静态方法，用户可以方便的通过该类进行 redis 的操作。

```java
String key = "testKey";
String value = RedisHelper.get(key);
```



### 2. 全局 key 前缀

通过修改 RedisTemplate 的 key 序列化器，进行 redis 全局 key 前缀的注册，方便公用 redis 环境时的 key 隔离。

例如当配置以下 key 前缀时：

```yaml
ballcat:
  reids:
  	key-prefix: 'ballcat:'
```

代码中添加一个 String 类型的 key：**testKey**，其实际在 redis 中存储的 key name 为 **ballcat:testKey**

```java
String key = "testKey";
RedisHelper.set(key, "testValue");
```

全局 key 前缀的配置，并不影响对 key 的其他操作，例如获取对应的 value 时，依然是传入 **testKey**，而不是 **ballcat:testKey**

```
String key = "testKey";
String value = RedisHelper.get(key);
```



### 3. 简易分布式锁

`CacheLock` 类中，提供了 lock 和 releaseLock 方法，并利用 lua 脚本，保证了加解锁的一致性。

但是并为提供锁的续期机制，如需更高要求，可自行引入 redission.



### 4. 消息监听者自动注册

提供了 MessageEventListener 类，对于 PUB/SUB 的消息监听者只需实现该类，就可默认注册到 RedisMessageListenerContainer 中。

```java
/**
 * PUB/SUB 模式中的消息监听者
 *
 * @author hccake
 */
public interface MessageEventListener extends MessageListener {

	/**
	 * 订阅者订阅的话题
	 * @return topic
	 */
	Topic topic();

}
```



## 注解操作

### 缓存查询 @Cached

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@MetaCacheAnnotation
public @interface Cached {

	/**
	 * redis 存储的Key名
	 */
	String key();

	/**
	 * 如果需要在key 后面拼接参数 则传入一个拼接数据的 SpEL 表达式
	 */
	String keyJoint() default "";

	/**
	 * 超时时间(S) ttl = 0 使用全局配置值 ttl < 0 : 不超时 ttl > 0 : 使用此超时间
	 */
	long ttl() default 0;
}
```

key 和 keyJoint 共同拼接出了当前的 redis key，拼接的连接符默认为 `:`。

keyJoint 的值为 [SPEL 表达式](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#expressions)，可以进行一些简单的字面量运算，根据方法的上下文信息进行值的解析，最常用的就是获取入参的值。



注解示例：

```java
@Cached(key = "testKey", keyJoint = "#p0", ttl="86400")
public User getUser(String userName) {
    return new User("zhangsan", 18);
}
```

当调用方法 `getUser("zhangsan")` 时，该注解对应的 redis key 为：**testKey:zhangsan**



**注解流程**

该注解标记于方法上时，将会对标记方法开启代理增强，后续对方法的调用将会按以下逻辑处理：

\-  先查询缓存 若不为空 直接返回
\-  若缓存为空，则调用方法，获取结果集
\-  将结果集置入缓存，以便下次读取



**此外该注解提供了缓存防击穿，和防穿透的处理**：

在缓存中不存在，进而进行方法调用前，使用分布式锁进行加锁处理，保证只有一个线程去执行方法，进行缓存的初始化。

当方法返回值为 null，标识 db 中没有数据时，将会在缓存中添加一个空值标识，后续进行查询时，发现缓存中存储的是空值标识，将不再进行方法的调用，直接返回 null 值。



### 缓存删除 @CacheDel

在方法执行后执行缓存删除操作

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@MetaCacheAnnotation
public @interface CacheDel {

   /**
    * redis 存储的Key名
    */
   String key();

   /**
    * 如果需要在key 后面拼接参数 则传入一个拼接数据的 SpEL 表达式
    */
   String keyJoint() default "";

   /**
    * 清除多个 key，当值为 true 时，强制要求 keyJoint 有值，且 Spel 表达式解析结果为 Collection
    * @return boolean
    */
   boolean multiDel() default false;
}
```



key 和 keyjoint 同 `@Cached`，multiDel 属性主要用于控制是否是批量删除缓存。

批量删除缓存时，要求 keyjoint 对应的 SPEL 表达式解析出来的值为一个 Collection。



单独删除注解示例：

```java
@CacheDel(key = "testKey", keyJoint = "#p0")
public User updateUser(String username, String age) {
    return mapper.updateUserAge(username, age);
}
```

批量删除示例：

```java
@CacheDel(key = "testKey", keyJoint = "#p0", multiDel = true)
public User updateUserStatus(List<String> usernameList, String status) {
    return mapper.updateUserAge(usernameList, age);
}
```

进阶玩法，集合投影，可以对集合的元素操作，获取新的集合数据，类似于 stream 的 map 方法：

```java
@CacheDel(key = "testKey", keyJoint = "#p0.![#this.username]", multiDel = true)
public User updateUserStatus(List<User> userList, String status) {
    List<String> usernameList = userList.stream().map(User::getUsername).collect(Collectors.toList());
    return mapper.updateUserAge(usernameList, age);
}
```



### 缓存修改 @CachePut

在方法执行后执行缓存put操作 将方法的返回值置入缓存中，若方法返回null，则会默认置入一个nullValue。

> 不推荐使用该注解，缓存变更时，尽量使用删除操作

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@MetaCacheAnnotation
public @interface CachePut {

   /**
    * redis 存储的Key名
    */
   String key();

   /**
    * 如果需要在key 后面拼接参数 则传入一个拼接数据的 SpEL 表达式
    */
   String keyJoint() default "";

   /**
    * 超时时间(S) ttl = 0 使用全局配置值 ttl < 0 : 不超时 ttl > 0 : 使用此超时间
    */
   long ttl() default 0;

}
```

