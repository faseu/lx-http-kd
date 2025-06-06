<route lang="json5">
{
  style: {
    navigationBarTitleText: '发布精彩瞬间',
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>

<template>
  <view class="content">
    <wd-toast />
    <wd-form ref="form" :model="model" errorType="toast" :rules="getRules()">
      <!-- 照片上传区域 -->
      <wd-cell-group custom-class="group">
        <template #value>
          <text class="color-[#999] text-24rpx">至少上传1张照片，最多12张</text>
        </template>
        <wd-upload
          multiple
          :limit="12"
          v-model:file-list="model.fileList"
          action="/api/image/upload"
          @change="handleFileChange"
        />
      </wd-cell-group>

      <!-- 基本信息 -->
      <wd-cell-group custom-class="group" title="基本信息">
        <wd-input
          label="标题"
          label-width="100px"
          :maxlength="30"
          prop="title"
          v-model="model.title"
          placeholder="请输入标题"
        />
        <wd-textarea
          label="描述"
          label-width="100px"
          prop="description"
          v-model="model.description"
          auto-height
          :maxlength="500"
          clearable
          show-word-limit
          placeholder="分享你的精彩瞬间..."
        />
      </wd-cell-group>

      <!-- 位置信息 -->
      <wd-cell-group custom-class="group" title="位置信息">
        <wd-input
          label="省份/城市"
          label-width="100px"
          :maxlength="20"
          prop="province"
          v-model="model.province"
          placeholder="请输入省份或城市"
        />
      </wd-cell-group>

      <!-- 关联活动 -->
      <wd-cell-group custom-class="group" title="关联活动">
        <template #value>
          <text class="color-[#999] text-24rpx">（可选）选择相关的活动</text>
        </template>
        <wd-picker
          label="选择活动"
          placeholder="请选择关联的活动"
          label-width="100px"
          prop="activity_id"
          v-model="model.activity_id"
          :columns="activityList"
          value-key="id"
          label-key="team_name"
        />
      </wd-cell-group>

      <wd-gap bg-color="#FFFFFF" safe-area-bottom height="150rpx"></wd-gap>

      <view class="footer bg-white">
        <view class="flex items-center text-20rpx h-120rpx">
          <view class="flex flex-col items-center mr-48rpx" @click="resetModel">
            <image class="w-32rpx h-32rpx" src="/static/images/common/reload.png" alt="" />
            <view class="mt-6rpx">清空</view>
          </view>
          <wd-button
            custom-style="flex: 1; background-color: #4BD06E !important;"
            type="primary"
            size="large"
            @click="handleSubmit"
            block
          >
            发布
          </wd-button>
        </view>
        <wd-gap bg-color="#FFFFFF" safe-area-bottom height="0"></wd-gap>
      </view>
    </wd-form>
  </view>
</template>

<script lang="js" setup>
import { reactive, ref } from 'vue'
import { httpPost, httpGet } from '@/utils/http'
import { onLoad } from '@dcloudio/uni-app'
import { useToast } from 'wot-design-uni'

const toast = useToast()
const form = ref()

// 表单数据
const model = reactive({
  fileList: [],
  title: '',
  description: '',
  province: '',
  activity_id: null,
})

// 活动列表
const activityList = ref([])

// 获取活动列表
const { run: getActivityList } = useRequest(() =>
  httpGet('/api/activity/select_list', {
    page: 1,
    page_size: 1000,
  }),
)

// 发布精彩瞬间
const { run: publishMoment } = useRequest((data) => httpPost('/api/album/upload', data))

// 表单验证规则
const getRules = () => ({
  title: [
    { required: true, message: '请输入标题' },
    { min: 2, message: '标题至少2个字符' },
  ],
  description: [
    { required: true, message: '请输入描述' },
    { min: 5, message: '描述至少5个字符' },
  ],
  province: [{ required: true, message: '请输入省份或城市' }],
})

onLoad(async (options) => {
  // 获取活动列表
  try {
    const result = await getActivityList()
    if (result && result.list) {
      activityList.value = result.list
    }
  } catch (error) {
    console.error('获取活动列表失败:', error)
  }
})

// 处理文件上传变化
const handleFileChange = ({ fileList }) => {
  model.fileList = fileList
  console.log('文件列表更新:', fileList)
}

// 重置表单
const resetModel = () => {
  model.fileList = []
  model.title = ''
  model.description = ''
  model.province = ''
  model.activity_id = null
}

// 提交发布
const handleSubmit = async () => {
  try {
    // 表单验证
    const { valid, errors } = await form.value.validate()
    if (!valid) {
      return
    }

    // 检查是否上传了照片
    if (!model.fileList || model.fileList.length === 0) {
      toast.show('请至少上传1张照片')
      return
    }

    // 检查照片是否上传成功
    const allSuccess = model.fileList.every((item) => item.status === 'success')
    if (!allSuccess) {
      toast.show('照片上传中，请稍后再试')
      return
    }

    uni.showLoading({ title: '发布中...' })

    // 提取上传成功的图片URL
    const images = model.fileList.map((item) => {
      const response = JSON.parse(item.response)
      return response.data
    })

    // 构建提交数据
    const submitData = {
      images,
      cover_image: images[0], // 使用第一张图片作为封面
      title: model.title,
      description: model.description,
      province: model.province,
    }

    // 如果选择了关联活动，添加activity_id
    if (model.activity_id) {
      submitData.activity_id = model.activity_id
    }

    console.log('提交数据:', submitData)

    await publishMoment(submitData)

    uni.hideLoading()
    toast.show('发布成功！')

    // 延迟返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    console.error('发布失败:', error)
    toast.show('发布失败，请重试')
  }
}
</script>

<style scoped lang="scss">
.content {
  padding: 20rpx;
  box-sizing: border-box;
}

.footer {
  padding: 0 40rpx;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}

:deep() {
  .group {
    .wd-cell-group__title {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .wd-cell-group__title {
    align-items: center;
  }
  .wd-cell-group__left {
    font-size: 28rpx !important;
    font-weight: bold !important;
    color: #333333 !important;
  }
  .wd-cell-group__right {
    flex: 1;
    font-size: 24rpx !important;
    color: #999999 !important;
  }
  .wd-picker__cell {
    margin-top: 4rpx;
    background: #f6f8fa !important;
    border-radius: 10rpx !important;
  }
  .wd-input.is-cell {
    margin-top: 4rpx;
    background: #f6f8fa !important;
    border-radius: 10rpx !important;
  }
  .wd-textarea.is-cell {
    margin-top: 4rpx;
    background: #f6f8fa !important;
    border-radius: 10rpx !important;
  }
  .wd-textarea__value {
    background: #f6f8fa !important;
  }
  .wd-textarea__count {
    background: #f6f8fa !important;
  }
  .wd-textarea__clear {
    background: #f6f8fa !important;
  }
  .wd-input__placeholder {
    color: #bfbfbf !important;
  }
  .wd-textarea__placeholder {
    color: #bfbfbf !important;
    line-height: 48rpx !important;
  }
  .wd-input__inner {
    color: #262626 !important;
  }
  .wd-upload__preview {
    margin: 0 16rpx 12rpx 0 !important;
  }
  .wd-upload__preview:nth-child(4n) {
    margin: 0 !important;
  }
}
</style>
