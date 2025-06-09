<template>
  <view class="activity-item" @click.stop="goToTeamDetail(item.id)">
    <!-- 活动名称和状态 -->
    <view class="header">
      <view class="activity-name">{{ item.team_name || '未知活动' }}</view>
      <view class="activity-status" :class="getStatusClass(item.status)">
        {{ getStatusText(item.status) }}
      </view>
    </view>

    <!-- 第一排：队长和组员头像 -->
    <view class="members-row">
      <view class="leader-section">
        <view class="leader-avatar">
          <image
            class="avatar-img"
            :src="
              item.creator_user?.avatar ||
              item.creator_participant?.avatar ||
              'https://temp.im/60x60'
            "
            mode="aspectFill"
          />
          <view class="leader-tag">队长</view>
        </view>
      </view>
      <view class="members-section">
        <view class="members-avatars">
          <view
            v-for="(member, index) in displayMembers"
            :key="index"
            class="member-avatar"
            :style="{ left: `${index * 25}rpx`, zIndex: 10 - index }"
          >
            <image
              class="avatar-img small"
              :src="member.user_info?.avatar || 'https://temp.im/40x40'"
              mode="aspectFill"
            />
          </view>
          <view v-if="remainingCount > 0" class="more-count">+{{ remainingCount }}</view>
        </view>
        <!--        <view class="member-count">-->
        <!--          {{ item.members_info?.length || 0 }}/{{ item.max_participants }}人-->
        <!--        </view>-->
      </view>
    </view>

    <!-- 第二排：活动时间范围 -->
    <view class="time-row">
      <image class="icon" src="/static/images/teamDetail/clock.png" />
      <text class="time-text">{{ formatTimeRange(item.start_time, item.end_time) }}</text>
    </view>

    <!-- 第三排：活动地点 -->
    <view class="location-row">
      <image class="icon" src="/static/images/teamDetail/location.png" />
      <text class="location-text">{{ item.location || '待定地点' }}</text>
    </view>

    <!-- 操作区 -->
    <view class="actions-row" @click.stop>
      <!-- 队长操作 -->
      <template v-if="isLeader">
        <!-- 审核中状态 -->
        <template v-if="item.status === 'reviewing'">
          <view class="action-btn cancel-btn" @click.stop="handleCancelActivity">取消活动</view>
        </template>

        <!-- 审核不通过 -->
        <template v-else-if="item.status === 'rejected'">
          <view class="action-btn cancel-btn" @click.stop="handleCancelActivity">取消活动</view>
          <view class="action-btn edit-btn" @click.stop="handleEditActivity">编辑</view>
        </template>

        <!-- 组团中 -->
        <template v-else-if="item.status === 'recruiting'">
          <view class="action-btn cancel-btn" @click.stop="handleCancelActivity">取消活动</view>
          <view
            v-if="!isCurrentUserJoined"
            class="action-btn join-btn"
            @click.stop="handleJoinActivity"
          >
            报名
          </view>
          <view
            v-if="isCurrentUserJoined"
            class="action-btn quit-btn"
            @click.stop="handleQuitActivity"
          >
            取消报名
          </view>
          <view v-if="canFormTeam" class="action-btn form-btn" @click.stop="handleFormTeam">
            成团
          </view>
        </template>

        <!-- 已封团：不显示操作按钮 -->
      </template>

      <!-- 其他人操作 -->
      <template v-else>
        <!-- 组团中且已报名 -->
        <template v-if="item.status === 'recruiting' && isCurrentUserJoined">
          <view class="action-btn quit-btn" @click.stop="handleQuitActivity">取消报名</view>
        </template>

        <!-- 组团中且未报名 -->
        <template v-else-if="item.status === 'recruiting' && !isCurrentUserJoined">
          <view class="action-btn join-btn" @click.stop="handleJoinActivity">报名</view>
        </template>

        <!-- 已封团：不显示操作按钮 -->
      </template>
      <wd-message-box />
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store'
import { useMessage, useToast } from 'wot-design-uni'
import { httpPost } from '@/utils/http'

const userStore = useUserStore()
const message = useMessage()
const toast = useToast()

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['refresh'])

// 获取当前用户ID
const getCurrentUserId = () => {
  const {
    user_info: { id },
  } = userStore.userInfo
  return id
}

// 是否为队长
const isLeader = computed(() => {
  const currentUserId = getCurrentUserId()
  return (
    props.item.creator_user?.id === currentUserId ||
    props.item.creator_participant?.user_info?.id === currentUserId
  )
})

// 当前用户是否已报名
const isCurrentUserJoined = computed(() => {
  const currentUserId = getCurrentUserId()
  return props.item.members_info?.some((member) => member.user_info?.id === currentUserId) || false
})

// 是否可以成团（人数达到要求）
const canFormTeam = computed(() => {
  // const currentCount = props.item.members_info?.length || 0
  // const minRequired = Math.ceil((props.item.max_participants || 1) * 0.5) // 假设50%以上可以成团
  // return currentCount >= minRequired
  return true
})

// 显示的成员（最多6个）
const displayMembers = computed(() => {
  const members = props.item.members_info || []
  return members.slice(0, 6)
})

// 剩余成员数量
const remainingCount = computed(() => {
  const total = props.item.members_info?.length || 0
  return Math.max(0, total - 6)
})

// 获取状态样式类
const getStatusClass = (status) => {
  const statusMap = {
    reviewing: 'status-reviewing',
    rejected: 'status-rejected',
    recruiting: 'status-recruiting',
    formed: 'status-formed',
    cancelled: 'status-cancelled',
  }
  return statusMap[status] || 'status-default'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    reviewing: '审核中',
    rejected: '审核不通过',
    recruiting: '组团中',
    formed: '已封团',
    cancelled: '已取消',
  }
  return statusMap[status] || '未知状态'
}

// 格式化时间范围
const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '时间待定'

  const start = new Date(startTime)
  const end = new Date(endTime)

  const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hour}:${minute}`
  }

  return `${formatDate(start)} ~ ${formatDate(end)}`
}

// 跳转到队伍详情
const goToTeamDetail = (id) => {
  if (!id) return
  uni.navigateTo({
    url: `/pages/teamDetail/index?id=${id}`,
  })
}

// 取消活动
const handleCancelActivity = async () => {
  message
    .confirm({
      msg: '确定要取消这个活动吗？取消后无法恢复。',
      title: '确认取消',
      confirmButtonText: '确定取消',
      cancelButtonText: '我再想想',
    })
    .then(async () => {
      uni.showLoading({ title: '处理中...' })

      await httpPost('/api/team/delete', {
        team_id: props?.item?.id,
      })

      uni.hideLoading()

      toast.show('活动已取消')
      emit('refresh')
    })
    .catch(() => {
      console.log('用户取消操作')
    })
}

// 编辑活动
const handleEditActivity = () => {
  uni.navigateTo({
    url: `/pages/publish/index?editId=${props.item.id}`,
  })
}

// 报名活动
const handleJoinActivity = () => {
  uni.navigateTo({
    url: `/pages/joinTeam/index?id=${props.item.id}`,
  })
}

// 取消报名
const handleQuitActivity = () => {
  message
    .confirm({
      msg: '确定要取消报名吗？',
      title: '确认取消报名',
    })
    .then(async () => {
      // TODO: 调用取消报名接口
      uni.showLoading({ title: '处理中...' })

      await httpPost('/api/pay/refund', {
        team_id: props?.item?.id,
      })

      uni.hideLoading()

      toast.show('已取消报名')
      emit('refresh')
    })
    .catch(() => {
      console.log('用户取消操作')
    })
}

// 成团
const handleFormTeam = () => {
  message
    .confirm({
      msg: '确定要成团吗？成团后将不再接受新的报名。',
      title: '确认成团',
    })
    .then(async () => {
      uni.showLoading({ title: '处理中...' })

      await httpPost('/api/team_over', {
        team_id: props?.item?.id,
      })
      uni.hideLoading()
      toast.show('成团成功')
      emit('refresh')
    })
    .catch(() => {
      console.log('用户取消操作')
    })
}
</script>

<style scoped lang="scss">
.activity-item {
  width: 100%;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.11);
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;

  .activity-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    flex: 1;
    margin-right: 20rpx;
  }

  .activity-status {
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    font-weight: 500;

    &.status-reviewing {
      background: #fff7e6;
      color: #fa8c16;
    }

    &.status-rejected {
      background: #fff2f0;
      color: #ff4d4f;
    }

    &.status-recruiting {
      background: #f6ffed;
      color: #52c41a;
    }

    &.status-formed {
      background: #e6f7ff;
      color: #1890ff;
    }

    &.status-cancelled {
      background: #f5f5f5;
      color: #999;
    }
  }
}

.members-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;

  .leader-section {
    margin-right: 24rpx;

    .leader-avatar {
      position: relative;
      display: inline-block;

      .avatar-img {
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        border: 2rpx solid #fff;
      }

      .leader-tag {
        position: absolute;
        bottom: -6rpx;
        left: 50%;
        transform: translateX(-50%);
        background: #ff8c28;
        color: #fff;
        font-size: 18rpx;
        padding: 2rpx 8rpx;
        border-radius: 10rpx;
        white-space: nowrap;
      }
    }
  }

  .members-section {
    flex: 1;
    display: flex;
    align-items: center;

    .members-avatars {
      position: relative;
      display: flex;
      align-items: center;
      margin-right: 20rpx;
      height: 50rpx;

      .member-avatar {
        position: absolute;
        top: 0;

        .avatar-img.small {
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
          border: 2rpx solid #fff;
        }
      }

      .more-count {
        position: absolute;
        left: 150rpx;
        top: 0;
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
        background: #f0f0f0;
        color: #666;
        font-size: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2rpx solid #fff;
      }
    }

    .member-count {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.time-row,
.location-row {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;

  .icon {
    width: 24rpx;
    height: 24rpx;
    margin-right: 12rpx;
  }

  .time-text,
  .location-text {
    font-size: 26rpx;
    color: #666;
    flex: 1;
  }
}

.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 16rpx;
  padding-top: 20rpx;

  .action-btn {
    padding: 8rpx 18rpx;
    border-radius: 24rpx;
    font-size: 24rpx;
    text-align: center;
    flex: 1;
    max-width: 120rpx;

    &.cancel-btn {
      background: #fff;
      color: #ff4d4f;
      border: 2rpx solid #ff4d4f;
    }

    &.edit-btn {
      background: #fff;
      color: #1890ff;
      border: 2rpx solid #1890ff;
    }

    &.join-btn {
      background: #52c41a;
      color: #fff;
    }

    &.quit-btn {
      background: #fff;
      color: #fa8c16;
      border: 2rpx solid #fa8c16;
    }

    &.form-btn {
      background: #1890ff;
      color: #fff;
    }

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
