<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '消息',
  },
}
</route>
<template>
  <view class="w-[100vw] h-[100vh] pos-relative flex flex-col items-center box-border">
    <wd-img
      mode="aspectFill"
      custom-style="position: absolute !important;"
      custom-class="pos-absolute top-0 left-0 w-[100vw] h-[100vh]"
      src="/static/images/common/bg1.png"
    />
    <view
      class="pos-absolute top-0 left-0 w-[100vw] h-[100vh] box-border pt-180rpx flex flex-col items-center"
    >
      <view class="flex w-full h-150rpx">
        <view class="flex-1 h-150rpx pos-relative" @click="tab = 1">
          <wd-img
            mode="aspectFill"
            custom-style="position: absolute !important;"
            custom-class="pos-absolute top-0 left-0 w-full h-full"
            :src="
              tab === 1
                ? '/static/images/message/public-h.png'
                : '/static/images/message/public-l.png'
            "
          />
        </view>
        <view class="flex-1 h-150rpx pos-relative" @click="tab = 2">
          <wd-img
            mode="aspectFill"
            custom-style="position: absolute !important;"
            custom-class="pos-absolute top-0 left-0 w-full h-full"
            :src="
              tab === 1
                ? '/static/images/message/private-l.png'
                : '/static/images/message/private-h.png'
            "
          />
        </view>
      </view>
      <view class="flex-1 w-full bg-[#F6FDFF]">
        <wd-cell-group border>
          <wd-cell
            v-for="(item, index) in wsStore.groups"
            :title="item.group_name"
            :value="formatChatTime(item.last_active)"
            :label="item.last_message.content"
            :key="item.group_id"
            is-link
            @click="goToChatRoom(item.group_id)"
          >
            <template #icon>
              <view class="cell-icon">
                <wd-badge :modelValue="item.unread_count">
                  <image
                    mode="aspectFill"
                    class="w-96rpx h-96rpx"
                    src="/static/images/message/bell.png"
                  />
                </wd-badge>
              </view>
            </template>
          </wd-cell>
        </wd-cell-group>
      </view>
    </view>
    <tabbar :selected="3" />
  </view>
</template>

<script setup lang="js">
import { httpGet, httpPost } from '@/utils/http'
import { onShow, onLoad } from '@dcloudio/uni-app'
import tabbar from '@/components/tabbar/index.vue'
import { useUserStore, useWebSocketStore } from '@/store'
import { formatChatTime } from '@/utils/utils'

const tab = ref(1)

const userStore = useUserStore()
const { token } = userStore.userInfo
const { run: runGetChatList } = useRequest((e) => httpGet('/api/groups/my'))
const { run: runJoinChatList } = useRequest((e) => httpPost('/api/groups/join', { group_id: 1 }))

const wsStore = useWebSocketStore()

const handleJoinChat = () => {
  runJoinChatList()
}

onShow(async () => {
  uni?.hideTabBar()
  if (token) {
    // wsStore.initWebSocket(`ws://1.14.59.102:8000/ws/chat?token=${token}`)
    // console.log(wsStore.groups)
  }
})

const goToChatRoom = (id) => {
  uni.navigateTo({ url: `/pages/chatRoom/index?id=${id}` })
}
</script>

<style lang="scss">
.get-phone-button {
  width: 614rpx !important;
  height: 100rpx !important;
  padding: 0;
}
:deep() {
  .wd-cell__right {
    width: 100rpx !important;
    flex: none !important;
  }
  .wd-cell__value {
    font-size: 24rpx !important;
    color: #969699 !important;
  }
  .wd-cell__title {
    font-size: 32rpx !important;
    margin-left: 30rpx;
  }
  .wd-cell__wrapper {
    padding: 32rpx 32rpx 32rpx 0 !important;
  }
  .wd-cell__arrow-right {
    display: none !important;
  }
}
</style>
