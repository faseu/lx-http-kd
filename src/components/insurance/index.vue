<template>
  <view
    class="w-100vw h-488rpx bg-[#DFF2F6] pos-relative left-[-20rpx] p-[38rpx_20rpx_22rpx] box-border flex flex-col justify-between text-24rpx color-[#333]"
  >
    <view class="flex justify-between">
      <view class="item item-1 item-active">
        <view class="title">
          <text>全面保障</text>
        </view>
        <view
          class="w-200rpx h-214rpx border border-solid border-[#DDECFF] rounded-20rpx p-[24rpx_28rpx] box-border bg-[#F2F8FA] flex flex-col justify-between"
        >
          <view>
            <view class="font-bold">10万保额</view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">参与者意外保障</view>
          </view>
          <view>
            <view>
              <text class="color-[#FF8C28]">￥</text>
              <text class="color-[#FF8C28] text-36rpx">3.98</text>
              <text>/人</text>
            </view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              {{ `原价¥7.96 / 人` }}
            </view>
          </view>
        </view>
        <view class="triangle"></view>
      </view>
      <view class="item item-2">
        <view class="title">
          <text>标准保障</text>
        </view>
        <view
          class="w-200rpx h-214rpx border border-solid border-[#BCFFD7] rounded-20rpx p-[24rpx_28rpx] box-border bg-[#F2FAF3] flex flex-col justify-between"
        >
          <view>
            <view class="font-bold">10万保额</view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">参与者意外保障</view>
          </view>
          <view>
            <view>
              <text class="color-[#FF8C28]">￥</text>
              <text class="color-[#FF8C28] text-36rpx">3.98</text>
              <text>/人</text>
            </view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              {{ `原价¥7.96 / 人` }}
            </view>
          </view>
        </view>
        <view class="triangle"></view>
      </view>
      <view class="item item-3">
        <view class="title">
          <text>尊享保障</text>
        </view>
        <view
          class="w-200rpx h-214rpx border border-solid border-[#FFDED1] rounded-20rpx p-[24rpx_28rpx] box-border bg-[#FAF3F2] flex flex-col justify-between"
        >
          <view>
            <view class="font-bold">10万保额</view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">参与者意外保障</view>
          </view>
          <view>
            <view>
              <text class="color-[#FF8C28]">￥</text>
              <text class="color-[#FF8C28] text-36rpx">3.98</text>
              <text>/人</text>
            </view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              {{ `原价¥7.96 / 人` }}
            </view>
          </view>
        </view>
        <view class="triangle"></view>
      </view>
    </view>
    <view
      class="flex justify-center items-center w-full h-60rpx border border-solid border-[#333333] rounded-30rpx font-bold"
    >
      查看保险方案>>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  bg: {
    type: String,
    default: "#fff"
  },
  item: {
    type: Object,
    default: () => ({
      id: "",
      time: "",
      icon: "",
      name: "",
      content: "",
      isMe: false
    })
  }
});

const goToTeamDetail = (id) => {
  uni.navigateTo({ url: `/pages/teamDetail/index?id=${id}` });
};
</script>

<style scoped lang="scss">
.item {
  position: relative;
  width: 228rpx;
  height: 336rpx;
  border-radius: 20rpx;
  background: linear-gradient(to bottom, #d9f5fd 76%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 14rpx 32rpx;
  box-sizing: border-box;

  .title {
    font-weight: bold;
    font-size: 42rpx;
    height: 52rxp;
    position: relative;
    display: flex;
    align-items: center;

    &::before {
      z-index: 1;
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      height: 16rpx;
      width: 100%;
      background: linear-gradient(to right, #a9bafd 76%, #9ae6fe 100%);
    }

    > text {
      position: relative;
      z-index: 2;
    }
  }

  /* 外层黑边三角形 */
  .triangle {
    position: absolute;
    bottom: -22rpx; /* 三角向下突出 */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 22rpx solid transparent;
    border-right: 22rpx solid transparent;
    border-right: 22rpx solid transparent;

    /* 内层白三角 */
  }

  .triangle::after {
    content: '';
    position: absolute;
    top: -22rpx; /* 紧贴外三角 */
    left: -20rpx;
    width: 0;
    height: 0;
    border-left: 20rpx solid transparent;
    border-right: 20rpx solid transparent;
  }
}

.item-2 {
  background: linear-gradient(to bottom, #D9FDDE 76%, #ffffff 100%);

  .title {
    &::before {
      background: linear-gradient(to right, #bfffab 76%, #e5ff9d 100%);

    }
  }
}

.item-3 {
  background: linear-gradient(to bottom, #FDE6D9 76%, #ffffff 100%);

  .title {
    &::before {
      background: linear-gradient(to right, #feb6aa 76%, #fed89c 100%);

    }
  }
}

.item-active {
  border: 2rpx solid #000;
  .triangle {
    border-top: 22rpx solid #000; /* 边框色 */
  }
  .triangle::after {
    border-top: 20rpx solid #ffffff; /* 背景色一致 */
  }
}
</style>
