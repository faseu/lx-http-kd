<!-- z-paging聊天item -->

<template>
  <view class="chat-item">
    <text class="chat-time" v-if="item.time && item.time.length">
      {{ item.time }}
    </text>
    <view :class="{ 'chat-container': true, 'chat-location-me': item.isMe }">
      <view class="chat-icon-container">
        <image class="chat-icon" :src="item.icon" mode="aspectFill" />
      </view>
      <view class="chat-content-container">
        <text :class="{ 'chat-user-name': true, 'chat-location-me': item.isMe }">
          {{ item.name }}
        </text>
        <view
          class="chat-text-container-super"
          :style="[{ justifyContent: item.isMe ? 'flex-end' : 'flex-start' }]"
        >
          <!-- 文本消息 -->
          <view
            v-if="item.type !== 'image'"
            :class="{ 'chat-text-container': true, 'chat-text-container-me': item.isMe }"
          >
            <text :class="{ 'chat-text': true, 'chat-text-me': item.isMe }">
              {{ item.content }}
            </text>
          </view>

          <!-- 图片消息 -->
          <view
            v-else
            :class="{ 'chat-image-container': true, 'chat-image-container-me': item.isMe }"
            @click="previewImage"
          >
            <image
              class="chat-image"
              :src="item.content"
              mode="aspectFill"
              @load="onImageLoad"
              @error="onImageError"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'chat-item',
  props: {
    item: {
      type: Object,
      default: function () {
        return {
          time: '',
          icon: '',
          name: '',
          content: '',
          type: 'text', // 消息类型：text, image
          isMe: false,
        }
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    // 预览图片
    previewImage() {
      if (this.item.type === 'image') {
        uni.previewImage({
          current: this.item.content,
          urls: [this.item.content],
          fail: (err) => {
            console.error('预览图片失败:', err)
            uni.showToast({
              title: '图片加载失败',
              icon: 'none',
            })
          },
        })
      }
    },

    // 图片加载成功
    onImageLoad(e) {
      console.log('图片加载成功:', e)
    },

    // 图片加载失败
    onImageError(e) {
      console.error('图片加载失败:', e)
    },
  },
}
</script>

<style scoped>
.chat-item {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}
.chat-time {
  padding: 4rpx 0rpx;
  text-align: center;
  font-size: 22rpx;
  color: #aaaaaa;
}
.chat-container {
  display: flex;
  flex-direction: row;
}
.chat-location-me {
  flex-direction: row-reverse;
  text-align: right;
}
.chat-icon-container {
  margin-top: 12rpx;
}
.chat-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #eeeeee;
}
.chat-content-container {
  margin: 0rpx 15rpx;
}
.chat-user-name {
  font-size: 26rpx;
  color: #888888;
}
.chat-text-container {
  text-align: left;
  background-color: #f1f1f1;
  border-radius: 8rpx;
  padding: 10rpx 15rpx;
  margin-top: 10rpx;
  /* #ifndef APP-NVUE */
  max-width: 500rpx;
  /* #endif */
}
.chat-text-container-me {
  background-color: #007aff;
}

/* 图片容器样式 */
.chat-image-container {
  margin-top: 10rpx;
  border-radius: 8rpx;
  overflow: hidden;
  /* #ifndef APP-NVUE */
  max-width: 400rpx;
  /* #endif */
  background-color: #f1f1f1;
}
.chat-image-container-me {
  background-color: transparent;
}

/* 图片样式 */
.chat-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  /* #ifdef APP-NVUE */
  max-width: 400rpx;
  /* #endif */
}

.chat-text-container-super {
  display: flex;
  flex-direction: row;
}
.chat-text {
  font-size: 28rpx;
  /* #ifndef APP-NVUE */
  word-break: break-all;
  /* #endif */
  /* #ifdef APP-NVUE */
  max-width: 500rpx;
  /* #endif */
}
.chat-text-me {
  color: white;
}
</style>
