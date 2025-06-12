<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
}
</route>
<template>
  <view class="main">
    <view class="bg_box">
      <image class="w-750rpx h-1624rpx" src="/static/images/common/bg2.png" />
    </view>
    <wd-navbar
      safeAreaInsetTop
      custom-style="background-color: transparent !important; z-index: 99"
    />
    <view class="main-box">
      <view class="mine-box">
        <view class="mine-left">
          <view class="avator">
            <view class="avator-img">
              <wd-img
                width="100%"
                height="100%"
                round
                :src="isLogined ? userInfo?.avatar : '/static/images/common/avatar.png'"
              />
            </view>
            <view class="edit-img" @click="goToSettings">
              <wd-img width="100%" height="100%" src="/static/images/mine/edit-btn.png" />
            </view>
          </view>
        </view>
        <view class="mine-right">
          <view class="setting-btn" @click="goToSettings">
            <wd-img width="100%" height="100%" src="/static/images/mine/setting-btn.png" />
          </view>
          <view class="mine-name" v-if="isLogined">{{ userInfo?.nickname }}</view>
          <view class="mine-name" v-else @click="goToLogin">注册/登录</view>
          <view class="mine-type">
            <view
              class="type-item"
              :class="[j % 3 == 0 ? 'blue' : j % 3 == 1 ? 'brown' : 'purple']"
              v-for="(i, j) in userInfo?.hobbies"
              :key="j"
            >
              {{ i }}
            </view>
          </view>
        </view>
      </view>
      <view class="follow-box">
        <view class="follow-item">
          <view class="num">{{ userInfo?.following_count || 0 }}</view>
          <view class="label">关注</view>
        </view>
        <view class="follow-item">
          <view class="num">{{ userInfo?.followers_count || 0 }}</view>
          <view class="label">粉丝</view>
        </view>
      </view>
      <view class="content-box">
        <view class="content-item" v-for="(i, j) in contentList" :key="j" @click="toPage(i)">
          <view class="icon">
            <wd-img height="100%" width="100%" :src="i.iconUrl"></wd-img>
          </view>
          <view class="label">{{ i.name }}</view>
          <wd-icon name="arrow-right" size="12px" color="#797979" />
        </view>
        <view class="logout-box" v-if="isLogined" @click="goToLogin">
          <wd-icon name="logout" size="22px"></wd-icon>
          <text class="ml-20rpx">退出登录</text>
        </view>
      </view>
    </view>
    <tabbar :selected="4" />
  </view>
</template>

<script lang="js" setup>
import tabbar from '@/components/tabbar/index.vue'
import { useToast } from 'wot-design-uni'
import { onShow } from '@dcloudio/uni-app'
import { httpGet } from '@/utils/http'
import { getIsTabbar } from '@/utils'
import { useUserStore } from '@/store'
const toast = useToast()

const userStore = useUserStore()
const isLogined = computed(() => userStore.isLogined)

const userInfo = ref()
// 请求用户信息
const { run: runGetUserInfo } = useRequest(() => httpGet('/api/get_user'))

defineOptions({
  name: 'mine',
})

const contentList = ref([
  {
    name: '我的活动',
    iconUrl: '/static/images/mine/btn-1.png',
    linkUrl: '/pages/myActivity/index',
  },
  {
    name: '我的收藏',
    iconUrl: '/static/images/mine/btn-2.png',
    linkUrl: '/pages/mine/myCollect',
  },
  {
    name: '我的相册',
    iconUrl: '/static/images/mine/btn-3.png',
    linkUrl: '/pages/mine/myAblum',
  },
  {
    name: '我的保单',
    iconUrl: '/static/images/mine/btn-4.png',
    linkUrl: '',
  },
])

const toPage = (e) => {
  if (!isLogined.value) {
    toast.show('请先登录！')
    return
  }
  if (e.name === '我的收藏' || e.name === '我的相册') {
    toast.show('正在开发中，敬请期待！～')
  } else {
    uni.navigateTo({
      url: e.linkUrl,
    })
  }
}

const goToSettings = () => {
  uni.navigateTo({ url: `/pages/settings/index` })
}

const goToLogin = () => {
  userStore.clearUserInfo()
  uni.navigateTo({ url: `/pages/login/index` })
}

onShow(async () => {
  if (getIsTabbar()) {
    uni?.hideTabBar()
  }
  if (isLogined.value) {
    userInfo.value = await runGetUserInfo()
  }
})
</script>

<style scoped lang="scss">
.main {
  position: relative;
  height: 100vh;

  .bg_box {
    position: absolute;
    width: 750rpx;
    height: 890rpx;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  .main-box {
    position: relative;
    width: 100%;

    .mine-box {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0 20rpx;
      box-sizing: border-box;

      .mine-left {
        position: relative;
        width: 160rpx;
        height: 160rpx;

        .avator {
          width: 160rpx;
          height: 160rpx;
          border-radius: 50%;
          background-color: #fff;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          .avator-img {
            width: 150rpx;
            height: 150rpx;
          }

          .edit-img {
            width: 40rpx;
            height: 40rpx;
            position: absolute;
            bottom: 5rpx;
            right: 5rpx;
          }
        }
      }

      .mine-right {
        flex: 1;
        margin-left: 28rpx;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .setting-btn {
          width: 44rpx;
          height: 44rpx;
          position: absolute;
          top: 8rpx;
          right: 12rpx;
        }

        .mine-name {
          font-weight: 500;
          font-size: 40rpx;
          color: #0b1526;
        }

        .mine-brif {
          font-weight: 350;
          font-size: 24rpx;
          color: #8d93a6;
        }

        .mine-type {
          display: flex;
          flex-wrap: wrap;

          .type-item {
            margin-right: 5rpx;
            padding: 6rpx 8rpx;
            box-sizing: border-box;
            border-radius: 8rpx 8rpx 8rpx 8rpx;
            font-weight: 350;
            font-size: 20rpx;
          }

          .blue {
            color: #2a5cff;
            border: 1rpx solid rgba(42, 92, 255, 0.2);
          }

          .brown {
            color: #ff8c28;
            border: 1rpx solid rgba(255, 140, 40, 0.2);
          }

          .purple {
            color: rgba(95, 42, 255, 1);
            border: 1rpx solid rgba(95, 42, 255, 0.2);
          }
        }
      }
    }

    .follow-box {
      display: flex;
      width: 100%;
      margin-top: 28rpx;
      .follow-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .num {
          font-weight: 700;
          font-size: 40rpx;
          color: #0b1526;
        }

        .label {
          font-weight: 350;
          font-size: 24rpx;
          color: #999999;
        }
      }
    }

    .content-box {
      position: relative;
      margin-top: 28rpx;
      z-index: 99;
      width: 100%;
      height: 63vh;
      background: #ffffff;
      box-shadow: 0rpx 8rpx 20rpx 0rpx #cae5eb;
      border-radius: 40rpx 40rpx 40rpx 40rpx;
      padding: 32rpx 44rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;

      .content-item {
        display: flex;
        align-items: center;
        margin-bottom: 50rpx;
        width: 100%;
      }

      .icon {
        width: 40rpx;
        height: 38rpx;
      }

      .label {
        font-weight: 400;
        font-size: 32rpx;
        color: #333333;
        flex: 1;
        margin-left: 6rpx;
      }
    }

    .logout-box {
      position: absolute;
      bottom: 150rpx;
      color: #d5d5d5;
      display: flex;
      align-items: center;
    }
  }
}
:deep() {
  .wd-navbar.is-border::after {
    display: none;
  }
}
</style>
