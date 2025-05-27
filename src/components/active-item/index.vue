<template>
  <view class="item" @click="goToTeamDetail(item.id)">
    <view class="w-232rpx h-232rpx pos-relative rounded-20rpx overflow-hidden">
      <image
        class="w-full h-full pos-absolute top-0 right-0"
        :src="item.activity_images?.[0] || 'https://temp.im/166x166'"
      />
      <view class="pos-relative w-full h-full text-20rpx flex flex-col justify-between">
        <view
          class="w-[92rpx] h-[32rpx] bg-gradient-to-b from-[#C1FF00] to-[#08E6E3] rounded-[264rpx] flex justify-center items-center color-[#333] mt-20rpx ml-20rpx"
        >
          {{ '徒步型' }}
        </view>
      </view>
    </view>
    <view class="p-16rpx ml-10rpx flex-1 flex flex-col justify-between text-24rpx">
      <view class="flex justify-between items-center">
        <view class="text-32rpx color-[#333] font-bold">{{ item.team_name || '未知地点' }}</view>
        <view class="w-100rpx color-[#4BD06E]">{{ item.is_full ? '已满员' : '报名中...' }}</view>
      </view>
      <view class="flex items-center mr-12rpx">
        <view
          class="p-[6rpx_12rpx] rounded-[8rpx] bg-[#ff8c2833] color-[#FF8C28] box-content text-20rpx mr-12rpx"
        >
          {{ item.hiking_type || '类型未知' }}
        </view>
        <view>来回{{ item.hiking_distance || '--' }}km</view>
      </view>
      <view class="text-20rpx color-[#999]">
        {{ item.hiking_duration || '--' }}小时徒步｜海拔 {{ item.peak_altitude || '--' }}km｜{{
          item.travel_method || '未知'
        }}
      </view>
      <view
        class="flex items-center w-full h-60rpx px-4rpx box-border bg-[#F6F6F6] rounded-[10rpx]"
      >
        <view class="flex pos-relative w-80rpx mr-12rpx">
          <view class="flex justify-center items-center w-40rpx h-40rpx bg-white rounded-[50%]">
            <image class="w-36rpx h-36rpx rounded-[50%]" src="https://temp.im/40x40" />
          </view>
          <view
            class="flex justify-center items-center w-40rpx h-40rpx bg-white rounded-[50%] pos-absolute top-0 left-20rpx"
          >
            <image class="w-36rpx h-36rpx rounded-[50%]" src="https://temp.im/40x40" />
          </view>
          <view
            class="flex justify-center items-center w-40rpx h-40rpx bg-white rounded-[50%] pos-absolute top-0 left-40rpx"
          >
            <image class="w-36rpx h-36rpx rounded-[50%]" src="https://temp.im/40x40" />
          </view>
        </view>
        <view>已有{{ item.members?.length || 0 }}人上车～</view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})
const goToTeamDetail = (id) => {
  console.log(id)
  uni.navigateTo({ url: `/pages/teamDetail/index?id=${id}` })
}
</script>

<style scoped>
.item {
  width: 100%;
  height: 252rpx;
  margin-bottom: 30rpx;
  background: #ffffff;
  box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.11);
  border-radius: 20rpx;
  display: flex;
  padding: 10rpx;
  box-sizing: border-box;
}
</style>
