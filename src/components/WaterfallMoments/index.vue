<template>
  <view class="waterfall-container">
    <!-- 加载状态 -->
    <view v-if="isCalculating && leftColumnData.length === 0" class="waterfall-loading">
      <view class="loading-skeleton" v-for="n in 6" :key="n">
        <view class="skeleton-image"></view>
        <view class="skeleton-content">
          <view class="skeleton-title"></view>
          <view class="skeleton-info">
            <view class="skeleton-avatar"></view>
            <view class="skeleton-name"></view>
            <view class="skeleton-like"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 瀑布流内容 -->
    <template v-else>
      <!-- 左列 -->
      <view class="waterfall-column">
        <view
          class="waterfall-item"
          v-for="item in leftColumnData"
          :key="item.id"
          @click="onItemClick(item)"
          :class="{ 'item-new': item.isNew }"
        >
          <view class="waterfall-image" :style="{ height: item.displayHeight + 'rpx' }">
            <image :src="item.cover_image" mode="aspectFill" />
          </view>
          <view class="waterfall-content">
            <view class="waterfall-title">{{ item.description || '精彩瞬间' }}</view>
            <view class="waterfall-info">
              <view class="waterfall-author">
                <image
                  class="author-avatar"
                  :src="item.uploader?.avatar || 'https://temp.im/64x64'"
                  mode="aspectFill"
                />
                <text class="author-name">{{ item.uploader?.nickname || '匿名用户' }}</text>
              </view>
              <view class="waterfall-likes" @click.stop="onLikeClick(item)">
                <image
                  class="like-icon"
                  :src="
                    item.is_liked
                      ? '/static/images/homepage/like.png'
                      : '/static/images/homepage/unlike.png'
                  "
                />
                <text class="like-count">{{ formatCount(item.likes_count || 0) }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 左列新增数据加载指示器 -->
        <view v-if="isCalculating && leftNewItems.length > 0" class="loading-more">
          <view
            class="loading-skeleton"
            v-for="n in Math.min(leftNewItems.length, 3)"
            :key="'left-' + n"
          >
            <view class="skeleton-image"></view>
            <view class="skeleton-content">
              <view class="skeleton-title"></view>
              <view class="skeleton-info">
                <view class="skeleton-avatar"></view>
                <view class="skeleton-name"></view>
                <view class="skeleton-like"></view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 右列 -->
      <view class="waterfall-column">
        <view
          class="waterfall-item"
          v-for="item in rightColumnData"
          :key="item.id"
          @click="onItemClick(item)"
          :class="{ 'item-new': item.isNew }"
        >
          <view class="waterfall-image" :style="{ height: item.displayHeight + 'rpx' }">
            <image :src="item.cover_image" mode="aspectFill" />
          </view>
          <view class="waterfall-content">
            <view class="waterfall-title">{{ item.title || item.description || '精彩瞬间' }}</view>
            <view class="waterfall-info">
              <view class="waterfall-author">
                <image
                  class="author-avatar"
                  :src="item.uploader?.avatar || 'https://temp.im/64x64'"
                  mode="aspectFill"
                />
                <text class="author-name">{{ item.uploader?.nickname || '匿名用户' }}</text>
              </view>
              <view class="waterfall-likes" @click.stop="onLikeClick(item)">
                <image
                  class="like-icon"
                  :src="
                    item.is_liked
                      ? '/static/images/homepage/like.png'
                      : '/static/images/homepage/unlike.png'
                  "
                />
                <text class="like-count">{{ formatCount(item.likes_count || 0) }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 右列新增数据加载指示器 -->
        <view v-if="isCalculating && rightNewItems.length > 0" class="loading-more">
          <view
            class="loading-skeleton"
            v-for="n in Math.min(rightNewItems.length, 3)"
            :key="'right-' + n"
          >
            <view class="skeleton-image"></view>
            <view class="skeleton-content">
              <view class="skeleton-title"></view>
              <view class="skeleton-info">
                <view class="skeleton-avatar"></view>
                <view class="skeleton-name"></view>
                <view class="skeleton-like"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  // 数据列表
  dataList: {
    type: Array,
    default: () => [],
  },
  // 列间距
  columnGap: {
    type: Number,
    default: 16,
  },
  // 行间距
  rowGap: {
    type: Number,
    default: 20,
  },
  // 默认占位高度
  defaultImageHeight: {
    type: Number,
    default: 300,
  },
  // 图片最大高度
  maxImageHeight: {
    type: Number,
    default: 500,
  },
})

const emit = defineEmits(['itemClick', 'likeClick'])

// 左右两列数据
const leftColumnData = ref([])
const rightColumnData = ref([])

// 新增数据临时存储
const leftNewItems = ref([])
const rightNewItems = ref([])

// 计算状态
const isCalculating = ref(false)

// 列高度记录
const leftColumnHeight = ref(0)
const rightColumnHeight = ref(0)

// 已处理的数据ID集合
const processedIds = ref(new Set())

// 上一次的数据列表长度
const previousDataLength = ref(0)

// 预加载图片并获取尺寸
const preloadImage = (src) => {
  return new Promise((resolve) => {
    // 在小程序环境中使用 getImageInfo
    if (typeof uni !== 'undefined') {
      uni.getImageInfo({
        src,
        success: (res) => {
          resolve({
            width: res.width,
            height: res.height,
            success: true,
          })
        },
        fail: () => {
          resolve({
            width: 332,
            height: props.defaultImageHeight,
            success: false,
          })
        },
      })
    } else {
      // H5 环境fallback
      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.width || img.naturalWidth,
          height: img.height || img.naturalHeight,
          success: true,
        })
      }
      img.onerror = () => {
        resolve({
          width: 332,
          height: props.defaultImageHeight,
          success: false,
        })
      }
      img.src = src
    }
  })
}

// 计算图片显示高度
const calculateImageHeight = (originalWidth, originalHeight) => {
  const containerWidth = 332 // rpx
  let imageHeight = (originalHeight * containerWidth) / originalWidth

  // 限制最大高度
  imageHeight = Math.min(imageHeight, props.maxImageHeight)

  // 确保最小高度
  imageHeight = Math.max(imageHeight, 200)

  return Math.round(imageHeight)
}

// 预处理新增数据
const preprocessNewData = async (newDataList) => {
  if (!newDataList || newDataList.length === 0) {
    return []
  }

  const processedData = await Promise.all(
    newDataList.map(async (item) => {
      const imageInfo = await preloadImage(item.cover_image)

      const displayHeight = imageInfo.success
        ? calculateImageHeight(imageInfo.width, imageInfo.height)
        : props.defaultImageHeight

      return {
        ...item,
        displayHeight,
        imageWidth: imageInfo.width,
        imageHeight: imageInfo.height,
        imageLoaded: imageInfo.success,
        isNew: true, // 标记为新增数据
      }
    }),
  )

  return processedData
}

// 分配新增数据到两列
const distributeNewData = (newProcessedData) => {
  const contentHeight = 120 // 内容区域固定高度

  // 清空新增数据临时存储
  leftNewItems.value = []
  rightNewItems.value = []

  // 逐个分配新增item
  newProcessedData.forEach((item) => {
    const totalHeight = item.displayHeight + contentHeight + props.rowGap

    // 选择高度较小的列
    if (leftColumnHeight.value <= rightColumnHeight.value) {
      leftNewItems.value.push(item)
      leftColumnHeight.value += totalHeight
    } else {
      rightNewItems.value.push(item)
      rightColumnHeight.value += totalHeight
    }
  })

  // 将新增数据添加到对应列
  nextTick(() => {
    leftColumnData.value.push(...leftNewItems.value)
    rightColumnData.value.push(...rightNewItems.value)

    // 清除新增标记（延迟清除以保持动画效果）
    setTimeout(() => {
      leftColumnData.value.forEach((item) => (item.isNew = false))
      rightColumnData.value.forEach((item) => (item.isNew = false))
    }, 500)

    isCalculating.value = false
  })
}

// 完全重新分配所有数据（仅在重置时使用）
const redistributeAllData = async (dataList) => {
  // 清空所有数据
  leftColumnData.value = []
  rightColumnData.value = []
  leftColumnHeight.value = 0
  rightColumnHeight.value = 0
  processedIds.value.clear()
  previousDataLength.value = 0

  if (!dataList || dataList.length === 0) {
    isCalculating.value = false
    return
  }

  isCalculating.value = true

  try {
    const processedData = await Promise.all(
      dataList.map(async (item) => {
        const imageInfo = await preloadImage(item.cover_image)

        const displayHeight = imageInfo.success
          ? calculateImageHeight(imageInfo.width, imageInfo.height)
          : props.defaultImageHeight

        // 添加到已处理集合
        processedIds.value.add(item.id)

        return {
          ...item,
          displayHeight,
          imageWidth: imageInfo.width,
          imageHeight: imageInfo.height,
          imageLoaded: imageInfo.success,
          isNew: false,
        }
      }),
    )

    const contentHeight = 120

    // 分配到两列
    processedData.forEach((item) => {
      const totalHeight = item.displayHeight + contentHeight + props.rowGap

      if (leftColumnHeight.value <= rightColumnHeight.value) {
        leftColumnData.value.push(item)
        leftColumnHeight.value += totalHeight
      } else {
        rightColumnData.value.push(item)
        rightColumnHeight.value += totalHeight
      }
    })

    previousDataLength.value = dataList.length
    isCalculating.value = false
  } catch (error) {
    console.error('瀑布流数据处理失败:', error)
    isCalculating.value = false
  }
}

// 处理增量数据更新
const handleIncrementalUpdate = async (newDataList) => {
  // 找出新增的数据
  const newItems = newDataList.filter((item) => !processedIds.value.has(item.id))

  if (newItems.length === 0) {
    return
  }

  isCalculating.value = true

  try {
    // 预处理新增数据
    const processedNewData = await preprocessNewData(newItems)

    // 添加到已处理集合
    processedNewData.forEach((item) => {
      processedIds.value.add(item.id)
    })

    // 分配新增数据
    distributeNewData(processedNewData)

    previousDataLength.value = newDataList.length
  } catch (error) {
    console.error('增量更新失败:', error)
    isCalculating.value = false
  }
}

// 处理数据变化
const handleDataChange = async (newData, oldData) => {
  // 如果新数据为空或长度为0，重置所有数据
  if (!newData || newData.length === 0) {
    await redistributeAllData([])
    return
  }

  // 如果是第一次加载或者数据完全重置
  if (!oldData || oldData.length === 0 || newData.length < previousDataLength.value) {
    await redistributeAllData(newData)
    return
  }

  // 如果数据长度增加，进行增量更新
  if (newData.length > previousDataLength.value) {
    await handleIncrementalUpdate(newData)
    return
  }

  // 如果长度相同，检查是否有数据更新
  const hasUpdates = newData.some((item, index) => {
    const oldItem = oldData[index]
    return !oldItem || oldItem.id !== item.id
  })

  if (hasUpdates) {
    await redistributeAllData(newData)
  }
}

// 监听数据变化
watch(
  () => props.dataList,
  (newData, oldData) => {
    handleDataChange(newData, oldData)
  },
  { deep: true, immediate: true },
)

// 格式化数字显示
const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

// 点击事件
const onItemClick = (item) => {
  console.log(item)
  emit('itemClick', item)
}

const onLikeClick = (item) => {
  emit('likeClick', item)
}
</script>

<style scoped lang="scss">
.waterfall-container {
  display: flex;
  gap: 16rpx;
  padding: 0 16rpx;
  box-sizing: border-box;
  min-height: 400rpx;
}

.waterfall-loading {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  width: 100%;
}

.loading-more {
  width: 100%;
}

.loading-skeleton {
  width: calc(50% - 8rpx);
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  animation: pulse 1.5s ease-in-out infinite;

  .loading-more & {
    width: 100%;
  }
}

.skeleton-image {
  width: 100%;
  height: 300rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  padding: 16rpx;
}

.skeleton-title {
  height: 32rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4rpx;
  margin-bottom: 12rpx;
}

.skeleton-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-avatar {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-name {
  width: 120rpx;
  height: 24rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4rpx;
  margin-left: 8rpx;
}

.skeleton-like {
  width: 60rpx;
  height: 24rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4rpx;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.waterfall-item {
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    opacity 0.3s ease;

  &.item-new {
    animation: slideInUp 0.5s ease-out;
  }

  &:active {
    transform: scale(0.98);
  }
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(30rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.waterfall-image {
  width: 100%;
  position: relative;
  background: #f5f5f5;
  overflow: hidden;

  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.waterfall-content {
  padding: 16rpx;
}

.waterfall-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.waterfall-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.waterfall-author {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.author-avatar {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  margin-right: 8rpx;
  background: #f0f0f0;
}

.author-name {
  font-size: 24rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.waterfall-likes {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 8rpx;
  margin: -8rpx;
  border-radius: 8rpx;
  transition: background-color 0.2s ease;

  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.like-icon {
  width: 24rpx;
  height: 24rpx;
}

.like-count {
  font-size: 24rpx;
  color: #666;
  min-width: 32rpx;
}
</style>
