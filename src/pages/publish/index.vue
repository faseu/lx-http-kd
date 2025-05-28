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
          :minDate="new Date().getTime()"
          v-model="model.start_time"
        />
        <wd-datetime-picker
          label="结束时间"
          label-width="100px"
          placeholder="请选择时间"
          prop="end_time"
          :minDate="new Date().getTime()"
          v-model="model.end_time"
        />
        <wd-picker
          label="人数"
          placeholder="请选择人数"
          label-width="100px"
          prop="max_participants"
          v-model="model.max_participants"
          :columns="numberList"
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
          label="保险(元)"
          type="digit"
          label-width="100px"
          :maxlength="20"
          disabled
          prop="insurance_cost"
          v-model="model.insurance_cost"
          placeholder="请输入保险费用"
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
            提交
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
const insuranceCost = ref('')
const toast = useToast()
const { data: activityList, run: getActivityList } = useRequest((e) =>
  httpGet('/api/activity/select_list', {
    page: 1,
    page_size: 1000,
  }),
)
const { run: createTeam } = useRequest((e) => httpPost('/api/join_team', e))
onLoad(async (options) => {
  // await getActivityList()
  if (options.id) {
    id.value = options.id
    model.activity = Number(options.id)
  }
  if (options.insuranceCost) {
    insuranceCost.value = options.insuranceCost
  }
})
const initialModel = {
  title: '活动名',
  location: '不不不',
  start_time: 1748066867132,
  end_time: 1748278800000,
  hiking_type: '休闲徒步',
  hiking_distance: 12,
  hiking_duration: 5,
  altitude_ascent: 13,
  peak_altitude: 15,
  is_car_required: true,
  travel_method: '拼车',
  car_fee: 15,
  accommodation_fee: 13,
  insurance_cost: 10,
  other_fee: 36,
  other_fee_introduced: '45',
  cost_method: 1,
  activity: '',
  max_participants: 1,
  phone: '15711111111',
  team_intro: '简介渐渐简介渐渐简介渐渐',
  equipment_info: {
    backpack: ['一次性雨衣', '洗漱用品', '防水袋'],
    feet_body: ['登山杖', '羊毛袜', '登山鞋'],
    head: ['头盔', '遮阳帽'],
    lower_body: ['羽绒裤', '速干裤', '护具'],
    upper_body: ['五点式安全带', '羽绒'],
    equipment_other: '不敢杠',
  },
}

const model = reactive({
  ...initialModel,
})

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
  other_fee_introduced: [{ required: false }],

  // 装备信息（必选装备部分，如有强制项）
  'equipment_info.head': [{ required: true, message: '请选择头部装备' }],
  'equipment_info.upper_body': [{ required: true, message: '请选择上半身装备' }],
  'equipment_info.lower_body': [{ required: true, message: '请选择下半身装备' }],
  'equipment_info.feet_body': [{ required: true, message: '请选择鞋子装备' }],
  'equipment_info.backpack': [{ required: true, message: '请选择背包装备' }],
  'equipment_info.equipment_other': [{ required: false }],

  // 联系方式
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
  ],
})

const form = ref()

const handleSubmit = async () => {
  const { valid, errors } = await form.value.validate()
  console.log(model)
  const allSuccess =
    model?.fileList?.length > 0 && model?.fileList?.every((item) => item.status === 'success')
  if (!allSuccess) {
    toast.show('请上传至少1张图片！')
    return
  }
  if (valid) {
    await createTeam({
      ...model,
      start_time: dayjs(model.start_time).format('YYYY-MM-DD HH:mm'),
      end_time: dayjs(model.end_time).format('YYYY-MM-DD HH:mm'),
      is_charged: +model.car_fee + +model.accommodation_fee + +model.other_fee > 0,
      max_participants: +model.max_participants,
      cost_method: model.is_car_required ? model.cost_method : 2,
      activity_images: model.fileList.map((item) => {
        return JSON.parse(item.response).data
      }),
    })
    toast.show('队伍发布已提交！')
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  }
}
const handleChangeActivity = ({ value, selectedItems }) => {
  insuranceCost.value = selectedItems.insurance_cost
}

const handleFileChange = (e) => {
  console.log(e)
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
