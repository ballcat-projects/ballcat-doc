# Ballcat Admin UI Vue2 版本

::: danger 过期提示
vue 团队官宣 vue2 将于 2023年12月31日 停止维护，建议使用 vue3 或者 react 版本前端。
:::

## 环境准备

请先下载并安装好 Node 环境，版本要求 14+ 。

## 代码下载

| 代码仓库   | 地址                                                 |
|--------|----------------------------------------------------|
| github | https://github.com/ballcat-projects/ballcat-ui-vue |
| gitee  | https://gitee.com/ballcat-projects/ballcat-ui-vue  |

> Gitee（码云）做为 github 的镜像仓库，代码可能同步会有一定延时



## 依赖安装

::: code-group
```shell [yarn]
yarn install
```

```shell [npm]
npm install
```
:::



## 配置修改

### projectConfig

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

### vue.config

`vue.config.js` 中的 serverAddress 是服务端的接口地址，可按需修改为实际地址
```js
const serverAddress = 'http://ballcat-admin:8080'
```



## 启动项目

打开命令行进入项目根目录，或在 ide 提供的命令行工具中执行

::: code-group
```shell [yarn]
yarn serve
```

```shell [npm]
npm run serve
```
:::


## 访问项目

默认前端项目路径：[http://localhost:8000/](http://localhost:8000/)  

默认用户名密码：admin/a123456


## 生产构建

::: code-group
```shell [yarn]
yarn build
```

```shell [npm]
npm run build
```
:::

执行以上命令后，将会在项目根目录生成 `dist` 文件夹，其中即是构建好的静态文件，上传此文件夹到服务器的指定位置即可。