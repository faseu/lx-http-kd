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
        <view>共{{ insuranceList.length }}款保障产品，最终根据</view>
        <view>您的选择，展示出...</view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="flex justify-center items-center mt-100rpx">
      <wd-loading type="spinner" />
      <text class="ml-20rpx">加载中...</text>
    </view>

    <!-- 保险列表 -->
    <view v-else class="pos-relative px-20rpx mt-60rpx box-border">
      <view
        v-for="(insurance, index) in insuranceList"
        :key="insurance.id"
        :class="['item', `item-${index + 1}`]"
        @click="viewInsuranceDetail(insurance)"
      >
        <view class="w-full h-52rpx flex items-center">
          <view class="title mr-20rpx">
            <text>{{ insurance.name }}</text>
          </view>
          <view class="flex-1 pos-relative ml-[-5rpx]">
            <text class="color-[#FF8C28]">￥</text>
            <text class="color-[#FF8C28] text-32rpx">{{ insurance.price }}</text>
            <text class="">/人</text>
          </view>
          <view class="clause-btn" @click.stop="viewInsuranceFile(insurance)">
            <view class="clause-btn-content">保险条款</view>
          </view>
        </view>
        <view
          class="w-100% h-200rpx border border-solid border-[#DDECFF] rounded-20rpx p-30rpx box-border bg-[#F2F8FA] flex flex-col justify-between"
        >
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害身故、残疾</view>
            <view>¥{{ formatMoney(insurance.hurt_coverage) }}万</view>
          </view>
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害医疗</view>
            <view>¥{{ formatMoney(insurance.medical_coverage) }}万</view>
          </view>
          <view class="flex items-center">
            <view class="w-16rpx h-16rpx bg-[#A7DAF9] rounded-50% mr-12rpx" />
            <view class="mr-20rpx color-[#586B93]">意外伤害住院津贴</view>
            <view>¥{{ insurance.allowance_price }}/天</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空数据状态 -->
    <view
      v-if="!loading && insuranceList.length === 0"
      class="flex flex-col items-center mt-100rpx"
    >
      <image src="/static/images/common/no-data.png" class="w-200rpx h-200rpx" mode="aspectFit" />
      <text class="color-[#999] mt-20rpx">暂无保险方案</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { httpGet } from '@/utils/http'
import { useToast } from 'wot-design-uni'

const toast = useToast()

// 响应式数据
const loading = ref(false)
const insuranceList = ref([])
const currentInsurance = ref(null)

// 简化的请求函数
const useRequest = (requestFn) => {
  return {
    run: async (params) => {
      try {
        loading.value = true
        const result = await requestFn(params)
        return result
      } catch (error) {
        console.error('请求失败:', error)
        throw error
      } finally {
        loading.value = false
      }
    },
  }
}

// 获取保险列表的请求函数
const { run: getInsuranceList } = useRequest((e) => httpGet('/api/insurance_list', e))

// 获取保险列表数据
const fetchInsuranceList = async () => {
  try {
    const result = await getInsuranceList()
    insuranceList.value = result?.data?.list || []
    console.log('获取到的保险列表:', insuranceList.value)
  } catch (error) {
    console.error('获取保险列表失败:', error)
    toast.show('获取保险信息失败')
  }
}

// 格式化金额显示（元转万元）
const formatMoney = (amount) => {
  const num = parseFloat(amount)
  if (num >= 10000) {
    return (num / 10000).toFixed(num % 10000 === 0 ? 0 : 1)
  }
  return (num / 10000).toFixed(2)
}

// 查看保险详情
const viewInsuranceDetail = (insurance) => {
  console.log('查看保险详情:', insurance)
  // 这里可以跳转到保险详情页面或显示详细信息
  // toast.show(`查看${insurance.name}详情`)
}

// 查看保险条款文件 - 跳转到PDF文件列表页面
const viewInsuranceFile = (insurance) => {
  currentInsurance.value = insurance

  if (insurance.insurance_file && insurance.insurance_file.length > 0) {
    // 跳转到PDF文件列表页面
    const insuranceData = encodeURIComponent(JSON.stringify(insurance))
    uni.navigateTo({
      url: `/pages/insurancePDF/index?data=${insuranceData}`,
    })
  } else {
    toast.show('暂无保险条款文件')
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 页面挂载时获取数据
onMounted(() => {
  fetchInsuranceList()
})
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
    margin-bottom: 40rpx;

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

    // 第二个保险方案样式
    &.item-2 {
      background: linear-gradient(to bottom, #d9fdde 76%, #ffffff 100%);

      .title {
        &::before {
          background: linear-gradient(to right, #bfffab 76%, #e5ff9d 100%);
        }
      }
    }

    // 第三个保险方案样式
    &.item-3 {
      background: linear-gradient(to bottom, #fde6d9 76%, #ffffff 100%);

      .title {
        &::before {
          background: linear-gradient(to right, #feb6aa 76%, #fed89c 100%);
        }
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
