import {defineConfig, type PageData, type TransformPageContext} from 'vitepress'
import {BALLCAT_VERSION} from "./constants";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Ballcat",
    description: '帮助开发者快速高效的完成功能开发',
    transformPageData: (pageData: PageData, ctx: TransformPageContext) => {
        pageData.frontmatter.ballcatVersion = BALLCAT_VERSION
    },
    ignoreDeadLinks: [
        // ignore all localhost links
        /^https?:\/\/localhost/,
    ],
    srcDir: ".",
    themeConfig: {
        logo: '/logo.png',
        // https://vitepress.dev/reference/default-theme-config
        outline: {
            level: [2, 3]
        },
        footer: {
            message: '<a href="https://beian.miit.gov.cn" target="_blank">皖ICP备2023010551号</a>',
            copyright: 'Copyright © 2019-present The Ballcat Authors'
        },
        nav: [
            {text: '功能组件', link: '/guide/'},
            {text: '业务模块', link: '/business/'},
            {text: '后台管理', link: '/admin/'},
            {text: '代码生成器', link: '/codegen/'},
            {
                text: BALLCAT_VERSION,
                items: [
                    {text: '1.x 文档', link: "http://v1.ballcat.cn"},
                ]
            },
            {
                text: '更多',
                items: [
                    {text: 'Maven 资源文件占位符使用', link: "/other/maven-resource-filter"},
                    {text: '二开代码同步', link: "/other/syncing-fork"},
                    {text: 'git commit emoji', link: "/other/git-emoji"},
                    {text: 'Swagger 升级 OpenApi', link: "/other/swagger2ToOpenApi3"}
                ]
            },
        ],
        sidebar: {
            "/guide/": [
                {
                    text: "使用介绍",
                    items: [
                        {text: 'Ballcat', link: '/guide/'},
                        {text: '常见问题', link: '/guide/FAQ'},
                        {text: '改动日志', link: '/guide/CHANGELOG'},
                    ],
                },
                {
                    text: "功能组件",
                    items: [
                        {text: '数据权限组件', link: "/guide/feature/data-scope"},
                        {text: '脱敏工具', link: "/guide/feature/desensitization"},
                        {text: '策略模式工具', link: "/guide/feature/strategy"},
                        {text: '钉钉通知', link: "/guide/feature/dingtalk"},
                        {text: 'Excel 组件', link: "/guide/feature/excel"},
                        {text: 'File 文件组件', link: "/guide/feature/file"},
                        {text: 'GRPC 组件', link: "/guide/feature/grpc"},
                        {text: 'I18N 国际化组件', link: "/guide/feature/i18n"},
                        {text: '幂等组件', link: "/guide/feature/idempotent"},
                        {text: 'IP2region 离线IP地址查询', link: "/guide/feature/ip2region"},
                        {text: '定时任务', link: "/guide/feature/job"},
                        {text: 'Kafka 消息队列', link: "/guide/feature/kafka"},
                        {text: 'Log 日志组件', link: "/guide/feature/log"},
                        {text: 'Mail 邮件组件', link: "/guide/feature/mail"},
                        {text: 'Mybatis Plus 扩展封装', link: "/guide/feature/mybatis-plus"},
                        {text: 'NTP 时间同步工具', link: "/guide/feature/ntp"},
                        {text: 'OpenAPI文档（Swagger）', link: "/guide/feature/openapi"},
                        {text: 'OSS 对象存储', link: "/guide/feature/oss"},
                        {text: 'Pay 支付组件', link: "/guide/feature/pay"},
                        {text: 'Redis 工具', link: "/guide/feature/redis"},
                        {text: 'Sms 短信组件', link: "/guide/feature/sms"},
                        {text: 'Tesseract OCR文字识别工具', link: "/guide/feature/tesseract"},
                        {text: 'Web 组件', link: "/guide/feature/web"},
                        {text: 'WebSocket 组件', link: "/guide/feature/websocket"},
                        {text: 'XSS 防注入组件', link: "/guide/feature/xss"},
                        {text: '布隆过滤器', link: "/guide/feature/bloom-filter"},
                    ],
                },
                {
                    text: "认证授权",
                    items: [
                        {text: 'OAuth 2.0', link: '/guide/security/oauth2'},
                        {text: 'OAuth2 服务器', link: '/guide/security/oauth2-server'},
                        {text: 'Spring Authorization Server', link: '/guide/security/sas-server'},
                    ],
                }
            ],
            "/admin/": [
                {
                    text: '服务端',
                    items: [
                        {text: '快速搭建', link: '/admin/server/quick-start'},
                    ]
                },
                {
                    text: '前端',
                    items: [
                        {
                            text: 'Vue3 版本',
                            collapsed: true,
                            items: [
                                {text: '快速上手', link: "/admin/front/ui-vue3/"},
                            ]
                        },
                        {
                            text: 'React 版本',
                            collapsed: true,
                            items: [
                                {text: '快速上手', link: "/admin/front/ui-react/"},
                                {text: '动态路由', link: "/admin/front/ui-react/dynamic-route"}
                            ]
                        },
                        {
                            text: 'Vue2 版本',
                            collapsed: true,
                            items: [
                                {text: '快速上手', link: "/admin/front/ui-vue2/"},
                                {text: 'ProTable', link: "/admin/front/ui-vue2/pro-table"},
                                {text: '字典组件', link: "/admin/front/ui-vue2/dict"},
                                {text: 'Lov Local', link: "/admin/front/ui-vue2/lov-local"},
                            ]
                        },
                        {text: '前端部署', link: "/admin/front/front-deploy"},
                    ]
                },
            ],
            "/codegen/": [],
            "/other/": [],
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/ballcat-projects'}
        ]
    }
})
