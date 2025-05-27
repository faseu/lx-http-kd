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
      <insurance />
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
          prop="passenger"
          v-model="model.passenger"
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
            <text style="color: #d8aa4f">{{ `¥ ${price}` }}</text>
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
import { reactive, ref } from 'vue'
import { httpPost } from '@/utils/http'
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
const leaderId = ref()
const price = ref(0)
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
const getRules = () => ({
  name: [{ required: true, message: '请输入姓名' }],
  id_card: [{ required: true, message: '请输入身份证号' }],
  phone: [{ required: true, message: '请输入手机号' }],
  license_plate: [
    {
      required: model.is_driver, // 每次动态取值
      message: '请填写车牌信息',
    },
  ],
})

const { run: joinTeam } = useRequest((e) => httpPost('/api/activity/team/join', e))
const { run: updateLeader } = useRequest((e) => httpPost('/api/activity/team/update_user', e))

onLoad((options) => {
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
    price.value = options.price
  }
  // uni.login({
  //   success: (res) => {
  //     console.log(res)
  //   },
  // })
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
    // 手动校验车牌号格式（如果不是在规则中做）
    if (model.is_driver && !/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{5}$/.test(model.license_plate)) {
      toast.show('请输入正确的车牌号，例如：渝A12345')
      return
    }
    const e = {
      ...model,
      team_id: id.value,
      car_photo: `${JSON.parse(model.fileList1[0].response).data},${JSON.parse(model.fileList2[0].response).data}`,
    }
    if (!model.is_driver) {
      delete e.car_photo
    }
    if (Number(localLeaderId) === Number(leaderId.value)) {
      await updateLeader(e)
      toast.show('已加入队伍！')
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    } else {
      await joinTeam(e)
      toast.show('已加入队伍！')
      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
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
  padding: 0 32rpx;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}

.content {
  padding: 20rpx;
  box-sizing: border-box;
  overflow-x: hidden;
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
