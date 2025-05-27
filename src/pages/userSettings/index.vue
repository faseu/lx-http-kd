<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '用户设置',
  },
}
</route>

<template>
  <view class="flex w-[100vw] h-[100vh] flex-col box-border pos-relative overflow-hidden">
    <view v-show="steps === 1">
      <wd-img
        mode="aspectFill"
        custom-style="position: absolute !important;"
        custom-class="pos-absolute top-0 left-0 w-[100vw] h-[100vh]"
        src="/static/images/common/bg1.png"
      />
      <view
        class="pos-absolute top-0 left-0 w-[100vw] h-[100vh] box-border p-[222rpx_68rpx_638rpx_68rpx] flex flex-col justify-between items-center min-h-1400rpx"
      >
        <view class="w-full h-86rpx">
          <view class="pos-relative inline-block h-full">
            <wd-img
              mode="aspectFill"
              custom-style="position: absolute !important;"
              custom-class="pos-absolute right-0 bottom-0 w-244rpx h-46rpx"
              src="/static/images/userSettings/decoration.png"
            />
            <view class="font-900 text-60rpx text-[#333333] h-full leading-86rpx pos-relative">
              请填写基本信息
            </view>
          </view>
        </view>
        <view class="w-full h-244rpx flex flex-col justify-between">
          <view class="pos-relative w-full h-100rpx" @click="handleSelectCity">
            <wd-img
              mode="aspectFill"
              custom-style="position: absolute !important;"
              custom-class="pos-absolute w-full h-full"
              src="/static/images/userSettings/input-box.png"
            />
            <view
              class="pos-relative w-full h-full px-50rpx box-border flex justify-between items-center"
            >
              <text v-if="!user.city" class="color-[#999] text-36rpx">请选择地区</text>
              <text
                v-else
                :class="{
                  'color-[#666]': true,
                  'text-36rpx': user.city.length < 14,
                  'text-28rpx': user.city.length >= 14,
                }"
              >
                {{ user.city }}
              </text>
              <wd-img
                mode="aspectFill"
                custom-class="pos-absolute w-28rpx h-28rpx"
                src="/static/images/common/triangle.png"
              />
            </view>
          </view>
          <view class="pos-relative w-full h-100rpx" @click="handleSelectBirthday">
            <wd-img
              mode="aspectFill"
              custom-style="position: absolute !important;"
              custom-class="pos-absolute w-full h-full"
              src="/static/images/userSettings/input-box.png"
            />
            <view
              class="pos-relative w-full h-full px-50rpx box-border flex justify-between items-center"
            >
              <text v-if="!user.birthday" class="color-[#999] text-36rpx">您的出生日期</text>
              <text v-else class="color-[#666] text-36rpx">{{ user.birthday }}</text>
              <wd-img
                mode="aspectFill"
                custom-class="pos-absolute w-28rpx h-28rpx"
                src="/static/images/common/triangle.png"
              />
            </view>
          </view>
        </view>
        <view class="pos-relative w-422rpx h-170rpx" @click="handleNextStep">
          <wd-img
            mode="aspectFill"
            custom-style="position: absolute !important;"
            custom-class="pos-absolute w-full h-full"
            src="/static/images/userSettings/next-step.png"
          />
        </view>
      </view>
      <wd-img
        mode="aspectFill"
        custom-style="position: absolute !important;"
        custom-class="pos-absolute -bottom-374rpx -left-114rpx w-978rpx h-996rpx"
        src="/static/images/userSettings/earth.png"
      />
    </view>
    <view v-show="steps === 2">
      <wd-img
        mode="aspectFill"
        custom-style="position: absolute !important;"
        custom-class="pos-absolute top-0 left-0 w-[100vw] h-[100vh]"
        src="/static/images/common/bg1.png"
      />
      <wd-navbar
        safeAreaInsetTop
        custom-style="background-color: transparent !important; z-index: 99"
        left-arrow
        @click-left="handlePreviousStep"
      />
      <view
        class="pos-absolute top-0 left-0 w-[100vw] h-[100vh] box-border p-[222rpx_56rpx_84rpx_56rpx] flex flex-col justify-between items-center"
      >
        <view class="w-full h-86rpx">
          <view class="pos-relative inline-block h-full">
            <wd-img
              mode="aspectFill"
              custom-style="position: absolute !important;"
              custom-class="pos-absolute right-90rpx bottom-0 w-244rpx h-46rpx"
              src="/static/images/userSettings/decoration.png"
            />
            <view class="font-900 text-60rpx text-[#333333] h-full leading-86rpx pos-relative">
              您的性别是...
            </view>
          </view>
        </view>
        <view class="w-full flex justify-between color-[#333]">
          <view class="w-310rpx h-620rpx" @click="handleSwitchSex(1)">
            <view>
              <wd-img
                mode="aspectFill"
                custom-class="w-310rpx h-216rpx"
                src="/static/images/userSettings/boys.png"
              />
            </view>
            <view
              class="pos-relative w-310rpx h-254rpx bg-[#E3E7EB] rounded-30rpx flex justify-center items-center font-700 text-48rpx leading-48rpx"
            >
              <wd-img
                v-if="user.sex === 1"
                mode="aspectFill"
                custom-style="position: absolute !important;"
                custom-class="w-full h-full"
                src="/static/images/userSettings/boys-f.png"
              />
              <text :class="{ 'pos-relative': true, 'color-white': user.sex === 1 }">男生</text>
            </view>
          </view>
          <view class="w-310rpx h-620rpx" @click="handleSwitchSex(2)">
            <view>
              <wd-img
                mode="aspectFill"
                custom-class="w-310rpx h-216rpx"
                src="/static/images/userSettings/girls.png"
              />
            </view>
            <view
              class="pos-relative w-310rpx h-254rpx bg-[#E3E7EB] rounded-30rpx flex justify-center items-center font-700 text-48rpx leading-48rpx"
            >
              <wd-img
                v-if="user.sex === 2"
                mode="aspectFill"
                custom-style="position: absolute !important;"
                custom-class="w-full h-full"
                src="/static/images/userSettings/girls-f.png"
              />
              <text :class="{ 'pos-relative': true, 'color-white': user.sex === 2 }">女生</text>
            </view>
          </view>
        </view>
        <wd-button
          custom-class="w-590rpx h-100rpx diy-button"
          size="large"
          block
          @click="handleNextStep"
        >
          下一步
        </wd-button>
      </view>
    </view>
    <view v-show="steps === 3">
      <wd-img
        mode="aspectFill"
        custom-style="position: absolute !important;"
        custom-class="pos-absolute top-0 left-0 w-[100vw] h-[100vh]"
        src="/static/images/common/bg2.png"
      />
      <wd-navbar
        safeAreaInsetTop
        custom-style="background-color: transparent !important; z-index: 99"
        left-arrow
        @click-left="handlePreviousStep"
      />
      <view
        class="pos-absolute top-0 left-0 w-[100vw] h-[100vh] box-border pt-222rpx flex flex-col justify-between items-center"
      >
        <view class="w-full ml-56rpx h-86rpx">
          <view class="pos-relative inline-block h-full">
            <wd-img
              mode="aspectFill"
              custom-style="position: absolute !important;"
              custom-class="pos-absolute right-90rpx bottom-0 w-244rpx h-46rpx"
              src="/static/images/userSettings/decoration.png"
            />
            <view class="font-900 text-60rpx text-[#333333] h-full leading-86rpx pos-relative">
              你喜欢的是...
            </view>
          </view>
        </view>
        <view
          class="flex flex-col justify-between w-full h-[70%] pos-absolute bottom-0 left-0 p-[32rpx_32rpx_84rpx_32rpx] bg-white border-2rpx border-solid border-black rounded-[60rpx_60rpx_0_0] box-border"
        >
          <view class="flex items-center">
            <wd-img
              mode="aspectFill"
              custom-class="w-54rpx h-54rpx mr-10rpx"
              src="/static/images/userSettings/hobby.png"
            />
            <text class="text-28rpx font-700 color-[#333] flex-1">请选择您的爱好（可多选）</text>
            <text class="text-24rpx color-[#999]">{{ `已选${user.hobbyList.length}个` }}</text>
          </view>
          <RandomBalls :balls="ballList" :updateList="updateBallsList" />
          <wd-button
            custom-class="w-590rpx h-100rpx diy-button"
            size="large"
            block
            @click="handleNextStep"
          >
            完成
          </wd-button>
        </view>
      </view>
    </view>
    <wd-action-sheet custom-class="h-1000rpx" v-model="showCitySheet" safe-area-inset-bottom>
      <view class="h-full flex flex-col">
        <view class="pos-relative h-162rpx flex items-center justify-center">
          <view>选择地区</view>
          <wd-img
            mode="widthFix"
            custom-style="position: absolute !important;"
            custom-class="pos-absolute right-36rpx block top-1/2 -translate-y-1/2 w-32rpx h-32rpx"
            src="/static/images/common/close.png"
            @click="closeSheet"
          />
        </view>
        <view class="flex-1 overflow-hidden">
          <wd-picker-view
            :columns="columns"
            v-model="citySheet"
            :column-change="onChangeProvince"
            columns-height="350"
            immediate-change
            @change="handleChangeCity"
          />
          <wd-button
            custom-class="w-590rpx h-100rpx diy-button"
            size="large"
            block
            @click="confirmCity"
          >
            确定
          </wd-button>
        </view>
      </view>
    </wd-action-sheet>
    <wd-action-sheet custom-class="h-800rpx" v-model="showBirthdaySheet" safe-area-inset-bottom>
      <view class="h-full flex flex-col">
        <view class="pos-relative h-162rpx flex items-center justify-center">
          <view>选择日期</view>
          <wd-img
            mode="widthFix"
            custom-style="position: absolute !important;"
            custom-class="pos-absolute right-36rpx block top-1/2 -translate-y-1/2 w-32rpx h-32rpx"
            src="/static/images/common/close.png"
            @click="closeSheet"
          />
        </view>
        <view class="flex-1 overflow-hidden">
          <wd-datetime-picker-view
            custom-class="w-full"
            :columns-height="250"
            type="date"
            v-model="birthdaySheet"
            label="年月日"
            :minDate="dayjs().subtract(100, 'year')"
            :maxDate="Date.now()"
          />
        </view>
        <wd-button
          custom-class="w-590rpx h-100rpx diy-button"
          size="large"
          block
          @click="confirmBirthday"
        >
          确定
        </wd-button>
      </view>
    </wd-action-sheet>
  </view>
</template>

<script setup lang="js">
import RandomBalls from '@/components/RandomBalls.vue'
import dayjs from 'dayjs'
import { ballList, province, city } from '@/utils/config'
import { useToast } from 'wot-design-uni'
import { httpPost } from '@/utils/http'
const { run: runSetUserinfo } = useRequest((e) => httpPost('/api/get_user', { ...e }))

const toast = useToast()
const columns = ref([province, ['市辖区']])
const steps = ref(1)
const showCitySheet = ref(false)
const showBirthdaySheet = ref(false)
const citySheet = ref(['北京市', '市辖区'])
const birthdaySheet = ref(dayjs().subtract(20, 'year'))
const user = reactive({
  sex: 1,
  city: null,
  birthday: null,
  hobbyList: [],
})

const closeSheet = () => {
  showCitySheet.value = false
  showBirthdaySheet.value = false
}

const handleSwitchSex = (value) => {
  user.sex = value
}

const updateBallsList = (list) => {
  user.hobbyList = list
}

const handleNextStep = () => {
  if (steps.value === 1) {
    if (!user.birthday || !user.city) {
      toast.show('请填写完整信息')
      return
    }
  }
  if (steps.value === 3) {
    if (user.hobbyList.length === 0) {
      toast.show('请选至少一个爱好')
      return
    }
    console.log(user)
    runSetUserinfo({
      location: user.city,
      birth_date: user.birthday,
      gender: user.sex,
      hobbies: user.hobbyList,
    })
    uni.switchTab({
      url: '/pages/message/index',
    })
  }
  steps.value = steps.value + 1
}

const handlePreviousStep = () => {
  steps.value = steps.value - 1
}

const handleSelectCity = () => {
  showCitySheet.value = true
}

const handleChangeCity = ({ value }) => {
  console.log(value)
}

const handleSelectBirthday = () => {
  showBirthdaySheet.value = true
}

const onChangeProvince = (pickerView, value, columnIndex, resolve) => {
  if (columnIndex === 0) {
    const province = value[columnIndex].value
    pickerView.setColumnData(1, city.find((item) => item.value === province)?.children)
  }
  resolve()
}

const confirmCity = () => {
  user.city = citySheet.value.join(' ')
  closeSheet()
}

const confirmBirthday = () => {
  user.birthday = dayjs(birthdaySheet.value).format('YYYY-MM-DD')
  closeSheet()
}
</script>

<style lang="scss">
:deep() {
  .diy-button {
    background: #222 !important;
  }
  //.wd-img__image {
  //  display: inline-block !important;
  //}
  .wd-picker-view {
    height: 700rpx;
  }
}
</style>
