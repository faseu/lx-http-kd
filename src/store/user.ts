import { defineStore } from 'pinia'
import { ref } from 'vue'

const initState = {}

export const useUserStore = defineStore(
  'user',
  () => {
    const userInfo = ref<IUserInfo>({ ...initState })

    const setUserInfo = (val: IUserInfo) => {
      console.log(val)
      userInfo.value = { ...val, token: val.access_token }
    }

    const clearUserInfo = () => {
      userInfo.value = { ...initState }
    }
    // 一般没有reset需求，不需要的可以删除
    const reset = () => {
      userInfo.value = { ...initState }
    }
    const isLogined = computed(() => !!userInfo.value.token)

    return {
      userInfo,
      setUserInfo,
      clearUserInfo,
      isLogined,
      reset,
    }
  },
  {
    persist: true,
  },
)
