# Ballcat Admin UI Vue3 版本

## 环境准备

请先下载并安装好 Node 环境，版本要求 16+ 。

## 代码下载

| 代码仓库   | 地址                                                        |
|--------|-----------------------------------------------------------|
| github | https://github.com/ballcat-projects/ballcat-admin-ui-vue3 |
| gitee  | https://gitee.com/ballcat-projects/ballcat-admin-ui-vue3  |

> Gitee（码云）做为 github 的镜像仓库，代码可能同步会有一定延时

## 依赖安装

**vue3 版本强制使用 pnpm 作为包管理工具**  

没有安装过 pnpm 请先执行 `npm install -g pnpm`。

::: code-group
```sh [pnpm]
$ pnpm install
```
:::

::: warning 提示
如果错误的使用了 npm 或者 yarn 进行了依赖安装，请先删除 node_modules 文件夹后重新使用 pnpm 安装依赖，否则可能会出现异常。  
:::


## 配置修改

### projectConfig

可按需修改 `src/config/index.ts` 配置文件中的项目标题描述等

```ts
// 项目标题
export const projectTitle = 'Ballcat Admin'
// 项目描述
export const projectDesc = 'Ballcat Admin 是一套简单好用的后台管理系统'

// Local Storage/ Session Storage 的 key 前缀 prefix
export const storageKeyPrefix = 'ballcat-admin/'

// 开启 websocket，开启此选项需要服务端同步支持 websocket 功能
// 若服务端不支持，则本地启动时，抛出 socket 异常，导致 proxyServer 关闭
export const enableWebsocket = true

// 开启布局设置
export const enableLayoutSetting = true

// 开启登录验证码
export const enableLoginCaptcha = true

// 是否开启国际化
export const enableI18n = true
// 项目默认语言
export const defaultLanguage = 'zh-CN'
// 支持的语言信息
export const supportLanguage: SupportLanguage = {
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
}
```

> 注意：enableWebsocket 需要服务端同步开启 websocket 支持，否则前端项目启动后将会闪退

### vite.config

`vite.config.ts` 中的 `serverAddress` 属性值为服务端的接口地址。  

默认使用的是 ballcat 组织提供的预览环境， 请按需替换为实际的开发地址，如：
```js
const serverAddress = 'http://ballcat-admin:8080'
```

## 启动项目

打开命令行进入项目根目录，或在 ide 提供的命令行工具中执行

::: code-group
```sh [pnpm]
$ pnpm run dev
```
:::

## 访问项目

默认前端项目路径：[http://localhost:5173/](http://localhost:5173/)

默认用户名密码：admin/a123456

> 注意这里在 5173 端口号被占用时，端口号可能会自动递增为 5174


::: code-group
```shell [pnpm]
pnpm run build
```
:::

执行以上命令后，将会在项目根目录生成 `dist` 文件夹，其中即是构建好的静态文件，上传此文件夹到服务器的指定位置即可。