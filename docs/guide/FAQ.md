# 常见问题

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
