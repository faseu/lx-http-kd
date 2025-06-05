<template>
  <view class="item" :style="`background: ${bg}`">
    <!-- 司机头像区域 -->
    <view class="w-140rpx h-140rpx pos-relative rounded-20rpx">
      <image
        class="w-full h-full pos-absolute rounded-50% top-0 right-0"
        :src="item.avatar || 'https://temp.im/166x166'"
        mode="aspectFill"
      />
      <!-- 车主标识 -->
      <image
        class="w-78rpx h-36rpx pos-absolute bottom-[-18rpx] right-32rpx"
        src="/static/images/common/teamOwner.png"
      />
    </view>

    <!-- 司机基本信息 -->
    <view class="p-16rpx ml-10rpx flex-1 flex flex-col justify-between">
      <view class="flex items-center">
        <view class="font-bold mr-8rpx">{{ item.name || '匿名司机' }}</view>
        <!-- 性别图标 -->
        <image class="w-32rpx h-32rpx" :src="getGenderIcon(item.gender)" />
      </view>
      <view class="flex items-center mr-12rpx">
        <view>上车点：活动地点</view>
      </view>
      <view class="text-20rpx color-[#999]">
        车牌号：{{ formatLicensePlate(item.license_plate) }}
      </view>
    </view>

    <!-- 右侧操作区域 -->
    <view class="w-228rpx flex flex-col items-center justify-between">
      <!-- 乘客头像展示 -->
      <view class="flex items-center">
        <view class="mr-12rpx" v-if="+item.driver_review_status !== 0">乘客：</view>
        <view class="flex pos-relative w-120rpx h-60rpx" v-if="+item.driver_review_status !== 0">
          <view
            v-for="(passenger, index) in displayPassengers"
            :key="index"
            class="flex justify-center items-center w-60rpx h-60rpx bg-white rounded-[50%] pos-absolute top-0"
            :style="`left: ${index * 30}rpx; z-index: ${10 - index};`"
          >
            <image
              class="w-54rpx h-54rpx rounded-[50%]"
              :src="passenger?.user_info?.avatar || 'https://temp.im/40x40'"
              mode="aspectFill"
            />
          </view>
          <!-- 如果没有乘客，显示空状态 -->
          <view
            v-if="displayPassengers.length === 0"
            class="flex justify-center items-center w-60rpx h-60rpx rounded-[50%]"
          >
            <text class="text-24rpx color-[#999]">暂无</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮区域 -->
      <view class="w-full">
        <!-- 审核状态显示（仅创建者可见） -->
        <view
          v-if="showReviewStatus && +item.driver_review_status === 0"
          class="w-full flex justify-between mb-16rpx"
        >
          <view class="small-btn small-btn-1" @click.stop="handleReject">拒绝</view>
          <view class="small-btn small-btn-2" @click.stop="handleApprove">通过</view>
        </view>

        <!-- 审核通过后的状态 -->
        <template v-else>
          <!-- 如果是当前用户自己的车 -->
          <view
            v-if="item.is_current_user_car"
            class="big-btn big-btn-1"
            @click.stop="handleExitDriver"
          >
            退出车主
          </view>

          <!-- 如果当前用户已经在这辆车上 -->
          <view
            v-else-if="item.is_current_user_passenger"
            class="big-btn big-btn-3"
            @click.stop="handleExitPassenger"
          >
            退出该车
          </view>

          <!-- 未报名队伍的情况 -->
          <view v-else-if="!isMember" class="big-btn big-btn-3">未报名</view>

          <!-- 可以上车的情况 -->
          <view
            v-else-if="availableSeats > 0 && +item.driver_review_status === 1"
            class="big-btn big-btn-2"
            @click.stop="handleJoinCar"
          >
            上该车（余位{{ availableSeats }}）
          </view>

          <!-- 车已满 -->
          <view v-else-if="availableSeats <= 0" class="big-btn big-btn-3">车已满</view>

          <!-- 司机未通过审核 -->
          <view v-else class="big-btn big-btn-3">
            {{ getDriverStatusText(item.driver_review_status) }}
          </view>
        </template>
      </view>

      <!-- 审核状态标签（右上角） -->
      <view
        v-if="+item.driver_review_status === 0"
        class="pos-absolute top-0 right-0 w-132rpx h-48rpx"
      >
        <image
          class="pos-absolute top-0 right-0 w-full h-full"
          src="/static/images/common/review-bg.png"
        />
        <view
          class="pos-absolute top-0 right-0 flex items-center justify-center w-96rpx h-full color-white text-20rpx"
        >
          审核中
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bg: {
    type: String,
    default: '#fff',
  },
  item: {
    type: Object,
    default: () => ({
      id: '',
      name: '',
      avatar: '',
      gender: 1, // 1:男 2:女
      license_plate: '',
      pickup_location: '',
      car_seat_count: 4,
      car_passengers: [],
      driver_review_status: 0, // 0:待审核 1:通过 2:拒绝
      is_current_user_car: false, // 是否是当前用户的车
      is_current_user_passenger: false, // 当前用户是否是该车乘客
    }),
  },
  showReviewStatus: {
    type: Boolean,
    default: false, // 是否显示审核按钮（仅创建者可见）
  },
  isMember: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['approve-driver', 'reject-driver', 'join-car', 'exit-car', 'exit-driver'])

// 计算可用座位数
const availableSeats = computed(() => {
  const totalSeats = props.item.car_seat_count || 4
  const occupiedSeats = props.item.car_passengers?.length || 0
  return Math.max(0, totalSeats - occupiedSeats)
})

// 显示的乘客（最多显示3个）
const displayPassengers = computed(() => {
  return (props.item.car_passengers || []).slice(0, 3)
})

// 获取性别图标
const getGenderIcon = (gender) => {
  return gender === 2
    ? '/static/images/common/female-icon.png'
    : '/static/images/common/male-icon.png'
}

// 格式化车牌号（脱敏处理）
const formatLicensePlate = (licensePlate) => {
  if (!licensePlate) return '未知车牌'
  if (licensePlate.length >= 6) {
    return licensePlate.substring(0, 3) + '***' + licensePlate.substring(licensePlate.length - 2)
  }
  return licensePlate
}

// 获取司机状态文本
const getDriverStatusText = (status) => {
  const statusMap = {
    0: '审核中',
    1: '已通过',
    2: '已拒绝',
  }
  return statusMap[status] || '未知状态'
}

const handleApprove = () => {
  emit('approve-driver', props.item)
}

const handleReject = () => {
  emit('reject-driver', props.item)
}

const handleJoinCar = () => {
  emit('join-car', props.item)
}

const handleExitPassenger = () => {
  emit('exit-car', props.item)
}

const handleExitDriver = () => {
  emit('exit-driver', props.item)
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
    margin-bottom: 12rpx;
    border-radius: 24rpx;
    font-size: 22rpx;
  }

  .big-btn-1 {
    border: 2rpx solid #009dff;
    color: #009dff;
    background: transparent;
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
    border-radius: 24rpx;
    font-size: 22rpx;
  }

  .small-btn-1 {
    border: 2rpx solid #ff9d96;
    color: #ff9d96;
    background: transparent;
  }

  .small-btn-2 {
    background: #4bd06e;
    color: #fff;
  }
}

// 位置相关样式
.pos-relative {
  position: relative;
}

.pos-absolute {
  position: absolute;
}
</style>
