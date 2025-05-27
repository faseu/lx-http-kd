<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '',
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
        <view class="bg_box">
          <wd-navbar
            safeAreaInsetTop
            custom-style="background-color: transparent !important; z-index: 99"
          >
            <template #left>
              <wd-img height="74rpx" width="194rpx" src="/static/images/homepage/title.png" />
            </template>
          </wd-navbar>
          <view class="title-box">
            <p>蹭现在 · 找个搭子</p>
          </view>
          <image class="bg-img" src="/static/images/homepage/index_bg.png" />
          <view class="flex flex-col w-full pos-relative z-index-100">
            <view class="function-box">
              <view
                class="function-item"
                v-for="(i, j) in functionList"
                :key="j"
                @click="toFunPage(i)"
              >
                <image class="w-90rpx h-90rpx" :src="i.logo"></image>
                <view class="function-text">{{ i.name }}</view>
              </view>
            </view>
            <view class="btm_top">
              <view class="w-[350rpx] flex justify-between">
                <view
                  class="flex justify-between items-center w-[170rpx] h-[48rpx] bg-[#E7F0F6] rounded-[24rpx] px-[20rpx] box-border"
                >
                  <view class="flex-1 flex justify-center">一日徒步</view>
                  <wd-img
                    mode="aspectFill"
                    custom-class="pos-absolute w-18rpx h-12rpx"
                    src="/static/images/common/triangle.png"
                  />
                </view>
                <view
                  class="flex justify-between items-center w-[170rpx] h-[48rpx] bg-[#E7F0F6] rounded-[24rpx] px-[20rpx] box-border"
                >
                  <view class="flex-1 flex justify-center">时间</view>
                  <wd-img
                    mode="aspectFill"
                    custom-class="pos-absolute w-18rpx h-12rpx"
                    src="/static/images/common/triangle.png"
                  />
                </view>
              </view>
              <view class="search-box" @click="goToSearch">
                <view class="search-input">中坝森林</view>
                <wd-img height="44rpx" width="72rpx" src="/static/images/homepage/search-btn.png" />
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
      <template #bottom>
        <wd-gap safe-area-bottom height="100rpx"></wd-gap>
        <tabbar :selected="0" />
      </template>
    </z-paging>
  </view>
</template>

<script lang="js" setup>
import tabbar from '@/components/tabbar/index.vue'
import activeItem from '@/components/active-item/index.vue'
import { onShow } from '@dcloudio/uni-app'
import { httpGet, httpPost } from '@/utils/http'
import { ref } from 'vue'
import { getIsTabbar } from '@/utils'

const paging = ref(null)
const functionList = ref([])
const tmpClassify = 'preview'

// 请求分类列表
const { run: runGetCategoriesList } = useRequest((e) => httpGet('/api/category/category_list'))
const { run: runGetList } = useRequest((e) =>
  httpGet('/api/team/all', {
    page: e.pageNo,
    page_size: e.pageSize,
    classify: tmpClassify,
  }),
)

const dataList = ref([])

// 请求活动列表
const queryList = async (pageNo, pageSize) => {
  const { list } = await runGetList({ pageNo, pageSize })
  console.log(list)
  paging.value.complete(list)
}

onShow(async () => {
  if (getIsTabbar()) {
    uni?.hideTabBar()
  }
  const value2 = await runGetCategoriesList()
  functionList.value = value2?.list
  paging?.value?.reload()
})

const goToSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}
</script>

<style scoped lang="scss">
.main_container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;

  .bg_box {
    position: relative;
    overflow: hidden;

    .bg-img {
      position: absolute;
      z-index: -1;
      top: 0;
      width: 100%;
      height: 890rpx;
    }

    .title-box {
      font-weight: 400;
      font-size: 24rpx;
      color: #333333;
      line-height: 34rpx;
      width: 100%;
      padding: 0 32rpx;
      box-sizing: border-box;
      z-index: 100;
    }

    .function-box {
      width: 100%;
      padding: 0 48rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      margin-top: 44rpx;

      .function-item {
        display: flex;
        align-items: center;
        flex-direction: column;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 34rpx;
      }

      .function-text {
        margin-top: 10rpx;
      }
    }

    .btm_top {
      width: 100%;
      margin-top: 50rpx;
      padding: 0 30rpx;
      box-sizing: border-box;
      height: 112rpx;
      border-radius: 40rpx 40rpx 0 0;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 400;
      font-size: 24rpx;
      color: #333333;

      .search-box {
        width: 296rpx;
        height: 56rpx;
        background: #ffffff;
        border-radius: 250rpx 250rpx 250rpx 250rpx;
        border: 2rpx solid #000000;
        display: flex;
        align-items: center;
        padding: 0 6rpx 0 20rpx;

        .search-input {
          flex: 1;
          font-weight: 400;
          font-size: 28rpx;
          color: #999999;
        }
      }
    }
  }

  .nav-box {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .tab-box {
      flex: 1;
      height: 56rpx;
      margin-top: -30rpx;
    }

    .search-box {
      width: 336rpx;
      height: 56rpx;
      background: #ffffff;
      border-radius: 250rpx 250rpx 250rpx 250rpx;
      border: 2rpx solid #000000;
      display: flex;
      align-items: center;
      padding: 0 6rpx 0 20rpx;

      .search-input {
        flex: 1;
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
      }
    }
  }

  .content-box {
    margin-top: 20rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
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
}
</style>
