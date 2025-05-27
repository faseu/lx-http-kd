<route lang="json5" type="page">
{
  style: {
    navigationStyle: 'custom',
  },
}
</route>
<template>
  <view class="main_container">
    <view class="poster-box">
      <wd-img
        height="100%"
        width="100%"
        :src="activityDetail.cover_image"
      ></wd-img>
      <view class="nav-back" @click="goBack">
        <wd-img height="100%" width="100%" src="/static/images/homepage/goBack.png"></wd-img>
      </view>
      <view class="join-box">
        <view class="number">{{ activityDetail.want__to_count }}</view>
        <view class="normal">人想去；</view>
        <view class="number">{{ activityDetail.team_count }}</view>
        <view class="normal">个队伍在约搭</view>
        <view class="left-join">
          <view class="circle">
            <wd-img
              :width="20"
              :height="20"
              round 
              src="https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg"
            />
          </view>
          <view class="circle">
            <wd-img
              :width="20"
              :height="20"
              round
              src="https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg"
            />
          </view>
          <view class="circle">
            <wd-img
              :width="20"
              :height="20"
              round
              src="https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg"
            />
          </view>
        </view>
      </view>
    </view>

    <view class="tab-container">
      <wd-tabs v-model="activeIndex" :autoLineWidth="true" lineColor="#3b60ff">
        <wd-tab v-for="(item, index) in tabList" :key="index" :title="item"></wd-tab>
      </wd-tabs>
    </view>

    <view class="content-box">
      <poster_1 v-show="activeIndex == 0" :images="activityDetail.images || []"></poster_1>
      <poster_2 v-show="activeIndex == 1" :activityData="activityDetail"></poster_2>
      <poster_3 v-show="activeIndex == 2"></poster_3>
    </view>
  </view>
</template>

<script lang="js" setup>
import { httpGet, httpPost } from '@/utils/http'
import poster_1 from './components/poster_1.vue'
import poster_2 from './components/poster_2.vue'
import poster_3 from './components/poster_3.vue'

function goBack() {
  uni.navigateBack()
}

const idUrl = ref('')
const activityDetail = ref({})
onLoad(async (e) => {
  const { run: runActivityDetail } = useRequest((e) => httpPost(idUrl.value))
  idUrl.value = `/api/activity/activities/preview/${e.id}`
  const value1 = await runActivityDetail()
  activityDetail.value = value1
  console.log('activityDetail数据:', activityDetail.value)
  
  
})

const tabList = ref(['攻略', '约搭队伍', '最新动态'])
const activeIndex = ref(0)
const handleTabClick = (index) => {
  activeIndex.value = index
}
</script>

<style lang="scss" scoped>
.main_container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  .poster-box {
    height: 636rpx;
    width: 750rpx;
    position: relative;

    .nav-back {
      width: 72rpx;
      height: 60rpx;
      position: absolute;
      top: 108rpx;
      left: 40rpx;
    }

    .join-box {
      position: absolute;
      bottom: 24rpx;
      right: 10rpx;
      padding: 10rpx 16rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 98rpx 98rpx 98rpx 98rpx;
      font-family:
        Source Han Sans,
        Source Han Sans;
      font-weight: 150;
      font-size: 24rpx;
      color: #ffffff;
      display: flex;
      align-items: center;

      .number {
        font-weight: 900;
      }

      .left-join {
        display: flex;
        margin-top: -25rpx;
        min-width: 90rpx;
        margin-left: 16rpx;

        .circle {
          width: 20rpx;
          height: 20rpx;
          border-radius: 50%;
        }
      }
    }
  }

  .tab-container {
    height: 100rpx;
    background-color: #ffffff;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 10;

    :deep(.wd-tabs) {
      height: 100%;
    }

    :deep(.wd-tabs__nav) {
      height: 100%;
    }

    :deep(.wd-tab) {
      height: 100%;
      line-height: 108rpx;
      font-size: 28rpx;
      font-weight: 500;
    }
  }

  .content-box {
    flex: 1;
    overflow: hidden;
  }

  .bottom-btn {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 20rpx 40rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom, 20rpx));
    z-index: 10;
  }

  .go-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(90deg, #222222 0%, #222222 100%);
    border-radius: 44rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    text-align: center;
    border: none;
  }
}
</style>
