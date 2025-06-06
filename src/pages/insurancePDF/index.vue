<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '',
  },
}
</route>

<template>
  <view class="main">
    <view class="bg_box">
      <image src="/static/images/common/bg2.png" />
    </view>
    <image
      class="pos-absolute top-64rpx left-340rpx w-224rpx h-200rpx"
      src="/static/images/common/plane.png"
    />
    <image
      class="pos-absolute top-222rpx right-20rpx w-322rpx h-266rpx"
      src="/static/images/common/shield.png"
    />
    <wd-navbar
      safeAreaInsetTop
      custom-style="background-color: transparent !important; z-index: 99"
      title="保险方案详情"
      left-arrow
      @click-left="goBack"
    />
    <view class="w-full">
      <view class="pos-relative h-88rpx inline-block mt-40rpx ml-32rpx">
        <wd-img
          mode="aspectFill"
          custom-style="position: absolute !important;"
          custom-class="pos-absolute right-52rpx bottom-0 w-184rpx h-46rpx"
          src="/static/images/userSettings/decoration.png"
        />
        <view class="font-900 text-72rpx leading-86rpx pos-relative">保险条款</view>
      </view>
      <view class="pos-relative mt-20rpx ml-36rpx text-28rpx color-[#666]">
        <view>以下为保险产品介绍、可一</view>
        <view>键查阅全面信息</view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="flex justify-center items-center mt-100rpx">
      <wd-loading type="spinner" />
      <text class="ml-20rpx">加载中...</text>
    </view>

    <!-- 保险列表 -->
    <view class="file-list">
      <view
        v-for="(file, index) in fileList"
        :key="index"
        class="file-item"
        @click="openPdfFile(file)"
      >
        <view class="file-icon">
          <wd-icon name="file-pdf" size="40rpx" color="#FF4D4F" />
        </view>
        <view class="file-info">
          <view class="file-name">{{ file.file_name || `保险条款${index + 1}.pdf` }}</view>
        </view>
        <view class="file-arrow">
          <wd-icon name="arrow-right" size="32rpx" color="#C8C9CC" />
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="fileList.length === 0" class="empty-state">
      <wd-icon name="file-text" size="100rpx" color="#C8C9CC" />
      <view class="empty-text">暂无保险条款文件</view>
    </view>

    <!-- 底部提示 -->
    <view class="footer-tip">
      <wd-icon name="info" size="28rpx" color="#999" />
      <text class="tip-text">点击文件即可查看详细内容</text>
    </view>

    <!-- 加载提示 -->
    <wd-loading v-if="loading" type="spinner" />
  </view>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useToast } from 'wot-design-uni'

const toast = useToast()

// 响应式数据
const loading = ref(false)
const fileList = ref([])
const insuranceName = ref('')
const insuranceData = ref(null)

// 页面加载时获取参数
onLoad((options) => {
  console.log('接收到的参数:', options)

  if (options.data) {
    try {
      // 解析传递过来的保险数据
      insuranceData.value = JSON.parse(decodeURIComponent(options.data))
      insuranceName.value = insuranceData.value.name || '保险条款'
      fileList.value = insuranceData.value.insurance_file || []

      console.log('解析后的保险数据:', insuranceData.value)
      console.log('文件列表:', fileList.value)
    } catch (error) {
      console.error('解析保险数据失败:', error)
      toast.show('数据解析失败')
    }
  }

  // 设置导航栏标题
  uni.setNavigationBarTitle({
    title: `${insuranceName.value} - 保险条款`,
  })
})

// 打开PDF文件
const openPdfFile = async (file) => {
  if (!file.file_url) {
    toast.show('文件链接无效')
    return
  }

  loading.value = true
  toast.show('正在加载文件...')

  try {
    // 下载文件
    const downloadResult = await uni.downloadFile({
      url: file.file_url,
      timeout: 30000, // 30秒超时
    })

    loading.value = false

    if (downloadResult[1].statusCode === 200) {
      // 文件下载成功，打开文件
      uni.openDocument({
        filePath: downloadResult[1].tempFilePath,
        showMenu: true,
        success: () => {
          console.log('PDF文件打开成功')
          toast.show('文件打开成功')
        },
        fail: (err) => {
          console.error('PDF文件打开失败:', err)
          handleFileOpenError(err, file)
        },
      })
    } else {
      console.error('文件下载失败, 状态码:', downloadResult[1].statusCode)
      toast.show(`文件下载失败，状态码: ${downloadResult[1].statusCode}`)
    }
  } catch (error) {
    loading.value = false
    console.error('下载文件时发生错误:', error)
    handleDownloadError(error, file)
  }
}

// 处理文件打开失败
const handleFileOpenError = (error, file) => {
  console.error('文件打开失败详情:', error)

  // 尝试其他打开方式
  uni.showModal({
    title: '文件打开失败',
    content: '是否尝试在浏览器中打开？',
    showCancel: true,
    confirmText: '在浏览器打开',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 在系统浏览器中打开
        uni.openDocument({
          filePath: file.file_url,
          showMenu: true,
          fail: () => {
            // 最后尝试：复制链接到剪贴板
            uni.setClipboardData({
              data: file.file_url,
              success: () => {
                toast.show('文件链接已复制到剪贴板')
              },
            })
          },
        })
      }
    },
  })
}

// 处理下载失败
const handleDownloadError = (error, file) => {
  let errorMessage = '文件下载失败'

  if (error.errMsg) {
    if (error.errMsg.includes('timeout')) {
      errorMessage = '下载超时，请检查网络连接'
    } else if (error.errMsg.includes('network')) {
      errorMessage = '网络连接失败'
    }
  }

  uni.showModal({
    title: '下载失败',
    content: `${errorMessage}，是否重试？`,
    showCancel: true,
    confirmText: '重试',
    cancelText: '复制链接',
    success: (res) => {
      if (res.confirm) {
        // 重试下载
        openPdfFile(file)
      } else {
        // 复制链接到剪贴板
        uni.setClipboardData({
          data: file.file_url,
          success: () => {
            toast.show('文件链接已复制到剪贴板')
          },
        })
      }
    },
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.main {
  position: relative;
  height: 100vh;
  font-size: 24rpx;
  color: #333333;
  padding: 0 20rpx;
  display: flex;
  flex-direction: column;

  .bg_box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    > image {
      width: 100%;
      height: 100%;
    }
  }

  .file-list {
    flex: 1;
    margin-top: 20rpx;
    position: relative;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    width: 100%;
    border-radius: 20rpx;
    background: linear-gradient(to bottom, #d9f5fd 76%, #ffffff 100%);
  }

  .file-item {
    display: flex;
    align-items: center;
    background: #f2f8fa;
    border-radius: 16rpx;
    padding: 30rpx 24rpx;
    box-sizing: border-box;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.08);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .file-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
  }

  .file-info {
    flex: 1;

    .file-name {
      font-size: 32rpx;
      font-weight: 500;
      color: #586b93;
      margin-bottom: 8rpx;
      line-height: 1.4;
    }
  }

  .file-arrow {
    margin-left: 16rpx;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 30rpx;

    .empty-text {
      font-size: 28rpx;
      color: #9ca3af;
      margin-top: 30rpx;
    }
  }

  .footer-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx 30rpx;

    .tip-text {
      font-size: 24rpx;
      color: #999;
      margin-left: 8rpx;
    }
  }
}

:deep() {
  .wd-navbar.is-border::after {
    display: none;
  }
  .wd-loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
}
</style>
