<template>
  <view class="item" :style="`background: ${bg}`" @click="goToTeamDetail(item.id)">
    <view class="w-140rpx h-140rpx pos-relative rounded-20rpx">
      <image
        class="w-full h-full pos-absolute rounded-50% top-0 right-0"
        src="https://temp.im/166x166"
      />
      <image
        class="w-78rpx h-36rpx pos-absolute bottom-[-18rpx] right-32rpx"
        src="https://temp.im/166x166"
      />
    </view>
    <view class="p-16rpx ml-10rpx flex-1 flex flex-col justify-between">
      <view class="flex items-center">
        <view class="font-bold mr-8rpx">张三</view>
        <image class="w-32rpx h-32rpx" src="https://temp.im/32x32" />
      </view>
      <view class="flex items-center mr-12rpx">
        <view>上车点：火车南站D口</view>
      </view>
      <view class="text-20rpx color-[#999]">车牌号：川A***78</view>
    </view>
    <view v-if="true" class="w-228rpx flex flex-col items-center justify-between">
      <view class="flex items-center">
        <view class="mr-12rpx">乘客：</view>
        <view class="flex pos-relative w-120rpx">
          <view class="flex justify-center items-center w-60rpx h-60rpx bg-white rounded-[50%]">
            <image class="w-54rpx h-54rpx rounded-[50%]" src="https://temp.im/40x40" />
          </view>
          <view
            class="flex justify-center items-center w-60rpx h-60rpx bg-white rounded-[50%] pos-absolute top-0 left-30rpx"
          >
            <image class="w-54rpx h-54rpx rounded-[50%]" src="https://temp.im/40x40" />
          </view>
          <view
            class="flex justify-center items-center w-60rpx h-60rpx bg-white rounded-[50%] pos-absolute top-0 left-60rpx"
          >
            <image class="w-54rpx h-54rpx rounded-[50%]" src="https://temp.im/40x40" />
          </view>
        </view>
      </view>
      <!--      <view class="big-btn big-btn-1">退出车主</view>-->
      <view class="big-btn big-btn-2">上该车（余位1）</view>
      <!--      <view class="big-btn big-btn-3">退出该队伍</view>-->
    </view>
    <view v-if="false" class="w-210rpx flex flex-col items-center justify-end">
      <view class="pos-absolute top-0 right-0 w-132rpx h-48rpx">
        <image class="pos-absolute top-0 right-0 w-full h-full" src="https://temp.im/32x32" />
        <view
          class="pos-absolute top-0 right-0 flex items-center justify-center w-96rpx h-full color-white"
        >
          审核中
        </view>
      </view>
      <view class="flex w-full justify-between">
        <view class="small-btn small-btn-1">拒绝</view>
        <view class="small-btn small-btn-2">通过</view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  bg: {
    type: String,
    default: '#fff',
  },
  item: {
    type: Object,
    default: () => ({
      id: '',
      time: '',
      icon: '',
      name: '',
      content: '',
      isMe: false,
    }),
  },
})

const goToTeamDetail = (id) => {
  uni.navigateTo({ url: `/pages/teamDetail/index?id=${id}` })
}
</script>

<style scoped lang="scss">
.item {
  position: relative;
  overflow: hidden;
  width: 100%;
  font-size: 24rpx;
  color: #333333;
  height: 188rpx;
  margin-top: 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
  display: flex;
  padding: 16rpx;
  box-sizing: border-box;
  .big-btn {
    width: 214rpx;
    height: 48rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
    border-radius: 24rpx;
  }
  .big-btn-1 {
    border: 2rpx solid #009dff;
    color: #009dff;
  }
  .big-btn-2 {
    background: linear-gradient(152deg, #3b60ff 0%, #00c3ff 100%);
    color: #fff;
  }
  .big-btn-3 {
    background: #c1c1c1;
    color: #fff;
  }

  .small-btn {
    width: 100rpx;
    height: 48rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16rpx;
    border-radius: 24rpx;
  }
  .small-btn-1 {
    border: 2rpx solid #ff9d96;
    color: #ff9d96;
  }
  .small-btn-2 {
    background: #4bd06e;
    color: #fff;
  }
}
</style>
