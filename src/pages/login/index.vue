<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '登录',
  },
}
</route>
<template>
  <view
    class="bg-[#ccc] w-[100vw] h-[100vh] pos-relative flex flex-col justify-between items-center pt-204rpx pb-320rpx box-border"
  >
    <view class="flex flex-col items-center">
      <wd-img custom-class="w-200rpx h-200rpx" mode="widthFix" src="/static/logo.svg" />
      <wd-img
        custom-class="w-414rpx h-96rpx mt-72rpx"
        mode="widthFix"
        src="/static/images/login/hello.png"
      />
    </view>
    <view class="flex flex-col items-center">
      <wd-button
        custom-class="get-phone-button"
        :open-type="read ? 'getPhoneNumber' : ''"
        @click="handleLogin"
        @getphonenumber="handleGetPhoneNumber"
      >
        <view
          class="w-614rpx h-100rpx pos-relative bg-white rounded-50rpx flex justify-center items-center"
        >
          <wd-img
            custom-class="w-full h-full pos-absolute"
            mode="widthFix"
            :src="read ? '/static/images/login/login-button.png' : ''"
          />
          <view class="font-700 text-28rpx pos-absolute">
            <text :class="read ? 'color-[#333]' : 'color-[#9f9f9f]'">一键授权登录</text>
          </view>
        </view>
      </wd-button>

      <view class="flex items-center mt-30rpx text-24rpx color-[#000]" @click="goToHome">
        跳过登录>>
      </view>

      <view class="pos-absolute bottom-[48rpx] flex items-center mt-30rpx">
        <wd-img
          @click="handleReadAgreement"
          custom-class="w-28rpx h-28rpx mr-6rpx"
          mode="widthFix"
          :src="
            read
              ? '/static/images/common/select-circle-active.png'
              : '/static/images/common/select-circle.png'
          "
        />
        <view class="color-white text-24rpx">
          <text>我已阅读并同意</text>
          <text class="underline">《用户协议》</text>
          <text>和</text>
          <text class="underline">《隐私政策》</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="js">
import { useToast } from 'wot-design-uni'
import { httpPost } from '@/utils/http'
import { useUserStore } from '@/store'
import { generateRandomNickname } from '@/utils/nickname'
const userStore = useUserStore()
const read = ref(true)
const toast = useToast()
const { run: getOpenid } = useRequest((e) => httpPost('/api/get_openid', e))
const { run: runSetUserinfo } = useRequest((e) => httpPost('/api/get_user', { ...e }))

const { run: runGetUserInfo } = useRequest((e) =>
  httpPost('/api/wechat_login', {
    ...e,
  }),
)

const handleReadAgreement = () => {
  read.value = !read.value
}

const handleLogin = () => {
  if (!read.value) {
    toast.show({
      position: 'top',
      msg: '请阅读用户协议',
    })
  }
  // uni.navigateTo({
  //   url: '/pages/userSettings/index',
  // })
}
const handleGetPhoneNumber = async (e) => {
  console.log(e)
  const data = await runGetUserInfo({
    loginCode: e.code,
    encryptedData: e.encryptedData,
    iv: e.iv,
  })
  userStore.setUserInfo(JSON.parse(JSON.stringify(data)))
  const { code } = await uni.login()
  const { openid: tempOpenid } = await getOpenid({ code })
  await runSetUserinfo({
    avatar:
      'https://kuaida-1348792525.cos.ap-chengdu.myqcloud.com/uploads/image/34f63803-46a0-43d5-a457-68f435ae511b.png',
    nickname: generateRandomNickname(),
    openid: tempOpenid,
  })
  if (!data.is_new_user) {
    uni.navigateTo({
      url: '/pages/userSettings/index',
    })
  } else {
    uni.switchTab({
      url: '/pages/home/index',
    })
  }
}

const goToHome = (id) => {
  uni.switchTab({
    url: '/pages/home/index',
  })
}
</script>

<style lang="scss">
.get-phone-button {
  width: 614rpx !important;
  height: 100rpx !important;
  padding: 0;
}
</style>
