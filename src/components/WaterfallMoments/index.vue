<template>
  <view class="waterfall-container">
    <!-- 左列 -->
    <view class="waterfall-column">
      <view
        class="waterfall-item"
        v-for="item in leftColumnData"
        :key="item.id"
        @click="onItemClick(item)"
      >
        <view class="waterfall-image" :style="{ height: getImageHeight(item) + 'rpx' }">
          <image
            :src="item.cover_image"
            mode="aspectFill"
            @load="onImageLoad($event, item, 'left')"
            @error="onImageError(item)"
          />
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
    </view>

    <!-- 右列 -->
    <view class="waterfall-column">
      <view
        class="waterfall-item"
        v-for="item in rightColumnData"
        :key="item.id"
        @click="onItemClick(item)"
      >
        <view class="waterfall-image" :style="{ height: getImageHeight(item) + 'rpx' }">
          <image
            :src="item.cover_image"
            mode="aspectFill"
            @load="onImageLoad($event, item, 'right')"
            @error="onImageError(item)"
          />
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
    </view>
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

// 列高度记录
const leftColumnHeight = ref(0)
const rightColumnHeight = ref(0)

// 获取图片显示高度
const getImageHeight = (item) => {
  if (item.imageHeight !== undefined) {
    // 已加载完成，使用实际高度但不超过最大高度
    return Math.min(item.imageHeight, props.maxImageHeight)
  }
  // 未加载完成，使用默认占位高度
  return props.defaultImageHeight
}

// 图片加载完成的回调
const onImageLoad = (event, item, column) => {
  const { height, width } = event.detail

  // 计算图片实际显示高度（基于容器宽度332rpx）
  const containerWidth = 332 // rpx
  let imageHeight = (height * containerWidth) / width

  // 限制最大高度
  imageHeight = Math.min(imageHeight, props.maxImageHeight)

  // 如果高度发生变化，才重新分配
  if (item.imageHeight !== imageHeight) {
    // 更新item的图片高度
    item.imageHeight = imageHeight

    // 重新分配到合适的列
    redistributeItem(item)
  }
}

// 图片加载错误的回调
const onImageError = (item) => {
  // 设置默认图片高度
  if (item.imageHeight !== props.defaultImageHeight) {
    item.imageHeight = props.defaultImageHeight
    item.cover_image = 'https://temp.im/332x' + props.defaultImageHeight
    redistributeItem(item)
  }
}

// 重新分配单个item到合适的列
const redistributeItem = (item) => {
  // 计算item总高度（图片 + 内容区域）
  const contentHeight = 120 // 内容区域固定高度
  const imageHeight = getImageHeight(item)
  const totalHeight = imageHeight + contentHeight

  // 从当前列表中移除该item
  removeItemFromColumns(item.id)

  // 选择高度较小的列
  if (leftColumnHeight.value <= rightColumnHeight.value) {
    leftColumnData.value.push(item)
    leftColumnHeight.value += totalHeight
  } else {
    rightColumnData.value.push(item)
    rightColumnHeight.value += totalHeight
  }
}

// 从列中移除指定item
const removeItemFromColumns = (itemId) => {
  const leftIndex = leftColumnData.value.findIndex((item) => item.id === itemId)
  if (leftIndex !== -1) {
    const removedItem = leftColumnData.value.splice(leftIndex, 1)[0]
    const itemHeight = getImageHeight(removedItem) + 120
    leftColumnHeight.value -= itemHeight
  }

  const rightIndex = rightColumnData.value.findIndex((item) => item.id === itemId)
  if (rightIndex !== -1) {
    const removedItem = rightColumnData.value.splice(rightIndex, 1)[0]
    const itemHeight = getImageHeight(removedItem) + 120
    rightColumnHeight.value -= itemHeight
  }
}

// 完全重新分配所有数据
const redistributeAllData = () => {
  // 清空列数据
  leftColumnData.value = []
  rightColumnData.value = []
  leftColumnHeight.value = 0
  rightColumnHeight.value = 0

  // 逐个分配item
  props.dataList.forEach((item) => {
    const contentHeight = 120
    const imageHeight = getImageHeight(item)
    const totalHeight = imageHeight + contentHeight

    // 选择高度较小的列
    if (leftColumnHeight.value <= rightColumnHeight.value) {
      leftColumnData.value.push(item)
      leftColumnHeight.value += totalHeight
    } else {
      rightColumnData.value.push(item)
      rightColumnHeight.value += totalHeight
    }
  })
}

// 监听数据变化
watch(
  () => props.dataList,
  (newData) => {
    if (newData && newData.length > 0) {
      nextTick(() => {
        redistributeAllData()
      })
    }
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
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
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
