# 快速搭建

跟随本文可以使用 ballcat 快速搭建一套单体的后台管理系统

## 环境准备

开始之前，请先确保您已经配置好以下环境

| 名称  | 版本   |
| ----- |------|
| JDK   | 8-11 |
| MySQL | 5.7+ |
| Redis | 3.2+ |


**另：请在您的开发工具中安装好 `Lombok` 插件, lombok 的使用参看其 [官方文档](https://projectlombok.org/)**
> 最新版本的 Idea 中已经自带了 Lombok 插件


## 数据库配置

版本： MySQL
默认字符集：utf8mb4  
默认排序规则：utf8mb4_general_ci

:::warning  
5.7.x 及以下版本的 MySQL，需要开启 timestamp 类型默认值为 null 的支持, 在执行 sql 前先执行以下 sql.
```sql
set session explicit_defaults_for_timestamp = 1;
```
注意，该设置仅当前会话内生效，所以执行完成后必须在同一会话内进行 sql 执行。  
:::

- 按下面顺序依次执行 ballcat/doc 目录下的数据库脚本

```sql
# 建库语句
scheme.sql   
# 核心库
ballcat.sql  

# 国际化相关 SQL, 无需国际化功能则不用执行此处代码
ballcat-i18n.sql
```

**默认 oauth2_registered_client 脚本中有一个 test client，该 client 只能用于开发及测试环境，其登陆时会跳过图形验证码以及密码解密过程，生产环境请删除该client**

> 注意： ballcat/doc/update_sql 下的是各个版本升级的增量 sql，初次搭建时无需执行。  
> 当跟随 ballcat 做版本升级时，如从 0.5.0 版本升级到 0.6.0 版本时，需执行 update_sql 文件夹下的 0.6.0.sql

## 配置本地hosts

建议使用 switchHost 软件管理hosts配置!

也可直接修改本地host文件:  
windows系统下host文件位于
`C:\Windows\System32\drivers\etc\hosts`


**新增如下host:**

```
127.0.0.1 ballcat-mysql
127.0.0.1 ballcat-redis
127.0.0.1 ballcat-admin
```

其中 `127.0.0.1` 按需替换成开发环境ip


## 服务端代码准备

后台管理系统的服务端的基础代码可以使用以下两种方式创建：

### 1. 基于模板仓库开发

**ballcat-boot** 是 ballcat 提供的后台管理服务单模板仓库，用户可以使用 git clone 该模板代码或者直接下载 zip 源码，然后在其基础上进行相关业务的开发。

| 代码仓库   | 地址                                                   |
|--------|------------------------------------------------------|
| github | https://github.com/ballcat-projects/ballcat-boot |
| gitee  | https://gitee.com/ballcat-projects/ballcat-boot   |


### 2. 使用代码生成器生成

可用预览环境的代码生成器进行后台管理的骨架代码生成

## 使用快照版本

在正式版本发布前，BallCat 会先推出快照 SNAPSHOT 版本，如果想尝鲜使用快照版本的话需要添加 oss 的快照仓库，否则无法拉取到对应版本的依赖

```xml
<!-- oss 快照私服 -->
<repositories>
    <repository>
        <id>oss-snapshots</id>
        <url>https://oss.sonatype.org/content/repositories/snapshots</url>
        <releases>
            <enabled>false</enabled>
        </releases>
        <snapshots>
            <enabled>true</enabled>
            <updatePolicy>always</updatePolicy>
        </snapshots>
    </repository>
</repositories>
```

> 如果配置私服后依然无法正常下载，请检查是否配置了镜像仓库。  
> 镜像仓库中的 mirrorOf 属性请排除掉 oss-snapshots，或者直接修改为 central


## 开启 websocket

ballcat 在修改字典和公告时会通过 websocket 进行发送通知，以便前端实时感知，否则只有在用户重新登录时才会去变更这些信息。

服务端添加依赖：

```xml-vue
<!-- websocket 相关 -->
<dependency>
	<groupId>org.ballcat.business</groupId>
	<artifactId>ballcat-admin-websocket</artifactId>
</dependency>
```

## 开启国际化

> 服务端的默认国际化依赖数据库，注意需要先执行 ballcat-i18n.sql 文件中的相关 sql

1. 服务端添加依赖：

```xml-vue
<!-- 国际化 相关 -->
<dependency>
	<groupId>org.ballcat.business</groupId>
	<artifactId>ballcat-admin-i18n</artifactId>
</dependency>
```

2. 且国际化需要服务端添加以下配置信息：

```yaml
 spring:
     messages:
        basename: "org.ballcat.**.messages, org.springframework.security.messages"
```


## 启动项目

直接在开发工具中运行 `AdminApplication` 的 main 方法即可

> 建议启动前先执行一次 `mvn clean package` 命令，保证依赖下载和代码编译没有问题