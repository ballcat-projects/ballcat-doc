# 快速搭建

跟随本文可以使用 ballcat 快速搭建一套单体的后台管理系统

## 环境准备

开始之前，请先确保您已经配置好以下环境

| 名称  | 版本    |
| ----- | ------- |
| JDK   | 1.8     |
| MySQL | 5.7.8 + |
| Redis | 3.2 +   |
| node  | 10.0 +  |
| npm   | 6.0 +   |

**另：请在您的开发工具中安装好 `Lombok` 插件, lombok 的使用参看其 [官方文档](https://projectlombok.org/)**
> 最新版本的 Idea 中已经自带了 Lombok 插件



## 数据库配置

版本： mysql5.7.8+  
默认字符集：utf8mb4  
默认排序规则：utf8mb4_general_ci

- 按下面顺序依次执行 ballcat/docs 目录下的数据库脚本

```sql
# 建库语句
scheme.sql   
# 核心库
ballcat.sql  

# 国际化相关 SQL, 无需国际化功能则不用执行此处代码
ballcat-i18n.sql
```

**默认 oauth_client_details 脚本中有一个 test client，该 client 只能用于开发及测试环境，其登陆时会跳过图形验证码以及密码解密过程，生产环境请删除该client**

> 注意： ballcat/docs/update 下的是各个版本升级的增量 sql，初次搭建时无需执行。  
> 当跟随 ballcat 做版本升级时，如从 0.5.0 版本升级到 0.6.0 版本时，需执行 update 文件夹下的 0.6.0.sql

## 配置本地hosts

建议使用 switchHost 软件管理hosts配置!

也可直接修改本地host文件:  
windows系统下host文件位于
`C:\Windows\System32\drivers\etc\hosts`


**新增如下host:**

```
127.0.0.1 ballcat-mysql
127.0.0.1 ballcat-redis
127.0.0.1 ballcat-job
127.0.0.1 ballcat-admin
```

其中 `127.0.0.1` 按需替换成开发环境ip



## 服务端准备

### 基于模板仓库开发

**直接下载模板仓库代码，在模板仓库代码基础上进行业务开发**



**ballcat-boot** 是一个比较干净的模板仓库，比较适合拿来二开

```shell
git clone https://github.com/ballcat-projects/ballcat-boot.git
```

下载完代码，直接运行 `AdminApplication` 即可。



**ballcat-samples** 是一个功能使用示例仓库，里面提供了其他功能的演示以及一些测试的代码

比如默认提供了一个基于部门的数据权限使用示例，国际化的使用集成等，适合学习使用：

```shell
git clone https://github.com/ballcat-projects/ballcat-samples.git
```



### 使用快照版本

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



## 前端准备

### 代码构建

直接下载前端代码

```shell
git clone https://github.com/ballcat-projects/ballcat-ui-vue.git
```

### 依赖安装

安装项目依赖，使用 yarn 或 npm 都可以

```shell
# 安装依赖
yarn install
----- 或者 --------
# 安装依赖
npm install
```

### 配置修改

可按需修改 `src/config/projectConfig.js` 配置文件中的项目标题描述等

```js
module.exports = {
  // 项目标题
  projectTitle: 'Ball Cat',
  // 项目描述
  projectDesc: 'Ball Cat 一个简单的项目启动脚手架',
  // Vue ls 配置
  storageOptions: {
    namespace: 'ballcat/', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  },


  // 开启 websocket，开启此选项需要服务端同步支持 websocket 功能
  // 若服务端不支持，则本地启动时，抛出 socket 异常，导致 proxyServer 关闭
  enableWebsocket: false,

  // ------------- 国际化配置分隔符 -----------------

  // 是否开启国际化
  enableI18n: false,
  // 项目默认语言
  defaultLanguage: 'zh-CN',
  // 支持的语言列表
  supportLanguage: {
    'zh-CN': {
      lang: 'zh-CN',
      title: '简体中文',
      symbol: '🇨🇳'
    },
    'en-US': {
      lang: 'en-US',
      title: 'English',
      symbol: '🇺🇸'
    }
  },
    
  // icon 使用 iconFont 方式引用，此处为对应配置
  iconFontUrl: '//at.alicdn.com/t/font_2663734_ac285tyx19.js',
  iconPrefix: 'ballcat-icon-'
}
```
> 注意：enableWebsocket 需要服务端同步开启 websocket 支持，否则前端项目启动后将会闪退

`vue.config.js` 中的 serverAddress 是服务端的接口地址，可按需修改

```js
const serverAddress = 'http://ballcat-admin:8080'
```



## 开启 websocket

ballcat 在修改字典和公告时会通过 websocket 进行发送通知，以便前端实时感知，否则只有在用户重新登录时才会去变更这些信息。

服务端添加依赖：

```xml
    <!-- websocket 相关 -->
    <dependency>
        <groupId>com.hccake</groupId>
        <artifactId>ballcat-admin-websocket</artifactId>
    </dependency>
```

前端配置修改：

`src/config/projectConfig.js`

```js
 // 开启 websocket，开启此选项需要服务端同步支持 websocket 功能
 enableWebsocket: true,
```



## 开启国际化

> 服务端的默认国际化依赖数据库，注意需要先执行 ballcat-i18n.sql 文件中的相关 sql

1. 服务端添加依赖：

```xml
    <!-- 国际化 相关 -->
    <dependency>
        <groupId>com.hccake</groupId>
        <artifactId>ballcat-admin-i18n</artifactId>
    </dependency>
```

2. 且国际化需要服务端添加以下配置信息：

```yaml
 spring:
     messages:
        basename: "ballcat-*, org.springframework.security.messages"
```

3. 前端配置修改：

`src/config/projectConfig.js`

```js
 // 开启 国际化
 enableI18n: true,
```



## 启动项目

- 后端

直接在开发工具中启动 SpringBoot 的启动类即可，如果需要命令行或者 jar 包启动，请自行查阅 spring-boot的 多种启动方式

- 前端

打开命令行进入项目根目录，或 在 ide 提供的命令行工具中执行

```shell
# 启动服务
yarn serve
----- 或者 -----
# 启动服务
npm run serve
```



## 访问项目

默认前端项目路径：[http://localhost:8000/](http://localhost:8000/)

默认用户名密码：admin/a123456
