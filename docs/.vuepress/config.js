module.exports = {
  title: 'Xiao Blog',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }
    ],
    [
      'link',
      { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-152x152.png' }
    ],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/icons/msapplication-icon-144x144.png'
      }
    ],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  serviceWorker: true,
  themeConfig: {
    lastUpdated: '上次更新',
    sidebar: [
      {
        title: 'JavaScript',
        collapsable: false,
        children: [
          'javascript/', 
          'javascript/partner', 
          // 'javascript/js', 
          'javascript/canvas'
        ]
      },
      {
        title: 'Vue',
        collapsable: false,
        children: [
          'vue/',
          'vue/vuex-persistence',
          'vue/vueMultipage',
          'vue/optimize',
          'vue/parcel-vue',
          'vue/sync-component'
        ]
      },
      {
        title: 'WebApp',
        collapsable: false,
        children: ['webapp/', 'webapp/questions']
      },
      // {
      //   title: '代码块',
      //   collapsable: false,
      //   children: ['block/promise', 'block/page']
      // },
      {
        title: '其他',
        collapsable: false,
        children: ['others/', 'others/vsESlint', 'others/nginx']
      }
    ]
  }
}
