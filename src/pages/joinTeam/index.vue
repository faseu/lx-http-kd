<route lang="json5">
{
  style: {
    navigationBarTitleText: '加入队伍',
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="content">
    <wd-toast />
    <wd-form ref="form" :model="model" errorType="toast" :rules="getRules()">
      <wd-cell-group custom-class="group" title="保险信息">
        <template #value>
          <text class="color-[#999] text-24rpx">
            注：成功加入队伍后，出发24小时为队员强制购买旅游保险
          </text>
        </template>
        <wd-input
          label="姓名"
          label-width="100px"
          :maxlength="20"
          prop="name"
          v-model="model.name"
          placeholder="请输入姓名"
        />
        <wd-input
          label="身份证号码"
          type="idcard"
          label-width="100px"
          :maxlength="18"
          prop="id_card"
          v-model="model.id_card"
          placeholder="请输入身份证号码"
        />
        <wd-input
          label="联系电话"
          type="number"
          label-width="100px"
          :maxlength="11"
          prop="phone"
          v-model="model.phone"
          placeholder="请输入联系电话"
        />
      </wd-cell-group>

      <!-- 保险选择组件 -->
      <view class="mt-20rpx">
        <insurance :insurance-list="insuranceList" @insuranceChange="handleInsuranceChange" />
      </view>

      <!-- 显示当前选中的保险信息 -->
      <view class="insurance-info">
        <view class="info-item">
          <text class="label">已选保险：</text>
          <text class="value">{{ selectedInsurance.name }}</text>
        </view>
        <view class="info-item">
          <text class="label">保险费用：</text>
          <text class="value price">￥{{ selectedInsurance.price }}/人/天</text>
        </view>
        <view class="info-item">
          <text class="label">保障金额：</text>
          <text class="value">{{ selectedInsurance.coverage }}万元</text>
        </view>
      </view>

      <!-- 车主信息展示 -->
      <view v-if="processedDrivers.length > 0" class="mt-20rpx">
        <wd-cell-group title="当前车主信息">
          <view class="drivers-container">
            <driverItem
              v-for="driver in processedDrivers"
              :key="driver.id"
              :item="driver"
              :bg="'#f6f8fa'"
              :showReviewStatus="false"
              @join-car="handleSelectDriver"
              @exit-car="handleExitCar"
            />
          </view>
        </wd-cell-group>
      </view>

      <wd-cell-group title="当车主">
        <template #value>
          <div class="w-full flex items-center justify-between">
            <text class="color-[#999] text-24rpx">（车费过路费等车主不A，其余队员AA）</text>
            <wd-switch
              v-model="model.is_driver"
              size="24px"
              @change="handleDriverSwitchChange"
              :disabled="model.is_driver && selectedDriverId"
            />
          </div>
        </template>
        <wd-input
          v-if="model.is_driver"
          label="可载人数"
          type="number"
          label-width="100px"
          :maxlength="11"
          prop="car_seat_count"
          v-model="model.car_seat_count"
          placeholder="请输入可载人数"
        />
        <wd-input
          v-if="model.is_driver"
          label="车牌号"
          type="number"
          label-width="100px"
          :maxlength="20"
          prop="license_plate"
          disabled
          v-model="model.license_plate"
          placeholder="请输入车牌号"
          @click="
            (e) => {
              visible = true
            }
          "
        />
      </wd-cell-group>

      <view class="mt-30rpx flex" v-if="model.is_driver">
        <wd-upload
          :limit="1"
          :file-list="model.fileList1"
          action="/api/image/upload"
          @change="handleFileChange1"
          custom-class="mr-8rpx"
        >
          <view
            class="w-160rpx h-160rpx flex flex-col justify-center items-center bg-[#f6f8fa] text-[#B8B8B8]"
          >
            <wd-icon name="photo" size="22px"></wd-icon>
            <view class="text-24rpx">驾驶证</view>
          </view>
        </wd-upload>
        <view class="w-10rpx" />
        <wd-upload
          :limit="1"
          :file-list="model.fileList2"
          action="/api/image/upload"
          @change="handleFileChange2"
        >
          <view
            class="w-160rpx h-160rpx flex flex-col justify-center items-center bg-[#f6f8fa] text-[#B8B8B8]"
          >
            <wd-icon name="photo" size="22px"></wd-icon>
            <view class="text-24rpx">行驶证</view>
          </view>
        </wd-upload>
      </view>

      <wd-cell-group title="紧急联系人">
        <wd-input
          label="姓名"
          label-width="100px"
          :maxlength="20"
          prop="emergency_contact"
          v-model="model.emergency_contact"
          placeholder="请输入紧急联系人姓名"
        />
        <wd-input
          label="联系电话"
          type="number"
          label-width="100px"
          :maxlength="11"
          prop="emergency_contact_phone"
          v-model="model.emergency_contact_phone"
          placeholder="请输入紧急联系人电话"
        />
      </wd-cell-group>

      <view class="color-[#FF5252] text-24rpx mt-20rpx">
        注：加入队伍需预付费用，出发前72小时退出全额退款，出发前24 小时退出退款50%
      </view>
      <wd-gap bg-color="#FFFFFF" safe-area-bottom height="150rpx"></wd-gap>

      <view class="footer bg-white">
        <view class="tip">
          <wd-checkbox v-model="model.read" prop="read" custom-label-class="label-class">
            <text style="color: #999999; font-size: 24rpx">我已同意并阅读</text>
            <text style="color: #009dff; font-size: 24rpx">
              《保险协议》《免责协议》《AA搭子协议》
            </text>
          </wd-checkbox>
        </view>
        <view class="flex items-center text-28rpx">
          <view class="flex-1 mr-48rpx">
            <text>应付金额 ：</text>
            <text style="color: #d8aa4f">{{ `¥ ${totalPrice}` }}</text>
            <text class="text-20rpx color-[#999] ml-8rpx">({{ activityDays }}天)</text>
          </view>
          <wd-button
            custom-style="width: 320rpx; background-color: #4BD06E !important;"
            type="primary"
            size="large"
            @click="checkRead"
            block
          >
            提交
          </wd-button>
        </view>
        <wd-gap bg-color="#FFFFFF" safe-area-bottom height="0"></wd-gap>
      </view>
    </wd-form>
    <wd-keyboard v-model:visible="visible" mode="car" @input="onInputCar" @delete="onDeleteCar" />
  </view>
</template>

<script lang="js" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { httpPost, httpGet } from '@/utils/http'
import { useUserStore } from '@/store'
import { onLoad } from '@dcloudio/uni-app'
import { useToast, useMessage } from 'wot-design-uni'
import driverItem from '@/components/driver-item/index.vue'
import insurance from '@/components/insurance/index.vue'

const message = useMessage()
const toast = useToast()

const userStore = useUserStore()
const {
  user_info: { id: localLeaderId, avatar: userAvatar, nickname: userNickname },
} = userStore.userInfo

const form = ref()
const visible = ref(false)
const id = ref()
const openid = ref(null)
const leaderId = ref()
const basePrice = ref(0) // 队伍基础费用
const insuranceList = ref([]) // 保险列表
const loading = ref(false)
const teamDetail = ref(null) // 队伍详情数据
const selectedDriverId = ref(null) // 选中的司机ID

// 选中的保险信息（默认值）
const selectedInsurance = ref({
  type: 'comprehensive',
  name: '全面保障',
  price: 12.98,
  coverage: 50,
  features: [],
})

const model = reactive({
  name: '',
  id_card: '',
  phone: '',
  is_driver: false,
  car_seat_count: '',
  license_plate: '',
  emergency_contact: '',
  emergency_contact_phone: '',
  fileList1: [],
  fileList2: [],
  read: false,
  driver_id: null,
})

// 计算活动天数
const activityDays = computed(() => {
  if (!teamDetail.value?.start_time || !teamDetail.value?.end_time) {
    return 1 // 默认1天
  }

  // 创建日期对象，只考虑日期部分，忽略时分秒
  const startDate = new Date(teamDetail.value.start_time)
  const endDate = new Date(teamDetail.value.end_time)

  // 将时间设置为当天的00:00:00，确保只比较日期
  const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

  // 计算日期差值（毫秒）
  const timeDiff = endDateOnly - startDateOnly

  // 转换为天数差值
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24)

  // 跨几天就是几+1天，比如：
  // 同一天: 2025-06-08 到 2025-06-08 = 0天差值 = 1天活动
  // 跨1天: 2025-06-08 到 2025-06-09 = 1天差值 = 2天活动
  // 跨2天: 2025-06-08 到 2025-06-10 = 2天差值 = 3天活动
  return daysDiff + 1
})

// 计算总价格（活动天数 × 保险费用）
const totalPrice = computed(() => {
  const insuranceTotal = parseFloat(selectedInsurance.value.price) * activityDays.value
  return (parseFloat(basePrice.value) + insuranceTotal).toFixed(2)
})

// 计算属性：获取队伍中的司机列表，并正确显示乘客信息
const processedDrivers = computed(() => {
  if (!teamDetail.value?.members_info) return []

  const currentUserId = localLeaderId

  return teamDetail.value.members_info
    .filter((member) => member.is_driver && +member.driver_review_status === 1)
    .map((driver) => {
      const isCurrentUserCar = driver.user_info?.id === currentUserId

      // 检查当前用户是否已选择这辆车
      const isCurrentUserPassenger = selectedDriverId.value === driver.id

      // 构建乘客列表，如果当前用户选择了这辆车，则加入当前用户信息
      const carPassengers = [...(driver.car_passengers || [])]

      if (isCurrentUserPassenger && !carPassengers.some((p) => p.user_info?.id === currentUserId)) {
        // 添加当前用户到乘客列表
        carPassengers.push({
          user_info: {
            id: currentUserId,
            avatar: userAvatar || 'https://temp.im/40x40',
            nickname: userNickname || '我',
          },
        })
      }

      return {
        id: driver.id,
        name: driver.name || driver.user_info?.nickname || '匿名司机',
        avatar: driver.user_info?.avatar || 'https://temp.im/166x166',
        gender: driver.user_info?.gender || 1,
        license_plate: driver.license_plate || '未知车牌',
        pickup_location: driver.pickup_location || '待确定上车点',
        car_seat_count: driver.car_seat_count || 4,
        car_passengers: carPassengers,
        driver_review_status: driver.driver_review_status || 1,
        is_current_user_car: isCurrentUserCar,
        is_current_user_passenger: isCurrentUserPassenger,
        originalData: driver,
      }
    })
})

const getRules = () => ({
  name: [{ required: true, message: '请输入姓名' }],
  id_card: [{ required: true, message: '请输入身份证号' }],
  phone: [{ required: true, message: '请输入手机号' }],
  emergency_contact: [{ required: true, message: '请输入紧急联系人姓名' }],
  emergency_contact_phone: [{ required: true, message: '请输入紧急联系人电话' }],
  license_plate: [
    {
      required: model.is_driver,
      message: '请填写车牌信息',
    },
  ],
  car_seat_count: [
    {
      required: model.is_driver,
      message: '请填写可载人数',
    },
  ],
})

// 处理司机开关变化
const handleDriverSwitchChange = ({ value: newValue }) => {
  console.log('司机开关变化:', newValue, '当前选中司机ID:', selectedDriverId.value)

  // 如果要开启司机模式，且当前已选择了其他司机的车辆
  if (newValue && selectedDriverId.value) {
    // 阻止开关变化，先弹出确认框
    model.is_driver = false

    message
      .confirm({
        msg: '当车主后将退出当前选择的车辆，确定要切换为车主吗？',
        title: '确认切换',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
      .then(() => {
        // 用户确认，退出当前车辆并开启司机模式
        selectedDriverId.value = null
        model.driver_id = null
        model.is_driver = true
        toast.show('已退出当前车辆，切换为车主模式')
      })
      .catch(() => {
        // 用户取消，保持开关关闭状态
        console.log('用户取消切换为车主')
      })
  } else if (!newValue) {
    // 关闭司机模式，直接允许
    model.is_driver = false
    // 清空司机相关信息
    model.car_seat_count = ''
    model.license_plate = ''
    model.fileList1 = []
    model.fileList2 = []
  } else {
    // 开启司机模式且没有选择其他车辆，直接允许
    model.is_driver = true
  }
}

// 处理保险选择变化
const handleInsuranceChange = (insuranceData) => {
  console.log('选中保险:', insuranceData)
  selectedInsurance.value = insuranceData
}

// 处理选择司机车辆
const handleSelectDriver = (driverData) => {
  console.log('选择司机车辆:', driverData)

  // 如果当前是司机模式，先询问是否退出司机模式
  if (model.is_driver) {
    message
      .confirm({
        msg: '选择其他车辆后将退出车主模式，确定要选择该车辆吗？',
        title: '确认选择',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
      .then(() => {
        // 退出司机模式
        model.is_driver = false
        model.car_seat_count = ''
        model.license_plate = ''
        model.fileList1 = []
        model.fileList2 = []

        // 选择新车辆
        selectedDriverId.value = driverData.id
        model.driver_id = driverData.id
        toast.show(`已退出车主模式，选择${driverData.name}的车辆`)
      })
      .catch(() => {
        console.log('用户取消选择车辆')
      })
  } else {
    // 非司机模式，直接选择车辆
    selectedDriverId.value = driverData.id
    model.driver_id = driverData.id
    toast.show(`已选择${driverData.name}的车辆`)
  }
}

// 处理退出车辆
const handleExitCar = (driverData) => {
  console.log('退出车辆:', driverData)
  selectedDriverId.value = null
  model.driver_id = null
  toast.show(`已退出${driverData.name}的车辆`)
}

const { run: joinTeam } = useRequest((e) => httpPost('/api/pay', e))
const { run: updateLeader } = useRequest((e) => httpPost('/api/activity/team/update_user', e))
const { run: getInsuranceList } = useRequest((e) => httpGet('/api/insurance_list', e))
const { run: getOpenid } = useRequest((e) => httpPost('/api/get_openid', e))
const { run: getUserInfo } = useRequest(() => httpGet('/api/get_user'))
const { run: getTeamDetail } = useRequest((e) => httpGet(`/api/team/user/detail/${e.id}`))

// 获取并填充用户信息
const fetchAndFillUserInfo = async () => {
  try {
    const userInfo = await getUserInfo()

    if (userInfo) {
      if (userInfo.real_name) {
        model.name = userInfo.real_name
      }
      if (userInfo.id_card_number) {
        model.id_card = userInfo.id_card_number
      }
      if (userInfo.phone_number) {
        model.phone = userInfo.phone_number
      }
      if (userInfo.emergency_contact) {
        model.emergency_contact = userInfo.emergency_contact
      }
      if (userInfo.emergency_contact_phone) {
        model.emergency_contact_phone = userInfo.emergency_contact_phone
      }

      console.log('已自动填充用户信息:', userInfo)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 获取队伍详情
const fetchTeamDetail = async (teamId) => {
  try {
    const data = await getTeamDetail({ id: teamId })
    teamDetail.value = data.team_detail
    console.log('获取到的队伍详情:', teamDetail.value)
  } catch (error) {
    console.error('获取队伍详情失败:', error)
  }
}

// 获取保险列表
const fetchInsuranceList = async () => {
  try {
    const data = await getInsuranceList()
    insuranceList.value = data?.list || []
    console.log('获取到的保险列表:', insuranceList.value)

    if (insuranceList.value.length > 0) {
      const firstInsurance = insuranceList.value[0]
      selectedInsurance.value = {
        id: firstInsurance.id,
        type: firstInsurance.id.toString(),
        name: firstInsurance.name,
        price: parseFloat(firstInsurance.price),
        coverage: parseFloat(firstInsurance.hurt_coverage) / 10000,
        features: firstInsurance.description ? [firstInsurance.description] : [],
        description: firstInsurance.description,
        originalPrice: parseFloat(firstInsurance.original_price || firstInsurance.price),
        medicalCoverage: parseFloat(firstInsurance.medical_coverage),
        allowancePrice: parseFloat(firstInsurance.allowance_price),
      }
    }
  } catch (error) {
    console.error('获取保险列表失败:', error)
    toast.show('获取保险信息失败')
  }
}

onLoad(async (options) => {
  if (options.id) {
    id.value = options.id
  }
  if (options.leaderId) {
    leaderId.value = options.leaderId
    if (+localLeaderId === +options.leaderId) {
      uni.setNavigationBarTitle({
        title: '完善队长信息',
      })
    }
  }
  if (options.price) {
    basePrice.value = options.price
  }

  try {
    const { code } = await uni.login()
    const { openid: tempOpenid } = await getOpenid({ code })
    console.log(tempOpenid)
    openid.value = tempOpenid

    await Promise.all([fetchInsuranceList(), fetchAndFillUserInfo(), fetchTeamDetail(id.value)])
  } catch (error) {
    console.error('初始化失败:', error)
    toast.show('初始化失败，请重试')
  }
})

const handleFileChange1 = ({ fileList }) => {
  model.fileList1 = fileList
}

const handleFileChange2 = ({ fileList }) => {
  model.fileList2 = fileList
}

const handleSubmit = async () => {
  const { valid, errors } = await form.value.validate()
  if (valid) {
    if (model.is_driver && (!model.fileList1?.length || !model.fileList2?.length)) {
      toast.show('请上传行驶证/驾驶证')
      return
    }

    if (model.is_driver && !/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{5}$/.test(model.license_plate)) {
      toast.show('请输入正确的车牌号，例如：渝A12345')
      return
    }

    const submitData = {
      ...model,
      team_id: id.value,
      openid: openid.value,
      insurance_id: selectedInsurance.value.id,
      privacy_agreement: model.read,
    }

    if (model.is_driver) {
      submitData.car_photo = `${JSON.parse(model.fileList1[0].response).data},${JSON.parse(model.fileList2[0].response).data}`
    }

    console.log('提交数据:', submitData)

    try {
      if (Number(localLeaderId) === Number(leaderId.value)) {
        await updateLeader(submitData)
        toast.show('队长信息更新成功！')
      } else {
        const payData = await joinTeam(submitData)
        console.log(payData)
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: payData.signType,
          paySign: payData.paySign,
          success: (res) => {
            uni.showToast({ title: '支付成功，加入小队' })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          },
          fail: (err) => {
            uni.showToast({ title: '支付失败', icon: 'none' })
          },
        })
      }
    } catch (error) {
      console.error('提交失败:', error)
      toast.show('提交失败，请重试')
    }
  }
}

const checkRead = () => {
  if (model.read) {
    handleSubmit()
  } else {
    message
      .confirm({
        msg: '确认已阅读并同意《保险协议》《免责协议》《AA搭子协议》',
        title: '提示',
      })
      .then(() => {
        model.read = true
        handleSubmit()
      })
      .catch(() => {
        console.log('点击了取消按钮')
      })
  }
}

const onInputCar = (value) => {
  model.license_plate = `${model.license_plate}${value}`
}

const onDeleteCar = () => {
  model.license_plate = model.license_plate.slice(0, -1)
}
</script>

<style scoped lang="scss">
.inline-txt {
  display: inline-block;
  font-size: 28rpx;
  margin: 0 28rpx;
  color: rgba(0, 0, 0, 0.45);
  vertical-align: middle;
}

.tip {
  margin-bottom: 18rpx;
  color: #999;
  font-size: 24rpx;
}

.footer {
  padding: 24rpx 32rpx 0;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  z-index: 99;
  bottom: 0;
  left: 0;
}

.content {
  padding: 20rpx;
  box-sizing: border-box;
  overflow-x: hidden;
}

.drivers-container {
  padding: 0 20rpx;
}

.insurance-info {
  margin: 20rpx 0;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  border-left: 4rpx solid #4bd06e;

  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
    font-size: 26rpx;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #666;
      width: 160rpx;
    }

    .value {
      color: #333;
      font-weight: 500;
      flex: 1;

      &.price {
        color: #ff8c28;
        font-weight: bold;
      }
    }
  }
}

:deep() {
  .group {
    .wd-cell-group__title {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .wd-cell-group__title {
    align-items: center;
  }
  .wd-cell-group__left {
    font-size: 28rpx !important;
    font-weight: bold !important;
    color: #333333 !important;
  }
  .wd-cell-group__right {
    flex: 1;
    font-size: 24rpx !important;
    color: #999999 !important;
  }
  .wd-picker__cell {
    margin-top: 4rpx;
    background: #f6f8fa !important;
    border-radius: 10rpx !important;
  }
  .wd-input.is-cell {
    margin-top: 4rpx;
    background: #f6f8fa !important;
    border-radius: 10rpx !important;
  }
  .wd-checkbox__label {
    margin-left: 10rpx !important;
  }
  .wd-input__clear {
    background: transparent !important;
  }
  .wd-input__inner {
    color: #262626 !important;
  }
}
</style>
