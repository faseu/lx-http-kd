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
      </template>
      <view class="content-box">
        <view class="content-left">
          <view
            class="content-item content-item-left"
            v-for="(i, j) in dataList.filter((item, index) => index % 2 !== 0)"
            :key="j"
          >
            <view class="img-box" @click="toDetail(i)">
              <wd-img width="100%" height="100%" :src="i.cover_image" />
            </view>
            <view class="text-box">{{ i.title }}</view>
            <view class="info-box">
              <view class="avator">
                <wd-img :width="24" :height="24" round :src="i.uploader?.avatar" />
              </view>
              <view class="name">{{ i.uploader?.nickname }}</view>
              <view class="like-box" v-if="i.is_liked" @click="likeAblum(i, 'cut')">
                <wd-img :width="12" :height="12" src="/static/images/homepage/like.png" />
              </view>
              <view class="like-box" v-else @click="likeAblum(i, 'plus')">
                <wd-img :width="12" :height="12" src="/static/images/homepage/unlike.png" />
              </view>
              <view class="num">{{ i.likes_count }}</view>
            </view>
          </view>
        </view>
        <view class="content-right">
          <view
            class="content-item content-item-right"
            v-for="(i, j) in dataList.filter((item, index) => index % 2 === 0)"
            :key="j"
          >
            <view class="img-box" @click="toDetail(i)">
              <wd-img width="100%" height="100%" :src="i.cover_image" />
            </view>
            <view class="text-box">{{ i.text }}</view>
            <view class="info-box">
              <view class="avator">
                <wd-img :width="24" :height="24" round :src="i.uploader?.avatar" />
              </view>
              <view class="name">{{ i.uploader?.nickname }}</view>
              <view class="like-box" v-if="i.is_liked" @click="likeAblum(i, 'cut')">
                <wd-img :width="12" :height="12" src="/static/images/homepage/like.png" />
              </view>
              <view class="like-box" v-else @click="likeAblum(i, 'plus')">
                <wd-img :width="12" :height="12" src="/static/images/homepage/unlike.png" />
              </view>
              <view class="num">{{ i.likes_count }}</view>
            </view>
          </view>
        </view>
      </view>
      <!--      <template #loadingMoreNoMore>44444444444</template>-->
      <template #bottom>
        <wd-gap safe-area-bottom height="100rpx"></wd-gap>
        <tabbar :selected="1" />
      </template>
    </z-paging>
  </view>
</template>

<script lang="js" setup>
import tabbar from '@/components/tabbar/index.vue'
import { onShow } from '@dcloudio/uni-app'
import { httpGet, httpPost } from '@/utils/http'
const { run: runGetAlbumList } = useRequest(({ page_size, page }) =>
  httpGet('/api/album/list', {
    page_size,
    page,
  }),
)
const paging = ref(null)
const dataList = ref([])

onShow(() => {
  uni?.hideTabBar()
})

// 请求活动列表
const queryList = async (pageNo, pageSize) => {
  const { data_list } = await runGetAlbumList({ page_size: pageSize, page: pageNo })
  paging.value.complete(data_list)
}

const searchInput = ref('')

const tabList = ref(['推荐'])
const tab = ref(0)

// const contentList = ref([
//   {
//     imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
//     text: '开启时髦异域之旅，跟着ETRO去旅行',
//     avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
//     name: '时尚博主',
//     like: true, // false是不喜欢，true是喜欢
//     saveNum: 2345, // 处理数据时候过万的需要处理
//   },
//   {
//     imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
//     text: '开启时髦异域之旅，跟着ETRO去旅行',
//     avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
//     name: '时尚博主',
//     like: false, // false是不喜欢，true是喜欢
//     saveNum: 24567, // 处理数据时候过万的需要处理
//   },
//   {
//     imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
//     text: '让经典焕发新活力，告别极简主义',
//     avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
//     name: '渐渐米乐妍',
//     like: true, // false是不喜欢，true是喜欢
//     saveNum: 123456, // 处理数据时候过万的需要处理
//   },
//   {
//     imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
//     text: '续命奶茶色又来了！又暖又甜这个冬天',
//     avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
//     name: '时尚博主',
//     like: false, // false是不喜欢，true是喜欢
//     saveNum: 9876, // 处理数据时候过万的需要处理
//   },
//   {
//     imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
//     text: '开启时髦异域之旅，跟着ETRO去旅行',
//     avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
//     name: '时尚博主',
//     like: true, // false是不喜欢，true是喜欢
//     saveNum: 2345, // 处理数据时候过万的需要处理
//   },
//   {
//     imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
//     text: '开启时髦异域之旅，跟着ETRO去旅行',
//     avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
//     name: '时尚博主',
//     like: false, // false是不喜欢，true是喜欢
//     saveNum: 24567, // 处理数据时候过万的需要处理
//   },
//   {
//     imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
//     text: '让经典焕发新活力，告别极简主义',
//     avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
//     name: '渐渐米乐妍',
//     like: true, // false是不喜欢，true是喜欢
//     saveNum: 123456, // 处理数据时候过万的需要处理
//   },
//   {
//     imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
//     text: '续命奶茶色又来了！又暖又甜这个冬天',
//     avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
//     name: '时尚博主',
//     like: false, // false是不喜欢，true是喜欢
//     saveNum: 9876, // 处理数据时候过万的需要处理
//   },
// ])
//
// const attentionList = ref([
//   {
//     imgUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/moon.jpg',
//     text: '让经典焕发新活力，告别极简主义',
//     avatarUrl: 'https://registry.npmmirror.com/wot-design-uni-assets/*/files/panda.jpg',
//     name: '渐渐米乐妍',
//     like: true, // false是不喜欢，true是喜欢
//     saveNum: 123456, // 处理数据时候过万的需要处理
//   },
// ])

const tabChange = (e) => {
  console.log('tabChange', e)
}
const inputClick = () => {
  console.log(searchInput)
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
  uni.navigateTo({
    url: `/pages/share/detail?id=${e.id}`,
  })
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
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 50rpx;
    box-sizing: border-box;

    .content-left {
      width: 332rpx;

      .content-item-left:nth-child(2n) {
        .img-box {
          width: 100%;
          height: 368rpx;
          background: #f1f3f6;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          overflow: hidden;
        }
      }

      .content-item-left:nth-child(2n + 1) {
        .img-box {
          width: 100%;
          height: 400rpx;
          background: #f1f3f6;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          overflow: hidden;
        }
      }
    }

    .content-right {
      width: 332rpx;

      .content-item-right:nth-child(2n + 1) {
        .img-box {
          width: 100%;
          height: 328rpx;
          background: #f1f3f6;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          overflow: hidden;
        }
      }

      .content-item-right:nth-child(2n) {
        .img-box {
          width: 100%;
          height: 400rpx;
          background: #f1f3f6;
          border-radius: 16rpx 16rpx 16rpx 16rpx;
          overflow: hidden;
        }
      }
    }

    .content-item {
      width: 332rpx;
      height: fit-content;
      display: flex;
      flex-direction: column;
      margin-top: 36rpx;

      .text-box {
        margin-top: 16rpx;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 350;
        font-size: 28rpx;
        color: #0b1526;
      }

      .info-box {
        margin-top: 16rpx;
        display: flex;
        align-items: center;
        font-family:
          Source Han Sans,
          Source Han Sans;
        font-weight: 350;
        font-size: 24rpx;
        color: #8d93a6;

        .name {
          margin-left: 16rpx;
          flex: 1;
        }
      }

      .like-box {
        display: flex;
        margin-right: 4rpx;
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

:deep() {
  .zp-l-container {
    margin-bottom: 20rpx;
  }
}
</style>
