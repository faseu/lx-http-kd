<route lang="json5">
{
  style: {
    navigationBarBackgroundColor: '#fff',
    backgroundColor: '#fff',
    navigationBarTextStyle: 'white',
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
        <view class="nav-box">
          <view class="tab-box">
            <wd-tabs @chang="tabChange" v-model="tab" auto-line-width inactiveColor="#8D93A6">
              <block v-for="(item, index) in tabList" :key="index">
                <wd-tab :title="item"></wd-tab>
              </block>
            </wd-tabs>
          </view>
          <view class="search-box" @click="goToSearch">
            <view class="search-input">中坝森林</view>
            <wd-img height="44rpx" width="72rpx" src="/static/images/homepage/search-btn.png" />
          </view>
        </view>
      </template>

      <!-- 精彩瞬间内容 -->
      <view class="moments-container">
        <WaterfallMoments :dataList="dataList" @itemClick="toDetail" />
      </view>

      <template #bottom>
        <wd-gap safe-area-bottom height="100rpx"></wd-gap>
        <tabbar :selected="1" />
      </template>
    </z-paging>
    <wd-fab
      :draggable="true"
      :expandable="false"
      :zIndex="9999"
      :gap="{ top: 16, left: 16, right: 16, bottom: 116 }"
    >
      <template #trigger>
        <view
          class="w-100rpx h-100rpx bg-[#3a93ff] flex justify-center items-center rounded-50%"
          @click="goToAddShare"
        >
          <wd-icon name="add" size="20px" color="#fff" />
        </view>
      </template>
    </wd-fab>
  </view>
</template>

<script lang="js" setup>
import tabbar from '@/components/tabbar/index.vue'
import WaterfallMoments from '@/components/WaterfallMoments/index.vue'
import { onShow } from '@dcloudio/uni-app'
import { httpGet, httpPost } from '@/utils/http'
import { getIsTabbar } from '@/utils'
import { useUserStore } from '@/store'
import { useToast } from 'wot-design-uni'
const userStore = useUserStore()
const toast = useToast()
const isLogined = computed(() => userStore.isLogined)

// 请求精彩瞬间列表
const { run: runGetMomentsList } = useRequest(({ page_size, page }) =>
  httpGet('/api/album/list', {
    page_size,
    page,
  }),
)

const paging = ref(null)
const dataList = ref([])

onShow(async () => {
  if (getIsTabbar()) {
    uni?.hideTabBar()
  }
  paging?.value?.reload()
})

// 请求列表数据
const queryList = async (pageNo, pageSize) => {
  const { data_list } = await runGetMomentsList({ page_size: pageSize, page: pageNo })
  paging.value.complete(data_list)
}

const searchInput = ref('')

const tabList = ref(['推荐'])
const tab = ref(0)

const tabChange = (e) => {
  console.log('tabChange', e)
  tab.value = e
  // 切换tab时重新加载数据
  paging.value.reload()
}

const likeAblum = (e, j) => {
  const target = dataList.value.find((item) => item.id === e.id)
  if (target) {
    target.is_liked = !target.is_liked
    sentLikeRequest(e.id)
    if (j === 'plus') {
      target.likes_count++
    } else {
      target.likes_count--
    }
  }
}

// 调用接口
const sentLikeRequest = async (e) => {
  const tmpUrl = `/api/album/like/${e}`
  const { data: sentLike, run: runsentLike } = useRequest((e) => httpPost(tmpUrl, {}))
  await runsentLike()
}

const toDetail = (e) => {
  console.log(e)
  uni.navigateTo({
    url: `/pages/share/detail?id=${e.id}`,
  })
}

const goToAddShare = () => {
  if (!isLogined.value) {
    toast.show('请先登录！')
    return
  }
  uni.navigateTo({ url: `/pages/addShare/index` })
}

const goToSearch = () => {
  uni.navigateTo({ url: `/pages/search/index?tab=${1}` })
}
</script>

<style scoped lang="scss">
.main_container {
  width: 100vw;
  height: 100vh;
  padding: 24rpx 32rpx 0;
  box-sizing: border-box;

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

  .moments-container {
    width: 100%;
    padding-bottom: 50rpx;
    box-sizing: border-box;
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
}
</style>
