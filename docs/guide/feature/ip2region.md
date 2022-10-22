# ip2region离线IP查询

**目前文档内容对标 ballcat v1.0.0 以上版本**

## 什么是 Ip2region

[ip2region](https://gitee.com/lionsoul/ip2region)是一个离线IP地址定位库和IP定位数据管理框架，具有10微秒级别的查询效率，提供了众多主流编程语言的 xdb 数据生成和查询客户端实现。

## 使用方式

springboot 项目，直接在项目中引入 starter 组件：

### 依赖引入

```xml
<dependency>
    <groupId>com.hccake</groupId>
    <artifactId>ballcat-spring-boot-starter-ip2region</artifactId>
</dependency>
```

### 配置

#### 配置说明

| 配置项                           | 默认值                               | 说明                          |
| ------------------------------- |-----------------------------------|-----------------------------|
| ballcat.ip2region.file-location | classpath:ip2region/ip2region.xdb | ip2region.xdb 文件的地址，默认内置的文件 |
| ballcat.ip2region.cache-type | xdb | ip2region查询缓存方式 |

#### cache-type配置说明

| 取值                           | 说明                               | 备注                          |
| ------------------------------- |-----------------------------------|-----------------------------|
| none | 完全基于文件的查询|  |
| vector_index | 缓存 VectorIndex 索引 | 我们可以提前从 xdb 文件中加载出来 VectorIndex 数据，然后全局缓存，每次创建 Searcher 对象的时候使用全局的 VectorIndex 缓存可以减少一次固定的 IO 操作，从而加速查询，减少 IO 压力。|
| xdb | 缓存整个 xdb 数据| 我们也可以预先加载整个 ip2region.xdb 的数据到内存，然后基于这个数据创建查询对象来实现完全基于文件的查询，类似ip2region 1.x的 memory search。 |

**注意**

一般情况下，```ip2region.xdb```我们会与官方保持同步，如果没有自己加工IP的话，一般不需要调整对应配置

### 基本使用

> 引入依赖后会自动注册一个  ```Ip2regionSearcher```的bean, 使用该bean即可

> 参考: [示例](https://github.com/ballcat-projects/ballcat/blob/master/ballcat-starters/ballcat-spring-boot-starter-ip2region/src/test/java/com/hccake/ballcat/starter/ip2region/searcher/Ip2regionSearcherTestTemplate.java)

## 注意事项

### maven 自定义 ip2region.db 注意事项

如果通过如下配置启用maven资源过滤时，需要额外注意:

```xml
<build>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>
```

**此时,maven** `resources` 拷贝文件是默认会做 `filter`，会导致我们的文件发生变化，导致不能读，`pom` 中你需要添加下面的配置。

```xml
<plugin>
    <artifactId>maven-resources-plugin</artifactId>
    <configuration>
        <nonFilteredFileExtensions>
            <nonFilteredFileExtension>xdb</nonFilteredFileExtension>
        </nonFilteredFileExtensions>
    </configuration>
</plugin>
 ```

## FAQ

### ip2region支持IPV6么

截至目前[官方版本](https://mvnrepository.com/artifact/org.lionsoul/ip2region/2.6.5)是不支持IPV6的。

### ip2region 2.x比1.x提升在哪里

ip2region 1.x的数据在数据量超过70万行时，ip2region的btree 算法查询会有问题，需要使用 binary 或者 memory 算法，btree 算法部分数据查询会出错,2.x主要提升为不限制原始数据量。

### 封装的ip2region插件是否线程安全

默认配置下，```Ip2regionSearcher```的检索结果是线程安全的，调整```cache-type```配置为```vector_index```或者```none```时，线程安全性由开发者自行保证。