<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '',
  },
}
</route>
<template>
  <view class="main">
    <view class="bg_box">
      <image src="/static/images/common/bg2.png" />
    </view>
    <image
      class="pos-absolute top-64rpx left-340rpx w-224rpx h-200rpx"
      src="/static/images/common/plane.png"
    />
    <image
      class="pos-absolute top-222rpx right-20rpx w-322rpx h-266rpx"
      src="/static/images/common/shield.png"
    />
    <wd-navbar
      safeAreaInsetTop
      custom-style="background-color: transparent !important; z-index: 99"
      title="保险方案详情"
      left-arrow
      @click-left="goBack"
    />
    <view class="w-full">
      <view class="pos-relative h-88rpx inline-block h-full mt-40rpx ml-32rpx">
        <wd-img
          mode="aspectFill"
          custom-style="position: absolute !important;"
          custom-class="pos-absolute right-52rpx bottom-0 w-184rpx h-46rpx"
          src="/static/images/userSettings/decoration.png"
        />
        <view class="font-900 text-72rpx h-full leading-86rpx pos-relative">保险方案</view>
      </view>
      <view class="pos-relative mt-20rpx ml-36rpx text-28rpx color-[#666]">
        <view>共3款保障产品，最终根据</view>
        <view>您的选择，展示出...</view>
      </view>
    </view>

    <view class="pos-relative px-20rpx mt-60rpx box-border">
      <!-- 标准保障 -->
      <view class="item">
        <view class="w-full h-52rpx flex items-center">
          <view class="title mr-20rpx">
            <text>标准保障</text>
          </view>
          <view class="flex-1 pos-relative ml-[-5rpx]">
            <text class="color-[#FF8C28]">￥</text>
            <text class="color-[#FF8C28] text-32rpx">{{ insuranceOptions.premium.price }}</text>
            <text class="">/人</text>
          </view>
          <view class="clause-btn">
            <view class="clause-btn-content">保险条款</view>
          </view>
        </view>
        <view
          class="w-100% h-200rpx border border-solid border-[#DDECFF] rounded-20rpx p-30rpx box-border bg-[#F2F8FA] flex flex-col justify-between"
        >
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害身故、残疾</view>
            <view>¥10万</view>
          </view>
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害医疗</view>
            <view>¥1万</view>
          </view>
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害住院津贴</view>
            <view>¥100万</view>
          </view>
        </view>
      </view>
      <!-- 标准保障 -->
      <view class="item item-2">
        <view class="w-full h-52rpx flex items-center">
          <view class="title mr-20rpx">
            <text>标准保障</text>
          </view>
          <view class="flex-1 pos-relative ml-[-5rpx]">
            <text class="color-[#FF8C28]">￥</text>
            <text class="color-[#FF8C28] text-32rpx">{{ insuranceOptions.premium.price }}</text>
            <text class="">/人</text>
          </view>
          <view class="clause-btn">
            <view class="clause-btn-content">保险条款</view>
          </view>
        </view>
        <view
          class="w-100% h-200rpx border border-solid border-[#DDECFF] rounded-20rpx p-30rpx box-border bg-[#F2F8FA] flex flex-col justify-between"
        >
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害身故、残疾</view>
            <view>¥10万</view>
          </view>
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害医疗</view>
            <view>¥1万</view>
          </view>
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害住院津贴</view>
            <view>¥100万</view>
          </view>
        </view>
      </view>
      <!-- 标准保障 -->
      <view class="item item-3">
        <view class="w-full h-52rpx flex items-center">
          <view class="title mr-20rpx">
            <text>标准保障</text>
          </view>
          <view class="flex-1 pos-relative ml-[-5rpx]">
            <text class="color-[#FF8C28]">￥</text>
            <text class="color-[#FF8C28] text-32rpx">{{ insuranceOptions.premium.price }}</text>
            <text class="">/人</text>
          </view>
          <view class="clause-btn">
            <view class="clause-btn-content">保险条款</view>
          </view>
        </view>
        <view
          class="w-100% h-200rpx border border-solid border-[#DDECFF] rounded-20rpx p-30rpx box-border bg-[#F2F8FA] flex flex-col justify-between"
        >
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害身故、残疾</view>
            <view>¥10万</view>
          </view>
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害医疗</view>
            <view>¥1万</view>
          </view>
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害住院津贴</view>
            <view>¥100万</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
// 保险选项数据
import { reactive } from 'vue'

const insuranceOptions = reactive({
  comprehensive: {
    type: 'comprehensive',
    name: '全面保障',
    coverage: 50,
    description: '参与者意外保障',
    price: 12.98,
    originalPrice: 25.96,
    features: ['意外伤害保障', '意外医疗保障', '紧急救援服务', '24小时客服'],
  },
  standard: {
    type: 'standard',
    name: '标准保障',
    coverage: 30,
    description: '参与者意外保障',
    price: 8.98,
    originalPrice: 17.96,
    features: ['意外伤害保障', '意外医疗保障', '紧急救援服务'],
  },
  premium: {
    type: 'premium',
    name: '尊享保障',
    coverage: 100,
    description: '参与者意外保障',
    price: 19.98,
    originalPrice: 39.96,
    features: [
      '意外伤害保障',
      '意外医疗保障',
      '紧急救援服务',
      '24小时客服',
      '住院津贴',
      '交通意外双倍赔付',
    ],
  },
})

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.main {
  position: relative;
  height: 100vh;
  font-size: 24rpx;
  color: #333333;

  .bg_box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    > image {
      width: 100%;
      height: 100%;
    }
  }
  .item {
    position: relative;
    width: 100%;
    height: 336rpx;
    border-radius: 20rpx;
    background: linear-gradient(to bottom, #d9f5fd 76%, #ffffff 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx;
    box-sizing: border-box;
    cursor: pointer;

    .title {
      font-weight: bold;
      font-size: 42rpx;
      height: 52rpx;
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

    .clause-btn {
      width: 132rpx;
      height: 48rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to right, #3d61ff 76%, #02c3ff 100%);
      border-radius: 24rpx;
      .clause-btn-content {
        color: #009dff;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 128rpx;
        height: 44rpx;
        background: #ffffff;
        border-radius: 22rpx;
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 20rpx;
      border: 2rpx solid #000;
      pointer-events: none;
      z-index: 10;
      opacity: 0;
    }
  }

  .item-2 {
    margin-top: 40rpx;
    background: linear-gradient(to bottom, #d9fdde 76%, #ffffff 100%);

    .title {
      &::before {
        background: linear-gradient(to right, #bfffab 76%, #e5ff9d 100%);
      }
    }
  }

  .item-3 {
    margin-top: 40rpx;
    background: linear-gradient(to bottom, #fde6d9 76%, #ffffff 100%);

    .title {
      &::before {
        background: linear-gradient(to right, #feb6aa 76%, #fed89c 100%);
      }
    }
  }
}
:deep() {
  .wd-navbar.is-border::after {
    display: none;
  }
}
</style>
