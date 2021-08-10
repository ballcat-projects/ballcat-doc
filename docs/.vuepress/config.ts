import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

// https://v2.vuepress.vuejs.org/zh/
export default defineUserConfig<DefaultThemeOptions>({
    lang: 'zh-CN',
    title: "BallCat",
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    themeConfig: {
        navbar: [
            { text: '指南', link: '/guide/' },
            { text: '代码生成', link: '/codegen/' },
            { text: '预览', link: 'http://preview.ballcat.cn', target:'_blank' }
        ],
        repo:  'https://github.com/Hccake/ballcat',
        logo: '/logo.png',

        docsRepo: 'https://github.com/ballcat-projects/ballcat-doc',
        docsBranch: 'master',
        editLinkText: '在 GitHub 上编辑此页',
        editLinkPattern: ':repo/edit/:branch/docs/:path',
        lastUpdatedText: '上次更新',
        contributors: false,

        sidebar: {
            '/guide/': [
                {
                    text: '使用介绍',
                    children: [
                        '/guide/',
                        '/guide/quick-start.md',
                    ],
                },
                {
                    text: '认证授权',
                    children: [
                        '/guide/security/OAuth2.md',
                    ]
                },
                {
                    text: '功能扩展',
                    children: [
                        '/guide/feature/i18n.md',
                        '/guide/feature/data-scope.md',
                        '/guide/feature/websocket.md',
                        '/guide/feature/bloom-filter.md',
                        '/guide/feature/desensitization.md',
                    ]
                },
                {
                    text: '前端开发',
                    children: [
                        '/guide/front/syncing-fork.md',
                        '/guide/front/lov-local.md'
                    ]
                },
                {
                    text: '其他',
                    children: [
                        '/guide/other/git-emoji.md',
                    ]
                },
            ],
            '/codegen/': [
                '/codegen/'
            ]
        },
        sidebarDepth: 1
    }
})
