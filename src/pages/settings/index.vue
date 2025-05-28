<route lang="json5">
{
  style: {
    navigationBarTitleText: '个人资料',
  },
}
</route>

<template>
  <view class="main_container">
    <view>
      <wd-form ref="form" :model="model" errorType="toast">
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
                <image class="w-80rpx h-80rpx mr-12rpx" src="https://temp.im/166x166" />
                <wd-icon name="arrow-right" color="rgba(0, 0, 0, 0.25)" size="32rpx"></wd-icon>
              </template>
            </wd-button>
          </wd-cell>
          <wd-input
            type="nickname"
            label="昵称"
            label-width="100px"
            :maxlength="20"
            prop="name"
            v-model="model.name"
            placeholder="请输入昵称"
          />
          <wd-select-picker
            label="性别"
            placeholder="请选择性别"
            label-width="100px"
            prop="head"
            v-model="model.head"
            :columns="sexList"
          />
        </wd-cell-group>
        <view class="text-28rpx font-bold px-10rpx m-[24rpx_0]">报名信息</view>

        <wd-cell-group border>
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
          <wd-input
            label="紧急联系人"
            label-width="100px"
            :maxlength="20"
            prop="name"
            v-model="model.urgent_name"
            placeholder="请输入紧急联系人"
          />
          <wd-input
            label="紧急联系人电话"
            type="number"
            label-width="100px"
            :maxlength="11"
            prop="phone"
            v-model="model.urgent_phone"
            placeholder="请输入紧急联系人电话"
          />
        </wd-cell-group>
      </wd-form>
    </view>
  </view>
</template>

<script lang="js" setup>
import { reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { httpGet, httpPost } from '@/utils/http'
import { getIsTabbar, getEnvBaseUrl } from '@/utils'
import { sexList } from '@/utils/config'
const { run: runGetUserInfo } = useRequest((e) => httpGet('/api/get_user'))

const form = ref()

const model = reactive({})

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
      uni.setStorageSync('avatarUrl', avatarUrl)
      console.log(uploadFileRes, '')
      const url = JSON.parse(uploadFileRes.data).data
      this.avatarUrl = avatarUrl
      setTimeout(() => {
        console.log('this.baseURL前缀', this.baseURL)
        // this.actaimg=`${this.baseURL}${url}`
        console.log('我是转化后的头像', this.actaimg)
        this.weAvatar = url
      })
      console.log(avatarUrl, '成功')
    },
    fail: (err) => {
      uni.hideLoading()
      uni.showToast({
        title: '上传失败，请重试',
        icon: 'none',
      })
      console.log(err, '失败')
    },
  })
}

onShow(async () => {
  if (getIsTabbar()) {
    uni?.hideTabBar()
  }
  await runGetUserInfo()
})
</script>

<style scoped lang="scss">
.main_container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background: #f6f8fa;
  padding: 0 30rpx;
  color: #333;
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
