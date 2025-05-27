<route lang="json5" type="page">
{
  style: {
    navigationBarTitleText: '我的相册',
    navigationBarBackgroundColor: '#fff',
  },
}
</route>

<template>
  <view class="content-box">
    <view class="ablum-item" v-for="(i, j) in ablumList" :key="j">
      <view class="time-part">
        <view class="time">{{ i.date }}</view>
        <view class="location">{{ i.location }}</view>
      </view>
      <view class="pic-part">
        <view class="pic-container" v-if="i.ablumList.length == 1">
          <wd-img height="100%" width="100%" :src="i.ablumList[0]" :enable-preview="true"></wd-img>
        </view>
        <view class="pic-container2" v-else-if="i.ablumList.length == 2">
          <view class="pic-item2" v-for="(z, x) in i.ablumList" :key="x">
            <wd-img height="100%" width="100%" :src="z" :enable-preview="true"></wd-img>
          </view>
        </view>
        <view class="pic-container3" v-else-if="i.ablumList.length == 3">
          <view class="pic-item3 left">
            <wd-img height="100%" width="100%" :src="i.ablumList[0]" :enable-preview="true"></wd-img>
          </view>
          <view class="pic-item3 right">
            <view class="right-1">
              <wd-img height="100%" width="100%" :src="i.ablumList[1]" :enable-preview="true"></wd-img>
            </view>
            <view class="right-2">
              <wd-img height="100%" width="100%" :src="i.ablumList[2]" :enable-preview="true"></wd-img>
            </view>
          </view>
        </view>
        <view class="pic-container3" v-else-if="i.ablumList.length == 4">
          <view class="pic-item4 item4-left">
            <view class="left-1">
              <wd-img height="100%" width="100%" :src="i.ablumList[0]" :enable-preview="true"></wd-img>
            </view>
            <view class="left-2">
              <wd-img height="100%" width="100%" :src="i.ablumList[1]" :enable-preview="true"></wd-img>
            </view>
          </view>
          <view class="pic-item4 item4-right">
            <view class="right-1">
              <wd-img height="100%" width="100%" :src="i.ablumList[2]" :enable-preview="true"></wd-img>
            </view>
            <view class="right-2">
              <wd-img height="100%" width="100%" :src="i.ablumList[3]" :enable-preview="true"></wd-img>
            </view>
          </view>
        </view>
      </view>
      <view class="content-part">{{ i.content }}</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
const ablumList = ref([
  {
    date: '04月05日',
    location: '四川·成都',
    ablumList: ['https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg'],
    content: '人已散架～',
  },
  {
    date: '04月04日',
    location: '长白山',
    ablumList: [
      'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
      'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg',
    ],
    content: '是自由的味道啊顺利登顶！',
  },
  {
    date: '04月03日',
    location: '新疆维吾尔自治区克孜勒苏吉尔吉斯自治州',
    ablumList: [
      'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
      'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg',
      'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
    ],
    content: '骑了快3个小时翻山越岭就是为了在海拔3400米的地方气喘吁吁的滑两趟雪...',
  },
  {
    date: '04月02日',
    location: '',
    ablumList: [
      'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
      'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg',
      'https://registry.npmmirror.com/wot-design-uni-assets/*/files/capybara.jpg',
      'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    ],
    content: '来过，打卡！',
  },
])
</script>

<style lang="scss" scoped>
.content-box {
  width: 100%;
  padding: 24rpx 32rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .ablum-item {
    width: 100%;
    display: flex;
    border-bottom: 4rpx solid #f4f4f4;
    margin-bottom: 22rpx;
    padding-bottom: 16rpx;
    box-sizing: border-box;

    .time-part {
      width: 124rpx;
      height: 150rpx;

      display: flex;
      flex-direction: column;

      .time {
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 500;
        font-size: 28rpx;
        color: #0b1526;
      }

      .location {
        text-align: right;
        margin-top: 10rpx;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;

        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 500;
        font-size: 24rpx;
        color: #8d93a6;
      }
    }

    .pic-part {
      width: 140rpx;
      height: 140rpx;
      margin: 0 12rpx;

      .pic-container {
        width: 100%;
        height: 100%;
        border-radius: 12rpx 12rpx 12rpx 12rpx;
        overflow: hidden;
      }

      .pic-container2 {
        width: 100%;
        height: 100%;
        display: flex;

        .pic-item2 {
          flex: 1;
          height: 100%;
          overflow: hidden;
        }

        .pic-item2:first-child {
          border-radius: 12rpx 0rpx 0rpx 12rpx;
        }

        .pic-item2:last-child {
          margin-left: 2rpx;
          border-radius: 0rpx 12rpx 12rpx 0rpx;
        }
      }

      .pic-container3 {
        width: 100%;
        height: 100%;
        display: flex;

        .pic-item3 {
          flex: 1;
          height: 100%;
          overflow: hidden;
        }

        .left {
          border-radius: 12rpx 0rpx 0rpx 12rpx;
        }

        .right {
          margin-left: 2rpx;
          display: flex;
          flex-direction: column;

          .right-1 {
            overflow: hidden;
            flex: 1;
            border-radius: 0rpx 12rpx 0rpx 0;
          }

          .right-2 {
            overflow: hidden;
            flex: 1;
            margin-top: 2rpx;
            border-radius: 0rpx 0 12rpx 0;
          }
        }

        .pic-item4 {
          flex: 1;
          height: 100%;
        }

        .item4-left {
          display: flex;
          flex-direction: column;

          .left-1 {
            overflow: hidden;
            flex: 1;
            border-radius: 12rpx 0 0 0;
          }

          .left-2 {
            overflow: hidden;
            flex: 1;
            margin-top: 2rpx;
            border-radius: 0rpx 0 0 12rpx;
          }
        }

        .item4-right {
          margin-left: 2rpx;
          display: flex;
          flex-direction: column;

          .right-1 {
            overflow: hidden;
            flex: 1;
            border-radius: 0rpx 12rpx 0rpx 0;
          }

          .right-2 {
            overflow: hidden;
            flex: 1;
            margin-top: 2rpx;
            border-radius: 0rpx 0 12rpx 0;
          }
        }
      }
    }

    .content-part {
      flex: 1;
      font-family:
        Source Han Sans,
        Source Han Sans;
      font-weight: 500;
      font-size: 28rpx;
      color: #0b1526;
    }
  }
}
</style>
