<template>
  <view
    class="w-100vw h-488rpx bg-[#DFF2F6] pos-relative left-[-20rpx] p-[38rpx_20rpx_22rpx] box-border flex flex-col justify-between text-24rpx color-[#333]"
  >
    <view class="flex justify-between">
      <!-- 全面保障 -->
      <view
        class="item item-1"
        :class="{ 'item-active': selectedInsurance.type === 'comprehensive' }"
        @click="selectInsurance('comprehensive')"
      >
        <view class="title">
          <text>全面保障</text>
        </view>
        <view
          class="w-200rpx h-214rpx border border-solid border-[#DDECFF] rounded-20rpx p-[24rpx_20rpx] box-border bg-[#F2F8FA] flex flex-col justify-between"
        >
          <view>
            <view class="font-bold">{{ insuranceOptions.comprehensive.coverage }}万保额</view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              {{ insuranceOptions.comprehensive.description }}
            </view>
          </view>
          <view>
            <view class="w-150rpx pos-relative ml-[-5rpx]">
              <text class="color-[#FF8C28]">￥</text>
              <text class="color-[#FF8C28] text-32rpx">{{ insuranceOptions.premium.price }}</text>
              <text class="">/人</text>
            </view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              原价¥{{ insuranceOptions.comprehensive.originalPrice }} / 人
            </view>
          </view>
        </view>
        <view class="triangle"></view>
      </view>

      <!-- 标准保障 -->
      <view
        class="item item-2"
        :class="{ 'item-active': selectedInsurance.type === 'standard' }"
        @click="selectInsurance('standard')"
      >
        <view class="title">
          <text>标准保障</text>
        </view>
        <view
          class="w-200rpx h-214rpx border border-solid border-[#BCFFD7] rounded-20rpx p-[24rpx_20rpx] box-border bg-[#F2FAF3] flex flex-col justify-between"
        >
          <view>
            <view class="font-bold">{{ insuranceOptions.standard.coverage }}万保额</view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              {{ insuranceOptions.standard.description }}
            </view>
          </view>
          <view>
            <view class="w-150rpx pos-relative ml-[-5rpx]">
              <text class="color-[#FF8C28]">￥</text>
              <text class="color-[#FF8C28] text-32rpx">{{ insuranceOptions.premium.price }}</text>
              <text class="">/人</text>
            </view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              原价¥{{ insuranceOptions.standard.originalPrice }} / 人
            </view>
          </view>
        </view>
        <view class="triangle"></view>
      </view>

      <!-- 尊享保障 -->
      <view
        class="item item-3"
        :class="{ 'item-active': selectedInsurance.type === 'premium' }"
        @click="selectInsurance('premium')"
      >
        <view class="title">
          <text>尊享保障</text>
        </view>
        <view
          class="w-200rpx h-214rpx border border-solid border-[#FFDED1] rounded-20rpx p-[24rpx_20rpx] box-border bg-[#FAF3F2] flex flex-col justify-between"
        >
          <view>
            <view class="font-bold">{{ insuranceOptions.premium.coverage }}万保额</view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              {{ insuranceOptions.premium.description }}
            </view>
          </view>
          <view>
            <view class="w-150rpx pos-relative ml-[-5rpx]">
              <text class="color-[#FF8C28]">￥</text>
              <text class="color-[#FF8C28] text-32rpx">{{ insuranceOptions.premium.price }}</text>
              <text class="">/人</text>
            </view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              原价¥{{ insuranceOptions.premium.originalPrice }} / 人
            </view>
          </view>
        </view>
        <view class="triangle"></view>
      </view>
    </view>

    <view
      class="flex justify-center items-center w-full h-60rpx border border-solid border-[#333333] rounded-30rpx font-bold"
      @click="goToInsuranceDetail"
    >
      查看保险方案>>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

// 定义组件的 props 和 emits
const props = defineProps({
  // 默认选中的保险类型
  defaultType: {
    type: String,
    default: 'comprehensive',
  },
})

const emit = defineEmits(['insuranceChange'])

// 保险选项数据
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

// 当前选中的保险
const selectedInsurance = ref(insuranceOptions[props.defaultType])

// 选择保险
const selectInsurance = (type) => {
  selectedInsurance.value = insuranceOptions[type]

  // 触发事件，向父组件传递选中的保险信息
  emit('insuranceChange', {
    type: selectedInsurance.value.type,
    name: selectedInsurance.value.name,
    price: selectedInsurance.value.price,
    coverage: selectedInsurance.value.coverage,
    features: selectedInsurance.value.features,
  })
}

// 查看保险详情
const goToInsuranceDetail = () => {
  uni.navigateTo({ url: `/pages/insuranceDetail/index` })
}

// 监听选中保险变化，初始化时也要触发一次
watch(
  () => selectedInsurance.value,
  () => {
    emit('insuranceChange', {
      type: selectedInsurance.value.type,
      name: selectedInsurance.value.name,
      price: selectedInsurance.value.price,
      coverage: selectedInsurance.value.coverage,
      features: selectedInsurance.value.features,
    })
  },
  { immediate: true },
)
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

  /* 外层黑边三角形 */
  .triangle {
    position: absolute;
    bottom: -20rpx; /* 三角向下突出 */
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 22rpx solid transparent;
    border-right: 22rpx solid transparent;
    border-right: 22rpx solid transparent;
    z-index: 11;
  }

  /* 内层白三角 */
  .triangle::after {
    content: '';
    position: absolute;
    top: -22rpx; /* 紧贴外三角 */
    left: -20rpx;
    width: 0;
    height: 0;
    border-left: 20rpx solid transparent;
    border-right: 20rpx solid transparent;
    z-index: 12;
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
  background: linear-gradient(to bottom, #d9fdde 76%, #ffffff 100%);

  .title {
    &::before {
      background: linear-gradient(to right, #bfffab 76%, #e5ff9d 100%);
    }
  }
}

.item-3 {
  background: linear-gradient(to bottom, #fde6d9 76%, #ffffff 100%);

  .title {
    &::before {
      background: linear-gradient(to right, #feb6aa 76%, #fed89c 100%);
    }
  }
}

.item-active {
  &::after {
    opacity: 1;
  }

  .triangle {
    border-top: 22rpx solid #000; /* 边框色 */
  }

  .triangle::after {
    border-top: 20rpx solid #ffffff; /* 背景色一致 */
  }
}
</style>
