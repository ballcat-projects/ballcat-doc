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

**可以直接下载模板仓库代码，在模板仓库代码基础上进行业务开发**

```
git clone https://github.com/ballcat-projects/ballcat-boot.git
```

下载完代码，直接运行 `AdminApplication` 即可。



### 从头搭建新项目

**也可以按示例代码的结构新建项目，但需要注意以下几点**

1. 项目的 父pom 文件的 parent 需要修改为 BallCat，这样可以做到统一的依赖管理，也方便后续升级

   ```xml
   <parent>
       <artifactId>ballcat</artifactId>
       <groupId>com.hccake</groupId>
       <version>${lastVersion}</version>
       <relativePath/>
   </parent>
   ```

2. 当使用的 BallCat 版本为快照版本（版本号尾缀 -SNAPSHOT）时，需要在 父 pom 文件中添加私服地址，否则无法正常下载依赖包

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

3. 在后台管理的启动项目的 pom 文件中引入以下必须依赖

   ```xml
      		<!-- 权限管理相关 -->
           <dependency>
               <groupId>com.hccake</groupId>
               <artifactId>ballcat-admin-core</artifactId>
           </dependency>
   		<!--mysql驱动-->
           <dependency>
               <groupId>mysql</groupId>
               <artifactId>mysql-connector-java</artifactId>
           </dependency>
   ```



4. 配置文件修改

   在 src/main/resources 目录下新建 application.yml 文件：

    ```yml
    server:
       port: 8080
       
    spring:
       application:
          name: @artifactId@
       profiles:
          active: @profiles.active@  # 当前激活配置，默认dev
       messages:
          # basename 中的 . 和 / 都可以用来表示文件层级，默认的 basename 是 messages
          # 必须注册此 basename, 否则 security 错误信息将一直都是英文
          basename: 'org.springframework.security.messages'
       
    # 图形验证码
    aj:
       captcha:
          waterMark: 'BallCat'
          cacheType: redis
       
    # mybatis-plus相关配置
    mybatis-plus:
       mapper-locations: classpath*:/mapper/**/*Mapper.xml
       global-config:
          banner: false
          db-config:
             id-type: auto
             insert-strategy: not_empty
             update-strategy: not_empty
             logic-delete-value: "NOW()" # 逻辑已删除值(使用当前时间标识)
             logic-not-delete-value: 0 # 逻辑未删除值(默认为 0)
   
    # BallCat 相关配置
    ballcat:
       upms:
          # 登陆验证码是否开启
          login-captcha-enabled: true
       security:
          # 前端传输密码的 AES 加密密钥
          password-secret-key: '==BallCat-Auth=='
          ## 忽略鉴权的 url 列表
          ignore-urls:
             - /public/**
             - /actuator/**
             - /doc.html
             - /v2/api-docs/**
             - /v3/api-docs/**
             - /swagger-resources/**
             - /swagger-ui/**
             - /webjars/**
             - /bycdao-ui/**
             - /favicon.ico
             - /captcha/**
       # 项目 redis 缓存的 key 前缀
       redis:
          key-prefix: 'ballcat:'
    ```

   数据库连接，Redis 连接基础设施相关的配置都建议根据环境拆分到不同的配置文件中

   当然把这些配置全部都放在 application.yml 中也是可以的，但是这样在不通环境下发布时需要不断的修改配置，所以不建议这么做。

   BallCat 默认启用的是 dev 环境，所以新建 application-dev.yml 文件：

   ```yaml
   # 这里按需修改数据库账号密码，以及redis密码，若未配置redis密码，则直接留空
   spring:
      datasource:
         url: jdbc:mysql://ballcat-mysql:3306/ballcat?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
         username: root
         password: '123456'
      redis:
         host: ballcat-redis
         password: ''
         port: 6379
   
   # 目前必填 oss 配置，使用以下配置依然可以正常启动项目，只是头像和公告的图片上传无法正常使用
   ballcat:
      oss:
         endpoint: oss-cn-shanghai.aliyuncs.com
         access-key: your key here
         access-secret: your secret here
         bucket: your bucket here
   ```

   **请尽量使用host域名形式来配置链接地址，而非直接使用ip**



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
