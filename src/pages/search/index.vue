<route lang="json5">
{
  style: {
    navigationBarTitleText: '搜索',
  },
}
</route>

<template>
  <view class="main_container">
    <z-paging
      ref="paging"
      :fixed="false"
      :show-scrollbar="false"
      v-model="dataList"
      @query="queryList"
    >
      <template #top>
        <view class="w-full px-30rpx mt-20rpx box-border">
          <view class="flex h-72rpx items-center bg-white rounded-10rpx">
            <view class="w-72rpx flex items-center justify-center">
              <wd-icon color="#666" name="search" size="24rpx"></wd-icon>
            </view>
            <view class="flex-1">
              <wd-input placeholder="请输入搜索内容" />
            </view>
            <view class="text-28rpx color-[#009DFF] p-x-30rpx">取消</view>
          </view>
          <view class="mt-30rpx flex items-center h-60rpx">
            <view
              :class="{
                'tab w-80rpx mr-60rpx': true,
                'tab-active': tab === 1,
              }"
              @click="() => changeTab(1)"
            >
              活动
            </view>
            <view>
              <view
                :class="{
                  'tab w-160rpx': true,
                  'tab-active': tab === 2,
                }"
                @click="() => changeTab(2)"
              >
                精彩瞬间
              </view>
            </view>
          </view>
        </view>
      </template>

      <!-- 活动列表 -->
      <view class="content-box" v-if="tab === 1">
        <view v-for="item in dataList" :key="item.id">
          <activeItem :item="item" />
        </view>
      </view>

      <!-- 精彩瞬间瀑布流 -->
      <view class="waterfall-container" v-if="tab === 2">
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

<script lang="js" setup>
import activeItem from '@/components/active-item/index.vue'
import { onShow } from '@dcloudio/uni-app'
import { httpGet, httpPost } from '@/utils/http'
import { ref } from 'vue'
import { getIsTabbar } from '@/utils'

const paging = ref(null)
const tab = ref(1)
const functionList = ref([])
const tmpClassify = 'preview'

// 活动数据
const activityDataList = ref([])
// 精彩瞬间数据
const momentsDataList = ref([])
const leftColumnData = ref([])
const rightColumnData = ref([])

// 请求分类列表
const { run: runGetCategoriesList } = useRequest((e) => httpGet('/api/category/category_list'))
const { run: runGetList } = useRequest((e) =>
  httpGet('/api/hiking_list', {
    page: e.pageNo,
    page_size: e.pageSize,
    classify: tmpClassify,
  }),
)

// 请求精彩瞬间列表
const { run: runGetMomentsList } = useRequest(({ page, page_size }) =>
  httpGet('/api/album/list', {
    page,
    page_size,
  }),
)

const dataList = ref([])

// 请求活动列表
const queryList = async (pageNo, pageSize) => {
  if (tab.value === 1) {
    // 活动数据
    const { list } = await runGetList({ pageNo, pageSize })

    // 将activity_type与分类列表id对比，添加activity_type_word字段
    if (list && list.length > 0 && functionList.value && functionList.value.length > 0) {
      list.forEach((item) => {
        const matchedCategory = functionList.value.find(
          (category) => category.id === item.activity_type,
        )
        if (matchedCategory) {
          item.activity_type_word = matchedCategory.name
        } else {
          item.activity_type_word = '未分类'
        }
      })
    }

    activityDataList.value = [...activityDataList.value, ...list]
    paging.value.complete(list)
  } else if (tab.value === 2) {
    // 精彩瞬间数据
    const { data_list } = await runGetMomentsList({ page: pageNo, page_size: pageSize })

    if (data_list && data_list.length > 0) {
      momentsDataList.value = [...momentsDataList.value, ...data_list]
      // 重新分配到左右两列
      redistributeToColumns()
    }

    paging.value.complete(data_list || [])
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

onShow(async () => {
  if (getIsTabbar()) {
    uni?.hideTabBar()
  }
  const value2 = await runGetCategoriesList()
  functionList.value = value2?.list
})

const changeTab = (value) => {
  tab.value = value
  // 切换标签时重置数据
  if (value === 1) {
    dataList.value = activityDataList.value
  } else if (value === 2) {
    dataList.value = momentsDataList.value
    // 如果精彩瞬间数据为空，重新加载
    if (momentsDataList.value.length === 0) {
      paging.value?.reload()
    }
  }
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

<style scoped lang="scss">
.main_container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background: #f6f8fa;

  .content-box {
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  // 瀑布流容器样式
  .waterfall-container {
    display: flex;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    gap: 16rpx;
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

  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
    font-size: 28rpx;
    color: #666666;
  }
  .tab-active {
    position: relative;
    font-weight: bold;
    font-size: 36rpx;
    color: #333;
  }
  .tab-active::after {
    content: '';
    position: absolute;
    bottom: -10rpx;
    width: 48rpx;
    height: 6rpx;
    background: linear-gradient(152deg, #3b60ff 0%, #00c3ff 100%);
    border-radius: 4px;
  }
}

input {
  width: 260rpx;
  padding-left: 20rpx;
  box-sizing: border-box;
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
}

:deep() {
  .zp-l-container {
    margin-bottom: 20rpx;
  }

  .wd-navbar.is-border::after {
    display: none;
  }
  .wd-input::after {
    display: none !important;
  }
}
</style>
