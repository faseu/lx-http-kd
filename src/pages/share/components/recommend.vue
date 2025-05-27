<template>
  <z-paging
    ref="paging"
    :fixed="false"
    :paging-style="{ height: '570px' }"
    :show-scrollbar="false"
    v-model="dataList"
    @query="queryList"
  >
    <view class="content-box">
      <view class="content-left">
        <view class="content-item content-item-left" v-for="(i, j) in contentList1" :key="j" @click="toDetail(i)">
          <view class="img-box">
            <wd-img width="100%" height="100%" :src="i.cover_image" />
          </view>
          <view class="text-box">{{ i.title }}</view>
          <view class="info-box">
            <view class="avator">
              <wd-img :width="24" :height="24" round :src="i.uploader.avatar" />
            </view>
            <view class="name">{{ i.uploader.nickname }}</view>
            <view class="like-box" v-if="i.is_liked" @click="likeAblum(i, 1, 'cut')">
              <wd-img :width="12" :height="12" src="/static/images/homepage/like.png" />
            </view>
            <view class="like-box" v-else @click="likeAblum(i, 1, 'plus')">
              <wd-img :width="12" :height="12" src="/static/images/homepage/unlike.png" />
            </view>
            <view class="num">{{ i.likes_count }}</view>
          </view>
        </view>
      </view>
      <view class="content-right">
        <view class="content-item content-item-right" v-for="(i, j) in contentList2" :key="j" @click="toDetail(i)">
          <view class="img-box">
            <wd-img width="100%" height="100%" :src="i.cover_image" />
          </view>
          <view class="text-box">{{ i.text }}</view>
          <view class="info-box">
            <view class="avator">
              <wd-img :width="24" :height="24" round :src="i.uploader.avatar" />
            </view>
            <view class="name">{{ i.uploader.nickname }}</view>
            <view class="like-box" v-if="i.is_liked" @click="likeAblum(i, 2, 'cut')">
              <wd-img :width="12" :height="12" src="/static/images/homepage/like.png" />
            </view>
            <view class="like-box" v-else @click="likeAblum(i, 2, 'plus')">
              <wd-img :width="12" :height="12" src="/static/images/homepage/unlike.png" />
            </view>
            <view class="num">{{ i.likes_count }}</view>
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<script lang="js" setup>
import { httpGet, httpPost } from '@/utils/http'
import { onShow } from '@dcloudio/uni-app'

const props = defineProps({
  contentList: {
    type: Array,
    required: true,
  },
})

// // 监听 props.items 的变化
// watch(
//   () => albumList._rawValue.data_list,
//   (newItems) => {

//     albumList._rawValue.data_list.forEach((item, index) => {
//       if ((index + 1) % 2 == 1) {
//         tmpArr1.push(item)
//       } else {
//         tmpArr2.push(item)
//       }
//     })

//   },
//   {
//     immediate: true, // 立即执行一次，初始化赋值
//   },
// )

// 数字格式化方法
const formatLargeNumber = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num
}

// 点赞方法
const likeAblum = (e, z, j) => {
  console.log(e.id, z)
  switch (z) {
    case 1:
      contentList1.value.forEach(item => {
        if(e.id == item.id) {
          item.is_liked = !item.is_liked
          sentLikeRequest(e.id)
          if(j == 'plus') {
            item.likes_count++
          } else {
            item.likes_count--
          }
        }
      })
      break
    case 2:
    contentList2.value.forEach(item => {
        if(e.id == item.id) {
          item.is_liked = !item.is_liked
          sentLikeRequest(e.id)
          if(j == 'plus') {
            item.likes_count++
          } else {
            item.likes_count--
          }
        }
      })
      break
    default:
      break
  }
}

// 调用接口
const sentLikeRequest = async (e) => {
  const tmpUrl = `/api/album/like/${e}`
  const { data: sentLike, run: runsentLike } = useRequest((e) =>
    httpPost(tmpUrl, {}),
  )
  await runsentLike()
}

const paging = ref(null)
const dataList = ref([])

/**
 * @brief        :
 * @explanation  : 处理数组
 * @return        {*}
 */
const contentList1 = ref([])

const contentList2 = ref([])

// 请求活动列表
const queryList = async (pageNo, pageSize) => {
  const { data: albumList, run: runGetAlbumList } = useRequest((e) =>
    httpGet('/api/album/list', {
      page_size: pageSize,
      page: pageNo,
    }),
  )
  await runGetAlbumList()
  paging.value.complete(albumList._rawValue.data_list)

  console.log('albumList', albumList._rawValue.data_list)
  if (albumList._rawValue.data_list.length > 0) {
    albumList._rawValue.data_list.forEach((item, index) => {
      if ((index + 1) % 2 == 1) {
        contentList1.value.push(item)
      } else {
        contentList2.value.push(item)
      }
    })

    console.log(contentList1, contentList2)
  }
}

const toDetail = (e) => {
  uni.navigateTo({
    url: `/pages/share/detail?id=${e.id}`,
  })
}
</script>

<style lang="scss" scoped>
.content-box {
  width: 100%;
  display: flex;
  justify-content: space-between;

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
</style>
