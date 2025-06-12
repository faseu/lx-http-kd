<template>
  <view>
    <view class="tabbar-box">
      <view class="tabbar-mid" @click="goToPublish">
        <image class="tabbar-mid-image" src="/static/images/index/tab_mid.png" />
      </view>
      <view class="tabbar-box-list">
        <view
          v-for="(item, index) in tabbarList"
          class="tabbar-box-list-item"
          :key="index"
          @click="handleChangeTabbar(index)"
        >
          <image
            class="tabbar-icon"
            :src="index === selected ? item.selectedIconPath : item.iconPath"
          />
          <view
            :class="{
              'color-[#009DFF]': index === selected,
              'color-[#D0D3DE]': index !== selected,
              'tabbar-text': true,
            }"
          >
            {{ item.text }}
          </view>
        </view>
      </view>
      <wd-gap bg-color="#FFFFFF" safe-area-bottom height="0"></wd-gap>
    </view>
  </view>
</template>

<script setup>
import { useUserStore } from '@/store'
import { useToast } from 'wot-design-uni'
const userStore = useUserStore()
const toast = useToast()
const isLogined = computed(() => userStore.isLogined)

const props = defineProps({
  selected: {
    type: Number,
    default: 0,
  },
})

const tabbarList = [
  {
    pagePath: '/pages/home/index',
    iconPath: '../../static/images/index/tab_1_non.png',
    selectedIconPath: '../../static/images/index/tab_1_act.png',
    text: '首页',
  },
  {
    pagePath: '/pages/share/index',
    iconPath: '../../static/images/index/tab_2_non.png',
    selectedIconPath: '../../static/images/index/tab_2_act.png',
    text: '分享',
  },
  {},
  {
    pagePath: '/pages/message/index',
    iconPath: '../../static/images/index/tab_3_non.png',
    selectedIconPath: '../../static/images/index/tab_3_act.png',
    text: '消息',
  },
  {
    pagePath: '/pages/mine/index',
    iconPath: '../../static/images/index/tab_4_non.png',
    selectedIconPath: '../../static/images/index/tab_4_act.png',
    text: '我的',
  },
]

const handleChangeTabbar = (value) => {
  const target = tabbarList[value]
  if (target && target.pagePath) {
    uni.switchTab({
      url: target.pagePath,
    })
  }
}

const goToPublish = () => {
  if (!isLogined.value) {
    toast.show('请先登录！')
    return
  }
  uni.navigateTo({ url: '/pages/publish/index' })
}
</script>

<style lang="scss">
.tabbar-box {
  z-index: 999;
  position: fixed;
  left: 0;
  bottom: 0;
  box-shadow: 0px -2px 0px 0px #f1f3f6;
  .tabbar-mid {
    width: 120rpx;
    height: 120rpx;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -28rpx);
    box-shadow: 0px -2px 0px 0px #f1f3f6;
    .tabbar-mid-image {
      width: 132rpx;
      height: 132rpx;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .tabbar-box-list {
    width: 100vw;
    height: 100rpx;
    display: flex;
    justify-content: space-between;
    background: #fff;
    .tabbar-box-list-item {
      padding: 10rpx;
      width: 20%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      font-size: 20rpx;
    }
  }
}
.tabbar-icon {
  height: 48rpx;
  width: 48rpx;
}
</style>
