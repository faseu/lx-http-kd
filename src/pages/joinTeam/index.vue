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
      <insurance :insurance-list="insuranceList" @insuranceChange="handleInsuranceChange" />

      <!-- 显示当前选中的保险信息 -->
      <view class="insurance-info">
        <view class="info-item">
          <text class="label">已选保险：</text>
          <text class="value">{{ selectedInsurance.name }}</text>
        </view>
        <view class="info-item">
          <text class="label">保险费用：</text>
          <text class="value price">￥{{ selectedInsurance.price }}/人</text>
        </view>
        <view class="info-item">
          <text class="label">保障金额：</text>
          <text class="value">{{ selectedInsurance.coverage }}万元</text>
        </view>
      </view>

      <view>
        <driverItem bg="#f6f8fa" />
        <driverItem bg="#f6f8fa" />
      </view>

      <wd-cell-group title="当车主">
        <template #value>
          <div class="w-full flex items-center justify-between">
            <text class="color-[#999] text-24rpx">（车费过路费等车主不A，其余队员AA）</text>
            <wd-switch v-model="model.is_driver" size="24px" />
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
  user_info: { id: localLeaderId },
} = userStore.userInfo

const form = ref()
const visible = ref(false)
const id = ref()
const openid = ref(null)
const leaderId = ref()
const basePrice = ref(0) // 队伍基础费用
const insuranceList = ref([]) // 保险列表
const loading = ref(false)

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
  is_driver: true,
  license_plate: '',
  fileList1: [],
  fileList2: [],
  read: false,
})

// 计算总价格（基础费用 + 保险费用）
const totalPrice = computed(() => {
  return (parseFloat(basePrice.value) + parseFloat(selectedInsurance.value.price)).toFixed(2)
})

const getRules = () => ({
  name: [{ required: true, message: '请输入姓名' }],
  id_card: [{ required: true, message: '请输入身份证号' }],
  phone: [{ required: true, message: '请输入手机号' }],
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

// 处理保险选择变化
const handleInsuranceChange = (insuranceData) => {
  console.log('选中保险:', insuranceData)
  selectedInsurance.value = insuranceData
  toast.show(`已选择${insuranceData.name}，保费￥${insuranceData.price}/人`)
}

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

const { run: joinTeam } = useRequest((e) => httpPost('/api/pay', e))
const { run: updateLeader } = useRequest((e) => httpPost('/api/activity/team/update_user', e))
const { run: getInsuranceList } = useRequest((e) => httpGet('/api/insurance_list', e))
const { run: getOpenid } = useRequest((e) => httpPost('/api/get_openid', e))
const { run: cancelPay } = useRequest((e) => httpPost('/api/pay/cancel', e))

// 获取保险列表
const fetchInsuranceList = async () => {
  try {
    const result = await getInsuranceList()
    insuranceList.value = result?.data?.list || []
    console.log('获取到的保险列表:', insuranceList.value)

    // 如果有保险数据，设置默认选中第一个
    if (insuranceList.value.length > 0) {
      const firstInsurance = insuranceList.value[0]
      selectedInsurance.value = {
        id: firstInsurance.id,
        type: firstInsurance.id.toString(),
        name: firstInsurance.name,
        price: parseFloat(firstInsurance.price),
        coverage: parseFloat(firstInsurance.hurt_coverage) / 10000, // 转换为万元
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
  const { code } = await uni.login()
  const {
    data: { openid: tempOpenid },
  } = await getOpenid({ code })
  console.log(tempOpenid)
  openid.value = tempOpenid
  // 获取保险列表
  await fetchInsuranceList()
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
    // 手动校验车牌号格式
    if (model.is_driver && !/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{5}$/.test(model.license_plate)) {
      toast.show('请输入正确的车牌号，例如：渝A12345')
      return
    }

    const submitData = {
      ...model,
      team_id: id.value,
      openid: openid.value,
      insurance_id: selectedInsurance.value.id, // 只需要保险ID
      privacy_agreement: model.read, // 只需要保险ID
    }

    // 如果是车主，添加车辆照片
    if (model.is_driver) {
      submitData.car_photo = `${JSON.parse(model.fileList1[0].response).data},${JSON.parse(model.fileList2[0].response).data}`
    }

    console.log('提交数据:', submitData)

    try {
      if (Number(localLeaderId) === Number(leaderId.value)) {
        await updateLeader(submitData)
        toast.show('队长信息更新成功！')
      } else {
        const { data: payData } = await joinTeam(submitData)
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
          },
          fail: (err) => {
            cancelPay({ order_id: payData.order_id })
            uni.showToast({ title: '支付失败', icon: 'none' })
          },
        })
      }

      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
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

// 保险信息显示样式
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
