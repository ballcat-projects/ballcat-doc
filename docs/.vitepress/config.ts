import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Ballcat",
    themeConfig: {
        logo: './logo.png',
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            {text: '指南', link: '/guide/'},
            {text: '代码生成器', link: '/codegen/'}
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
                    text: "认证授权",
                    items: [
                        {text: 'OAuth 2.0', link: '/guide/security/oauth2'},
                        {text: 'OAuth2 服务器', link: '/guide/security/oauth2-server'},
                        {text: 'Ballcat Spring Authorization Server', link: '/guide/security/sas-server'},
                    ],
                },
                {
                    text: "功能扩展",
                    items: [
                        {text: '布隆过滤器', link: "/guide/feature/bloom-filter"},
                        {text: '数据权限', link: "/guide/feature/data-scope"},
                        {text: '脱敏工具', link: "/guide/feature/desensitization"},
                        {text: '分布式定时任务', link: "/guide/feature/distributed-job"},
                        {text: 'Excel 导入导出', link: "/guide/feature/excel"},
                        {text: 'File 文件上传', link: "/guide/feature/file"},
                        {text: '国际化（I18N）', link: "/guide/feature/i18n"},
                        {text: '幂等处理方案', link: "/guide/feature/idempotent"},
                        {text: 'IP2region 离线IP地址查询', link: "/guide/feature/ip2region"},
                        {text: 'OpenAPI文档（Swagger）', link: "/guide/feature/openapi"},
                        {text: 'OSS 对象存储', link: "/guide/feature/oss"},
                        {text: 'Redis 工具', link: "/guide/feature/redis"},
                        {text: 'WebSocket', link: "/guide/feature/websocket"}
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
                },
                {
                    text: "其他",
                    items: [
                        {text: 'Maven 资源文件占位符使用', link: "/guide/other/maven-resource-filter"},
                        {text: '二开代码同步', link: "/guide/other/syncing-fork"},
                        {text: 'git commit emoji 使用指南', link: "/guide/other/git-emoji"},
                        {text: 'Swagger2.x 升级 OpenApi3.x 不完全指南', link: "/guide/other/swagger2ToOpenApi3"}
                    ],
                },
            ],
            "/codegen/": ["/codegen/"],
        },

        socialLinks: [
            {icon: 'github', link: 'https://github.com/ballcat-projects'}
        ]
    }
})
