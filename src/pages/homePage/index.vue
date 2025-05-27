<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: 'homePage',
  },
}
</route>
<template>
  <view class="main">
    <template #top>
      <view class="bg_box">
        <wd-img height="890rpx" width="750rpx" src="/static/images/homepage/index_bg.png"></wd-img>
        <view class="content-box">
          <view class="title-box">
            <wd-img height="74rpx" width="194rpx" src="/static/images/homepage/title.png"></wd-img>
            <p>蹭现在 · 找个搭子</p>
          </view>
          <view class="swiper-box">
            <wd-swiper
              :list="swiperList"
              height="300rpx"
              autoplay
              v-model:current="current"
              @click="handleClick"
            ></wd-swiper>
          </view>
          <view class="function-box">
            <view
              class="function-item"
              v-for="(i, j) in functionList"
              :key="j"
              @click="toFunPage(i)"
            >
              <wd-img height="90rpx" width="90rpx" :src="i.logo"></wd-img>
              <view class="function-text">{{ i.name }}</view>
            </view>
          </view>
        </view>
      </view>
    </template>
    <view class="btm_box">
      <view class="btm_top">
        <view class="tab-box">
          <view
            v-for="(i, j) in tabList"
            :key="j"
            class="tab-item"
            :class="{ 'active-item': currentTab === j }"
            @click="switchTab(j)"
          >
            <view class="inline-name">{{ i.name }}</view>
            <view class="base-img">
              <wd-img
                height="10rpx"
                width="96rpx"
                src="/static/images/homepage/semi-green.png"
                v-if="currentTab === j"
              ></wd-img>
            </view>
          </view>
        </view>
        <view class="search-box">
          <input v-model="searchInput" placeholder="中坝森林" />
          <wd-img
            height="44rpx"
            width="72rpx"
            src="/static/images/homepage/search-btn.png"
            @click="inputClick"
          ></wd-img>
        </view>
      </view>
      <view class="content-box">
        <z-paging
          ref="paging"
          :fixed="false"
          :paging-style="{ height: '280px' }"
          :show-scrollbar="false"
          v-model="dataList"
          @query="queryList"
        >
          <view class="content-item" v-for="(i, j) in dataList" :key="j">
            <view class="left-part">
              <view class="type">{{ i.activity_type_word }}</view>
              <wd-img
                :round="true"
                radius="10"
                height="240rpx"
                width="240rpx"
                :src="i.cover_image"
              ></wd-img>
              <view class="common-box">
                <view class="great-box">
                  <wd-img
                    height="24rpx"
                    width="32rpx"
                    src="/static/images/homepage/great.png"
                  ></wd-img>
                  <view class="word">{{ i.recommend_index }}</view>
                </view>
                <view class="great-box">
                  <wd-img
                    height="24rpx"
                    width="32rpx"
                    src="/static/images/homepage/save.png"
                  ></wd-img>
                  <view class="word">{{ i.star }}</view>
                </view>
              </view>
            </view>
            <view class="right-part">
              <view class="iWannaGo" @click="toDetail(i.id)">我也要去</view>
              <view class="name">{{ i.name }}</view>
              <view class="distance">{{ i.description }}</view>
              <view class="sub-text">{{ i.activities_json_word }}</view>
              <view class="join-box">
                <view class="left-join">
                  <view class="circle">
                    <wd-img
                      :width="20"
                      :height="20"
                      round
                      src="https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg"
                    />
                  </view>
                  <view class="circle">
                    <wd-img
                      :width="20"
                      :height="20"
                      round
                      src="https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg"
                    />
                  </view>
                  <view class="circle">
                    <wd-img
                      :width="20"
                      :height="20"
                      round
                      src="https://registry.npmmirror.com/wot-design-uni-assets/*/files/meng.jpg"
                    />
                  </view>
                </view>
                <view class="right-join">
                  <view class="word">
                    <view>已有</view>
                    <view class="orange-word">{{ i.follower_count }}</view>
                    <view>人游玩过；</view>
                  </view>
                  <p class="word">
                    <view>当前有</view>
                    <view class="orange-word">{{ i.team_count }}</view>
                    <view>个队伍在约搭～</view>
                  </p>
                </view>
              </view>
            </view>
          </view>
        </z-paging>
      </view>
    </view>
    <tabbar :selected="0" />

    <wd-toast :duration="500" position="middle" />
  </view>
</template>

<script lang="js" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { httpGet, httpPost } from '@/utils/http'
import { onShow } from '@dcloudio/uni-app'
import tabbar from '@/components/tabbar/index.vue'
import { list } from 'postcss'
import { useToast } from 'wot-design-uni'

const swiperList = ref([])
const functionList = ref([])
// 请求轮播图
const { run: runGetCarouselsList } = useRequest((e) => httpGet('/api/carousel/banner'))
// 请求分类列表
const { run: runGetCategoriesList } = useRequest((e) => httpGet('/api/category/category_list'))

const { run: runGetList } = useRequest((e) =>
  httpGet('/api/activity/activity_list', {
    page: e.pageNo,
    page_size: e.pageSize,
    classify: tmpClassify,
  }),
)

onShow(async () => {
  uni?.hideTabBar()
  const value1 = await runGetCarouselsList()
  swiperList.value = value1?.list?.map((item) => item.image)

  const value2 = await runGetCategoriesList()
  functionList.value = value2?.list
})

const paging = ref(null)
const dataList = ref([])
const tmpDataList = ref([])

let tmpClassify = 'preview'

// 请求活动列表
const queryList = async (pageNo, pageSize) => {
  const { list } = await runGetList({ pageNo, pageSize })
  console.log('33333333333', list)

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

defineOptions({
  name: 'Home',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad(() => {})

/**
 * @explanation  : swiper所需要内容
 */
const current = ref(0)

function handleClick(e) {}

/**
 * @brief        :
 * @explanation  : 搜索框
 * @return        {*}
 */
const searchInput = ref('')
function inputClick() {
  console.log(searchInput)
}

/**
 * @brief        :
 * @explanation  : 内容的list
 * @return        {*}
 */
const contentList = ref([])

/**
 * @brief        :
 * @explanation  : tab切换
 * @return        {*}
 */
const tabList = ref([
  {
    name: '最新',
    id: 0,
  },
  {
    name: '热门',
    id: 1,
  },
])
// 当前选中的tab索引
const currentTab = ref(1)

const switchTab = (index) => {
  console.log('切换至标签:', index)
  currentTab.value = index

  switch (index) {
    case 0:
      tmpClassify = 'new'
      break
    case 1:
      tmpClassify = 'preview'
      break
  }
  tmpDataList.value = []
  paging.value.reload()
}

const toast = useToast()
function toFunPage(e) {
  console.log('eeeeeeeee', e)
  if (e.id == 5) {
  } else {
    toast.show('正在开发中，敬请期待！～')
  }
}

function toDetail(e) {
  uni.navigateTo({
    url: `/pages/homePage/activityDetail?id=${e}`,
  })
}
</script>

<style scoped lang="scss">
.main {
  position: relative;

  .bg_box {
    .content-box {
      position: absolute;
      top: 106rpx;
      padding: 0 32rpx;
      box-sizing: border-box;
      width: 100%;
    }

    .title-box {
      font-family:
        Source Han Sans,
        Source Han Sans;
      font-weight: 400;
      font-size: 24rpx;
      color: #333333;
      line-height: 34rpx;

      width: 100%;
    }

    .swiper-box {
      margin-top: 30rpx;
      width: 100%;
      height: 300rpx;
    }

    .function-box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14rpx 0 20rpx;
      box-sizing: border-box;
      margin-top: 44rpx;

      .function-item {
        display: flex;
        align-items: center;
        flex-direction: column;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 400;
        font-size: 24rpx;
        color: #333333;
        line-height: 34rpx;
      }

      .function-text {
        margin-top: 10rpx;
      }
    }
  }

  .btm_box {
    width: 100%;
    height: 50vh;
    position: absolute;
    top: 762rpx;
    background: #ffffff;
    box-shadow: 0rpx -8rpx 20rpx 0rpx rgba(65, 65, 65, 0.07);
    border-radius: 40rpx 40rpx 40rpx 40rpx;
    padding: 28rpx 30rpx;
    box-sizing: border-box;

    .btm_top {
      display: flex;
      align-items: center;

      .tab-box {
        height: 56rpx;
        flex: 1;
        display: flex;
        align-items: baseline;
        justify-content: space-around;

        .tab-item {
          font-family:
            Source Han Sans,
            Source Han Sans;
          font-weight: 400;
          font-size: 28rpx;
          color: #666666;
          position: relative;

          .inline-name {
            z-index: 99;
          }

          .base-img {
            position: absolute;
            left: -6px;
            top: 6px;
          }
        }

        .active-item {
          font-family:
            Source Han Sans,
            Source Han Sans;
          font-weight: 700;
          font-size: 36rpx;
          color: #0b1526;
        }
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
          font-family:
            Source Han Sans,
            Source Han Sans;
          font-weight: 400;
          font-size: 28rpx;
          color: #999999;
        }
      }
    }

    .content-box {
      margin-top: 50rpx;
      display: flex;
      flex-direction: column;

      .content-item {
        margin-bottom: 30rpx;
        background: #ffffff;
        box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(0, 0, 0, 0.11);
        border-radius: 0rpx 20rpx 20rpx 0rpx;
        display: flex;
        padding: 6rpx 20rpx 6rpx 6rpx;
        box-sizing: border-box;

        .left-part {
          width: 240rpx;
          height: 240rpx;
          border-radius: 20rpx 20rpx 20rpx 20rpx;
          border: 2rpx solid #ffffff;
          background-color: rgba($color: #000000, $alpha: 0.05);
          position: relative;
          overflow: hidden;

          .type {
            width: 92rpx;
            height: 32rpx;
            font-family:
              Source Han Sans,
              Source Han Sans;
            font-weight: 400;
            font-size: 20rpx;
            color: #333333;
            line-height: 32rpx;
            text-align: center;
            background: linear-gradient(180deg, #c1ff00 4%, #08e6e3 99%);
            border-radius: 264rpx 264rpx 264rpx 264rpx;
            position: absolute;
            top: 20rpx;
            left: 20rpx;
            z-index: 99;
          }

          .common-box {
            width: 100%;
            height: 42rpx;
            background: rgba(0, 0, 0, 0.6);
            position: absolute;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: space-around;

            .great-box {
              display: flex;
              align-items: center;

              .word {
                margin-left: 6rpx;
                font-family:
                  Source Han Sans,
                  Source Han Sans;
                font-weight: 500;
                font-size: 20rpx;
                color: #ffffff;
              }
            }
          }
        }

        .right-part {
          flex: 1;
          margin-left: 20rpx;
          display: flex;
          flex-direction: column;
          position: relative;

          .iWannaGo {
            width: 124rpx;
            height: 48rpx;
            font-family:
              Source Han Sans,
              Source Han Sans;
            font-weight: 400;
            font-size: 24rpx;
            color: #009dff;
            line-height: 48rpx;
            text-align: center;
            border-radius: 78rpx 78rpx 78rpx 78rpx;
            border: 2rpx solid;
            position: absolute;
            top: 16rpx;
            right: 0;
          }

          .name {
            font-family:
              Source Han Sans,
              Source Han Sans;
            font-weight: 500;
            font-size: 32rpx;
            color: #333333;
            margin-top: 20rpx;
          }

          .distance {
            font-family:
              Source Han Sans,
              Source Han Sans;
            font-weight: 400;
            font-size: 24rpx;
            color: #333333;
            margin-top: 6rpx;
          }

          .sub-text {
            font-family:
              Source Han Sans,
              Source Han Sans;
            font-weight: 400;
            font-size: 20rpx;
            color: #999999;
            margin-top: 10rpx;
          }

          .join-box {
            width: 392rpx;
            height: 76rpx;
            background: #f6fdff;
            border-radius: 10rpx 10rpx 10rpx 10rpx;
            margin-top: 8rpx;
            padding: 8rpx 16rpx;
            box-sizing: border-box;
            display: flex;
            align-items: center;

            .left-join {
              display: flex;
              margin-top: -25rpx;
              min-width: 90rpx;

              .circle {
                width: 20rpx;
                height: 20rpx;
                border-radius: 50%;
                border: 2rpx solid #fff;
              }
            }

            .right-join {
              margin-left: 12rpx;
              display: flex;
              flex-direction: column;

              .word {
                font-family:
                  Source Han Sans,
                  Source Han Sans;
                font-weight: 400;
                font-size: 20rpx;
                color: #666666;
                display: flex;
                align-items: center;

                .orange-word {
                  color: #ff6619;
                }
              }
            }
          }
        }
      }
    }
  }
}

input {
  width: 260rpx;
  padding-left: 20rpx;
  box-sizing: border-box;

  font-family:
    Source Han Sans,
    Source Han Sans;
  font-weight: 400;
  font-size: 28rpx;
  color: #999999;
}
</style>
