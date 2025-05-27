<template>
  <view class="content-box">
    <scroll-view 
      class="scroll-container" 
      scroll-y 
      :show-scrollbar="false"
    >
      <view v-if="images && images.length > 0">
        <view 
          class="image-item" 
          v-for="(image, index) in images" 
          :key="index"
        >
          <wd-img 
            width="100%" 
            :src="getImageUrl(image)" 
            mode="widthFix"
          ></wd-img>
        </view>
      </view>
      <view v-else class="empty-images">暂无海报</view>
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

<script lang="js" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
});

console.log('接收到的图片数据:', props.images);

// 获取图片URL的函数
function getImageUrl(image) {
  if (typeof image === 'string') {
    return image;
  }
  
  if (typeof image === 'object' && image !== null) {
    if (image.image_path) return image.image_path;
    if (image.url) return image.url;
    if (image.image) return image.image;
  }
  
  return '';
}
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
    flex: 1; /* 让滚动区域占满内容盒子剩余空间 */
    padding: 0 20rpx;
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
  
  .image-item {
    width: 100%;
    margin-bottom: 20rpx;
  }
  
  .empty-images {
    width: 100%;
    height: 200rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 28rpx;
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

      .icon{
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
