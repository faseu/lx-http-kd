<route lang="json5">
{
  style: {
    navigationBarTitleText: '聊天室',
  },
}
</route>
<!-- 聊天记录模式演示(vue)，加载更多聊天记录无闪动 -->
<!-- nvue的聊天记录模式中需要写@cellStyleChange="cellStyleChange"，如果需要兼容nvue和vue，请以nvue中写法为准，会自动兼容vue -->
<!-- 注意，此写法由于将列表倒置了，在iOS15以下和部分较低版本安卓中可能出现列表无法滚动的问题，此时建议使用z-paging 2.7.0以下的版本及写法 -->
<template>
  <view class="content">
    <!-- use-chat-record-mode：开启聊天记录模式 -->
    <!-- safe-area-inset-bottom：开启底部安全区域适配 -->
    <!-- bottom-bg-color：设置slot="bottom"容器的背景色，这里设置为和chat-input-bar的背景色一致 -->
    <z-paging
      ref="paging"
      v-model="dataList"
      use-chat-record-mode
      safe-area-inset-bottom
      bottom-bg-color="#f8f8f8"
      @query="queryList"
      @keyboardHeightChange="keyboardHeightChange"
      @hidedKeyboard="hidedKeyboard"
    >
      <!-- 顶部提示文字 -->
      <!-- #ifdef H5 || MP-BAIDU || MP-TOUTIAO -->
      <template #top>
        <view class="header">
          由于在H5、百度小程序、抖音小程序、飞书小程序中无法监听键盘高度变化，底部输入框切换时可能会有些bug，请运行在其他平台体验最佳效果
        </view>
      </template>
      <!-- #endif -->

      <!-- for循环渲染聊天记录列表 -->
      <view v-for="(item, index) in dataList" :key="index" style="position: relative">
        <!-- 如果要给聊天item添加长按的popup，请在popup标签上写style="transform: scaleY(-1);"，注意style="transform: scaleY(-1);"不要写在最外层，否则可能导致popup被其他聊天item盖住 -->
        <!-- <view class="popup" style="transform: scaleY(-1);">popUp</view> -->

        <!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置 -->
        <!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
        <view style="transform: scaleY(-1)">
          <chat-item :item="item"></chat-item>
        </view>
      </view>
      <!-- 底部聊天输入框 -->
      <template #bottom>
        <chat-input-bar ref="inputBar" @send="doSend" @sendImage="doSendImage" />
      </template>
    </z-paging>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import ChatInputBar from '@/components/chat-input-bar/index.vue'
import ChatItem from '@/components/chat-item/index.vue'
import { useUserStore, useWebSocketStore } from '@/store'

const wsStore = useWebSocketStore()
const id = ref(null)
const paging = ref(null)
const inputBar = ref(null)
const lastMessageId = ref(null)
// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
const dataList = ref([])
const userStore = useUserStore()
const {
  user_info: { id: userId },
  token,
} = userStore.userInfo

onLoad((options) => {
  id.value = options.id
  // paging.value.reload()
  if (token) {
    // wsStore.initWebSocket(`wss://api.kuaida.fun/ws/chat?token=${token}`)
    wsStore.initWebSocket(`wss://api.chuanshanzhixing.cn/ws/chat?token=${token}`)
    console.log(wsStore)
    wsStore.addMessageListener(handleMessage)
  } else {
  }
})
onUnload(() => {
  wsStore.removeMessageListener(handleMessage)
})
// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
const queryList = (pageNo, pageSize) => {
  // 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
  // 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
  // 模拟请求服务器获取分页数据，请替换成自己的网络请求
  let data = {
    command: 'get_history',
    page: pageNo,
    page_size: pageSize,
    group_id: id.value,
    chat_type: 'team',
  }
  if (lastMessageId.value) {
    data = {
      ...data,
      last_message_id: lastMessageId.value,
    }
  }
  wsStore.sendMessage(data)
}

// 监听键盘高度改变，请不要直接通过uni.onKeyboardHeightChange监听，否则可能导致z-paging内置的键盘高度改变监听失效（如果不需要切换表情面板则不用写）
const keyboardHeightChange = (res) => {
  inputBar.value.updateKeyboardHeightChange(res)
}

// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
const hidedKeyboard = () => {
  inputBar.value.hidedKeyboard()
}

// 发送文本消息
const doSend = (msg) => {
  uni.showLoading({
    title: '发送中...',
  })
  wsStore.sendMessage({
    type: 'chat_message', // 发送消息时要包含 `type` 必传
    content: msg,
    msg_type: 'text', // 消息类型 可选：text, image, audio, video
    media_url: '', // 如果是 image, audio, video 类型，则 必传
    command: 'send_message', // 添加 command 字段
    team_id: id.value,
    chat_type: 'team',
  })
  setTimeout(() => {
    uni.hideLoading()
  }, 500)
}

// 发送图片消息
const doSendImage = (imageData) => {
  console.log('发送图片:', imageData)

  wsStore.sendMessage({
    type: 'chat_message',
    content: imageData.url, // 使用上传后的URL作为内容
    msg_type: 'image', // 消息类型为图片
    media_url: imageData.url, // 图片URL
    command: 'send_message',
    team_id: id.value,
    chat_type: 'team',
  })
}

const handleMessage = (msg) => {
  console.log('组件中收到消息:', msg)
  if (msg.type === 'history' && Number(msg.team_id) === Number(id.value)) {
    if (!lastMessageId.value) {
      lastMessageId.value = msg?.messages[0]?.id
    }
    const messageList = msg?.messages?.map((item) => ({
      time: item?.timestamp,
      icon: item?.sender?.avatar,
      name: item?.sender?.username,
      content: item?.msg_type === 'image' ? item?.media_url : item?.content,
      type: item?.msg_type || 'text', // 添加消息类型
      isMe: item?.sender?.id === userId,
    }))
    console.log(messageList)
    paging?.value?.complete(messageList)
  }
  if (msg.type === 'broadcast_message' && Number(msg.team_id) === Number(id.value)) {
    const message = {
      time: msg?.timestamp,
      icon: msg?.sender?.avatar,
      name: msg?.sender?.username,
      content: msg?.msg_type === 'image' ? msg?.media_url : msg?.content,
      type: msg?.msg_type || 'text', // 添加消息类型
      isMe: msg?.sender?.id === userId,
    }
    paging?.value?.addChatRecordData(message)
  }
}
</script>

<style scoped>
.header {
  background-color: red;
  font-size: 20rpx;
  padding: 20rpx;
  color: white;
}
.popup {
  position: absolute;
  top: -20px;
  height: 200rpx;
  width: 400rpx;
  background-color: red;
  z-index: 1000;
}
</style>
