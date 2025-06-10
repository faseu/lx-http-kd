<route lang="json5">
{
  style: {
    navigationBarTitleText: '搜索',
  },
}
</route>

<template>
  <view class="main_container">
    <z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false">
      <template #top>
        <view class="w-full px-30rpx pb-30rpx mt-20rpx box-border">
          <view class="flex h-72rpx items-center bg-white rounded-10rpx">
            <view class="w-72rpx flex items-center justify-center">
              <wd-icon color="#666" name="search" size="24rpx"></wd-icon>
            </view>
            <view class="flex-1">
              <wd-input
                :focus="true"
                v-model="searchKeyword"
                placeholder="请输入搜索内容"
                @input="handleSearchInput"
                @confirm="handleSearchConfirm"
              />
            </view>
            <view class="text-28rpx color-[#009DFF] p-x-30rpx" @click="goBack">取消</view>
          </view>
          <view class="mt-30rpx flex items-center h-74rpx">
            <view
              :class="{
                'tab w-80rpx mr-60rpx': true,
                'tab-active': tab === 0,
              }"
              @click="() => changeTab(0)"
            >
              活动
            </view>
            <view>
              <view
                :class="{
                  'tab w-160rpx': true,
                  'tab-active': tab === 1,
                }"
                @click="() => changeTab(1)"
              >
                精彩瞬间
              </view>
            </view>
          </view>
        </view>
      </template>
      <view class="h-full px-20rpx box-border" v-if="tab === 0">
        <view v-for="item in dataList" :key="item.id">
          <activeItem :item="item" />
        </view>
      </view>
      <view class="h-full px-20rpx box-border" v-if="tab === 1">
        <WaterfallMoments :dataList="dataList" />
      </view>
    </z-paging>
  </view>
</template>

<script lang="js" setup>
import activeItem from '@/components/active-item/index.vue'
import WaterfallMoments from '@/components/WaterfallMoments/index.vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getIsTabbar } from '@/utils'
import { httpGet, httpPost } from '@/utils/http'

// 请求活动列表
const { run: runGetActivityList } = useRequest((e) =>
  httpGet('/api/team/all', {
    page: e.pageNo,
    page_size: e.pageSize,
    keyword: e.keyword, // 添加关键字参数
  }),
)

// 请求精彩瞬间列表
const { run: runGetMomentsList } = useRequest((e) =>
  httpGet('/api/album/list', {
    page: e.pageNo,
    page_size: e.pageSize,
    keyword: e.keyword, // 添加关键字参数
  }),
)

const paging = ref(null)
const dataList = ref([])

const tab = ref(0) // 默认选中活动tab
const searchKeyword = ref('') // 搜索关键词
let searchTimer = null // 搜索防抖定时器

onLoad(async (options) => {
  // 获取活动列表
  if (options.tab) {
    tab.value = +options.tab || 0
  }
})

const changeTab = (value) => {
  tab.value = value
  // 当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
  paging.value.reload()
}

// 请求活动列表
const queryList = async (pageNo, pageSize) => {
  // 构建查询参数
  const queryParams = {
    pageNo,
    pageSize,
    keyword: searchKeyword.value.trim(), // 添加搜索关键词
  }

  try {
    if (tab.value === 0) {
      const { list } = await runGetActivityList(queryParams)
      paging.value.complete(list)
    } else {
      const { data_list: list } = await runGetMomentsList(queryParams)
      paging.value.complete(list)
    }
  } catch (error) {
    console.error('查询失败:', error)
    paging.value.complete([])
  }
}

// 搜索输入处理（防抖）
const handleSearchInput = () => {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  // 设置新的定时器，500ms后执行搜索
  searchTimer = setTimeout(() => {
    handleSearch()
  }, 500)
}

// 搜索确认处理（立即搜索）
const handleSearchConfirm = () => {
  // 清除防抖定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
    searchTimer = null
  }
  handleSearch()
}

// 执行搜索
const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value)
  // 重新加载数据
  paging.value.reload()
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
.swiper {
  height: 100%;
}

.swiper-item {
  height: 100%;
}

.main_container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  background: #f6f8fa;

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

.content-box {
  margin-top: 20rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

:deep() {
  .wd-input::after {
    display: none !important;
  }
}
</style>
