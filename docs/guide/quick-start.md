# 快速开始

开始之前，请先确保您已经配置好以下环境

| 名称  | 版本    |      |
| ----- | ------- | ---- |
| JDK   | 1.8     |      |
| MySQL | 5.7.8 + |      |
| Redis | 3.2 +   |      |
| node  | 10.0 +  |      |
| npm   | 6.0 +   |      |

**另：请在您的开发工具中安装好 `Lombok` 插件** 

## 代码下载

- 后端：

> git clone https://github.com/Hccake/ballcat.git


- 前端：

> git clone https://github.com/Hccake/ballcat-ui-vue.git


## 数据库配置

版本： mysql5.7.8+  
默认字符集：utf8mb4  
默认排序规则：utf8mb4_general_ci  

- 按下面顺序依次执行/docs目录下的数据库脚本

```sql
# 建库语句
scheme.sql   
# 核心库
ballcat.sql  
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

其中`127.0.0.1`按需替换成开发环境ip

## 项目配置修改

- `ballcat-sample-admin-application`项目下的`src\main\resources\application-dev.yml`

  修改数据库账号密码，以及redis密码，若未配置redis密码，则直接留空

  ```yaml
  spring:
    datasource:
      url: jdbc:mysql://ballcat-mysql:3306/ballcat?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
      username: root
      password: '123456'
    redis:
      host: ballcat-redis
      password: ''
      port: 6379
  ```

**请尽量使用host域名形式来配置链接地址，而非直接使用ip**

## 启动项目

- 后端

直接执行`ballcat-sample-admin-application`项目下的`AdminApplication`类的main函数即可。  
更多启动项目的方法，请自行查阅spring-boot的多种启动方式

- 前端

打开命令行进入项目根目录
或 在ide提供的命令行工具中执行如下语句

```
# 安装依赖
yarn install
# 启动服务
yarn run serve
```

or

```
# 安装依赖
npm install
# 启动服务
npm run serve
```

## 访问项目

默认前端项目路径：[http://localhost:8000/](http://localhost:8000/)

默认用户名密码：admin/a123456