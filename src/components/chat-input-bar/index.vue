<!-- z-paging聊天输入框 -->

<template>
  <view class="chat-input-bar-container">
    <view class="chat-input-bar">
      <!-- 添加按钮 -->
      <view class="image-container" @click="toggleAddPanel">
        <wd-icon
          :name="addPanel ? 'keyboard-collapse' : 'add-circle'"
          size="54rpx"
          color="#999"
        ></wd-icon>
      </view>

      <view class="chat-input-container">
        <!-- :adjust-position="false"必须设置，防止键盘弹窗自动上顶，交由z-paging内部处理 -->
        <input
          :focus="focus"
          class="chat-input"
          v-model="msg"
          :adjust-position="false"
          confirm-type="send"
          type="text"
          placeholder="请输入内容"
          @confirm="sendClick"
          @focus="handleInputFocus"
        />
      </view>
      <!-- 表情图标（如果不需要切换表情面板则不用写） -->
      <view class="emoji-container">
        <image
          class="emoji-img"
          :src="`/static/${emojiType || 'emoji'}.png`"
          @click="emojiChange"
        />
      </view>
      <view
        :class="{ 'chat-input-send': true, 'chat-input-send-disabled': !sendEnabled }"
        @click="sendClick"
      >
        <text class="chat-input-send-text">发送</text>
      </view>
    </view>

    <!-- 表情面板 -->
    <view
      class="emoji-panel-container"
      :style="[{ height: emojiType === 'keyboard' ? '400rpx' : '0px' }]"
    >
      <scroll-view scroll-y style="height: 100%; flex: 1">
        <view class="emoji-panel">
          <text
            class="emoji-panel-text"
            v-for="(item, index) in emojisArr"
            :key="index"
            @click="emojiClick(item)"
          >
            {{ item }}
          </text>
        </view>
      </scroll-view>
    </view>

    <!-- 添加功能面板 -->
    <view class="add-panel-container" :style="[{ height: addPanel ? '400rpx' : '0px' }]">
      <view class="add-panel">
        <view class="add-panel-grid">
          <!-- 照片按钮 -->
          <view class="add-panel-item" @click="chooseImage">
            <view class="add-panel-icon">
              <wd-icon name="picture" size="48rpx" color="#4CAF50"></wd-icon>
            </view>
            <text class="add-panel-text">照片</text>
          </view>

          <!-- 拍照按钮 -->
          <view class="add-panel-item" @click="takePhoto">
            <view class="add-panel-icon">
              <wd-icon name="camera" size="48rpx" color="#2196F3"></wd-icon>
            </view>
            <text class="add-panel-text">拍照</text>
          </view>

          <!-- 可以添加更多功能按钮 -->
          <!-- <view class="add-panel-item" @click="chooseFile">
            <view class="add-panel-icon">
              <wd-icon name="folder" size="48rpx" color="#FF9800"></wd-icon>
            </view>
            <text class="add-panel-text">文件</text>
          </view> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'chat-input-bar',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      msg: '',
      // 表情数组
      emojisArr: [
        '😊',
        '😁',
        '😀',
        '😃',
        '😣',
        '😞',
        '😩',
        '😫',
        '😲',
        '😟',
        '😦',
        '😜',
        '😳',
        '😋',
        '😥',
        '😰',
        '🤠',
        '😎',
        '😇',
        '😉',
        '😭',
        '😈',
        '😕',
        '😏',
        '😘',
        '😤',
        '😡',
        '😅',
        '😬',
        '😺',
        '😻',
        '😽',
        '😼',
        '🙈',
        '🙉',
        '🙊',
        '🔥',
        '👍',
        '👎',
        '👌',
        '✌️',
        '🙏',
        '💪',
        '👻',
      ],
      // 当前input focus
      focus: false,
      // 当前表情/键盘点击后的切换类型
      emojiType: '',
      // 添加面板显示状态
      addPanel: false,
    }
  },
  computed: {
    sendEnabled() {
      return !this.disabled && this.msg.length
    },
  },
  methods: {
    // 切换添加面板
    toggleAddPanel() {
      this.addPanel = !this.addPanel
      // 关闭其他面板
      if (this.addPanel) {
        this.emojiType = ''
        this.focus = false
        uni.hideKeyboard()
      }
    },

    // 输入框获得焦点时关闭面板
    handleInputFocus() {
      this.addPanel = false
      this.emojiType = ''
    },

    // 从相册选择图片
    chooseImage() {
      this.selectImage(['album'])
    },

    // 拍照
    takePhoto() {
      this.selectImage(['camera'])
    },

    // 选择图片通用方法
    selectImage(sourceType) {
      this.addPanel = false // 关闭面板

      uni.chooseImage({
        count: 1, // 最多可以选择的图片张数
        sizeType: ['compressed'], // 压缩图，降低文件大小
        sourceType, // 图片来源
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          this.uploadImage(tempFilePath)
        },
        fail: (err) => {
          console.error('选择图片失败:', err)
          uni.showToast({
            title: '选择图片失败',
            icon: 'none',
          })
        },
      })
    },

    // 上传图片
    uploadImage(filePath) {
      uni.showLoading({
        title: '上传中...',
      })

      uni.uploadFile({
        url: '/api/image/upload', // 你的图片上传接口
        filePath,
        name: 'file',
        success: (uploadRes) => {
          uni.hideLoading()
          try {
            const response = JSON.parse(uploadRes.data)
            if (response.code === 200) {
              // 上传成功，发送图片消息
              this.$emit('sendImage', {
                type: 'image',
                url: response.data,
                filePath,
              })
              uni.showToast({
                title: '图片发送成功',
                icon: 'success',
              })
            } else {
              throw new Error(response.message || '上传失败')
            }
          } catch (error) {
            console.error('解析上传结果失败:', error)
            uni.showToast({
              title: '上传失败',
              icon: 'none',
            })
          }
        },
        fail: (error) => {
          uni.hideLoading()
          console.error('上传图片失败:', error)
          uni.showToast({
            title: '上传失败',
            icon: 'none',
          })
        },
      })
    },

    // 更新了键盘高度
    updateKeyboardHeightChange(res) {
      if (res.height > 0) {
        // 键盘展开，关闭其他面板
        this.emojiType = 'emoji'
        this.addPanel = false
      }
    },

    // 用户尝试隐藏键盘
    hidedKeyboard() {
      if (this.emojiType === 'keyboard') {
        this.emojiType = ''
      }
      if (this.addPanel) {
        this.addPanel = false
      }
    },

    // 点击了切换表情面板/键盘
    emojiChange() {
      this.$emit('emojiTypeChange', this.emojiType)
      // 关闭添加面板
      this.addPanel = false

      if (this.emojiType === 'keyboard') {
        // 点击了键盘，展示键盘
        this.focus = true
      } else {
        // 点击了切换表情面板
        this.focus = false
        // 隐藏键盘
        uni.hideKeyboard()
      }
      this.emojiType = !this.emojiType || this.emojiType === 'emoji' ? 'keyboard' : 'emoji'
    },

    // 点击了某个表情，将其插入输入内容中
    emojiClick(text) {
      this.msg += text
    },

    // 点击了发送按钮
    sendClick() {
      if (!this.sendEnabled) return
      this.$emit('send', this.msg)
      this.msg = ''
    },
  },
}
</script>

<style scoped>
.chat-input-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: solid 1px #f5f5f5;
  background-color: #f8f8f8;
  padding: 10rpx 20rpx;
}

.image-container {
  width: 54rpx;
  height: 54rpx;
  margin: 10rpx 20rpx 10rpx 0rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-input-container {
  flex: 1;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  padding: 15rpx;
  background-color: white;
  border-radius: 10rpx;
}

.chat-input {
  flex: 1;
  font-size: 28rpx;
}

.emoji-container {
  width: 54rpx;
  height: 54rpx;
  margin: 10rpx 0rpx 10rpx 20rpx;
}

.emoji-img {
  width: 54rpx;
  height: 54rpx;
}

.chat-input-send {
  background-color: #007aff;
  margin: 10rpx 10rpx 10rpx 20rpx;
  border-radius: 10rpx;
  width: 110rpx;
  height: 60rpx;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
}

.chat-input-send-disabled {
  background-color: #bbbbbb;
}

.chat-input-send-text {
  color: white;
  font-size: 26rpx;
}

.emoji-panel-container,
.add-panel-container {
  background-color: #f8f8f8;
  overflow: hidden;
  transition-property: height;
  transition-duration: 0.15s;
  /* #ifndef APP-NVUE */
  will-change: height;
  /* #endif */
}

.emoji-panel {
  font-size: 30rpx;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  flex-wrap: wrap;
  padding-right: 10rpx;
  padding-left: 15rpx;
  padding-bottom: 10rpx;
}

.emoji-panel-text {
  font-size: 50rpx;
  margin-left: 15rpx;
  margin-top: 20rpx;
}

/* 添加面板样式 */
.add-panel {
  padding: 30rpx;
  height: 100%;
}

.add-panel-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 40rpx;
}

.add-panel-item {
  width: 120rpx;
  height: 120rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.add-panel-item:active {
  transform: scale(0.95);
  background-color: #f5f5f5;
}

.add-panel-icon {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}

.add-panel-text {
  font-size: 24rpx;
  color: #666;
  text-align: center;
}
</style>
