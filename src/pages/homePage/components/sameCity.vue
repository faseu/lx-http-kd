<template>
  <view class="content-box">
    <view class="content-item" v-for="(i, j) in pointList" :key="j">
      <view class="img-box">
        <view class="img-info-box">
          <view class="info-left">{{ i.label }}</view>
          <view class="info-right">
            <view class="right-item">
              <view class="right-img">
                <wd-img height="100%" width="100%" src="/static/images/homepage/great.png"></wd-img>
              </view>
              <view class="word">{{ i.like }}</view>
            </view>
            <view class="right-item">
              <view class="right-img">
                <wd-img height="100%" width="100%" src="/static/images/homepage/save.png"></wd-img>
              </view>
              <view class="word">{{ i.collect }}</view>
            </view>
          </view>
        </view>
        <view class="base-info-box">
          <view class="normal">已有</view>
          <view class="orange">2600</view>
          <view class="normal">人游玩过；</view>
          <view class="orange">3362</view>
          <view class="normal">人想去；当前有</view>
          <view class="orange">10</view>
          <view class="normal">个队伍在约搭～</view>
        </view>
        <wd-img height="100%" width="100%" :src="i.imgUrl"></wd-img>
      </view>
      <view class="info-box">
        <view class="place-name">{{ i.placeName }}</view>
        <view class="place-sub">{{ i.subLabel }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const pointList = ref([
  {
    label: '每周一山·推荐',
    like: '5.0',
    collect: '4.0',
    visited: '2260',
    willTo: '3362',
    teamNum: '10',
    placeName: '九顶山·鸡爪鹏',
    subLabel: '当天来回｜日出｜山顶露营｜交通方便',
    imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
  },
  {
    label: '穿山甲特工队·撰写',
    like: '2.5',
    collect: '4.3',
    visited: '2260',
    willTo: '3362',
    teamNum: '10',
    placeName: '赵公山·祖师庙',
    subLabel: '当天来回｜财神庙｜小百可冲｜交通方便',
    imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
  },
])
</script>

<style lang="scss" scoped>
.content-box {
  width: 100%;
  height: 100vh;
  margin-top: 44rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .content-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 30rpx;

    .img-box {
      width: 690rpx;
      height: 262rpx;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      overflow: hidden;
      position: relative;

      .img-info-box {
        position: absolute;
        top: 20rpx;
        padding: 0 22rpx;
        box-sizing: border-box;
        z-index: 99;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .info-left {
          height: 32rpx;
          padding: 2rpx 16rpx;
          box-sizing: border-box;
          background: linear-gradient(180deg, #c1ff00 4%, #08e6e3 99%);
          border-radius: 264rpx 264rpx 264rpx 264rpx;

          font-family:
            Source Han Sans,
            Source Han Sans;
          font-weight: 400;
          font-size: 20rpx;
          color: #333333;
        }

        .info-right {
          display: flex;
          align-items: center;

          .right-item {
            display: flex;
            align-items: center;

            .right-img {
              height: 24rpx;
              width: 32rpx;
              margin-top: -16rpx;
            }

            .word {
              font-family:
                Source Han Sans,
                Source Han Sans;
              font-weight: 500;
              font-size: 20rpx;
              color: #ffffff;
              margin-left: 6rpx;
            }
          }

          .right-item:nth-child(2) {
            margin-left: 24rpx;
          }
        }
      }

      .base-info-box {
        display: flex;
        align-items: center;

        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 400;
        font-size: 20rpx;
        justify-content: center;
        position: absolute;
        bottom: 10rpx;
        left: 0;
        width: 100%;
        z-index: 99;

        .normal {
          color: #ffffff;
        }

        .orange {
          color: #ff6619;
        }
      }
    }

    .info-box {
      margin-top: 18rpx;

      .place-name {
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 500;
        font-size: 32rpx;
        color: #333333;
      }

      .place-sub {
        margin-top: 14rpx;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 400;
        font-size: 20rpx;
        color: #999999;
      }
    }
  }
}
</style>
