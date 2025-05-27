export function formatChatTime(timeStr: string): string {
  const inputDate = new Date(timeStr)
  const now = new Date()

  const inputYear = inputDate.getFullYear()
  const inputMonth = inputDate.getMonth()
  const inputDateOnly = inputDate.getDate()

  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const nowDateOnly = now.getDate()

  const diffTime = now.getTime() - inputDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  const hours = inputDate.getHours().toString().padStart(2, '0')
  const minutes = inputDate.getMinutes().toString().padStart(2, '0')
  const time = `${hours}:${minutes}`

  // 今天
  if (inputYear === nowYear && inputMonth === nowMonth && inputDateOnly === nowDateOnly) {
    return time
  }

  // 昨天
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (
    inputYear === yesterday.getFullYear() &&
    inputMonth === yesterday.getMonth() &&
    inputDateOnly === yesterday.getDate()
  ) {
    return `昨日 ${time}`
  }

  // 一周内（前天、三天前……）
  if (diffDays < 7) {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return weekdays[inputDate.getDay()]
  }

  // 超过一周
  return `${inputMonth + 1}月${inputDateOnly}日`
}
