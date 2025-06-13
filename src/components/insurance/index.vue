<template>
  <view
    class="w-100vw h-488rpx bg-[#DFF2F6] pos-relative left-[-20rpx] p-[38rpx_20rpx_22rpx] box-border flex flex-col justify-between text-24rpx color-[#333]"
  >
    <view class="content-box" v-if="insuranceList.length > 0">
      <!-- 动态渲染保险选项 -->
      <view
        v-for="(insurance, index) in displayInsuranceList"
        :key="insurance.id"
        class="item"
        :class="[`item-${index + 1}`, { 'item-active': selectedInsurance.id === insurance.id }]"
        @click="selectInsurance(insurance)"
      >
        <view class="title">
          <text>{{ insurance.name }}</text>
        </view>
        <view
          class="w-200rpx h-214rpx border border-solid rounded-20rpx p-[24rpx_20rpx] box-border flex flex-col justify-between"
          :class="getInsuranceCardClass(index)"
        >
          <view>
            <view class="font-bold">{{ formatCoverage(insurance.hurt_coverage) }}万保额</view>
            <view class="text-20rpx color-[#586B93] mt-4rpx">
              {{ insurance.description || '意外保障' }}
            </view>
          </view>
          <view>
            <view class="w-150rpx pos-relative ml-[-5rpx]">
              <text class="color-[#FF8C28]">￥</text>
              <text class="color-[#FF8C28] text-32rpx">{{ insurance.price }}</text>
              <text class="">/人</text>
            </view>
            <view
              class="text-20rpx color-[#586B93] mt-4rpx"
              v-if="insurance.original_price && insurance.original_price !== insurance.price"
            >
              原价¥{{ insurance.original_price }} / 人
            </view>
          </view>
        </view>
        <view class="triangle"></view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-else class="flex justify-center items-center h-300rpx">
      <text class="color-[#666]">加载保险选项中...</text>
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
import { ref, reactive, watch, computed } from 'vue'

// 定义组件的 props 和 emits
const props = defineProps({
  // 保险列表数据
  insuranceList: {
    type: Array,
    default: () => [],
  },
  // 默认选中的保险ID
  defaultId: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['insuranceChange'])

// 当前选中的保险
const selectedInsurance = ref({})

// 计算显示的保险列表（最多显示3个）
const displayInsuranceList = computed(() => {
  return props.insuranceList.slice(0, 5)
})

// 格式化保额显示
const formatCoverage = (coverage) => {
  const amount = parseFloat(coverage)
  if (amount >= 10000) {
    return (amount / 10000).toFixed(0)
  }
  return (amount / 10000).toFixed(1)
}

// 获取保险卡片样式类
const getInsuranceCardClass = (index) => {
  const classes = [
    'border-[#DDECFF] bg-[#F2F8FA]', // 第一个
    'border-[#BCFFD7] bg-[#F2FAF3]', // 第二个
    'border-[#FFDED1] bg-[#FAF3F2]', // 第三个
  ]
  return classes[index % 3]
}

// 选择保险
const selectInsurance = (insurance) => {
  selectedInsurance.value = insurance

  // 触发事件，向父组件传递选中的保险信息
  const insuranceData = {
    id: insurance.id,
    type: insurance.id.toString(),
    name: insurance.name,
    price: parseFloat(insurance.price),
    coverage: formatCoverage(insurance.hurt_coverage),
    features: insurance.description ? [insurance.description] : [],
    description: insurance.description,
    originalPrice: parseFloat(insurance.original_price || insurance.price),
    medicalCoverage: parseFloat(insurance.medical_coverage),
    allowancePrice: parseFloat(insurance.allowance_price),
  }

  emit('insuranceChange', insuranceData)
}

// 查看保险详情
const goToInsuranceDetail = () => {
  uni.navigateTo({ url: `/pages/insuranceDetail/index` })
}

// 监听保险列表变化，自动选中第一个或指定的保险
watch(
  () => props.insuranceList,
  (newList) => {
    if (newList && newList.length > 0) {
      let targetInsurance = newList[0] // 默认选择第一个

      // 如果指定了默认ID，尝试找到对应的保险
      if (props.defaultId) {
        const foundInsurance = newList.find((item) => item.id === props.defaultId)
        if (foundInsurance) {
          targetInsurance = foundInsurance
        }
      }

      selectInsurance(targetInsurance)
    }
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.content-box {
  height: 358rpx;
  display: flex;
  overflow-x: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
}

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
  margin-right: 12rpx;

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
