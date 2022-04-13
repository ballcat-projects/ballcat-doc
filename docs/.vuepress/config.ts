import {defineUserConfig} from "vuepress";
import type {DefaultThemeOptions} from "vuepress";

// https://v2.vuepress.vuejs.org/zh/
export default defineUserConfig<DefaultThemeOptions>({
    port: 8090,
    lang: "zh-CN",
    title: "BallCat",
    head: [["link", {rel: "icon", href: "/logo.png"}]],
    dest: "docs/.vuepress/doc",
    themeConfig: {
        navbar: [
            {text: "指南", link: "/guide/"},
            {text: "代码生成", link: "/codegen/"},
            {text: "预览", link: "http://preview.ballcat.cn", target: "_blank"},
        ],
        repo: "https://github.com/ballcat-projects",
        logo: "/logo.png",

        docsRepo: "https://github.com/ballcat-projects/ballcat-doc",
        docsBranch: "master",
        editLinkText: "在 GitHub 上编辑此页",
        editLinkPattern: ":repo/edit/:branch/docs/:path",
        lastUpdatedText: "上次更新",
        contributors: false,

        sidebar: {
            "/guide/": [
                {
                    text: "使用介绍",
                    children: [
                        "/guide/",
                        "/guide/quick-start.md",
                        "/guide/CHANGELOG.md",
                        "/guide/FAQ.md",
                    ],
                },
                {
                    text: "认证授权",
                    children: [
                        "/guide/security/oauth2.md",
                        "/guide/security/oauth2-server.md",
                    ],
                },
                {
                    text: "功能扩展",
                    children: [
                        "/guide/feature/i18n.md",
                        "/guide/feature/data-scope.md",
                        "/guide/feature/websocket.md",
                        "/guide/feature/bloom-filter.md",
                        "/guide/feature/desensitization.md",
                        "/guide/feature/excel.md",
                        "/guide/feature/redis.md",
                        "/guide/feature/oss.md",
                        "/guide/feature/file.md",
                        "/guide/feature/openapi.md",
                    ],
                },
                {
                    text: "前端开发",
                    children: [
                        "/guide/front/pro-table.md",
                        "/guide/front/dict.md",
                        "/guide/front/lov-local.md",
                        "/guide/front/front-deploy.md",
                    ],
                },
                {
                    text: "其他",
                    children: [
                        "/guide/other/syncing-fork.md",
                        "/guide/other/git-emoji.md",
                        "/guide/other/swagger2ToOpenApi3.md"
                    ],
                },
            ],
            "/codegen/": ["/codegen/"],
        },
        sidebarDepth: 1,
    },
});
