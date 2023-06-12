# Ballcat Admin UI React 版本

## 环境准备

请先下载并安装好 Node 环境，版本要求 16+ 。

## 代码下载

| 代码仓库   | 地址                                                   |
|--------|------------------------------------------------------|
| github | https://github.com/ballcat-projects/ballcat-ui-react |
| gitee  | https://gitee.com/ballcat-projects/ballcat-ui-react   |

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

可按需修改 `config/settings.ts` 配置文件中的项目标题描述等

```ts
const Settings: ProjectSetting = {
    navTheme: 'dark',
    primaryColor: '#1890ff',
    layout: 'side',
    contentWidth: 'Fluid',
    fixedHeader: true,
    fixSiderbar: true,
    // 项目标题
    title: 'Ball Cat',
    pwa: false,
    logo: '/logo.svg',
    historyType: 'browser',
    // 是否开启国际化
    i18n: true,
    // 是否开始websocket连接
    websocket: true,
    // 默认语言
    defaultLocal: 'zh-CN',
    // 是否展示水印
    waterMark: true,
    // 是否展示顶部多页签
    multiTab: true,
    storageOptions: {
        // 浏览器缓存key 前缀
        namespace: 'ballcat/',
        // 缓存类型, 目前仅支持 localStorage
        storage: 'local',
    },
};
```

> 注意：websocket 需要服务端同步开启 websocket 支持，否则前端项目启动后将会闪退

### 开发代理

```ts
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      target: 'http://admin.ballcat.cn/',
      // 支付 websocket转发
      ws: true,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
```

target 为前端开发环境下访问的服务端地址，默认使用的是 ballcat 组织提供的预览环境，请按需替换为实际的开发地址，如：
```js
'http://ballcat-admin:8080'
```

## 启动项目

打开命令行进入项目根目录，或在 ide 提供的命令行工具中执行

::: code-group
```shell [yarn]
yarn start
```

```shell [npm]
npm run start
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