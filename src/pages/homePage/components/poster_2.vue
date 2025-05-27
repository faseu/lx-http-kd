<template>
  <view class="content-box">
    <scroll-view class="scroll-container" scroll-y :show-scrollbar="false">
      <template v-if="teamData && teamData.length > 0">
        <view class="team-box mb-4" v-for="(team, teamIndex) in teamData" :key="teamIndex">
          <view class="outer-box" @click="toTeamDeatil(team)">
            <view class="outer-left">
              <view class="actibity-icon">
                <wd-img
                  height="100%"
                  width="100%"
                  src="/static/images/homepage/teamIcon.png"
                ></wd-img>
              </view>
              <view class="teamName">{{ team?.team_name || '暂无队伍名称' }}</view>
              <view class="teamLimited">
                （
                <view class="bold">{{ team?.members.length || 0 }}</view>
                /{{ team?.max_people || 5 }}）
              </view>
            </view>
            <view class="outer-right">
              <view class="location-icon">
                <wd-img
                  height="100%"
                  width="100%"
                  src="/static/images/homepage/location.png"
                ></wd-img>
              </view>
              <view class="location">{{ team?.location || '暂无集合点' }}</view>
              <view style="min-width: 50rpx">集合</view>
            </view>
          </view>

          <view class="content-box">
            <view class="team-info-box">
              <view class="driver-info">
                <view class="driver-tag ml-2.5">
                  <wd-img
                    height="36rpx"
                    width="78rpx"
                    src="/static/images/common/teamOwner.png"
                  ></wd-img>
                </view>
                <view class="driver-avatar">
                  <image class="avatar-circle" :src="team?.driver_avatar" mode="aspectFill"></image>
                </view>
              </view>
              <view class="members-row ml-4" @click="goToJoinTeam(team)">
                <view class="members-label mr-2.5">组员：</view>
                <template v-for="itemSlotIndex in 5" :key="itemSlotIndex">
                  <view
                    class="member-item"
                    :class="{
                      leader: itemSlotIndex === 1 && team.members && team.members.length > 0,
                    }"
                  >
                    <template v-if="team.members && itemSlotIndex - 1 < team.members.length">
                      <template v-if="team.members[itemSlotIndex - 1].user_info.avatar">
                        <image
                          class="avatar-circle"
                          :src="team.members[itemSlotIndex - 1].user_info.avatar"
                          mode="aspectFill"
                        ></image>
                        <view class="leader-badge" v-if="itemSlotIndex === 1">
                          <!-- Leader badge for the first slot if member has avatar -->
                          <wd-img
                            height="100%"
                            width="100%"
                            src="/static/images/homepage/teamLeader.png"
                          ></wd-img>
                        </view>
                      </template>
                      <template v-else>
                        <view class="avatar-circle add-icon">
                          <text class="plus-icon">+</text>
                        </view>
                      </template>
                    </template>
                    <template v-else>
                      <view class="avatar-circle add-icon">
                        <text class="plus-icon">+</text>
                      </view>
                    </template>
                  </view>
                </template>
              </view>
            </view>
            <view class="weather-box" @click="toTeamDeatil(team)">
              <wd-img
                height="32rpx"
                width="32rpx"
                src="/static/images/homepage/weather.png"
              ></wd-img>
              <view class="weather-left">{{ team?.weather_info || '' }}</view>
            </view>
            <view
              class="time-margin-btm"
              v-if="showAllFlags[teamIndex]"
              @click="toTeamDeatil(team)"
            >
              <view class="time-box">
                <view class="label">集合时间：</view>
                <view class="time">{{ formatDateTime(team?.start_time) || '' }}</view>
              </view>
              <view class="time-box">
                <view class="label">下山时间：</view>
                <view class="time">{{ formatDateTime(team?.last_active) || '' }}</view>
              </view>
            </view>
            <view class="btn-box">
              <view class="team-btn" v-if="showAllFlags[teamIndex]">
                <wd-img
                  height="100%"
                  width="100%"
                  src="/static/images/homepage/up-arrow.png"
                  @click="toggleFlag(teamIndex)"
                ></wd-img>
              </view>
              <view class="team-btn" v-else>
                <wd-img
                  height="100%"
                  width="100%"
                  src="/static/images/homepage/down-arrow.png"
                  @click="toggleFlag(teamIndex)"
                ></wd-img>
              </view>
            </view>
          </view>
        </view>
      </template>
      <view v-else class="empty-teams">暂无队伍信息</view>
    </scroll-view>

    <view class="btn-box">
      <view class="share-box">
        <view class="icon">
          <wd-img height="100%" width="100%" src="/static/images/homepage/share.png"></wd-img>
        </view>
        <view class="word">分享</view>
      </view>
      <view class="btn" @click="goToPublish">我要当队长</view>
    </view>
  </view>
</template>

<script lang="js" setup>
import { ref, watch, computed } from 'vue'
import { httpGet, httpPost } from '@/utils/http'

// 接收activityDetail数据作为props
const props = defineProps({
  activityData: {
    type: Object,
    default: () => ({}),
  },
})

// 日期时间处理方法
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr || typeof dateTimeStr !== 'string' || dateTimeStr.length < 19) {
    return ''
  }

  const date = dateTimeStr.substring(0, 10) // YYYY-MM-DD
  const time = dateTimeStr.substring(11, 19) // hh:mm:ss

  return `${date} ${time}`
}

// 监听activityData变化并获取teamData
const teamUrl = ref('')
const teamData = ref([])
watch(
  () => props.activityData,
  async (newVal) => {
    if (newVal && newVal.id) {
      teamUrl.value = `/api/activity/activities/teams/${newVal.id}`
      console.log('poster_2接收到的活动数据:', teamUrl.value)
      const { run: runTeamDetail } = useRequest((e) =>
        httpGet(teamUrl.value, { page: 1, page_size: 1000, review_status: 1 }),
      )
      const value1 = await runTeamDetail()

      teamData.value = Array.isArray(value1.list) ? value1.list : []
      // 处理团队数据，提取驾驶员头像信息
      if (teamData.value && teamData.value.length > 0) {
        teamData.value = teamData.value.map((itemA) => {
          // 初始化驾驶员头像为null
          let driver_avatar = null

          // 遍历members_info查找驾驶员
          if (itemA.members_info && Array.isArray(itemA.members_info)) {
            const driver = itemA.members_info.find((member) => member.is_driver === true)
            if (driver && driver.user_info && driver.user_info.avatar) {
              driver_avatar = driver.user_info.avatar
            }
          }

          // 处理团队成员信息
          let members = []
          if (itemA.members_info && Array.isArray(itemA.members_info)) {
            // 过滤出非驾驶员的成员
            const nonDriverMembers = itemA.members_info.filter((member) => !member.is_driver)

            // 确保队长（is_leader为true的成员）排在第一位
            const leaderMembers = nonDriverMembers.filter((member) => member.is_leader === true)
            const otherMembers = nonDriverMembers.filter((member) => member.is_leader !== true)

            // 合并队长和其他成员
            members = [...leaderMembers, ...otherMembers]
          }

          // 返回处理后的对象，添加driver_avatar字段
          return {
            ...itemA,
            driver_avatar,
            members,
          }
        })
      }
      console.log('teamData数据:', teamData.value)

      // 初始化每个队伍的展开/折叠状态
      initShowAllFlags()
    }
  },
  { deep: true, immediate: true },
)

// 为每个队伍单独维护展开/折叠状态
const showAllFlags = ref([])

// 初始化每个队伍的展开/折叠状态
const initShowAllFlags = () => {
  if (teamData.value && teamData.value.length > 0) {
    showAllFlags.value = new Array(teamData.value.length).fill(false)
  }
}

// 切换特定队伍的展开/折叠状态
const toggleFlag = (index) => {
  if (showAllFlags.value[index] !== undefined) {
    showAllFlags.value[index] = !showAllFlags.value[index]
  }
}

// 团队成员数据
const teamMembers = ref([
  {
    avatar: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg',
    name: '张三',
    isLeader: true,
  },
  {
    avatar: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
    name: '李四',
    isLeader: false,
  },
  {
    avatar: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
    name: '王五',
    isLeader: false,
  },
  {
    avatar: '',
    name: '',
    isLeader: false,
  },
  {
    avatar: '',
    name: '',
    isLeader: false,
  },
])

// 模拟点击事件
const simulateButtonClick = () => {
  console.log('模拟按钮点击事件')
}

const goToJoinTeam = ({ id, creator, cost_estimate: price }) => {
  uni.navigateTo({
    url: `/pages/joinTeam/index?id=${id}&leaderId=${creator}&price=${price}`,
  })
}
const goToPublish = () => {
  uni.navigateTo({
    url: `/pages/publish/index?id=${props.activityData.id}&insuranceCost=${props.activityData.insurance_cost}`,
  })
}

const toTeamDeatil = (e) => {
  uni.navigateTo({ url: `/pages/withTeam/teamDetail?id=${e.id}` })
}

// 在页面加载完成时，模拟点击按钮
onMounted(() => {
  // 使用 setTimeout 是为了确保 DOM 已经渲染完成
  setTimeout(() => {
    simulateButtonClick()

    // 在小程序环境中，可以使用 uni.createSelectorQuery 查找元素并模拟点击
    uni
      .createSelectorQuery()
      .select('.btn') // 选择器名称，对应需要点击的元素的class
      .boundingClientRect((rect) => {
        if (rect) {
          console.log('找到按钮元素', rect)
        }
      })
      .exec()
  }, 300)
})
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
    flex: 1;
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

  .empty-teams {
    width: 100%;
    height: 200rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 28rpx;
  }

  .team-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 24rpx 32rpx;
    box-sizing: border-box;

    .outer-box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20rpx;

      .outer-left {
        display: flex;
        align-items: center;
      }

      .outer-right {
        display: flex;
        align-items: center;

        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 400;
        font-size: 24rpx;
        color: #009dff;

        .location-icon {
          width: 32rpx;
          height: 32rpx;
        }

        .location {
          margin-right: 10rpx;
        }
      }

      .actibity-icon {
        width: 120rpx;
        height: 134rpx;
      }

      .teamName {
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 700;
        font-size: 32rpx;
        color: #333333;
      }

      .teamLimited {
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 350;
        font-size: 24rpx;
        color: #999;
        display: flex;
        align-items: center;

        .bold {
          font-weight: 500;
          font-size: 24rpx;
          color: #333;
        }
      }
    }

    /* 组员样式 */
    .members-container {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 24rpx;

      .members-label {
        font-size: 28rpx;
        color: #333;
        margin-right: 20rpx;
      }

      .members-list {
        display: flex;
        flex: 1;

        .member-avatar {
          width: 80rpx;
          height: 80rpx;
          position: relative;
          margin-right: 20rpx;

          .avatar-image {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            background-color: #e0e0e0;
            overflow: hidden;
          }

          .car-tag {
            position: absolute;
            top: -20rpx;
            left: 50%;
            transform: translateX(-50%);
            background-color: #ff9500;
            color: white;
            font-size: 20rpx;
            padding: 2rpx 10rpx;
            border-radius: 10rpx;
            white-space: nowrap;
            z-index: 1;
          }
        }

        .add-member {
          .add-icon {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            background-color: #f5f5f5;
            border: 2rpx dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40rpx;
            color: #999;
          }
        }
      }
    }
  }

  .content-box {
    width: 100%;
    padding: 26rpx 20rpx 10rpx 20rpx;
    box-sizing: border-box;
    background: #f4f4f4;
    box-shadow: 0rpx 2rpx 2rpx 0rpx rgba(179, 179, 179, 0.3);
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    position: relative;
    display: flex;
    flex-direction: column;

    .team-info-box {
      height: 60rpx;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10rpx;
      overflow: hidden;

      .driver-info {
        display: flex;
        align-items: center;
        position: relative;
        margin-right: 10rpx;

        .driver-tag {
          color: white;
          font-size: 18rpx;
          padding: 0 8rpx;
          border-radius: 8rpx;
          white-space: nowrap;
          z-index: 1;
        }

        .driver-avatar {
          width: 60rpx;
          height: 60rpx;

          .avatar-circle {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #e0e0e0;
          }
        }
      }

      .members-row {
        display: flex;
        align-items: center;
        flex: 1;

        .members-label {
          font-family:
            Source Han Sans,
            Source Han Sans;
          font-weight: 400;
          font-size: 24rpx;
          color: #333333;
        }

        .member-item {
          width: 60rpx;
          height: 60rpx;
          position: relative;
          margin-left: 6rpx;

          .avatar-circle {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #e0e0e0;
            object-fit: cover;

            &.add-icon {
              background-color: #f5f5f5;
              border: 2rpx dashed #ccc;
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;

              .plus-icon {
                font-size: 30rpx;
                color: #999;
                line-height: 1;
              }
            }
          }

          .leader-badge {
            position: absolute;
            bottom: -10rpx;
            left: 50%;
            transform: translateX(-50%);
            width: 63rpx;
            height: 37rpx;
            border-radius: 4rpx;
          }
        }
      }
    }

    .weather-box {
      font-family:
        Source Han Sans,
        Source Han Sans;
      font-weight: 400;
      font-size: 24rpx;
      color: #333333;
      display: flex;
      align-items: center;
      margin-bottom: 22rpx;
      margin-top: 38rpx;

      .weather-left {
        margin-left: 6rpx;
        flex: 1;
      }
    }

    .time-box {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;

      .label {
        flex: 1;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 400;
        font-size: 24rpx;
        color: rgba(51, 51, 51, 0.5);
      }

      .time {
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
      }
    }

    .btn-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 52rpx;
      background: linear-gradient(180deg, rgba(244, 244, 244, 0.6) 0%, #f4f4f4 100%);
      border-radius: 0rpx 0rpx 20rpx 20rpx;
      backdrop-filter: blur(1rpx);
      display: flex;
      justify-content: center;
      align-items: center;

      .team-btn {
        width: 60rpx;
        height: 24rpx;
        margin-top: -20rpx;
      }
    }
  }

  .time-margin-btm {
    display: flex;
    flex-direction: column;
    margin-bottom: 50rpx;
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

      .icon {
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
