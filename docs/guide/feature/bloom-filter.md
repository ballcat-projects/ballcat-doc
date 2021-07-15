# 布隆过滤器

## 简介

布隆过滤器（BloomFilter） 是一种数据结构，可以方便的 **检索一个元素是否在一个集合中。**

但是由于其原理， bloom 过滤器是有误判可能性的，但是错误只会出现在判断存在时。

也是就是说：**判断其存在的元素不一定存在，判断其不存在的元素一定不存在**

另外集合中元素越多，错误率就越高。



## 应用场景

布隆过滤器主要作用在大数据量情况下，需要判断数据是否存在的场景：

- 比如检测当前文章、视频是否被当前用户阅读，防止重复推送（https://toutiao.io/posts/mtrvsx/preview）
- 比如爬虫时的已爬网址记录，防止重复爬取


以上这种场景，通常我们会想到将元素全部保存到一个集合中，然后每次判断该元素是否在集合中。那么随着集合中元素的增加，我们需要的存储空间就越大，大部分数据结构的检索速度也会越来越慢。

而使用布隆过滤器，它的存储空间和插入/查询时间都是常数（**O(k)**）。



## 原理

布隆过滤器底层使用一个 m 位的 bit 数组存储数据，数组中元素初始值都是 0，然后额外定义 k 个 hash 函数，这些 hash 函数的返回值必须小于 m。

当元素被放入集合中时，遍历执行所有的 hash 函数，将这些函数的结果值，所对应的数组位置置为 1。

当检测元素是否存在时，遍历执行所有的 hash 函数，读取这些函数的结果值对应的数组位置，查看其数值是否都为 1.



![wiki 百科图示](https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Bloom_filter.svg/1920px-Bloom_filter.svg.png)



如上图所示中的布隆过滤器，定义了 3 个 hash 函数， x、y、z 三个元素都已被放置入过滤器中。

彩色箭头标识了元素经过 hash 函数运算后，映射到的不同位置。


这时，检测 w 元素是否存在，会得到一个否定的结果，因为 w 元素经过 3 个hash 函数运算后，有一个 hash 函数的结果对应的映射位置值为 0.

## 优缺点

优点上面已经说过，就是存储空间小，插入查询快。

缺点也很明显:
- 一个是错误率，当需要的错误率越小，需要提供的 hash 函数就越多，存储空间就越大。
- 另一个是无法进行删除

**无法删除的原因也很简单，会导致其他元素误判。**  

例如上图中的 x、z 元素经过 3 个 hash 函数后，各自指向了 3 个bit 位，但是其中的 1 个 bit 位重合了。  
这很正常，毕竟是不同的 hash 函数运算出来的结果。  
这时如果我们要删除 x 元素，则需要同时重置 x 指向的 3 个 bit 位的值为 0，此时再去检测 z 元素就会判断其不存在，因为 z 元素对应的 3 个 bit 位现在有一个是 0 了。

> 如果需要删除操作，可以考虑 布谷鸟过滤器，参考 [《Cuckoo Filter：Better Than Bloom》](https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf)

## 使用

布隆过滤器的实现方式有很多，网上也有很多示例，但是在生产环境下自己实现的布隆过滤器可能不够健壮，秉着不重复造轮子的精神，推荐使用 redis 4.0 后添加的模块功能，已有第三方组织提供了 redisbloom 模块。

该 module 除了布隆过滤器之外，还实现了 布谷鸟过滤器，Count-Min Sketch， Top-K 等其他功能。官网地址：https://oss.redislabs.com/redisbloom/。

官方提供了基于 Jedis 的使用操作 [sdk](https://github.com/RedisBloom/JRedisBloom)，但是由于 `spring-data-redis` 默认使用 lettuce 进行 redis 操作，所以 ballcat 对其进行了翻译，在 lettuce 的基础上提供了对 BloomFilter 的操作。

> PS：redisBloom 中的布隆过滤器支持扩容功能，在容量上限时，会通过创建子过滤器的形式来规避重复问题



### maven依赖

```xml
<dependencies>
    <dependency>
        <groupId>com.hccake</groupId>
        <artifactId>ballcat-extend-redis-module</artifactId>
        <version>${lastVersion}</version>
    </dependency>
</dependencies>
```



### 初始化操作类

**非 springboot 项目**：

```java
// 获取 Lettuce 链接工厂
LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory(redisHost, redisPort);
lettuceConnectionFactory.afterPropertiesSet();
// 获取布隆过滤器操作助手
BloomRedisModuleHelper bloomRedisModuleHelper = new BloomRedisModuleHelper(lettuceConnectionFactory);
// 可选操作：配合 ballcat-spring-boot-starter-redis 提供的 PrefixStringRedisSerializer，可以给 redis key 添加默认的 key 前缀
bloomRedisModuleHelper.setKeySerializer(new PrefixStringRedisSerializer("keyprefix:"));
```

**spring-boot 项目**，

在引入 `ballcat-spring-boot-starter-redis` 或者 `spring-boot-starter-redis` 的情况下可以直接注入 `LettuceConnectionFactory`。（前提是，yml 中正确配置 redis）

```java
@Configuration
@RequiredArgsConstructor
public class BloomRedisModuleHelperConfig {

	private final LettuceConnectionFactory lettuceConnectionFactory;

	@Bean
	@DependsOn("cachePropertiesHolder") // 防止 CachePropertiesHolder 初始化落后导致的空指针
	public BloomRedisModuleHelper bloomRedisModuleHelper() {
		BloomRedisModuleHelper bloomRedisModuleHelper = new BloomRedisModuleHelper(redisttuceConnectionFactory);
        // 可选操作，配合 ballcat-spring-boot-starter-redis 的 key 前缀使用
		bloomRedisModuleHelper.setKeySerializer(new PrefixStringRedisSerializer(CachePropertiesHolder.keyPrefix()));
		return bloomRedisModuleHelper;
	}
}
```

配置文件：

```yml
spring:
  redis:
    host: 192.168.1.3
    port: 20208
```



### 基本使用

可以查看 `BloomRedisModuleHelper` 类方法上的注释，对比官方的 redis 命令行操作：https://oss.redislabs.com/redisbloom/Bloom_Commands/

```java
	@Test
	void commandTest() {
		String filterKey = "TEST_FILTER";

		// 1.创建布隆过滤器
		boolean create = bloomRedisModuleHelper.createFilter(filterKey, 0.01, 1000000000);
		log.info("test createFilter result: {}", create);

		// 2.添加一个元素
		Boolean foo = bloomRedisModuleHelper.add(filterKey, "foo");
		log.info("test add result: {}", foo);

		// 3.批量添加元素
		List<Boolean> addMulti = bloomRedisModuleHelper.multiAdd(filterKey, "foo", "bar");
		log.info("test addMulti result: {}", addMulti);

		// 4.校验一个元素是否存在
		Boolean existsFoo = bloomRedisModuleHelper.exists(filterKey, "foo");
		log.info("test existsFoo result: {}", existsFoo);

		Boolean existsBar = bloomRedisModuleHelper.exists(filterKey, "bar");
		log.info("test existsBar result: {}", existsBar);

		// 5.批量校验元素是否存在
		List<Boolean> existsMulti = bloomRedisModuleHelper.multiExists(filterKey, "foo", "foo1");
		log.info("test existsMulti result: {}", existsMulti);

		// 6.获取 filter info
		Map<String, Object> info = bloomRedisModuleHelper.info(filterKey);
		log.info("test info result: {}", info);

		// 7.删除布隆过滤器
		Boolean delete = bloomRedisModuleHelper.delete(filterKey);
		log.info("test delete result: {}", delete);
	}
```



```java
@Test
	void insertTest() {
		String filterKey = "INSERT_TEST_FILTER";
		// 1. 定义 filter 属性
		BloomInsertOptions insertOptions = new BloomInsertOptions().capacity(1000).error(0.001);

		// 2. 判断元素是否存在
		List<Boolean> existsMulti1 = bloomRedisModuleHelper.multiExists(filterKey, "foo", "foo3", "foo5");
		log.info("test existsMulti1 result: {}", existsMulti1);

		// 3. 插入部分数据
		List<Boolean> insert1 = bloomRedisModuleHelper.insert(filterKey, insertOptions, "foo1", "foo2", "foo3");
		log.info("test insert1 result: {}", insert1);

		// 4. 再次执行 insert 进行插入
		List<Boolean> insert2 = bloomRedisModuleHelper.insert(filterKey, insertOptions, "foo2", "foo3", "foo4");
		log.info("test insert2 result: {}", insert2);

		// 5. 再次判断元素是否存在
		List<Boolean> existsMulti2 = bloomRedisModuleHelper.multiExists(filterKey, "foo", "foo3", "foo4", "foo5");
		log.info("test existsMulti2 result: {}", existsMulti2);

		// 6.获取 filter info
		Map<String, Object> info = bloomRedisModuleHelper.info(filterKey);
		log.info("test info result: {}", info);

		// 7.删除布隆过滤器
		Boolean delete = bloomRedisModuleHelper.delete(filterKey);
		log.info("test delete result: {}", delete);
	}
```



## 最后的备注

这里由于业务问题，仅翻译了官方 sdk 中关于 bloomFilter 的相关操作命令。

至于其他的如布谷鸟过滤器，TOPK 等操作，可以参考 `BloomRedisModuleHelper` 的实现自行翻译。

只需提供对应的 `ProtocolKeyword`，和一个继承于 `AbstractRedisModuleHelper` 的 Helper 类，然后在其中实现 Command 对应方法即可。

**欢迎翻译完成后 PR 至本项目**

