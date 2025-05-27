<template>
  <view class="relative" style="width: 658rpx; height: 640rpx">
    <view
      v-for="(ball, index) in balls"
      :key="index"
      class="absolute rounded-full flex items-center justify-center text-[28rpx] font-bold font-700"
      :style="{
        width: ball.size + 'rpx',
        height: ball.size + 'rpx',
        top: ball.top + 'rpx',
        left: ball.left + 'rpx',
        background: selectedIndices.includes(ball.text)
          ? 'linear-gradient(180deg, #0095FF 6%, #08E6E3 99%)'
          : '#E3E7EB',
        color: selectedIndices.includes(ball.text) ? '#ffffff' : '#333333',
        fontSize: ball.size > 144 ? '48rpx' : '36rpx',
      }"
      @click="toggleSelect(ball.text)"
    >
      {{ ball.text }}
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  balls: {
    type: Array,
    required: true,
  },
  updateList: () => {},
})

const selectedIndices = ref([])

function toggleSelect(e) {
  if (selectedIndices.value.includes(e)) {
    selectedIndices.value = selectedIndices.value.filter((i) => i !== e)
  } else {
    selectedIndices.value.push(e)
  }
  props.updateList(selectedIndices.value)
}
</script>
