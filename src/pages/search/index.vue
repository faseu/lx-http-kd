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
      <view class="content-box">
        <view v-for="item in dataList" :key="item.id">
          <activeItem :item="item" />
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

// 请求分类列表
const { run: runGetCategoriesList } = useRequest((e) => httpGet('/api/category/category_list'))
const { run: runGetList } = useRequest((e) =>
  httpGet('/api/hiking_list', {
    page: e.pageNo,
    page_size: e.pageSize,
    classify: tmpClassify,
  }),
)

const dataList = ref([])

// 请求活动列表
const queryList = async (pageNo, pageSize) => {
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

  paging.value.complete(list)

  // paging.value.complete(list)
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
