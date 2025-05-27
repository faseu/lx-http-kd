const STATUS = {
  CLOSED: 'closed',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
}
const DEFAULT_OPTIONS = {
  url: '', // WebSocket 服务器地址
  reconnectMaxTimes: 200, // 最大重连次数
  reconnectTimeout: 3000, // 尝试重连的间隔时间
  pingTimeout: 3000000, // 客户端发送ping的间隔时间
  pongTimeout: 5000000, // 服务器未响应pong的超时时间
  debug: typeof location !== 'undefined' && location.href.includes('debug'),
  onOpen: () => {}, // 连接成功回调
  onMessage: () => {}, // 收到消息回调
  onClose: () => {}, // 连接关闭回调
  onError: () => {}, // 连接错误回调
  onStatusChange: () => {}, // 连接状态变化回调
}

const SOCKET_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}

class WebSocketClient {
  static instance = null

  constructor(options = {}) {
    if (WebSocketClient.instance) return WebSocketClient.instance // 单例模式

    this.options = { ...DEFAULT_OPTIONS, ...options } // 合并配置
    this.socket = null // 实例化 WebSocket 对象
    this.reconnectTimes = 0 // 重连次数
    this.isNormalClosed = false // 是否正常关闭
    this.heartBeatTimer = null // 心跳检测定时器
    this.pongTimeoutTimer = null // pong 超时检测定时器
    this.reconnectTimer = null // 重连定时器
    this.isReconnecting = false // 标志是否正在重连
    this.messageQueue = [] // 消息队列（未连接时暂存消息）
    this.status = STATUS.CLOSED // 初始状态

    if (!this.options.url) {
      console.error('WebSocket URL 不能为空')
      return
    }

    this.initWebSocket()

    // 🔥 监听 `visibilitychange` & `online/offline`
    // #ifdef H5
    this.addEventListeners()
    // #endif
    WebSocketClient.instance = this
  }

  /** 初始化 WebSocket 连接 */
  initWebSocket() {
    // 已连接，不要重复连接
    if (this.isConnected()) return

    this.updateStatus(STATUS.CONNECTING)

    this.log(`准备连接到 ${this.options.url}`)
    this.socket = uni.connectSocket({
      url: this.options.url,
      success: () => {
        uni.hideLoading()
      },
    })

    this.socket.onOpen(() => this.handleOpen())
    this.socket.onMessage((event) => this.handleMessage(event))
    this.socket.onError((event) => this.handleError(event))
    this.socket.onClose((event) => this.handleClose(event))
  }

  /** WebSocket 连接成功 */
  handleOpen() {
    this.log('连接成功！')
    this.updateStatus(STATUS.CONNECTED)
    this.reconnectTimes = 0
    this.isNormalClosed = false
    this.options.onOpen()

    // 处理消息队列（连接后发送之前存储的消息）
    while (this.messageQueue.length > 0) {
      this.send(this.messageQueue.shift())
    }

    this.startHeartBeat()
  }

  /** 处理接收的消息 */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data)
      this.options.onMessage(data)

      // 服务器返回 "ping" 时，自动回复 "pong"
      if (data.type === 'ping') {
        this.send({ type: 'pong' })
      }

      if (data.type === 'pong') {
        clearTimeout(this.pongTimeoutTimer) // 🔥 收到 `pong`，清除超时计时器
      }
    } catch (error) {
      this.log('消息解析错误', error)
    }
  }

  /** WebSocket 连接关闭：断网 */
  handleClose(event) {
    this.updateStatus(STATUS.CLOSED)
    this.isReconnecting = false // 关闭时重置
    this.closeHeartBeat()
    this.log('WebSocket 连接关闭', event)

    // 不是手动关闭时，尝试重连
    if (!this.isNormalClosed) {
      this.reconnect()
    }
    this.options.onClose(event)
  }

  /** 处理 WebSocket 连接错误：断网、服务器宕机等 */
  handleError(event) {
    this.updateStatus(STATUS.ERROR)
    this.isReconnecting = false // 错误时重置
    this.closeHeartBeat()
    this.log('WebSocket 连接错误', event)

    this.reconnect()
    this.options.onError(event)
  }

  /** 监听 `visibilitychange` & `online/offline` 事件 */
  addEventListeners() {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.socket.readyState !== SOCKET_STATE.OPEN) {
        console.warn('🔄 页面恢复可见，尝试重新连接...')
        this.reconnect()
      }
    })

    window.addEventListener('online', () => {
      console.warn('🌍 网络恢复，尝试重新连接...')
      if (this.socket.readyState !== SOCKET_STATE.OPEN) {
        this.reconnect()
      }
    })
  }

  /** 更新 WebSocket 状态 */
  updateStatus(newStatus) {
    this.status = newStatus
    this.log(`状态更新：${newStatus}`)
    this.options.onStatusChange(newStatus)
  }

  /** 发送消息 */
  send(data) {
    if (this.isConnected()) {
      this.socket.send({ data: JSON.stringify(data) }) // ⚠️差异
    } else {
      this.log('WebSocket 未连接，消息加入队列')
      this.messageQueue.push(data)
    }
  }

  /** 断开连接 */
  close() {
    this.isNormalClosed = true
    this.updateStatus(STATUS.CLOSED)
    this.closeHeartBeat()
    this.messageQueue = []
    clearTimeout(this.pongTimeoutTimer)
    clearTimeout(this.reconnectTimer)

    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  /** 尝试重连 */
  reconnect() {
    if (this.isConnected()) {
      this.updateStatus(STATUS.CONNECTED)
      this.log('⚠️websocket状态正常，无需重新连接！')
      return
    }

    if (this.isReconnecting || this.reconnectTimer) {
      this.log('⚠️正在重连中，跳过本次调用')
      return
    }

    if (this.reconnectTimes >= this.options.reconnectMaxTimes) {
      this.log('⚠️达到最大重连次数，停止重连')
      return
    }

    this.isReconnecting = true
    this.reconnectTimes++
    this.updateStatus(STATUS.RECONNECTING)
    this.log(`第 ${this.reconnectTimes} 次尝试重连...`)
    this.reconnectTimer = setTimeout(() => {
      this.isReconnecting = false
      this.reconnectTimer = null
      this.initWebSocket()
    }, this.options.reconnectTimeout)
  }

  /** 开启心跳检测 */
  startHeartBeat() {
    this.closeHeartBeat()
    this.heartBeatTimer = setInterval(() => {
      this.send({ type: 'ping' })
      this.log('心跳检测发送 ping')

      // 🔥 设置 `pong` 超时检测，如果超时，则重连
      this.pongTimeoutTimer = setTimeout(() => {
        console.warn('🚨 未收到服务器 pong，可能断线，尝试重连...')
        this.reconnect()
      }, this.options.pongTimeout)
    }, this.options.pingTimeout)
  }

  /** 停止心跳检测 */
  closeHeartBeat() {
    clearInterval(this.heartBeatTimer)
    clearTimeout(this.pongTimeoutTimer)
    this.heartBeatTimer = null
  }

  /** 是否连接成功 */
  isConnected() {
    return this.socket && this.socket.readyState === SOCKET_STATE.OPEN
  }

  /** 记录日志（可选） */
  log(...args) {
    if (this.options.debug) {
      console.log('[WebSocket]:', ...args)
    }
  }
}

export default WebSocketClient
