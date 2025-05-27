<route lang="json5">
{
  style: {
    navigationBarTitleText: '分享',
  },
}
</route>

<template>
  <view class="detail-container">
    <!-- 用户信息 -->
    <view class="user-info">
      <view class="user-avatar">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
      </view>
      <view class="user-name">{{ userInfo.nickname }}</view>
      <view class="follow-btn" @click="handleFollow">
        <text>{{ isFollowed ? '已关注' : '关注' }}</text>
      </view>
      <view class="alarm-icon">
        <uni-icons type="notification-filled" size="24"></uni-icons>
      </view>
    </view>

    <!-- 图片轮播 -->
    <swiper class="swiper" :indicator-dots="true" :autoplay="false" :duration="500">
      <swiper-item v-for="(image, index) in images" :key="index">
        <image :src="image" mode="aspectFill" class="swiper-image"></image>
      </swiper-item>
    </swiper>

    <!-- 底部内容 -->
    <view class="content">
      <text class="description">{{ post.description }}</text>
      <!-- <view class="tags">
        <text v-for="(tag, index) in post.tags" :key="index" class="tag">#{{ tag }}</text>
      </view> -->
      <view class="post-info">
        <text class="post-time">发布于 {{ post.createTime }} | {{ post.location }}</text>
      </view>
      <view class="interaction">
        <view class="like" @click="handleLike">
          <image v-if="!post.isLiked" src="/static/images/share/heart.png" mode="aspectFill" class="info-image"></image>
          <image v-else src="/static/images/share/heart-selected.png" mode="aspectFill" class="info-image"></image>
          <text>{{ post.likes }}</text>
        </view>
        <view class="star" @click="handleStar">
          <image v-if="!post.isStarred" src="/static/images/share/star.png" mode="aspectFill" class="info-image"></image>
          <image v-else src="/static/images/share/star-selected.png" mode="aspectFill" class="info-image"></image>
          <text>{{ post.stars }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="js" setup>
import { httpGet, httpPost } from '@/utils/http'
import { ref, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useToast } from 'wot-design-uni'

const albumData = ref(null)
let tmpUrl = ''
const { run: runAlbumDetails } = useRequest((e) => httpGet(tmpUrl, {}))

onLoad(async (e) => {
  console.log('进入详情', e.id)
  tmpUrl = `/api/album/details/${e.id}`
  const value1 = await runAlbumDetails()
  albumData.value = value1
})
// 初始化数据
const albumDetails = ref({})

// 处理数据加载
const processData = () => {
  if (albumData.value) {
    // 更新用户信息
    userInfo.avatar = albumData.value.uploader?.avatar || ''
    userInfo.nickname = albumData.value.uploader?.nickname || ''

    // 更新图片数据
    if (albumData.value.images && albumData.value.images.length > 0) {
      images.value = albumData.value.images.map((img) => img.image)
    }
    console.log('albumData', images.value)

    // 更新帖子数据
    post.description = albumData.value.description || ''
    post.createTime = albumData.value.created_at ? albumData.value.created_at.substring(0, 10) : ''
    post.location = `${albumData.value.province || ''}${albumData.value.city ? '·' + albumData.value.city : ''}`
    post.likes = albumData.value.likes_count || 0
    post.stars = albumData.value.favorites_count || 0
    post.isLiked = albumData.value.is_liked || false
    post.isStarred = albumData.value.is_favorited || false

    // 更新关注状态
    isFollowed.value = albumData.value.is_followed || false

    // 关注
    tmpUploaderId.value = `/api/album/follower/${albumData.value.uploader?.id}`

    // 点赞
    tmpLike.value = `/api/album/like/${albumData.value.id}`
    // 收藏
    tmpStar.value = `/api/album/favorite/${albumData.value.id}`
  }
}

// 监听数据变化
watch(
  () => albumData.value,
  () => {
    processData()
  },
  { immediate: true },
)

// 用户信息
const userInfo = reactive({
  avatar: '',
  nickname: '',
})
// 关注状态
const isFollowed = ref(null)

// 图片数据
const images = ref([])

// 帖子数据
const post = reactive({
  description: '',
  createTime: '',
  location: '',
  likes: '',
  stars: '',
  isLiked: '',
  isStarred: '',
})

// 处理关注
let tmpUploaderId = ref('')

const handleFollow = async () => {
  const { run: runUploader } = useRequest((e) => httpPost(tmpUploaderId.value, {}))
  const value2 = await runUploader()
  console.log('value2', value2, value2.follower)

  isFollowed.value = value2.follower
}

// 处理点赞
const toast = useToast()
let tmpLike = ref('')
const handleLike = async () => {
  const { run: runSentLike } = useRequest((e) => httpPost(tmpLike.value, {}))
  post.isLiked = !post.isLiked
  const value3 = await runSentLike()
  post.likes = value3.likes_count
  if (value3.liked) {
    toast.show('点赞成功')
  } else {
    toast.show('取消点赞成功')
  }
}

// 处理收藏
let tmpStar = ref('')
const handleStar = async () => {
  const { run: runStar } = useRequest((e) => httpPost(tmpStar.value, {}))
  post.isStarred = !post.isStarred
  const value4 = await runStar()
  console.log('value4', value4)
  post.stars = value4.favorites_count
  if (value4.favorited) {
    toast.show('收藏成功')
  } else {
    toast.show('取消收藏成功')
  }
}
</script>

<style lang="scss" scoped>
.detail-container {
  background-color: #fff;
  min-height: 100vh;
}

.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 100;
}

.user-info {
  padding: 10px 15px;
  display: flex;
  align-items: center;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-name {
    margin-left: 10px;
    font-size: 16px;
    font-weight: 500;
  }

  .follow-btn {
    margin-left: auto;
    padding: 5rpx 30rpx;
    border-radius: 40rpx;
    color: #ff6619;
    border: 2rpx solid #ff6619;
  }

  .alarm-icon {
    margin-left: 15px;
  }
}

.swiper {
  width: 100%;
  height: 60vh;

  .swiper-image {
    width: 100%;
    height: 100%;
  }
}

.content {
  padding: 15px;

  .description {
    font-size: 15px;
    line-height: 1.5;
    color: #333;
  }

  .tags {
    margin-top: 10px;

    .tag {
      color: #0066cc;
      margin-right: 10px;
    }
  }

  .post-info {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
  }

  .interaction {
    margin-top: 15px;
    display: flex;
    gap: 20px;

    .like,
    .star {
      display: flex;
      align-items: center;
      gap: 5px;

      text {
        color: #666;
      }
    }
  }

  .info-image {
    width: 48rpx;
    height: 48rpx;
  }
}
</style>
