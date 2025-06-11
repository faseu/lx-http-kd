// stores/websocket.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import WebSocketClient from '@/utils/WebSocketClient'

export const useWebSocketStore = defineStore(
  'websocket',
  () => {
    const status = ref('closed')
    const lastMessage = ref<any>(null)
    const groups = ref<any>([])
    const teams = ref<any>([])
    const socketInstance = ref<WebSocketClient | null>(null)
    const listeners = ref<((data: any) => void)[]>([])

    /** 初始化 WebSocket */
    const initWebSocket = (url: string) => {
      if (socketInstance.value) return

      const client = new WebSocketClient({
        url,
        debug: true,
        onOpen: () => console.log('[Store] WebSocket connected'),
        onMessage: (data) => {
          if (data.type === 'init') {
            groups.value = data.group_data
            teams.value = data.team_data
          }
          lastMessage.value = data
          console.log('[Store] Received message:', data)
          // 🔥 通知所有监听器
          listeners.value.forEach((fn) => fn(data))
        },
        onClose: () => {
          console.log('[Store] WebSocket closed')
        },
        onError: () => {
          console.log('[Store] WebSocket error')
        },
        onStatusChange: (s: string) => {
          status.value = s
        },
      })

      socketInstance.value = client
    }

    /** 添加监听器 */
    const addMessageListener = (handler: (data: any) => void) => {
      listeners.value.push(handler)
    }

    /** 移除监听器 */
    const removeMessageListener = (handler: (data: any) => void) => {
      const index = listeners.value.indexOf(handler)
      if (index !== -1) listeners.value.splice(index, 1)
    }

    /** 发送消息 */
    const sendMessage = (message: any) => {
      if (socketInstance.value) {
        socketInstance.value.send(message)
      } else {
        console.warn('WebSocket 未初始化，无法发送消息')
      }
    }

    /** 关闭连接 */
    const closeConnection = () => {
      socketInstance.value?.close()
      socketInstance.value = null
      status.value = 'closed'
    }

    /** 获取当前连接状态 */
    const getStatus = () => status.value

    return {
      initWebSocket,
      sendMessage,
      closeConnection,
      getStatus,
      status,
      lastMessage,
      groups,
      teams,
      addMessageListener,
      removeMessageListener,
    }
  },
  {
    persist: true,
  },
)
