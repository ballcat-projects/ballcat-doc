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


### 项目启动报错

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
