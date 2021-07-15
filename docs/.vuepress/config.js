module.exports = {
    title: "BallCat",
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }]
    ],
    themeConfig: {
        nav: [
            { text: '指南', link: '/guide/' },
            { text: '代码生成', link: '/codegen/' },
            { text: '预览', link: 'http://preview.ballcat.cn', target:'_blank' },
            { text: 'GitHub', link: 'https://github.com/Hccake/ballcat', target:'_blank' },
        ],
        sidebar: {
            '/guide/': [
                {
                    title: '使用介绍',   // 必要的
                    collapsable: false, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        '/guide/',
                        '/guide/quick-start',
                    ]
                },
                {
                    title: '功能扩展',   // 必要的
                    collapsable: false, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'feature/data-scope',
                        'feature/websocket',
                        'feature/bloom-filter',
                        'feature/desensitization',
                    ]
                },
                {
                    title: '前端开发',   // 必要的
                    collapsable: false, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'front/syncing-fork',
                        'front/lov-local.md'
                    ]
                },
                {
                    title: '其他',   // 必要的
                    collapsable: false, // 可选的, 默认值是 true,
                    sidebarDepth: 1,    // 可选的, 默认值是 1
                    children: [
                        'other/git-emoji',
                    ]
                },
            ],
            '/codegen/': [
                '/codegen/'
            ]
        }
    }
}
