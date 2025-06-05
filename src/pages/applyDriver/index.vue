<route lang="json5">
{
  style: {
    navigationBarTitleText: '申请成为车主',
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="content">
    <wd-toast />
    <wd-form ref="form" :model="model" errorType="toast" :rules="getRules()">
      <wd-cell-group custom-class="group" title="车辆信息">
        <wd-input
          label="可载人数"
          type="number"
          label-width="100px"
          :maxlength="2"
          prop="car_seat_count"
          v-model="model.car_seat_count"
          placeholder="请输入可载人数"
        />
        <wd-input
          label="车牌号"
          label-width="100px"
          :maxlength="20"
          prop="license_plate"
          disabled
          v-model="model.license_plate"
          placeholder="请输入车牌号"
          @click="showCarKeyboard"
        />
      </wd-cell-group>

      <view class="mt-30rpx flex gap-20rpx">
        <wd-upload
          :limit="1"
          v-model:file-list="model.fileList1"
          action="/api/image/upload"
          @change="handleFileChange1"
          custom-class="mr-8rpx"
        >
          <view
            class="w-160rpx h-160rpx flex flex-col justify-center items-center bg-[#f6f8fa] text-[#B8B8B8] rounded-12rpx"
          >
            <wd-icon name="photo" size="22px"></wd-icon>
            <view class="text-24rpx">驾驶证</view>
          </view>
        </wd-upload>
        <wd-upload
          :limit="1"
          v-model:file-list="model.fileList2"
          action="/api/image/upload"
          @change="handleFileChange2"
        >
          <view
            class="w-160rpx h-160rpx flex flex-col justify-center items-center bg-[#f6f8fa] text-[#B8B8B8] rounded-12rpx"
          >
            <wd-icon name="photo" size="22px"></wd-icon>
            <view class="text-24rpx">行驶证</view>
          </view>
        </wd-upload>
      </view>

      <view class="tips">
        <view class="tip-item">
          <wd-icon name="info-fill" color="#FF8C28" size="16px"></wd-icon>
          <text>成为车主后，您将为队员提供出行服务</text>
        </view>
        <view class="tip-item">
          <wd-icon name="info-fill" color="#FF8C28" size="16px"></wd-icon>
          <text>根据队伍设置，车费将按照相应规则分摊</text>
        </view>
        <view class="tip-item">
          <wd-icon name="info-fill" color="#FF8C28" size="16px"></wd-icon>
          <text>请确保车辆状况良好，驾驶证件齐全有效</text>
        </view>
      </view>

      <wd-gap bg-color="#FFFFFF" safe-area-bottom height="150rpx"></wd-gap>

      <view class="footer bg-white">
        <view class="flex items-center text-20rpx h-120rpx">
          <wd-button
            custom-style="flex: 1; background-color: #4BD06E !important;"
            type="primary"
            size="large"
            @click="handleSubmit"
            block
          >
            提交申请
          </wd-button>
        </view>
        <wd-gap bg-color="#FFFFFF" safe-area-bottom height="0"></wd-gap>
      </view>
    </wd-form>

    <!-- 车牌键盘 -->
    <wd-keyboard v-model:visible="visible" mode="car" @input="onInputCar" @delete="onDeleteCar" />
  </view>
</template>

<script lang="js" setup>
import { reactive, ref } from 'vue'
import { httpPost } from '@/utils/http'
import { onLoad } from '@dcloudio/uni-app'
import { useToast } from 'wot-design-uni'

const toast = useToast()
const form = ref()
const visible = ref(false)
const teamId = ref(null)

const model = reactive({
  car_seat_count: '',
  license_plate: '',
  fileList1: [], // 驾驶证
  fileList2: [], // 行驶证
})

const { run: updateUserAsDriver } = useRequest((e) => httpPost('/api/team/update_user', e))

const getRules = () => ({
  car_seat_count: [
    { required: true, message: '请输入可载人数' },
    { pattern: /^[1-9]$/, message: '请输入1-9的数字' },
  ],
  license_plate: [
    { required: true, message: '请输入车牌号' },
    {
      pattern: /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z0-9]{5}$/,
      message: '请输入正确的车牌号格式，例如：渝A12345',
    },
  ],
})

onLoad(async (options) => {
  if (options.teamId) {
    teamId.value = options.teamId
  }
})

const showCarKeyboard = () => {
  visible.value = true
}

const onInputCar = (value) => {
  model.license_plate = `${model.license_plate}${value}`
}

const onDeleteCar = () => {
  model.license_plate = model.license_plate.slice(0, -1)
}

const handleFileChange1 = ({ fileList }) => {
  model.fileList1 = fileList
}

const handleFileChange2 = ({ fileList }) => {
  model.fileList2 = fileList
}

const goBack = () => {
  uni.navigateBack()
}

const handleSubmit = async () => {
  try {
    const { valid, errors } = await form.value.validate()

    if (!valid) {
      return
    }

    // 检查是否上传了驾驶证和行驶证
    if (!model.fileList1?.length || !model.fileList2?.length) {
      toast.show('请上传驾驶证和行驶证')
      return
    }

    // 检查图片是否上传成功
    const allSuccess1 = model.fileList1.every((item) => item.status === 'success')
    const allSuccess2 = model.fileList2.every((item) => item.status === 'success')

    if (!allSuccess1 || !allSuccess2) {
      toast.show('图片上传中，请稍后再试')
      return
    }

    uni.showLoading({ title: '提交中...' })

    // 构建提交数据
    const submitData = {
      team_id: teamId.value,
      is_driver: true,
      car_seat_count: parseInt(model.car_seat_count),
      license_plate: model.license_plate,
      car_photo: `${JSON.parse(model.fileList1[0].response).data},${JSON.parse(model.fileList2[0].response).data}`,
    }

    console.log('提交车主申请数据:', submitData)

    await updateUserAsDriver(submitData)

    uni.hideLoading()
    toast.show('车主申请提交成功，等待审核')

    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    console.error('提交车主申请失败:', error)
    toast.show('提交失败，请重试')
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 20rpx;
  box-sizing: border-box;
}

.tips {
  margin-top: 40rpx;
  padding: 24rpx;
  background: #fff9e6;
  border-radius: 12rpx;
  border-left: 4rpx solid #ff8c28;

  .tip-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16rpx;
    font-size: 24rpx;
    color: #666;

    &:last-child {
      margin-bottom: 0;
    }

    text {
      margin-left: 12rpx;
      line-height: 1.4;
    }
  }
}

.footer {
  padding: 0 40rpx;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
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
  .wd-input__placeholder {
    color: #bfbfbf !important;
  }
  .wd-input__inner {
    color: #262626 !important;
  }
  .wd-upload__preview {
    margin: 0 16rpx 12rpx 0 !important;
  }
  .wd-upload__preview:nth-child(4n) {
    margin: 0 !important;
  }
}
</style>
