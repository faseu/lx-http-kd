<route lang="json5">
{
  style: {
    navigationBarTitleText: '我的活动',
  },
}
</route>

<template>
  <view class="main_container">
    <z-paging ref="paging" v-model="dataList" @query="queryList" :fixed="false">
      <template #top>
        <view class="w-full px-30rpx pb-30rpx mt-20rpx box-border">
          <view class="mt-30rpx flex items-center h-74rpx">
            <view
              :class="{
                'tab w-80rpx mr-60rpx': true,
                'tab-active': tab === 0,
              }"
              @click="() => changeTab(0)"
            >
              全部
            </view>
            <view>
              <view
                :class="{
                  'tab w-160rpx': true,
                  'tab-active': tab === 1,
                }"
                @click="() => changeTab(1)"
              >
                我发布的
              </view>
            </view>
            <view>
              <view
                :class="{
                  'tab w-240rpx': true,
                  'tab-active': tab === 2,
                }"
                @click="() => changeTab(2)"
              >
                我参与的
              </view>
            </view>
          </view>
        </view>
      </template>
      <view class="h-full" v-if="tab === 0">
        <view class="content-box" v-for="item in dataList" :key="item.id">
          <MyActivityItem :item="item" @refresh="handleRefresh" />
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script lang="js" setup>
import MyActivityItem from '@/components/my-active-item/index.vue'
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getIsTabbar } from '@/utils'
import { httpGet, httpPost } from '@/utils/http'

// 请求活动列表
const { run: runGetActivityList } = useRequest((e) =>
  httpGet('/api/team/my_teams', {
    page: e.pageNo,
    page_size: e.pageSize,
  }),
)

const paging = ref(null)
const dataList = ref([])

const tab = ref(0) // 默认选中活动tab
onShow(async () => {
  if (getIsTabbar()) {
    uni?.hideTabBar()
  }
})

const changeTab = (value) => {
  tab.value = value
  // 当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
  paging.value.reload()
}

// 计算活动状态的方法
const getActivityStatus = (item) => {
  if (item.review_status === 0) {
    return 'reviewing'
  }
  if (item.review_status === 1) {
    return 'recruiting'
  }
  if (item.review_status === 2) {
    return 'rejected'
  }
}

// 请求活动列表
const queryList = async (pageNo, pageSize) => {
  // 构建查询参数
  const queryParams = {
    pageNo,
    pageSize,
  }
  const { list } = await runGetActivityList(queryParams)
  // 为每个 item 添加 status
  const processedList = list.map((item) => ({
    ...item,
    status: getActivityStatus(item),
  }))

  paging.value.complete(processedList)
}

const handleRefresh = () => {
  paging.value.reload()
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
