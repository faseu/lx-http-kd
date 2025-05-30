<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
  <view class="content">
    <!-- 活动列表 -->
    <z-paging
      v-if="tabIndex === 0 && (firstLoaded || isCurrentPage)"
      ref="paging1"
      v-model="dataList"
      @query="queryList"
      :fixed="false"
    >
      <view v-for="item in dataList" :key="item.id">
        <activeItem :item="item" />
      </view>
    </z-paging>

    <!-- 精彩瞬间瀑布流 -->
    <z-paging
      v-else-if="tabIndex === 1 && (firstLoaded || isCurrentPage)"
      ref="paging2"
      v-model="momentsDataList"
      @query="queryList"
      :fixed="false"
    >
      <view class="waterfall-container">
        <view class="waterfall-column">
          <view
            class="waterfall-item"
            v-for="item in leftColumnData"
            :key="item.id"
            @click="toMomentDetail(item)"
          >
            <view class="waterfall-image">
              <image :src="item.cover_image" mode="widthFix" @load="onImageLoad($event, item)" />
            </view>
            <view class="waterfall-content">
              <view class="waterfall-title">{{ item.title }}</view>
              <view class="waterfall-info">
                <view class="waterfall-author">
                  <image class="author-avatar" :src="item.uploader?.avatar" mode="aspectFill" />
                  <text class="author-name">{{ item.uploader?.nickname }}</text>
                </view>
                <view class="waterfall-likes">
                  <image
                    class="like-icon"
                    :src="
                      item.is_liked
                        ? '/static/images/homepage/like.png'
                        : '/static/images/homepage/unlike.png'
                    "
                    @click.stop="likeMoment(item)"
                  />
                  <text class="like-count">{{ item.likes_count }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="waterfall-column">
          <view
            class="waterfall-item"
            v-for="item in rightColumnData"
            :key="item.id"
            @click="toMomentDetail(item)"
          >
            <view class="waterfall-image">
              <image :src="item.cover_image" mode="widthFix" @load="onImageLoad($event, item)" />
            </view>
            <view class="waterfall-content">
              <view class="waterfall-title">{{ item.title }}</view>
              <view class="waterfall-info">
                <view class="waterfall-author">
                  <image class="author-avatar" :src="item.uploader?.avatar" mode="aspectFill" />
                  <text class="author-name">{{ item.uploader?.nickname }}</text>
                </view>
                <view class="waterfall-likes">
                  <image
                    class="like-icon"
                    :src="
                      item.is_liked
                        ? '/static/images/homepage/like.png'
                        : '/static/images/homepage/unlike.png'
                    "
                    @click.stop="likeMoment(item)"
                  />
                  <text class="like-count">{{ item.likes_count }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { httpGet, httpPost } from '@/utils/http'
import activeItem from '@/components/active-item/index.vue'

const paging1 = ref(null)
const paging2 = ref(null)
const dataList = ref([])
const momentsDataList = ref([])
const leftColumnData = ref([])
const rightColumnData = ref([])

// 当前组件是否已经加载过了
const firstLoaded = ref(false)
// 是否滚动到当前页
const isCurrentPage = ref(false)

const props = defineProps({
  tabIndex: {
    type: Number,
    default: 0,
  },
  currentIndex: {
    type: Number,
    default: 0,
  },
})

// 请求活动列表
const { run: runGetActivityList } = useRequest((e) =>
  httpGet('/api/team/all', {
    page: e.pageNo,
    page_size: e.pageSize,
  }),
)

// 请求精彩瞬间列表
const { run: runGetMomentsList } = useRequest((e) =>
  httpGet('/api/album/list', {
    page: e.pageNo,
    page_size: e.pageSize,
  }),
)

watch(
  () => props.currentIndex,
  (newVal) => {
    if (newVal === props.tabIndex) {
      // 懒加载，当滑动到当前的item时，才去加载
      if (!firstLoaded.value) {
        // 这里需要延迟渲染z-paging的原因是为了避免在一些平台上立即渲染可能引发的底层报错问题
        setTimeout(() => {
          isCurrentPage.value = true
        }, 100)
      }
    }
  },
  {
    immediate: true,
  },
)

const queryList = async (pageNo, pageSize) => {
  try {
    if (props.tabIndex === 0) {
      // 活动数据
      const { list } = await runGetActivityList({ pageNo, pageSize })
      paging1.value.complete(list)
      firstLoaded.value = true
    } else if (props.tabIndex === 1) {
      // 精彩瞬间数据
      const { data_list } = await runGetMomentsList({ pageNo, pageSize })

      if (data_list && data_list.length > 0) {
        if (pageNo === 1) {
          // 首次加载或刷新：替换数据
          momentsDataList.value = [...data_list]
        } else {
          // 加载更多：追加数据
          momentsDataList.value = [...momentsDataList.value, ...data_list]
        }

        // 重新分配到左右两列
        redistributeToColumns()
      }

      paging2.value.complete(data_list)
      firstLoaded.value = true
    }
  } catch (error) {
    console.error('数据加载失败:', error)
    paging1.value.complete(false)
    paging2.value.complete(false)
  }
}

// 瀑布流分列逻辑
const redistributeToColumns = () => {
  const leftColumn = []
  const rightColumn = []
  let leftHeight = 0
  let rightHeight = 0

  momentsDataList.value.forEach((item) => {
    // 估算每个item的高度（图片高度 + 内容高度）
    const contentHeight = 140 // 内容区域固定高度
    const imageHeight = item.imageHeight || 300 // 如果没有图片高度，使用默认值
    const totalHeight = imageHeight + contentHeight

    // 选择高度较小的列
    if (leftHeight <= rightHeight) {
      leftColumn.push(item)
      leftHeight += totalHeight
    } else {
      rightColumn.push(item)
      rightHeight += totalHeight
    }
  })

  leftColumnData.value = leftColumn
  rightColumnData.value = rightColumn
}

// 图片加载完成回调
const onImageLoad = (event, item) => {
  const { height, width } = event.detail
  // 计算按宽度332rpx缩放后的高度
  item.imageHeight = (height * 332) / width
  // 重新分配列表
  redistributeToColumns()
}

// 点赞精彩瞬间
const likeMoment = async (item) => {
  try {
    const tmpUrl = `/api/album/like/${item.id}`
    await httpPost(tmpUrl, {})

    // 更新点赞状态
    item.is_liked = !item.is_liked
    item.likes_count += item.is_liked ? 1 : -1

    // 同步更新各个数据源
    const updateItem = (list) => {
      const targetItem = list.find((i) => i.id === item.id)
      if (targetItem) {
        targetItem.is_liked = item.is_liked
        targetItem.likes_count = item.likes_count
      }
    }

    updateItem(momentsDataList.value)
    updateItem(leftColumnData.value)
    updateItem(rightColumnData.value)
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

// 跳转到精彩瞬间详情
const toMomentDetail = (item) => {
  uni.navigateTo({
    url: `/pages/share/detail?id=${item.id}`,
  })
}
</script>

<style lang="scss" scoped>
/* 注意:父节点需要固定高度，z-paging的height:100%才会生效 */
.content {
  height: 100%;
  position: relative;
  z-index: 99;
}

// 瀑布流容器样式
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
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.waterfall-image {
  width: 100%;

  image {
    width: 100%;
    height: auto;
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
}

.author-name {
  font-size: 24rpx;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.waterfall-likes {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.like-icon {
  width: 24rpx;
  height: 24rpx;
}

.like-count {
  font-size: 24rpx;
  color: #666;
}
</style>
