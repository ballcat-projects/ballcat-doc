# 常见问题

### 格式化异常
```java
java.lang.UnsupportedClassVersionError: io/spring/javaformat/eclipse/jdt/jdk11/internal/formatter/DefaultCodeFormatter 

has been compiled by a more recent version of the Java Runtime (class file version 55.0), 

this version of the Java Runtime only recognizes class file versions up to 52.0
```

由于 spring-javaformat 组件的升级，现在如果在 jdk8 环境下，请在项目跟目录新建一个名为 `.springjavaformatconfig` 的文件。

文件内容如下：
  ```
  java-baseline=8
  ```


### 项目启动报错（一）

输出如下异常信息：

```java
nested exception is java.lang.NoClassDefFoundError: javax/xml/bind/JAXBException
```

检查是否在 jdk11 及以上版本运行项目，是的话需要添加以下依赖：
```xml
<!-- API, java.xml.bind module -->
<!-- add it when jdk11 -->
<dependency>
   <groupId>jakarta.xml.bind</groupId>
   <artifactId>jakarta.xml.bind-api</artifactId>
   <version>2.3.2</version>
</dependency>
<dependency>
   <groupId>org.glassfish.jaxb</groupId>
   <artifactId>jaxb-runtime</artifactId>
   <version>2.3.2</version>
</dependency>
```

### 项目启动报错（二）

抛出如下异常：
```java
[main] ERROR org.springframework.boot.SpringApplication - Application run failed
org.yaml.snakeyaml.scanner.ScannerException: while scanning for the next token
found character '@' that cannot start any token. (Do not use @ for indentation)
 in 'reader', line 8, column 11:
        name: @artifactId@
              ^

	at org.yaml.snakeyaml.scanner.ScannerImpl.fetchMoreTokens(ScannerImpl.java:439)
	at org.yaml.snakeyaml.scanner.ScannerImpl.checkToken(ScannerImpl.java:248)
	at org.yaml.snakeyaml.parser.ParserImpl$ParseBlockMappingValue.produce(ParserImpl.java:665)
	at org.yaml.snakeyaml.parser.ParserImpl.peekEvent(ParserImpl.java:165)
	at org.yaml.snakeyaml.comments.CommentEventsCollector$1.peek(CommentEventsCollector.java:59)
```

**根本原因：**
maven 编译文件时 yml 中的占位符没有被替换成功。

**情况一： idea 抽风，没有正常处理 maven 配置**  
    删除项目 build 生产的 target 文件夹，maven reimport 项目后再重新启动

**情况二：没有勾选 maven profile**  
    导致无法正确进行 `@artifactId@` 值替换，按图勾选对应的 profile 并重新 reimport 项目，再进行启动。
    如果 pom 的 parent 不是 ballcat，请检查是否有对应的 `<profiles>` 配置
    ![](./img/faq-yml-error.png)

**情况三：没有正确配置 maven 的 resource 资源过滤器**  
    检查在项目 pom.xml 中是否添加对应的 `<resources>` 配置，配置方式参看: [Maven 占位符配置](/guide/other/maven-resource-filter.html)
