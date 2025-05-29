<route lang="json5">
{
  style: {
    navigationBarTitleText: '个人资料',
  },
}
</route>

<template>
  <view class="main_container">
    <wd-toast />
    <view>
      <wd-form ref="form" :model="model" errorType="toast" :rules="getRules()">
        <view class="text-28rpx font-bold p-10rpx pb-24rpx">基本设置</view>

        <wd-cell-group border custom-class="rounded-20rpx overflow-hidden">
          <wd-cell title="头像">
            <wd-button
              type="text"
              open-type="chooseAvatar"
              custom-class="diy-button"
              @chooseavatar="onChooseAvatar"
            >
              <template>
                <image
                  class="w-80rpx h-80rpx mr-12rpx rounded-50%"
                  :src="model.avatar || 'https://temp.im/166x166'"
                />
                <wd-icon name="arrow-right" color="rgba(0, 0, 0, 0.25)" size="32rpx"></wd-icon>
              </template>
            </wd-button>
          </wd-cell>
          <wd-input
            type="nickname"
            label="昵称"
            label-width="100px"
            :maxlength="20"
            prop="nickname"
            v-model="model.nickname"
            placeholder="请输入昵称"
          />
          <wd-picker
            label="性别"
            placeholder="请选择性别"
            label-width="100px"
            prop="gender"
            v-model="model.gender"
            :columns="genderList"
          />
        </wd-cell-group>

        <view class="text-28rpx font-bold px-10rpx m-[24rpx_0]">报名信息</view>

        <wd-cell-group border custom-class="rounded-20rpx overflow-hidden">
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
            prop="phone_number"
            v-model="model.phone_number"
            placeholder="请输入联系电话"
          />
          <wd-input
            label="紧急联系人"
            label-width="100px"
            :maxlength="20"
            prop="urgent_name"
            v-model="model.urgent_name"
            placeholder="请输入紧急联系人"
          />
          <wd-input
            label="紧急联系人电话"
            type="number"
            label-width="100px"
            :maxlength="11"
            prop="urgent_phone"
            v-model="model.urgent_phone"
            placeholder="请输入紧急联系人电话"
          />
        </wd-cell-group>

        <wd-gap bg-color="#F6F8FA" safe-area-bottom height="150rpx"></wd-gap>

        <view class="footer">
          <view class="flex items-center text-20rpx h-120rpx">
            <wd-button
              custom-style="flex: 1; background-color: #000000 !important;"
              type="primary"
              size="large"
              @click="handleSubmit"
              block
            >
              保存
            </wd-button>
          </view>
          <wd-gap bg-color="#FFFFFF" safe-area-bottom height="0"></wd-gap>
        </view>
      </wd-form>
    </view>
  </view>
</template>

<script lang="js" setup>
import { reactive, ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import { httpGet, httpPost } from '@/utils/http'
import { getIsTabbar, getEnvBaseUrl } from '@/utils'
import { useToast } from 'wot-design-uni'

const toast = useToast()

// 性别选项
const genderList = ref([
  { label: '男', value: 1 },
  { label: '女', value: 2 },
  { label: '保密', value: 3 },
])

// 请求用户信息
const { data: userInfo, run: runGetUserInfo } = useRequest(() => httpGet('/api/get_user'))
// 更新用户信息
const { run: runUpdateUserInfo } = useRequest((data) => httpPost('/api/update_user', data))

const form = ref()

// 表单数据模型
const model = reactive({
  avatar: '',
  nickname: '',
  gender: '',
  name: '',
  id_card: '',
  phone_number: '',
  urgent_name: '',
  urgent_phone: '',
})

// 表单验证规则
const getRules = () => ({
  nickname: [
    { required: true, message: '请输入昵称' },
    { min: 2, max: 20, message: '昵称长度为2-20个字符' },
  ],
  gender: [{ required: true, message: '请选择性别' }],
  name: [
    { required: true, message: '请输入姓名' },
    { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '请输入2-10位中文姓名' },
  ],
  id_card: [
    { required: true, message: '请输入身份证号码' },
    { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入有效的身份证号码' },
  ],
  phone_number: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
  ],
  urgent_name: [
    { required: true, message: '请输入紧急联系人' },
    { pattern: /^[\u4e00-\u9fa5]{2,10}$/, message: '请输入2-10位中文姓名' },
  ],
  urgent_phone: [
    { required: true, message: '请输入紧急联系人电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
  ],
})

// 头像选择处理
const onChooseAvatar = ({ avatarUrl }) => {
  uni.showLoading({
    title: '上传中...',
    mask: true,
  })

  uni.uploadFile({
    url: getEnvBaseUrl() + '/api/image/upload',
    filePath: avatarUrl,
    name: 'file',
    formData: {},
    success: (uploadFileRes) => {
      uni.hideLoading()
      try {
        const response = JSON.parse(uploadFileRes.data)
        if (response.code === 200 || response.data) {
          const uploadedUrl = response.data || response.url
          model.avatar = uploadedUrl
          toast.show('头像上传成功')
        } else {
          throw new Error('上传失败')
        }
      } catch (error) {
        console.error('头像上传失败:', error)
        toast.show('头像上传失败，请重试')
      }
    },
    fail: (err) => {
      uni.hideLoading()
      console.error('头像上传失败:', err)
      toast.show('头像上传失败，请重试')
    },
  })
}

// 提交表单
const handleSubmit = async () => {
  try {
    const { valid, errors } = await form.value.validate()

    if (valid) {
      await runUpdateUserInfo(model)
      toast.show('保存成功')

      // 延迟返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      console.log('表单验证失败:', errors)
    }
  } catch (error) {
    console.error('保存失败:', error)
    toast.show('保存失败，请重试')
  }
}

// 初始化数据
const initUserData = () => {
  if (userInfo.value) {
    Object.keys(model).forEach((key) => {
      if (userInfo.value[key] !== undefined) {
        model[key] = userInfo.value[key]
      }
    })
  }
}

onLoad(async () => {
  try {
    await runGetUserInfo()
    initUserData()
  } catch (error) {
    console.error('获取用户信息失败:', error)
    toast.show('获取用户信息失败')
  }
})

onShow(async () => {
  if (getIsTabbar()) {
    uni?.hideTabBar()
  }
})
</script>

<style scoped lang="scss">
.main_container {
  width: 100vw;
  min-height: 100vh;
  box-sizing: border-box;
  background: #f6f8fa;
  padding: 0 30rpx;
  color: #333;
}

.footer {
  padding: 0 40rpx;
  box-sizing: border-box;
  width: 100%;
  background: #f6f8fa;
  position: fixed;
  bottom: 0;
  left: 0;
}

:deep() {
  .diy-button {
    width: 124rpx !important;
    height: 80rpx !important;
    padding: 0 !important;
    background: transparent !important;
  }
  .wd-cell__wrapper {
    align-items: center !important;
  }
  .wd-input__placeholder {
    color: #bfbfbf !important;
  }
}
</style>
