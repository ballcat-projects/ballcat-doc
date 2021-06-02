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
                '/guide/',
                '/guide/quick-start',
                '/guide/data-scope',
                '/guide/syncing-fork',
                '/guide/desensitization',
                '/guide/git-emoji',
                '/lov/lov.md'
            ],
            '/codegen/': [
                '/codegen/'
            ]
        }
    }
}
