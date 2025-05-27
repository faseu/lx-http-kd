import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    navigationStyle: 'default',
    navigationBarTitleText: 'unibest',
    navigationBarBackgroundColor: '#f8f8f8',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FFFFFF',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  tabBar: {
    color: '#838281',
    selectedColor: '#007135',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    height: '50px',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        pagePath: 'pages/home/index',
        iconPath: 'static/images/index/tab_1_non.png',
        selectedIconPath: 'static/images/index/tab_1_act.png',
        text: '首页',
      },
      {
        pagePath: 'pages/share/index',
        iconPath: 'static/images/index/tab_2_non.png',
        selectedIconPath: 'static/images/index/tab_2_act.png',
        text: '分享',
      },
      {
        pagePath: 'pages/message/index',
        iconPath: 'static/images/index/tab_3_non.png',
        selectedIconPath: 'static/images/index/tab_3_act.png',
        text: '消息',
      },
      {
        pagePath: 'pages/mine/index',
        iconPath: 'static/images/index/tab_4_non.png',
        selectedIconPath: 'static/images/index/tab_4_act.png',
        text: '我的',
      },
    ],
  },
})
