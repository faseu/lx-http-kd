<template>
  <view class="content-box">
    <scroll-view 
      class="scroll-container" 
      scroll-y 
      :show-scrollbar="false"
    >
      <view class="content-wrapper">
        <view class="content-left">
          <view class="content-item content-item-left" v-for="(i, j) in contentList1" :key="j">
            <view class="img-box">
              <wd-img width="100%" height="100%" :src="i.imgUrl" />
            </view>
            <view class="text-box">{{ i.text }}</view>
            <view class="info-box">
              <view class="avator">
                <wd-img :width="24" :height="24" round :src="i.avatarUrl" />
              </view>
              <view class="name">{{ i.name }}</view>
              <view class="like-box" v-if="i.like">
                <wd-img :width="12" :height="12" src="/static/images/homepage/like.png" />
              </view>
              <view class="like-box" v-else>
                <wd-img :width="12" :height="12" src="/static/images/homepage/unlike.png" />
              </view>
              <view class="num">{{ formatLargeNumber(i.saveNum) }}</view>
            </view>
          </view>
        </view>
        <view class="content-right">
          <view class="content-item content-item-right" v-for="(i, j) in contentList2" :key="j">
            <view class="img-box">
              <wd-img width="100%" height="100%" :src="i.imgUrl" />
            </view>
            <view class="text-box">{{ i.text }}</view>
            <view class="info-box">
              <view class="avator">
                <wd-img :width="24" :height="24" round :src="i.avatarUrl" />
              </view>
              <view class="name">{{ i.name }}</view>
              <view class="like-box" v-if="i.like">
                <wd-img :width="12" :height="12" src="/static/images/homepage/like.png" />
              </view>
              <view class="like-box" v-else>
                <wd-img :width="12" :height="12" src="/static/images/homepage/unlike.png" />
              </view>
              <view class="num">{{ formatLargeNumber(i.saveNum) }}</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="btn-box">
      <view class="share-box">
        <view class="icon">
          <wd-img height="100%" width="100%" src="/static/images/homepage/share.png"></wd-img>
        </view>
        <view class="word">分享</view>
      </view>
      <view class="btn">我也要去</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
// 数字格式化方法
const formatLargeNumber = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num
}

const contentList1 = ref([
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
])

const contentList2 = ref([
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
</script>

<style lang="scss" scoped>
.content-box {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  
  .scroll-container {
    width: 100%;
    flex: 1;
    box-sizing: border-box;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      display: block;
      background: transparent;
    }
  }
  
  .content-wrapper {
    padding: 30rpx 32rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
  }

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
    box-sizing: border-box;

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

    .like-box {
      display: flex;
      margin-right: 4rpx;
    }
  }

  .btn-box {
    width: 100%;
    height: 140rpx;
    background: #ffffff;
    padding: 0 40rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

    .share-box {
      display: flex;
      align-items: center;
      flex-direction: column;

      .icon {
        width: 32rpx;
        height: 32rpx;
      }

      .word {
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 350;
        font-size: 20rpx;
        color: #333333;
      }
    }

    .btn {
      width: 598rpx;
      height: 80rpx;
      background: #222222;
      border-radius: 60rpx;

      font-family:
        Source Han Sans,
        Source Han Sans;
      font-weight: 700;
      font-size: 28rpx;
      color: #ffffff;
      line-height: 80rpx;
      text-align: center;
    }
  }
}
</style>
