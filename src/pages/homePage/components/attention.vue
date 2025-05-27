<template>
  <view class="content-box">
    <view class="content-left">
      <view class="content-item content-item-left" v-for="(i, j) in contentList1" :key="j">
        <view class="img-box">
          <wd-img width="100%" height="100%" :src="i.imgUrl" />
        </view>
        <view class="text-box">{{ i.text }}</view>
        <view class="info-box">
          <view class="avator">
            <wd-img :width="24" :height="24" round :src="i.avatarUrl" />
          </view>
          <view class="name">{{ i.name }}</view>
          <view class="like-box" v-if="i.like">
            <wd-img :width="12" :height="12" src="/static/images/homepage/like.png" />
          </view>
          <view class="like-box" v-else>
            <wd-img :width="12" :height="12" src="/static/images/homepage/unlike.png" />
          </view>
          <view class="num">{{ formatLargeNumber(i.saveNum) }}</view>
        </view>
      </view>
    </view>
    <view class="content-right">
      <view class="content-item content-item-right" v-for="(i, j) in contentList2" :key="j">
        <view class="img-box">
          <wd-img width="100%" height="100%" :src="i.imgUrl" />
        </view>
        <view class="text-box">{{ i.text }}</view>
        <view class="info-box">
          <view class="avator">
            <wd-img :width="24" :height="24" round :src="i.avatarUrl" />
          </view>
          <view class="name">{{ i.name }}</view>
          <view class="like-box" v-if="i.like">
            <wd-img :width="12" :height="12" src="/static/images/homepage/like.png" />
          </view>
          <view class="like-box" v-else>
            <wd-img :width="12" :height="12" src="/static/images/homepage/unlike.png" />
          </view>
          <view class="num">{{ formatLargeNumber(i.saveNum) }}</view>
        </view>
      </view>
    </view>
    <view class="attention-box">
      <wd-img
      height="132rpx"
      width="132rpx"
      src="/static/images/homepage/plus-btn.png"
    ></wd-img>
    </view>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  contentList: {
    type: Array,
    required: true,
  },
})

/**
 * @brief        :
 * @explanation  : 处理数组
 * @return        {*}
 */
const contentList1 = ref([])

const contentList2 = ref([])

// 监听 props.items 的变化
watch(
  () => props.contentList,
  (newItems) => {
    const tmpArr1 = []
    const tmpArr2 = []
    props.contentList.forEach((item, index) => {
      console.log(index % 2 == 1, item)

      if ((index + 1) % 2 == 1) {
        tmpArr1.push(item)
      } else {
        tmpArr2.push(item)
      }
    })
    contentList1.value = tmpArr1
    contentList2.value = tmpArr2
    console.log(contentList1, contentList2)
  },
  {
    immediate: true, // 立即执行一次，初始化赋值
  },
)

// 数字格式化方法
const formatLargeNumber = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + '万'
  return num
}

function loadMore() {
  console.log('触底咯')
}
</script>

<style lang="scss" scoped>
.content-box {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  position: relative;

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

  .attention-box{
    width: 132rpx;
    height: 132rpx;
    position: fixed;
    bottom: 86rpx;
    right: 0;
  }
}
</style>
