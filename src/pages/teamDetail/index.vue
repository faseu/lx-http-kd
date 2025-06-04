<route lang="json5">
{
  style: {
    navigationBarTitleText: '队伍详情',
  },
}
</route>
<template>
  <view class="w-full min-h-100vh bg-[#F6F8FA] box-border text-24rpx color-[#333]">
    <view class="banner-container">
      <image
        class="banner-image"
        :class="{ 'banner-vertical': isVerticalImage }"
        :src="teamDetail?.activity_images?.[0] || 'https://temp.im/750x374'"
        mode="aspectFill"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </view>
    <view class="p-30rpx w-full box-border">
      <!-- 活动基本信息 -->
      <view
        class="w-full bg-white p-24rpx box-border rounded-20rpx"
        :class="{ 'mt-20rpx': teamDetail?.activity_images?.length }"
      >
        <view class="text-32rpx font-bold">{{ teamDetail?.team_name || '活动名称' }}</view>
        <view class="color-[#666] mt-12rpx">
          {{ teamDetail?.team_intro || '暂无活动简介...' }}
        </view>
        <view class="mt-20rpx flex">
          <view
            class="p-[6rpx_12rpx] text-20rpx rounded-8rpx border border-solid border-[#2a63ff33] color-[#2A63FF] mr-12rpx"
          >
            {{ teamDetail?.is_charged ? '收费活动' : '免费活动' }}
          </view>
          <view
            class="p-[6rpx_12rpx] text-20rpx rounded-8rpx border border-solid border-[#28a74533] color-[#28A745]"
          >
            {{ teamDetail?.travel_method || '出行方式' }}
          </view>
        </view>
      </view>

      <!-- 时间和地点信息 -->
      <view class="mt-20rpx w-full bg-white p-24rpx box-border rounded-20rpx">
        <view class="flex items-center">
          <view class="color-[#999] mr-42rpx ml-12rpx">活动开始</view>
          <image class="w-32rpx h-32rpx mr-16rpx" src="/static/images/teamDetail/clock.png" />
          <view class="flex-1">{{ formatDateTime(teamDetail?.start_time) }}</view>
        </view>
        <view class="flex items-center mt-20rpx">
          <view class="color-[#999] mr-42rpx ml-12rpx">活动位置</view>
          <image class="w-28rpx h-34rpx mr-16rpx" src="/static/images/teamDetail/location.png" />
          <view class="flex-1">
            <view>{{ teamDetail?.location || '活动地点' }}</view>
            <view class="text-20rpx color-[#999]">活动地点</view>
          </view>
          <wd-icon name="arrow-right" color-[#333] size="32rpx"></wd-icon>
        </view>
      </view>

      <!-- 活动类型和详情 -->
      <view class="mt-20rpx w-full bg-white p-24rpx box-border rounded-20rpx">
        <view class="w-full border border-solid border-[#ECECEC] rounded-20rpx">
          <view
            class="flex items-center w-full h-66rpx border-0 border-b border-solid border-[#ECECEC] box-border"
          >
            <view
              class="flex items-center justify-center w-174rpx h-full bg-[#F8F9FA] color-[#999]"
            >
              活动类型
            </view>
            <view class="pl-30rpx">{{ teamDetail?.hiking_type || '休闲徒步' }}</view>
          </view>
          <view
            class="flex items-center w-full h-66rpx border-0 border-b border-solid border-[#ECECEC] box-border"
          >
            <view
              class="flex items-center justify-center w-174rpx h-full bg-[#F8F9FA] color-[#999]"
            >
              预计徒步时长
            </view>
            <view class="flex items-center justify-center flex-1 h-full">
              {{ teamDetail?.hiking_duration || 0 }}小时
            </view>
            <view
              class="flex items-center justify-center w-174rpx h-full bg-[#F8F9FA] color-[#999]"
            >
              徒步距离
            </view>
            <view class="flex items-center justify-center flex-1 h-full">
              {{ teamDetail?.hiking_distance || 0 }}km
            </view>
          </view>
          <view class="flex items-center w-full h-66rpx box-border">
            <view
              class="flex items-center justify-center w-174rpx h-full bg-[#F8F9FA] color-[#999]"
            >
              登顶海拔
            </view>
            <view class="flex items-center justify-center flex-1 h-full">
              {{ teamDetail?.peak_altitude || 0 }}m
            </view>
            <view
              class="flex items-center justify-center w-174rpx h-full bg-[#F8F9FA] color-[#999]"
            >
              海拔爬升
            </view>
            <view class="flex items-center justify-center flex-1 h-full">
              {{ teamDetail?.altitude_ascent || 0 }}m
            </view>
          </view>
        </view>
      </view>

      <!-- 发布者信息 -->
      <view
        class="mt-20rpx w-full h-100rpx bg-white p-[12rpx_24rpx] box-border rounded-20rpx flex items-center"
      >
        <image
          class="w-72rpx h-72rpx mr-16rpx rounded-[50%]"
          :src="teamDetail?.creator_user?.avatar || 'https://temp.im/72x72'"
        />
        <view class="flex-1 flex flex-col justify-between">
          <view class="text-28rpx color-[#333]">
            发布者·{{
              teamDetail?.creator_user?.nickname ||
              teamDetail?.creator_participant?.name ||
              '匿名用户'
            }}
          </view>
          <view class="text-20rpx color-[#999] mt-4rpx">
            联系方式：{{ maskPhone(teamDetail?.phone) }}（未报名不可见）
          </view>
        </view>
        <view
          class="flex justify-center items-center w-84rpx h-38rpx rounded-[20rpx] border border-solid border-[#FF8C28] color-[#FF8C28] text-22rpx"
        >
          关注
        </view>
      </view>

      <!-- 队伍信息 -->
      <view class="mt-20rpx w-full bg-white p-[24rpx] box-border rounded-20rpx">
        <view class="flex justify-between w-full">
          <view class="color-[#999]">
            {{ teamDetail?.members_info?.length || 0 }}人一起 (最多{{
              teamDetail?.max_participants
            }}人)
          </view>
          <view class="flex items-center">
            <view class="color-[#FF665A]">
              {{
                teamDetail?.is_full
                  ? '已满员'
                  : `仅剩${(teamDetail?.max_participants || 0) - (teamDetail?.members_info?.length || 0)}个名额`
              }}
            </view>
            <wd-icon name="arrow-right" color="#FF665A" size="32rpx"></wd-icon>
          </view>
        </view>
        <view class="flex mt-16rpx w-full gap-56rpx">
          <image
            v-for="(member, index) in teamDetail?.members_info?.slice(0, 6)"
            :key="index"
            class="w-60rpx h-60rpx rounded-[50%]"
            :src="member?.user_info?.avatar || 'https://temp.im/60x60'"
          />
        </view>
      </view>

      <!-- 车主信息 -->
      <view class="mt-20rpx" v-if="hasDrivers">
        <view class="font-bold text-28rpx">车主信息</view>
        <view class="mt-20rpx">
          <view>
            <driverItem v-for="driver in drivers" :key="driver.user_info.id" :driver="driver" />
          </view>
        </view>
      </view>

      <!-- 装备清单 -->
      <view
        class="mt-20rpx w-full p-[24rpx] bg-white box-border rounded-20rpx diy-line"
        v-if="teamDetail?.equipment_info"
      >
        <view class="flex w-full min-h-52rpx" v-if="teamDetail.equipment_info.head?.length">
          <view class="flex justify-center items-center w-82rpx color-[#666]">头部</view>
          <view class="flex flex-wrap items-center flex-1 ml-20rpx">
            {{ teamDetail.equipment_info.head.join('、') }}
          </view>
        </view>
        <view class="flex w-full min-h-52rpx" v-if="teamDetail.equipment_info.upper_body?.length">
          <view class="flex justify-center items-center w-82rpx color-[#666]">上身</view>
          <view class="flex flex-wrap items-center flex-1 ml-20rpx">
            {{ teamDetail.equipment_info.upper_body.join('、') }}
          </view>
        </view>
        <view class="flex w-full min-h-52rpx" v-if="teamDetail.equipment_info.lower_body?.length">
          <view class="flex justify-center items-center w-82rpx color-[#666]">下身</view>
          <view class="flex flex-wrap items-center flex-1 ml-20rpx">
            {{ teamDetail.equipment_info.lower_body.join('、') }}
          </view>
        </view>
        <view class="flex w-full min-h-52rpx" v-if="teamDetail.equipment_info.feet_body?.length">
          <view class="flex justify-center items-center w-82rpx color-[#666]">脚部</view>
          <view class="flex flex-wrap items-center flex-1 ml-20rpx">
            {{ teamDetail.equipment_info.feet_body.join('、') }}
          </view>
        </view>
        <view class="flex w-full min-h-52rpx" v-if="teamDetail.equipment_info.backpack?.length">
          <view class="flex justify-center items-center w-82rpx color-[#666]">背包</view>
          <view class="flex flex-wrap items-center flex-1 ml-20rpx">
            {{ teamDetail.equipment_info.backpack.join('、') }}
          </view>
        </view>
        <view class="flex w-full min-h-52rpx" v-if="teamDetail.equipment_info.equipment_other">
          <view class="flex justify-center items-center w-82rpx color-[#666]">其他</view>
          <view class="flex flex-wrap items-center flex-1 ml-20rpx">
            {{ teamDetail.equipment_info.equipment_other }}
          </view>
        </view>
      </view>

      <!-- 费用信息 -->
      <view class="mt-20rpx w-full bg-white p-24rpx box-border rounded-20rpx">
        <view class="w-full border border-solid border-[#ECECEC] rounded-20rpx overflow-hidden">
          <view
            class="flex items-center w-full h-66rpx border-0 border-b border-solid border-[#ECECEC] box-border"
          >
            <view
              class="flex items-center justify-center w-130rpx h-full bg-[#F8F9FA] color-[#999]"
            >
              住宿费
            </view>
            <view class="flex items-center justify-center flex-1 h-full">
              ¥{{ teamDetail?.accommodation_fee || 0 }}
            </view>
            <view
              class="flex flex-col items-center justify-center w-234rpx h-full bg-[#F8F9FA] color-[#999]"
            >
              <view class="text-22rpx">车费</view>
              <view class="color-[#FF665A] text-20rpx">
                {{ getCostMethodText(teamDetail?.cost_method) }}
              </view>
            </view>
            <view class="flex items-center justify-center flex-1 h-full">
              ¥{{ teamDetail?.car_fee || 0 }}
            </view>
          </view>
          <view
            class="flex items-center w-full h-66rpx border-0 border-b border-solid border-[#ECECEC] box-border"
          >
            <view
              class="flex items-center justify-center w-130rpx h-full bg-[#F8F9FA] color-[#999]"
            >
              其他费用
            </view>
            <view class="flex items-center justify-center flex-1 h-full">
              ¥{{ teamDetail?.other_fee || 0 }}
            </view>
            <view
              class="flex items-center justify-center w-234rpx h-full bg-[#F8F9FA] color-[#999]"
            >
              保险费
            </view>
            <view class="flex items-center justify-center flex-1 h-full">
              ¥{{ teamDetail?.insurance_price || 0 }}
            </view>
          </view>
          <view class="flex items-center w-full min-h-66rpx box-border bg-[#F8F9FA]">
            <view class="flex items-center justify-center w-130rpx h-[100%] color-[#999]">
              其他备注
            </view>
            <view class="flex items-center p-[6rpx_30rpx] flex-1 bg-white min-h-66rpx box-border">
              {{ teamDetail?.other_fee_introduced || '暂无其他备注' }}
            </view>
          </view>
        </view>
        <view class="w-full color-[#999] text-20rpx mt-16rpx">
          注：平台不收取任何费用，但为确保搭子安全需购买保险，加入队伍需预支付保险费用，活动开始24小时前可退款
        </view>
      </view>

      <!-- 活动图片展示（除第一张外的其他图片） -->
      <view
        class="mt-20rpx w-full bg-white p-24rpx box-border rounded-20rpx"
        v-if="remainingImages && remainingImages.length > 0"
      >
        <view class="text-28rpx font-bold mb-20rpx">更多活动图片</view>
        <view class="grid grid-cols-2 gap-12rpx">
          <view
            v-for="(image, index) in remainingImages"
            :key="index"
            class="w-full h-200rpx rounded-12rpx overflow-hidden"
          >
            <image
              class="w-full h-full"
              :src="image"
              mode="aspectFill"
              @click="previewImage(image, remainingImages)"
            />
          </view>
        </view>
      </view>
    </view>
    <wd-gap safe-area-bottom height="150rpx"></wd-gap>
    <view class="footer bg-white">
      <view class="flex items-center text-20rpx h-120rpx">
        <view class="flex flex-col items-center mr-48rpx" @click="share">
          <image class="w-32rpx h-32rpx" src="/static/images/teamDetail/share.png" alt="" />
          <view class="mt-6rpx">分享</view>
        </view>
        <wd-button
          custom-style="flex: 1; background-color: #000000 !important;"
          type="primary"
          size="large"
          @click="() => goToJoinTeam(teamDetail?.id)"
          :disabled="teamDetail?.is_full"
          block
        >
          {{ teamDetail?.is_member ? '已报名' : teamDetail?.is_full ? '已满员' : '报名' }}
        </wd-button>
      </view>
      <wd-gap bg-color="#FFFFFF" safe-area-bottom height="0"></wd-gap>
    </view>
  </view>
</template>

<script setup lang="js">
import { httpGet, httpPost } from '@/utils/http'
import driverItem from '@/components/driver-item/index.vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'

const id = ref(null)
const teamDetail = ref(null)
const isVerticalImage = ref(false) // 判断是否为竖图

const { run: runGetList } = useRequest((e) => httpGet(`/api/team/user/detail/${e.id}`))

// 计算属性
const hasDrivers = computed(() => {
  return teamDetail.value?.members_info?.some((member) => member.is_driver) || false
})

const drivers = computed(() => {
  return teamDetail.value?.members_info?.filter((member) => member.is_driver) || []
})

// 计算除第一张外的其他活动图片
const remainingImages = computed(() => {
  if (!teamDetail.value?.activity_images || teamDetail.value.activity_images.length <= 1) {
    return []
  }
  return teamDetail.value.activity_images.slice(1)
})

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  const date = new Date(dateTimeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[date.getDay()]

  return `${year}-${month}-${day} ${hour}:${minute} ${weekday}`
}

// 计算活动时长
const calculateDuration = () => {
  if (!teamDetail.value?.start_time || !teamDetail.value?.end_time) return '未知'

  const start = new Date(teamDetail.value.start_time)
  const end = new Date(teamDetail.value.end_time)
  const diffMs = end - start
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays}天${diffHours % 24}小时`
  } else {
    return `${diffHours}小时`
  }
}

// 获取审核状态文本
const getReviewStatus = (status) => {
  const statusMap = {
    0: '待审核',
    1: '已通过',
    2: '未通过',
  }
  return statusMap[status] || '未知'
}

// 获取费用分摊方式文本
const getCostMethodText = (method) => {
  const methodMap = {
    1: 'AA制',
    2: '车主不A，其余AA',
    3: '车主承担',
  }
  return methodMap[method] || 'AA制'
}

// 脱敏手机号
const maskPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

onShow(async () => {})

onLoad(async (options) => {
  id.value = options.id
  try {
    const data = await runGetList({ id: options.id })
    teamDetail.value = data.team_detail
    console.log('Team detail:', teamDetail.value)
  } catch (error) {
    console.error('获取队伍详情失败:', error)
  }
})

const goToJoinTeam = (teamId) => {
  if (!teamId) return
  uni.navigateTo({
    url: `/pages/joinTeam/index?id=${teamId}`,
  })
}

const share = () => {
  // 分享功能实现
  uni.share({
    provider: 'weixin',
    scene: 'WXSceneSession',
    type: 0,
    href: `pages/teamDetail/index?id=${teamDetail.value?.id}`,
    title: teamDetail.value?.team_name || '队伍详情',
    summary: `${teamDetail.value?.location} ${formatDateTime(teamDetail.value?.start_time)}`,
    imageUrl: 'https://temp.im/200x200',
  })
}

// 预览图片
const previewImage = (current, urls) => {
  uni.previewImage({
    current,
    urls,
  })
}

// 处理图片加载完成事件，判断图片方向
const handleImageLoad = (e) => {
  const { width, height } = e.detail
  // 如果高度大于宽度，则为竖图
  isVerticalImage.value = height > width
  console.log('图片尺寸:', { width, height, isVertical: isVerticalImage.value })
}

// 处理图片加载错误
const handleImageError = (e) => {
  console.error('图片加载失败:', e)
  isVerticalImage.value = false // 错误时默认为横图
}
</script>

<style lang="scss">
.footer {
  padding: 0 40rpx;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}

.diy-line {
  position: relative;
}

.diy-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 106rpx;
  background: #f8f9fa;
  width: 2rpx;
  height: 100%;
}

// 头部图片容器样式
.banner-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: 374rpx; // 默认横图高度
  object-fit: cover;
  display: block;

  // 竖图样式
  &.banner-vertical {
    height: 600rpx; // 竖图高度更高
  }
}

// 网格布局样式（兼容性更好的写法）
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.grid-cols-2 {
  > view {
    width: calc(50% - 6rpx);
  }
}

.gap-12rpx {
  gap: 12rpx;
}
</style>
