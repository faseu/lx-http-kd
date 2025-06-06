<route lang="json5">
{
  style: {
    navigationBarTitleText: '我的活动',
    navigationBarBackgroundColor: '#fff',
  },
}
</route>

<template>
  <view class="page-container">
    <view class="tab-box mb-1">
      <wd-tabs v-model="tab" :autoLineWidth="true" inactiveColor="#8D93A6">
        <block v-for="item in tabList" :key="item">
          <wd-tab :title="item"></wd-tab>
        </block>
      </wd-tabs>
    </view>
    <scroll-view class="scroll-content-area" :scroll-y="true" :show-scrollbar="false">
      <view class="content-box-item" v-for="(activity, index) in myActivityList" :key="index">
        <view class="mb-3 flex items-center">
          <view class="mr-20rpx">{{ activity.team_name }}</view>
          <view class="team-leader" v-if="activity.creator == activity.creator_user.id">
            我是队长
          </view>
        </view>

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
              <image class="avatar-circle" :src="activity.driver_avatar" mode="aspectFill"></image>
            </view>
          </view>
          <view class="members-row ml-4" @click="goToJoinTeam(activity)">
            <view class="members-label mr-2.5">组员：</view>
            <template v-for="itemSlotIndex in 5" :key="itemSlotIndex">
              <view
                class="member-item"
                :class="{
                  leader: itemSlotIndex === 1 && activity.members && activity.members.length > 0,
                }"
              >
                <template v-if="activity.members && itemSlotIndex - 1 < activity.members.length">
                  <template v-if="activity.members[itemSlotIndex - 1].user_info.avatar">
                    <image
                      class="avatar-circle"
                      :src="activity.members[itemSlotIndex - 1].user_info.avatar"
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
        <template v-if="activity.is_full">
          <view class="content-status">
            <wd-img height="100%" width="100%" src="/static/images/mine/team-ed.png"></wd-img>
          </view>
          <view class="content-status-text">已组团</view>
        </template>
        <template v-else>
          <view class="content-status">
            <wd-img height="100%" width="100%" src="/static/images/mine/team-ing.png"></wd-img>
          </view>
          <view class="content-status-text">组队中</view>
        </template>
        <view class="weather-box">
          <wd-img height="32rpx" width="32rpx" src="/static/images/homepage/weather.png"></wd-img>
          <view class="weather-left">{{ activity.weather_info }}</view>
        </view>
        <view class="time-margin-btm" v-if="activity.isExpanded">
          <view class="time-box">
            <view class="label">集合时间：</view>
            <view class="time">{{ formatDateTime(activity?.start_time) }}</view>
          </view>
          <view class="time-box">
            <view class="label">下山时间：</view>
            <view class="time">{{ formatDateTime(activity?.last_active) }}</view>
          </view>
        </view>
        <view class="team-btn-box" v-if="activity.isExpanded">
          <template v-if="activity.creator == activity.creator_user.id">
            <view class="team-making-2" v-if="!activity.is_full" @click="handleExitTeam(activity)">
              退出队伍
            </view>
          </template>
          <template v-else>
            <view class="team-making-empty"></view>
          </template>
        </view>
        <view class="btn-box">
          <view class="team-btn" v-if="activity.isExpanded">
            <wd-img
              height="100%"
              width="100%"
              src="/static/images/homepage/up-arrow.png"
              @click="toggleFlag(activity)"
            ></wd-img>
          </view>
          <view class="team-btn" v-else>
            <wd-img
              height="100%"
              width="100%"
              src="/static/images/homepage/down-arrow.png"
              @click="toggleFlag(activity)"
            ></wd-img>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="js" setup>
import { ref, watch } from 'vue'
import { httpGet, httpPost } from '@/utils/http'
import { onShow } from '@dcloudio/uni-app'
import { useToast } from 'wot-design-uni'

const tab = ref(0)
const tabList = ref(['全部', '我发起的', '我参与的'])

const toggleFlag = (activity) => {
  activity.isExpanded = !activity.isExpanded
}

const myActivityList = ref([])
const allActivities = ref([])
const myCreatedActivities = ref([])
const myJoinedActivities = ref([])

const { run: runGetMyActivities } = useRequest((e) =>
  httpGet('/api/team/my_teams', {
    page: 1,
    page_size: 1000,
  }),
)

onShow(async () => {
  const { list: rawActivities } = await runGetMyActivities()
  let processedActivities = []

  if (Array.isArray(rawActivities)) {
    processedActivities = rawActivities.map((activity) => {
      // 处理驾驶员头像信息(有一个默认头像)
      let driver_avatar = null
      if (activity.is_driver === true && activity.user_info.avatar) {
        driver_avatar = activity.user_info.avatar
      }
      // 处理团队成员信息
      let members = []
      if (activity.members_info && Array.isArray(activity.members_info)) {
        // 过滤出非驾驶员的成员
        // 确保队长（is_leader为true的成员）排在第一位
        const leaderMembers = activity.members_info.filter(
          (member) => member.is_leader === true && !member.is_driver,
        )
        const otherMembers = activity.members_info.filter(
          (member) => member.is_leader !== true && !member.is_driver,
        )

        // 合并队长和其他成员
        members = [...leaderMembers, ...otherMembers]
      }
      return {
        ...activity,
        isExpanded: false,
        driver_avatar,
        members,
      }
    })

    console.log(processedActivities)
  } else {
    processedActivities = []
  }

  allActivities.value = processedActivities
  myCreatedActivities.value = processedActivities.filter(
    (activity) => activity.creator === activity.creator_user?.id,
  )
  myJoinedActivities.value = processedActivities.filter(
    (activity) => activity.creator !== activity.creator_user?.id,
  )

  if (tab.value === 0) {
    myActivityList.value = allActivities.value
  } else if (tab.value === 1) {
    myActivityList.value = myCreatedActivities.value
  } else if (tab.value === 2) {
    myActivityList.value = myJoinedActivities.value
  }
})

watch(tab, (newTabValue) => {
  if (newTabValue === 0) {
    myActivityList.value = allActivities.value
  } else if (newTabValue === 1) {
    myActivityList.value = myCreatedActivities.value
  } else if (newTabValue === 2) {
    myActivityList.value = myJoinedActivities.value
  }
})

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

// 日期时间处理方法
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr || typeof dateTimeStr !== 'string' || dateTimeStr.length < 19) {
    return ''
  }

  const date = dateTimeStr.substring(0, 10) // YYYY-MM-DD
  const time = dateTimeStr.substring(11, 19) // hh:mm:ss

  return `${date} ${time}`
}
const { run: runExitTeam } = useRequest((e) => httpPost('/api/activity/team/leave', e))

const toast = useToast()
const handleExitTeam = async (activity) => {
  console.log(activity.id)
  runExitTeam({
    team_id: activity.id,
  })
    .then((res) => {
      if (res.statusCode === 200) {
        // 成功退出队伍后刷新页面
        toast.show('已成功退出队伍！')

        // 短暂延迟后刷新页面，确保用户能看到提示
        setTimeout(() => {
          // 刷新当前页面
          uni.redirectTo({
            url: '/pages/mine/myActivity',
          })
        }, 1500)
      } else if (res.statusCode === 204) {
        // 不做任何处理
      }
    })
    .catch((err) => {
      console.error('退出队伍失败', err)
    })
}

const goToJoinTeam = ({ id, creator, cost_estimate: price }) => {
  uni.navigateTo({
    url: `/pages/joinTeam/index?id=${id}&leaderId=${creator}&price=${price}`,
  })
}
</script>

<style lang="scss" scoped>
.page-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff; /* Assuming a white background for the page */
}

.content-box {
  width: 100%;
  padding: 0 32rpx; /* Adjusted padding, top padding handled by tab-box or page-container */
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent overall page scroll if not intended */
}

.tab-box {
  padding-top: 24rpx; /* Keep original top padding */
  padding-left: 32rpx; /* Keep original left padding */
  padding-right: 32rpx; /* Keep original right padding */
  box-sizing: border-box;
}

.scroll-content-area {
  flex: 1;
  height: 0; // This is important for flex item to take remaining space
  padding: 0 32rpx 64rpx 32rpx; /* Add padding for content inside scroll area */
  box-sizing: border-box;
  /* Hide scrollbar for IE, Edge */
  -ms-overflow-style: none;
  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
  /* Hide scrollbar for WebKit based browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    display: none;
  }
}

.content-box-item {
  margin-top: 34rpx;
  width: 100%;
  padding: 26rpx 20rpx 10rpx 20rpx;
  box-sizing: border-box;
  background: #f4f4f4;
  box-shadow: 0rpx 2rpx 2rpx 0rpx rgba(179, 179, 179, 0.3);
  border-radius: 20rpx 20rpx 20rpx 20rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 32rpx; /* Added margin-bottom */

  &:first-child {
    margin-top: 0; /* Remove margin-top for the first item in the scroll area */
  }

  .content-status {
    width: 132rpx;
    height: 48rpx;
    position: absolute;
    top: 0;
    right: 0;
  }

  .content-status-text {
    width: 108rpx;
    height: 48rpx;
    position: absolute;
    top: 0;
    right: 0;

    text-align: center;
    font-family:
      Source Han Sans,
      Source Han Sans;
    font-weight: 400;
    font-size: 24rpx;
    color: #ffffff;
    line-height: 48rpx;
  }

  .team-leader {
    width: 96rpx;
    height: 32rpx;
    border-radius: 8rpx 8rpx 8rpx 8rpx;
    border: 1rpx solid #2a63ff;

    font-family:
      Source Han Sans,
      Source Han Sans;
    font-weight: 350;
    font-size: 20rpx;
    color: #2a5cff;
    line-height: 32rpx;
    text-align: center;
  }

  .team-btn-box {
    display: flex;
    justify-content: flex-end;
  }

  .team-making {
    width: 164rpx;
    height: 48rpx;
    background: #222;
    box-shadow: 0rpx 2rpx 2rpx 0rpx rgba(179, 179, 179, 0.3);
    border-radius: 50rpx;
    border: 2rpx solid #000000;

    font-family:
      Source Han Sans,
      Source Han Sans;
    font-weight: 700;
    font-size: 24rpx;
    color: #ffffff;
    line-height: 48rpx;
    text-align: center;
    margin-bottom: 50rpx;
  }

  .team-making-empty {
    width: 164rpx;
    height: 48rpx;
  }

  .team-making-2 {
    width: 164rpx;
    height: 48rpx;
    border-radius: 50rpx;
    border: 2rpx solid #000000;

    font-family:
      Source Han Sans,
      Source Han Sans;
    font-weight: 700;
    font-size: 24rpx;
    color: #000;
    line-height: 48rpx;
    text-align: center;
    margin-bottom: 50rpx;
  }

  .team-making-3 {
    width: 164rpx;
    height: 48rpx;
    border-radius: 50rpx;
    background-color: #009dff;

    font-family:
      Source Han Sans,
      Source Han Sans;
    font-weight: 700;
    font-size: 24rpx;
    color: #fff;
    line-height: 48rpx;
    text-align: center;
    margin-bottom: 50rpx;
  }

  .team-info-box {
    height: 60rpx;
    width: 100%;
    display: flex;
    align-items: center;
  }

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
    margin-top: 22rpx;

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

  .time-margin-btm {
    display: flex;
    flex-direction: column;
  }
}
</style>
