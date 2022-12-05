# Maven 资源文件占位符使用

maven官方文档：https://maven.apache.org/plugins/maven-resources-plugin/examples/filter.html

## 简介
在 maven 支持在处理资源文件时，替换文件内部的一些占位符，对于文本文件是 `${...}` 格式，对于 `yml` 文件，是 `@...@` 格式，
这些占位符表示的变量可以来自系统属性、项目属性、过滤器资源和命令行参数。

## 使用方法

使用时，首先要开启 resource 过滤，例如如下配置，开启对 `src/main/resources` 路径下的文件过滤：
```xml
<project>
    ...
    <build>
        <!--重要 如果不设置resource 会导致application.yaml中的@@找不到pom文件中的配置-->
        <resources>
            <resource>
                <filtering>true</filtering>
                <directory>src/main/resources</directory>
            </resource>
        </resources>
        ...
    </build>
    ...
</project>

```

## 注意事项
**filter 过滤会破坏二进制文件，如果对应文件夹下有二进制文件，可以通过以下两种方式进行 filter 过滤, 但是 `jpg`, `jpeg`, `gif`, `bmp` 和 `png` 类型文件不用管，默认就会忽略**

### 第一种方法
在 maven-resources-plugin 中配置需要排除的文件后缀名：

  ```xml
  <project>
      ...
      <build>
          <plugins>
              <plugin>
                  <groupId>org.apache.maven.plugins</groupId>
                  <artifactId>maven-resources-plugin</artifactId>
                  <version>3.3.0</version>
                  <configuration>
                      ...
                      <nonFilteredFileExtensions>
                          <nonFilteredFileExtension>pdf</nonFilteredFileExtension>
                          <nonFilteredFileExtension>swf</nonFilteredFileExtension>
                      </nonFilteredFileExtensions>
                      ...
                  </configuration>
              </plugin>
          </plugins>
          ...
      </build>
      ...
  </project>
  ```

### 第二种方法
在 build 的 resources 配置多个 resource, 在开启 filtering 的 resource 中排除对应文件，在关闭 filtering 过滤的 resource
中包含对应文件：

  ```xml
  <project>
      ...
      <build>
          <!--重要 如果不设置resource 会导致application.yaml中的@@找不到pom文件中的配置-->
          <resources>
              <resource>
                  <filtering>true</filtering>
                  <directory>src/main/resources</directory>
                  <includes>
                      <include>**/*.yml</include>
                      <include>**/*.yaml</include>
                  </includes>
              </resource>
              <resource>
                  <filtering>false</filtering>
                  <directory>src/main/resources</directory>
                  <excludes>
                      <exclude>**/*.yml</exclude>
                      <exclude>**/*.yaml</exclude>
                  </excludes>
              </resource>
          </resources>
          ...
      </build>
      ...
  </project>
  ```
