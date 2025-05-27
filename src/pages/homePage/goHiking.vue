<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#fff',
  },
}
</route>

<template>
  <view class="main_container">
    <view class="nav-box">
      <view class="tab-box">
        <wd-tabs @chang="tabChange" v-model="tab" auto-line-width inactiveColor="#8D93A6">
          <block v-for="(item, index) in tabList" :key="index">
            <wd-tab :title="item"></wd-tab>
          </block>
        </wd-tabs>
      </view>
      <view class="search-box">
        <input v-model="searchInput" placeholder="中坝森林" />
        <wd-img
          height="44rpx"
          width="72rpx"
          src="/static/images/homepage/search-btn.png"
          @click="inputClick"
        ></wd-img>
      </view>
    </view>
    <attention :contentList="attentionList" v-show="tab == 0" />
    <recommend :contentList="contentList" v-show="tab == 1" />
    <same-city v-show="tab == 2" />
    <tabbar :selected="1" />
  </view>
</template>

<script lang="js" setup>
import attention from './components/attention.vue'
import recommend from './components/recommend.vue'
import sameCity from './components/sameCity.vue'
import tabbar from '@/components/tabbar/index.vue'
// code here
/**
 * @brief        :
 * @explanation  : 搜索框
 * @return        {*}
 */
const searchInput = ref('')
function inputClick() {
  console.log(searchInput)
}

const tabList = ref(['关注', '推荐', '同城'])
const tab = ref(1)

/**
 * @brief        :
 * @explanation  : 内容页
 * @return        {*}
 */
const contentList = ref([
  {
    imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
    text: '开启时髦异域之旅，跟着ETRO去旅行',
    avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    name: '时尚博主',
    like: true, // false是不喜欢，true是喜欢
    saveNum: 2345, // 处理数据时候过万的需要处理
  },
  {
    imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
    text: '开启时髦异域之旅，跟着ETRO去旅行',
    avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    name: '时尚博主',
    like: false, // false是不喜欢，true是喜欢
    saveNum: 24567, // 处理数据时候过万的需要处理
  },
  {
    imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
    text: '让经典焕发新活力，告别极简主义',
    avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    name: '渐渐米乐妍',
    like: true, // false是不喜欢，true是喜欢
    saveNum: 123456, // 处理数据时候过万的需要处理
  },
  {
    imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
    text: '续命奶茶色又来了！又暖又甜这个冬天',
    avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    name: '时尚博主',
    like: false, // false是不喜欢，true是喜欢
    saveNum: 9876, // 处理数据时候过万的需要处理
  },
])

const attentionList = ref([
  {
    imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
    text: '让经典焕发新活力，告别极简主义',
    avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    name: '渐渐米乐妍',
    like: true, // false是不喜欢，true是喜欢
    saveNum: 123456, // 处理数据时候过万的需要处理
  },
])

// 数字格式化方法
const formatLargeNumber = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num
}

function tabChange(e) {
  console.log('tabChange', e);
  
}
</script>

<style lang="scss" scoped>
.main_container {
  width: 100vw;
  height: 100vh;
  padding: 24rpx 32rpx;
  box-sizing: border-box;

  .nav-box {
    display: flex;
    align-items: center;

    .tab-box {
      flex: 1;
      height: 56rpx;
      margin-top: -30rpx;
    }

    .search-box {
      width: 336rpx;
      height: 56rpx;
      background: #ffffff;
      border-radius: 250rpx 250rpx 250rpx 250rpx;
      border: 2rpx solid #000000;
      display: flex;
      align-items: center;
      padding: 0 6rpx 0 20rpx;

      .search-input {
        flex: 1;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
      }
    }
  }

  .content-box {
    width: 100%;
    height: 100vh;
    display: flex;

    .content-left {
      width: 332rpx;

      .content-item-left:nth-child(2n) {
        .img-box {
          width: 100%;
          height: 368rpx;
          background: #f1f3f6;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          overflow: hidden;
        }
      }

      .content-item-left:nth-child(2n + 1) {
        .img-box {
          width: 100%;
          height: 400rpx;
          background: #f1f3f6;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          overflow: hidden;
        }
      }
    }

    .content-right {
      width: 332rpx;

      .content-item-right:nth-child(2n + 1) {
        .img-box {
          width: 100%;
          height: 328rpx;
          background: #f1f3f6;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          overflow: hidden;
        }
      }
  
      .content-item-right:nth-child(2n) {
        .img-box {
          width: 100%;
          height: 400rpx;
          background: #f1f3f6;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          overflow: hidden;
        }
      }
    }

    .content-item {
      width: 332rpx;
      height: fit-content;
      display: flex;
      flex-direction: column;
      margin-top: 36rpx;

      .text-box {
        margin-top: 16rpx;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 350;
        font-size: 28rpx;
        color: #0b1526;
      }

      .info-box {
        margin-top: 16rpx;
        display: flex;
        align-items: center;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 350;
        font-size: 24rpx;
        color: #8d93a6;

        .name {
          margin-left: 16rpx;
          flex: 1;
        }
      }

      .like-box{
        display: flex;
        margin-right: 4rpx;
      }
    }
  }
}

input {
  width: 260rpx;
  padding-left: 20rpx;
  box-sizing: border-box;

  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
}
</style>
