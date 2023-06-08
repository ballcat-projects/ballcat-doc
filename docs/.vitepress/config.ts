import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Ballcat",
    themeConfig: {
        logo: './logo.png',
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '功能组件', link: '/guide/'},
            {text: '业务模块', link: '/business/'},
            {text: '后台管理', link: '/admin/'},
            {text: '代码生成器', link: '/codegen/'},
            {
                text: '更多',
                items: [
                    {text: 'Maven 资源文件占位符使用', link: "/other/maven-resource-filter"},
                    {text: '二开代码同步', link: "/other/syncing-fork"},
                    {text: 'git commit emoji', link: "/other/git-emoji"},
                    {text: 'Swagger 升级 OpenApi', link: "/other/swagger2ToOpenApi3"}
                ]
            }
        ],
        sidebar: {
            "/guide/": [
                {
                    text: "使用介绍",
                    items: [
                        {text: 'Ballcat', link: '/guide/'},
                        {text: '快速搭建', link: '/guide/quick-start'},
                        {text: '常见问题', link: '/guide/FAQ'},
                        {text: '改动日志', link: '/guide/CHANGELOG'},
                    ],
                },
                {
                    text: "功能组件",
                    items: [
                        {text: '数据权限组件', link: "/guide/feature/data-scope"},
                        {text: '脱敏工具', link: "/guide/feature/desensitization"},
                        {text: '钉钉通知', link: "/guide/feature/dingtalk"},
                        {text: 'Excel 组件', link: "/guide/feature/excel"},
                        {text: 'File 文件组件', link: "/guide/feature/file"},
                        {text: 'GRPC 组件', link: "/guide/feature/grpc"},
                        {text: 'I18N 国际化组件', link: "/guide/feature/i18n"},
                        {text: '幂等组件', link: "/guide/feature/idempotent"},
                        {text: 'IP2region 离线IP地址查询', link: "/guide/feature/ip2region"},
                        {text: '分布式定时任务', link: "/guide/feature/distributed-job"},
                        {text: 'kafka 消息队列', link: "/guide/feature/kafka"},
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
                        {text: 'Ballcat Spring Authorization Server', link: '/guide/security/sas-server'},
                    ],
                },
                {
                    text: "前端开发",
                    items: [
                        {text: 'ProTable', link: "/guide/front/pro-table"},
                        {text: '字典组件', link: "/guide/front/dict"},
                        {text: 'Lov Local', link: "/guide/front/lov-local"},
                        {text: '前端部署', link: "/guide/front/front-deploy"},
                        {text: 'Ant Design Pro V5 动态路由', link: "/guide/front/react-antd-pro-v5-dynamic-route"}
                    ],
                }
            ],
            "/codegen/": [],
            "/other/": [],
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/ballcat-projects'}
        ]
    }
})
