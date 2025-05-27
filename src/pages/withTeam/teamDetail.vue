<route lang="json5">
{
  style: {
    navigationBarTitleText: '队伍详情',
  },
}
</route>
<template>
  <view class="container">
    <!-- 顶部图片和价格 -->
    <view class="banner">
      <image class="banner-img" :src="bannerImg" mode="aspectFill" />
      <view class="price-tag">
        <text>人均：¥{{ teamDetailData.cost_estimate }}</text>
      </view>
    </view>

    <!-- 标题和简介 -->
    <!-- <view class="card">
      <view class="title">{{ title }}</view>
      <view class="desc">{{ desc }}</view>
      <view class="tags">
        <text class="tag blue">收费活动</text>
        <text class="tag orange">露营/户外</text>
      </view>
    </view> -->

    <!-- 活动信息 -->
    <view class="card activity-card">
      <view class="info-item">
        <view class="info-label">活动开始</view>
        <view class="info-content">
          <view class="info-row">
            <view class="icon-wrapper">
              <image class="icon" :src="icons.time" />
            </view>
            <text class="info-text">{{ teamDetailData.time }}</text>
          </view>
        </view>
      </view>
      <view class="info-item">
        <view class="info-label">活动位置</view>
        <view class="info-content">
          <view class="info-row">
            <view class="icon-wrapper">
              <image class="icon-2" :src="icons.location" />
            </view>
            <view class="location-detail">
              <view class="location-name">{{ teamDetailData.location }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="arrow-right"></view>
    </view>

    <!-- 已报名 -->
    <view class="card enroll-card">
      <view class="enroll-flex">
        <view class="enroll-container">
          <view class="enroll-left">
            <view class="enroll-title">
              已报名（{{ teamDetailData.enrolled }}/{{ teamDetailData.maxPeople }}）（{{
                teamDetailData.maleCount
              }}男{{ teamDetailData.femaleCount }}女）
            </view>
          </view>
          <view class="avatar-list">
            <image v-for="(avatar, idx) in avatars" :key="idx" :src="avatar" class="avatar" />
          </view>
          <view class="enroll-right">
            <view class="arrow-right"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 发布者信息 -->
    <view class="card flex-row">
      <view class="avatar-wrapper">
        <image class="user-avatar" :src="teamDetailData.publisher.avatar" />
      </view>
      <view class="user-info">
        <view class="user-name">
          发布者·{{ teamDetailData.publisher.name }}
          <!-- <button class="follow-btn" @click="handleFollow(teamDetailData.publisher.id)">关注</button> -->
        </view>
        <view class="user-contact" v-if="!isJoined">
          联系方式：{{ teamDetailData.publisher.phoneMask }}
          <text class="contact-tip">（未报名不可见）</text>
        </view>
        <view class="user-contact" v-else>联系方式：{{ teamDetailData.publisher.phone }}</view>
      </view>
    </view>

    <!-- 车主信息/操作 -->
    <view class="card mb-safe">
      <template v-if="state === 'confirmed'">
        <view class="flex mb-2" style="align-items: center">
          <view class="avatar-wrapper">
            <image class="user-avatar" :src="teamDetailData.driver.avatar" />
          </view>
          <view class="user-info">
            <view class="user-name">车主·{{ teamDetailData.driver.name }}</view>
            <view class="user-contact">车牌号：{{ teamDetailData.driver.plate }}</view>
          </view>
        </view>
        <view class="flex" style="width: 100%">
          <view class="flex" style="width: 100%; gap: 10rpx">
            <image
              v-for="(photo, index) in teamDetailData.driver.car_photo"
              :key="index"
              :src="photo"
              style="flex: 1; height: 200rpx; object-fit: cover; border-radius: 8rpx"
            />
          </view>
        </view>
        <view class="flex" style="width: 100%">
          <button
            class="driver-btn custom-confirmed flex-1"
            @click="toDecideDriver(1, teamDetailData)"
          >
            确认车主
          </button>
          <button
            class="driver-btn custom-rejected flex-1"
            @click="toDecideDriver(2, teamDetailData)"
          >
            拒绝车主
          </button>
        </view>
      </template>
      <template v-else-if="state === 'isDriver'">
        <view class="avatar-wrapper">
          <image class="user-avatar" :src="teamDetailData.driver.avatar" />
        </view>
        <view class="user-info">
          <view class="user-name">车主·{{ teamDetailData.driver.name }}</view>
          <view class="user-contact">车牌号：{{ teamDetailData.driver.plate }}</view>
        </view>
        <button class="driver-btn exit" @click="exitDriver(teamDetailData)">退出车主</button>
      </template>
      <template v-else>
        <view class="no-driver-box">
          <image class="add-icon" :src="icons.add" />
          <view class="no-driver-text">当前暂无车主～</view>
        </view>
        <button class="driver-btn become" @click="toBeDriver(teamDetailData)">我要当车主</button>
      </template>
    </view>

    <!-- 底部报名按钮 -->
    <view class="footer" v-if="!isJoined">
      <view class="share flex-col">
        <image class="icon" :src="icons.share" />
        <text>分享</text>
      </view>
      <button class="enroll-btn m-4 flex-1" @click="toBeDriver(teamDetailData)">报名</button>
    </view>
    <wd-toast />
  </view>
</template>

<script lang="js" setup>
import { reactive, ref } from 'vue'
import { httpGet, httpPost } from '@/utils/http'
// 队伍详情
let tmpUrl = ''
const { run: runGetTeamDetail } = useRequest((e) => httpGet(tmpUrl, {}))
const teamDetail = ref(null)
const isFull = ref(null)
const isJoined = ref(false)
const haveDriver = ref(false)
// 页面状态：'confirmed'（已确认车主）|'isDriver'（我是车主）|'noDriver'（无车主）
const state = ref('confirmed') // 使用传入的状态或默认值

onLoad(async (options) => {
  tmpUrl = `/api/activity/team/user/detail/${options.id}`
  const value1 = await runGetTeamDetail()
  // 第一步判断是否已经成团了
  isFull.value = value1.team_detail.is_full
  // 第二步判断是否已经加入状态
  if (
    value1.team_detail.is_driver ||
    value1.team_detail.is_leader ||
    value1.team_detail.is_member
  ) {
    isJoined.value = true
  }
  // 第三步将返回数据赋值
  teamDetail.value = value1.team_detail
  console.log('teamDetail', teamDetail.value)
  // 第四步判断是否有车主
  teamDetail.value.members_info.forEach((item) => {
    if (item.is_driver) {
      haveDriver.value = true
    }
  })
  // 第五步判断页面状态
  // if (value1.team_detail.is_leader) {
  //   state.value = 'confirmed'
  // } else if (value1.team_detail.is_driver) {
  //   state.value = 'isDriver'
  // } else if (value1.team_detail.is_member || !haveDriver) {
  //   state.value = 'noDriver'
  // }
})

// 监听数据变化
watch(
  () => teamDetail.value,
  () => {
    processData()
  },
  { immediate: true },
)

const processData = () => {
  teamDetailData.teamId = teamDetail.value.id
  teamDetailData.cost_estimate = teamDetail.value.cost_estimate
  teamDetailData.time = formatDateTime(teamDetail.value.start_time)
  teamDetailData.location = teamDetail.value.location
  teamDetailData.enrolled = teamDetail.value.members_info.length
  teamDetailData.maxPeople = teamDetail.value.max_participants

  let male = 0
  let female = 0
  teamDetail.value.members_info.forEach((item) => {
    if (item.user_info.gender == 1) {
      male++
    } else if (item.user_info.gender == 3 || item.user_info.gender == null) {
      female++
    }

    if (item.is_creator) {
      teamDetailData.publisher.name = item.name
      teamDetailData.publisher.avatar = item.user_info.avatar
      teamDetailData.publisher.id = item.user_info.id
      teamDetailData.publisher.phone = item.phone
      teamDetailData.publisher.phoneMask = maskPhoneNumber(item.phone)
    }

    if (item.is_driver) {
      teamDetailData.driver.name = item.name
      teamDetailData.driver.avatar = item.user_info.avatar
      teamDetailData.driver.plate = item.license_plate
      teamDetailData.driver.id = item.user_info.id
      // 处理车辆照片，将逗号分隔的字符串转换为数组
      if (item.car_photo) {
        teamDetailData.driver.car_photo = item.car_photo
          .split(',')
          .filter((photo) => photo.trim() !== '')
      } else {
        teamDetailData.driver.car_photo = []
      }
    }
  })
  teamDetailData.maleCount = male
  teamDetailData.femaleCount = female
}
const teamDetailData = reactive({
  teamId: null,
  cost_estimate: 0,
  time: '',
  location: '',
  enrolled: 0,
  maxPeople: 0,
  maleCount: 0,
  femaleCount: 0,
  publisher: {
    name: '',
    avatar: '',
    phone: '',
    phoneMask: '',
    id: '',
  },
  driver: {
    name: '',
    avatar: '',
    plate: '',
    id: '',
    car_photo: [],
  },
  isFollowed: null,
})
const bannerImg = 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg'
const avatars = [
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
  'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
  '/static/images/teamDetail/more.png',
]
const icons = {
  time: '/static/images/teamDetail/clock.png',
  location: '/static/images/teamDetail/location.png',
  share: '/static/images/teamDetail/share.png',
  add: '/static/images/teamDetail/big-add.png',
}

// 日期时间处理方法
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr || typeof dateTimeStr !== 'string' || dateTimeStr.length < 19) {
    return ''
  }

  const date = dateTimeStr.substring(0, 10) // YYYY-MM-DD
  const time = dateTimeStr.substring(11, 19) // hh:mm:ss

  return `${date} ${time}`
}

// 手机号加密方法，保留前三后四，中间位数用*代替
const maskPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return ''
  }

  // 确保手机号格式正确
  if (phone.length !== 11) {
    return phone
  }

  // 保留前三后四，中间用*代替
  const prefix = phone.substring(0, 3)
  const suffix = phone.substring(7)
  const masked = prefix + '****' + suffix

  return masked
}

// 处理关注

const handleFollow = async (e) => {
  const tmpUploaderId = `/api/album/follower/${e}`
  const { run: runUploader } = useRequest((e) => httpPost(tmpUploaderId, {}))
  const value2 = await runUploader()
  console.log('value2', value2, value2.follower)
}

// 拉起当车主的方法
const { run: runBeDriver } = useRequest((e) => httpPost('/api/activity/team/become_driver', e))
const toBeDriver = async (e) => {
  console.log(e.teamId)
  // 这里判断是否报名了，没有报名就直接跳去报名的页面，报名了直接调车主接口
  // if (!isJoined) {
  // todo
  uni.navigateTo({ url: `/pages/joinTeam/index?id=${e.teamId}&leaderId=${e.publisher.id}` })
  // } else {
  //   runBeDriver({
  //     team_id: e.teamId,
  //   })
  // }
}

// 退出车主
const { run: runExitDriver } = useRequest((e) => httpPost('/api/activity/team/quit_driver', e))
const exitDriver = async (e) => {
  runExitDriver({
    team_id: e.teamId,
  })
}

// 决定车主
const { run: runDecideDriver } = useRequest((e) => httpPost('/api/activity/team/review_driver', e))

const toDecideDriver = (e, j) => {
  runDecideDriver({
    participant_id: j.driver.id, // 被审核人用户id
    review_status: e, // 审核状态 0：待审核，1审核通过，2审核拒绝
    team_id: j.teamId, // 小队id
  })
}
</script>

<style scoped>
.container {
  max-width: 1000rpx;
  margin: 0 auto;
  background: #f6f7f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}
.banner {
  width: 100vw;
  max-width: 1000rpx;
  height: 400rpx;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.banner-img {
  width: 100%;
  height: 400rpx;
  object-fit: cover;
}
.price-tag {
  position: absolute;
  bottom: 40rpx;
  right: 0;
  background: linear-gradient(180deg, #f2cd6b 0%, #ba9143 100%);
  width: 248rpx;
  height: 66rpx;
  color: #fff;
  border-radius: 40rpx 0 0 40rpx;
  padding: 6rpx 36rpx;
  font-size: 36rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  width: 92vw;
  max-width: 920rpx;
  background: #fff;
  border-radius: 24rpx;
  margin: 28rpx 0 0 0;
  padding: 36rpx 32rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.activity-card {
  position: relative;
}
.mb-safe {
  margin-bottom: 40rpx;
}
.title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}
.desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 20rpx;
}
.tags {
  display: flex;
  gap: 16rpx;
}
.tag {
  font-size: 20rpx;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  border: 1rpx solid;
}
.tag.blue {
  color: #2a5cff;
  border-color: #2a5cff33;
}
.tag.orange {
  color: #ff8c28;
  border-color: #ff8c2833;
}
.info-item {
  width: 100%;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.info-label {
  font-size: 28rpx;
  color: #999;
  width: 120rpx;
}
.info-content {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}
.info-row {
  display: flex;
  align-items: center;
  flex: 1;
}
.icon-wrapper {
  margin-left: 44rpx;
  margin-right: 16rpx;
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.icon {
  width: 32rpx;
  height: 32rpx;
}
.icon-2 {
  width: 28rpx;
  height: 38rpx;
}
.info-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
  word-break: break-word;
}
.arrow-right {
  width: 20rpx;
  height: 22rpx;
  border-top: 4rpx solid #ccc;
  border-right: 4rpx solid #ccc;
  transform: rotate(45deg);
}
.activity-card .arrow-right {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}
.location-detail {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.location-name {
  font-size: 28rpx;
  color: #333;
}
.location-address {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}
.enroll-card {
}
.enroll-flex {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
.enroll-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.enroll-left {
  flex: 1;
}
.enroll-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.enroll-title {
  font-size: 30rpx;
  color: #333;
}
.avatar-list {
  display: flex;
  align-items: center;
  width: 25%;
  justify-content: flex-end;
}
.avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  object-fit: cover;
  border: 3rpx solid #fff;
  box-sizing: border-box;
  z-index: 1;
}
.avatar:not(:first-child) {
  margin-left: -32rpx;
}
.flex-row {
  flex-direction: row;
  display: flex;
  align-items: center;
}
.avatar-wrapper {
  background-color: #000;
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  object-fit: cover;
}
.user-info {
  flex: 1;
  min-width: 0;
}
.user-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.follow-btn {
  font-size: 20rpx;
  padding: 0 20rpx;
  margin-left: 16rpx;
  height: auto;
  border: 2rpx solid #ff6619;
  color: #ff6619;
  border-radius: 292rpx;
  background-color: #fff;
}
.user-contact {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}
.contact-tip {
  color: #999;
  font-size: 24rpx;
  margin-left: 8rpx;
}
.driver-btn {
  font-size: 24rpx;
  padding: 0 32rpx;
  margin-left: 24rpx;
  height: auto;
  border: none;
  border-radius: 292rpx;
  color: #fff;
}
.custom-confirmed {
  background: linear-gradient(152deg, #3b60ff 0%, #00c3ff 100%) !important;
  border: none;
}

.custom-rejected {
  background: linear-gradient(152deg, #f11771 0%, #f11717 100%) !important;
  border: none;
}

.exit {
  background: linear-gradient(180deg, #ffaa5b 5%, #ff5353 100%);
  border: none;
}
.driver-btn.become {
  background: linear-gradient(152deg, #3b60ff 0%, #00c3ff 100%);
  color: #fff;
}
.no-driver-box {
  display: flex;
  align-items: center;
  flex: 1;
}
.add-icon {
  width: 132rpx;
  height: 132rpx;
  margin-bottom: 8rpx;
}
.no-driver-text {
  font-size: 26rpx;
  color: #999;
  margin-left: 18rpx;
}
.footer-placeholder {
  height: calc(0rpx + env(safe-area-inset-bottom));
}
.footer {
  width: 100vw;
  max-width: 1000rpx;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  box-sizing: border-box;
  z-index: 10;
  box-shadow: 0 -2rpx 20rpx rgba(0, 0, 0, 0.05);
  margin: 0 auto;
}
.share {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #333;
  font-size: 26rpx;
}
.enroll-btn {
  font-size: 28rpx !important;
  font-weight: 600 !important;
  border-radius: 48rpx !important;
  color: #ffffff;
  background: linear-gradient(90deg, #222, #222 80%) !important;
}
</style>
