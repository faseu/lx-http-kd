<route lang="json5">
{
  style: {
    navigationBarTitleText: '发布',
    navigationBarBackgroundColor: '#ffffff',
  },
}
</route>
<template>
  <view class="content">
    <wd-message-box />
    <wd-toast />
    <wd-form ref="form" :model="model" errorType="toast" :rules="getRules()">
      <wd-cell-group custom-class="group" title="活动图片">
        <wd-upload
          multiple
          :limit="20"
          v-model:file-list="model.fileList"
          action="/api/image/upload"
        />
      </wd-cell-group>
      <wd-cell-group custom-class="group" title="活动信息">
        <wd-input
          label="活动名称"
          label-width="100px"
          :maxlength="50"
          prop="title"
          v-model="model.title"
          placeholder="请输入活动名称"
        />
        <wd-textarea
          label="活动简介"
          label-width="100px"
          prop="team_intro"
          v-model="model.team_intro"
          auto-height
          :maxlength="120"
          clearable
          show-word-limit
          placeholder="请输入活动简介"
        />
      </wd-cell-group>
      <wd-cell-group custom-class="group" title="路线信息">
        <wd-picker
          v-if="model.is_car_required"
          label="徒步类型"
          placeholder="请选择徒步类型"
          label-width="100px"
          prop="hiking_type"
          v-model="model.hiking_type"
          :columns="carfareList"
        />
        <wd-input
          label="徒步距离(m)"
          type="number"
          label-width="100px"
          :maxlength="10"
          prop="hiking_distance"
          v-model="model.hiking_distance"
          placeholder="请输入徒步距离"
        />
        <wd-input
          label="海拔爬升(m)"
          type="number"
          label-width="100px"
          :maxlength="10"
          prop="altitude_ascent"
          v-model="model.altitude_ascent"
          placeholder="请输入海拔爬升"
        />
        <wd-input
          label="登顶海拔(m)"
          type="number"
          label-width="100px"
          :maxlength="10"
          prop="peak_altitude"
          v-model="model.peak_altitude"
          placeholder="请输入登顶海拔"
        />
        <wd-input
          label="预计时长(时)"
          type="digit"
          label-width="100px"
          :maxlength="10"
          prop="hiking_duration"
          v-model="model.hiking_duration"
          placeholder="请输入预计时长"
        />
      </wd-cell-group>
      <wd-cell-group custom-class="group" title="活动信息">
        <wd-datetime-picker
          label="开始时间"
          label-width="100px"
          placeholder="请选择时间"
          prop="start_time"
          :minDate="Date.now()"
          v-model="model.start_time"
        />
        <wd-datetime-picker
          label="结束时间"
          label-width="100px"
          placeholder="请选择时间"
          prop="end_time"
          :minDate="Date.now()"
          v-model="model.end_time"
        />
        <wd-input
          label="人数(个)"
          type="number"
          label-width="100px"
          :maxlength="3"
          prop="max_participants"
          v-model="model.max_participants"
          placeholder="请输入人数"
        />
        <wd-input
          label="集合地点"
          label-width="100px"
          :maxlength="50"
          prop="location"
          v-model="model.location"
          placeholder="请输入集合地点"
        />
        <wd-picker
          label="出行方式"
          placeholder="请选择出行方式"
          label-width="100px"
          prop="travel_method"
          v-model="model.travel_method"
          :columns="howToGetAroundList"
        />
        <wd-picker
          label="车费结算方式"
          placeholder="请选择车费结算方式"
          label-width="100px"
          prop="cost_method"
          v-model="model.cost_method"
          :columns="hikingTypeList"
        />
      </wd-cell-group>
      <wd-cell-group custom-class="group" title="费用信息" value="（填写每人费用）">
        <wd-input
          label="住宿(元)"
          type="digit"
          label-width="100px"
          :maxlength="20"
          prop="accommodation_fee"
          v-model="model.accommodation_fee"
          placeholder="请输入住宿费用"
          @blur="onFeeBlur"
        />
        <wd-input
          label="车费(元)"
          type="digit"
          label-width="100px"
          :maxlength="20"
          prop="car_fee"
          v-model="model.car_fee"
          placeholder="请输入车费"
          @blur="onFeeBlur"
        />
        <wd-input
          label="其他(元)"
          type="digit"
          label-width="100px"
          :maxlength="20"
          prop="other_fee"
          v-model="model.other_fee"
          placeholder="请输入其他费用"
          @blur="onFeeBlur"
        />
        <wd-input
          label="其他说明"
          label-width="100px"
          :maxlength="50"
          prop="other_fee_introduced"
          v-model="model.other_fee_introduced"
          placeholder="请输入其他说明"
        />
      </wd-cell-group>
      <wd-cell-group custom-class="group" title="装备信息">
        <wd-select-picker
          label="头部"
          placeholder="请选择头部装备"
          label-width="100px"
          prop="equipment_info.head"
          v-model="model.equipment_info.head"
          :columns="headValues"
        />
        <wd-select-picker
          label="上半身"
          placeholder="请选择上半身装备"
          label-width="100px"
          prop="equipment_info.upper_body"
          v-model="model.equipment_info.upper_body"
          :columns="upperValues"
        />
        <wd-select-picker
          label="下半身"
          placeholder="请选择下半身装备"
          label-width="100px"
          prop="equipment_info.lower_body"
          v-model="model.equipment_info.lower_body"
          :columns="lowerValues"
        />
        <wd-select-picker
          label="鞋子"
          placeholder="请选择鞋子装备"
          label-width="100px"
          prop="equipment_info.feet_body"
          v-model="model.equipment_info.feet_body"
          :columns="feetValues"
        />
        <wd-select-picker
          label="背包"
          placeholder="请选择头部装备"
          label-width="100px"
          prop="equipment_info.backpack"
          v-model="model.equipment_info.backpack"
          :columns="bagValues"
        />
        <wd-input
          label="其他装备"
          label-width="100px"
          prop="equipment_info.equipment_other"
          v-model="model.equipment_info.equipment_other"
          placeholder="请输入其他装备"
        />
      </wd-cell-group>
      <wd-cell-group custom-class="group" title="联系方式">
        <wd-input
          label="手机号"
          type="number"
          label-width="100px"
          :maxlength="11"
          prop="phone"
          v-model="model.phone"
          placeholder="请输入手机号"
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
            custom-style="flex: 1; background-color: #000000 !important;"
            type="primary"
            size="large"
            @click="handleSubmit"
            block
          >
            {{ isEditing ? '更新' : '提交' }}
          </wd-button>
        </view>
        <wd-gap bg-color="#FFFFFF" safe-area-bottom height="0"></wd-gap>
      </view>
    </wd-form>
  </view>
</template>

<script lang="js" setup>
import { useToast } from 'wot-design-uni'
import { reactive, ref } from 'vue'
import { httpGet, httpPost } from '@/utils/http'
import { onLoad } from '@dcloudio/uni-app'
import {
  numberList,
  carfareList,
  headValues,
  upperValues,
  lowerValues,
  feetValues,
  bagValues,
  howToGetAroundList,
  hikingTypeList,
} from '@/utils/config'
import dayjs from 'dayjs'

const id = ref(null)
const editId = ref(null) // 编辑时的活动ID
const isEditing = ref(false) // 是否为编辑模式
const insuranceCost = ref('')
const toast = useToast()

const initialModel = {
  title: '',
  location: '',
  start_time: '',
  end_time: '',
  hiking_type: '',
  hiking_distance: '',
  hiking_duration: '',
  altitude_ascent: '',
  peak_altitude: '',
  is_car_required: true,
  travel_method: '',
  car_fee: '',
  accommodation_fee: '',
  insurance_cost: 10,
  other_fee: '',
  other_fee_introduced: '',
  cost_method: '',
  activity: '',
  max_participants: '',
  phone: '',
  team_intro: '',
  fileList: [],
  equipment_info: {
    backpack: [],
    feet_body: [],
    head: [],
    lower_body: [],
    upper_body: [],
    equipment_other: '',
  },
}

const model = reactive({ ...initialModel })
const { data: activityList, run: getActivityList } = useRequest((e) =>
  httpGet('/api/activity/select_list', {
    page: 1,
    page_size: 1000,
  }),
)

const { run: createTeam } = useRequest((e) => httpPost('/api/join_team', e))
const { run: updateTeam } = useRequest((e) => httpPost(`/api/edit_team`, e))
const { run: getTeamDetail } = useRequest((e) => httpGet(`/api/team/user/detail/${e.id}`))

onLoad(async (options) => {
  console.log('onLoad options:', options)

  // 检查是否为编辑模式
  if (options.editId) {
    isEditing.value = true
    editId.value = options.editId

    // 设置导航栏标题为编辑
    uni.setNavigationBarTitle({
      title: '编辑活动',
    })

    // 获取活动详情并填充表单
    await loadTeamDetailForEdit(options.editId)
  } else {
    // 新建模式的原有逻辑
    if (options.id) {
      id.value = options.id
      model.activity = Number(options.id)
    }
    if (options.insuranceCost) {
      insuranceCost.value = options.insuranceCost
    }
  }
})

// 获取活动详情并填充表单
const loadTeamDetailForEdit = async (teamId) => {
  try {
    uni.showLoading({ title: '加载中...' })

    const data = await getTeamDetail({ id: teamId })
    const teamDetail = JSON.parse(JSON.stringify(data.team_detail))

    // 填充表单数据
    fillFormWithTeamDetail(teamDetail)

    uni.hideLoading()
  } catch (error) {
    uni.hideLoading()
    console.error('获取活动详情失败:', error)
    toast.show('获取活动详情失败')
  }
}

// 将队伍详情数据填充到表单中
const fillFormWithTeamDetail = (teamDetail) => {
  const modelTemp = {}
  // 基本信息
  modelTemp.title = teamDetail.team_name || ''
  modelTemp.team_intro = teamDetail.team_intro || ''
  modelTemp.location = teamDetail.location || ''
  modelTemp.phone = teamDetail.phone || ''

  // 时间信息 - 将时间戳转换为Date对象
  if (teamDetail.start_time) {
    modelTemp.start_time = new Date(teamDetail.start_time).getTime()
  }
  if (teamDetail.end_time) {
    modelTemp.end_time = new Date(teamDetail.end_time).getTime()
  }

  // 路线信息
  modelTemp.hiking_type = teamDetail.hiking_type || '休闲徒步'
  modelTemp.hiking_distance = parseFloat(teamDetail.hiking_distance) || 0
  modelTemp.altitude_ascent = parseFloat(teamDetail.altitude_ascent) || 0
  modelTemp.peak_altitude = parseFloat(teamDetail.peak_altitude) || 0
  modelTemp.hiking_duration = parseFloat(teamDetail.hiking_duration) || 0

  // 活动设置
  modelTemp.max_participants = teamDetail.max_participants || 0
  modelTemp.travel_method = teamDetail.travel_method || '拼车'
  modelTemp.cost_method = teamDetail.cost_method || 1
  modelTemp.is_car_required = teamDetail.is_car_required || true

  // 费用信息
  modelTemp.accommodation_fee = parseFloat(teamDetail.accommodation_fee) || 0
  modelTemp.car_fee = parseFloat(teamDetail.car_fee) || 0
  modelTemp.insurance_cost = parseFloat(teamDetail.insurance_price) || 0
  modelTemp.other_fee = parseFloat(teamDetail.other_fee) || 0
  modelTemp.other_fee_introduced = teamDetail.other_fee_introduced || ''

  // 装备信息
  if (teamDetail.equipment_info) {
    modelTemp.equipment_info = {
      head: teamDetail.equipment_info.head || [],
      upper_body: teamDetail.equipment_info.upper_body || [],
      lower_body: teamDetail.equipment_info.lower_body || [],
      feet_body: teamDetail.equipment_info.feet_body || [],
      backpack: teamDetail.equipment_info.backpack || [],
      equipment_other: teamDetail.equipment_info.equipment_other || '',
    }
  }

  // 处理活动图片 - 将已有图片转换为上传组件的格式
  if (teamDetail.activity_images && teamDetail.activity_images.length > 0) {
    modelTemp.fileList = teamDetail.activity_images.map((imageUrl, index) => ({
      uid: `existing-${index}`,
      name: `image-${index}.jpg`,
      status: 'success',
      url: imageUrl,
      response: JSON.stringify({ data: imageUrl }),
    }))
  }
  Object.assign(model, modelTemp)
}

// 1. 在 script 部分添加时间校验函数
const validateTimeRange = () => {
  const now = new Date()
  const startTime = model.start_time
  const endTime = model.end_time
  console.log(now, startTime, endTime)

  // 编辑模式下，允许开始时间小于当前时间（因为可能是已经开始的活动）
  if (!isEditing.value && startTime <= now) {
    toast.show('开始时间必须大于当前时间')
    return false
  }

  // 检查结束时间是否大于开始时间
  if (endTime <= startTime) {
    toast.show('结束时间必须大于开始时间')
    return false
  }

  return true
}

const getRules = () => ({
  // 活动信息
  title: [{ required: true, message: '请输入活动名称' }],
  team_intro: [{ required: true, message: '请输入活动简介' }],

  // 路线信息
  hiking_type: [{ required: true, message: '请选择徒步类型' }],
  hiking_distance: [{ required: true, message: '请输入徒步距离' }],
  altitude_ascent: [{ required: true, message: '请输入海拔爬升' }],
  peak_altitude: [{ required: true, message: '请输入登顶海拔' }],
  hiking_duration: [{ required: true, message: '请输入预计时长' }],

  // 时间与集合信息
  start_time: [{ required: true, message: '请选择开始时间' }],
  end_time: [{ required: true, message: '请选择结束时间' }],
  max_participants: [{ required: true, message: '请选择人数' }],
  location: [{ required: true, message: '请输入集合地点' }],
  travel_method: [{ required: true, message: '请选择出行方式' }],
  cost_method: [{ required: model.travel_method === '拼车', message: '请选择车费结算方式' }], // 可根据需求改为 required: true

  // 费用信息
  accommodation_fee: [{ required: true, message: '请输入住宿费用' }],
  car_fee: [{ required: true, message: '请输入车费' }],
  insurance_cost: [{ required: true, message: '请输入保险费用' }],
  other_fee: [{ required: true, message: '请输入其他费用' }],

  // 装备信息（必选装备部分，如有强制项）
  'equipment_info.head': [{ required: true, message: '请选择头部装备' }],
  'equipment_info.upper_body': [{ required: true, message: '请选择上半身装备' }],
  'equipment_info.lower_body': [{ required: true, message: '请选择下半身装备' }],
  'equipment_info.feet_body': [{ required: true, message: '请选择鞋子装备' }],
  'equipment_info.backpack': [{ required: true, message: '请选择背包装备' }],

  // 联系方式
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
  ],
})

const form = ref()

const handleSubmit = async () => {
  // 先进行时间范围校验
  if (!validateTimeRange()) {
    return
  }
  console.log('时间范围校验')

  const allSuccess =
    model?.fileList?.length > 0 && model?.fileList?.every((item) => item.status === 'success')
  if (!allSuccess) {
    toast.show('请上传至少1张图片！')
    return
  }

  const { valid, errors } = await form.value.validate()

  if (valid) {
    const submitData = {
      ...model,
      start_time: model.start_time,
      end_time: model.end_time,
      is_charged: +model.car_fee + +model.accommodation_fee + +model.other_fee > 0,
      max_participants: +model.max_participants,
      cost_method: model.is_car_required ? model.cost_method : 2,
      activity_images: model.fileList.map((item) => {
        // 如果是已存在的图片，直接使用URL
        if (item.url && !item.response) {
          return item.url
        }
        // 如果是新上传的图片，解析response
        return JSON.parse(item.response).data
      }),
    }

    try {
      if (isEditing.value) {
        submitData.team_id = editId.value
        await updateTeam(submitData)
        toast.show('活动更新成功！')
      } else {
        // 新建模式：调用创建接口
        await createTeam(submitData)
        toast.show('队伍发布已提交！')
      }

      setTimeout(() => {
        uni.navigateBack()
      }, 1000)
    } catch (error) {
      console.error('提交失败:', error)
      toast.show(isEditing.value ? '更新失败，请重试' : '发布失败，请重试')
    }
  }
}

const onFeeBlur = () => {
  if (!isNaN(parseFloat(model.car_fee))) {
    model.car_fee = Number(parseFloat(model.car_fee).toFixed(2)).toString()
  }
  if (!isNaN(parseFloat(model.accommodation_fee))) {
    model.accommodation_fee = Number(parseFloat(model.accommodation_fee).toFixed(2)).toString()
  }
  if (!isNaN(parseFloat(model.other_fee))) {
    model.other_fee = Number(parseFloat(model.other_fee).toFixed(2)).toString()
  }
}

const resetModel = () => {
  Object.assign(model, initialModel)
  if (id.value) {
    model.activity = id.value // 保持 activity = id.value
  }
}
</script>

<style scoped lang="scss">
.inline-txt {
  display: inline-block;
  font-size: 28rpx;
  margin: 28rpx 30rpx 0;
  color: rgba(0, 0, 0, 0.45);
  vertical-align: middle;
}

.tip {
  margin: 10rpx 15rpx 21rpx;
  color: #999;
  font-size: 24rpx;
}
.footer {
  padding: 0 40rpx;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}

.content {
  padding: 20rpx;
  box-sizing: border-box;
}

:deep() {
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
  .wd-select-picker__cell {
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
