/**
 * 旅游搭子随机昵称生成器
 * 生成符合旅游主题的可爱昵称
 */

// 旅游相关形容词
const travelAdjectives = [
  '爱冒险的',
  '自由的',
  '快乐的',
  '阳光的',
  '温暖的',
  '勇敢的',
  '活泼的',
  '开朗的',
  '热情的',
  '浪漫的',
  '优雅的',
  '可爱的',
  '甜美的',
  '清新的',
  '梦幻的',
  '神秘的',
  '探索的',
  '漫步的',
  '飞翔的',
  '闪亮的',
  '柔软的',
  '温柔的',
  '明媚的',
  '灿烂的',
]

// 旅游相关名词
const travelNouns = [
  '小鹿',
  '小熊',
  '小兔',
  '小猫',
  '小狗',
  '小鸟',
  '蝴蝶',
  '海豚',
  '独角兽',
  '小狐狸',
  '旅行者',
  '背包客',
  '探险家',
  '漫游者',
  '追梦人',
  '寻光者',
  '逐风者',
  '踏浪者',
  '云朵',
  '星星',
  '月亮',
  '太阳',
  '彩虹',
  '微风',
  '花朵',
  '叶子',
  '雪花',
  '露珠',
  '小船',
  '风筝',
  '气球',
  '羽毛',
  '贝壳',
  '珍珠',
  '宝石',
  '水晶',
  '琥珀',
  '翡翠',
]

// 旅游目的地
const destinations = [
  '巴厘岛',
  '马尔代夫',
  '普吉岛',
  '北海道',
  '富士山',
  '京都',
  '东京',
  '首尔',
  '济州岛',
  '巴黎',
  '伦敦',
  '罗马',
  '威尼斯',
  '圣托里尼',
  '布拉格',
  '维也纳',
  '阿姆斯特丹',
  '纽约',
  '洛杉矶',
  '夏威夷',
  '迈阿密',
  '拉斯维加斯',
  '旧金山',
  '西雅图',
  '悉尼',
  '墨尔本',
  '黄金海岸',
  '新西兰',
  '斐济',
  '大溪地',
  '丽江',
  '大理',
  '桂林',
  '三亚',
  '青岛',
  '厦门',
  '张家界',
  '九寨沟',
  '西藏',
  '新疆',
]

// 可爱后缀
const cuteSuffixes = [
  '小可爱',
  '小天使',
  '小公主',
  '小王子',
  '小仙女',
  '小精灵',
  '小甜心',
  '小宝贝',
  '酱',
  '子',
  '儿',
  '喵',
  '汪',
  '熊',
  '兔',
  '宝',
  '贝',
]

// 数字后缀（可选）
const numbers = ['01', '02', '03', '07', '08', '09', '88', '99', '520', '1314', '666', '888']

/**
 * 生成随机昵称的主方法
 * @param {string} type - 昵称类型: 'cute'(可爱风) | 'travel'(旅行风) | 'destination'(目的地风) | 'mixed'(混合风)
 * @param {boolean} addNumber - 是否添加数字后缀
 * @returns {string} 生成的随机昵称
 */
function generateRandomNickname(type = 'mixed', addNumber = false) {
  let nickname = ''

  switch (type) {
    case 'cute':
      nickname = generateCuteNickname()
      break
    case 'travel':
      nickname = generateTravelNickname()
      break
    case 'destination':
      nickname = generateDestinationNickname()
      break
    case 'mixed':
    default:
      // 随机选择一种风格
      const styles = ['cute', 'travel', 'destination']
      const randomStyle = styles[Math.floor(Math.random() * styles.length)]
      nickname = generateRandomNickname(randomStyle, false)
      break
  }

  // 可选添加数字后缀
  if (addNumber && Math.random() > 0.5) {
    nickname += getRandomElement(numbers)
  }

  return nickname
}

/**
 * 生成可爱风格昵称
 */
function generateCuteNickname() {
  const adjective = getRandomElement(travelAdjectives)
  const noun = getRandomElement(travelNouns)
  const suffix = getRandomElement(cuteSuffixes)

  const patterns = [
    `${adjective}${noun}`,
    `${noun}${suffix}`,
    `${adjective}${suffix}`,
    `小${noun}`,
    `${noun}呀`,
  ]

  return getRandomElement(patterns)
}

/**
 * 生成旅行风格昵称
 */
function generateTravelNickname() {
  const adjective = getRandomElement(travelAdjectives)
  const noun = getRandomElement(
    travelNouns.filter((n) =>
      ['旅行者', '背包客', '探险家', '漫游者', '追梦人', '寻光者', '逐风者', '踏浪者'].includes(n),
    ),
  )

  const patterns = [
    `${adjective}${noun}`,
    `${noun}_${Math.floor(Math.random() * 9999)}`,
    `爱旅行的${getRandomElement(['小仙女', '小王子', '小可爱'])}`,
    `${getRandomElement(['环球', '世界', '自由', '梦想'])}${noun}`,
  ]

  return getRandomElement(patterns)
}

/**
 * 生成目的地风格昵称
 */
function generateDestinationNickname() {
  const destination = getRandomElement(destinations)
  const adjective = getRandomElement(travelAdjectives)
  const noun = getRandomElement(travelNouns)

  const patterns = [
    `${destination}${getRandomElement(['小姐姐', '小哥哥', '小可爱', '达人'])}`,
    `想去${destination}的${noun}`,
    `${destination}${getRandomElement(['之旅', '梦想', '计划'])}`,
    `${adjective}${destination}行`,
  ]

  return getRandomElement(patterns)
}

/**
 * 获取数组中的随机元素
 */
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 批量生成昵称（用于给用户提供多个选择）
 * @param {number} count - 生成数量
 * @param {string} type - 昵称类型
 * @returns {Array} 昵称数组
 */
function generateMultipleNicknames(count = 5, type = 'mixed') {
  const nicknames = new Set() // 使用Set避免重复

  while (nicknames.size < count) {
    const nickname = generateRandomNickname(type, Math.random() > 0.7)
    nicknames.add(nickname)
  }

  return Array.from(nicknames)
}

/**
 * 检查昵称是否合规（长度、敏感词等）
 * @param {string} nickname - 待检查的昵称
 * @returns {Object} 检查结果
 */
function validateNickname(nickname) {
  const result = {
    valid: true,
    message: '昵称可用',
    suggestions: [],
  }

  // 长度检查
  if (nickname.length < 2) {
    result.valid = false
    result.message = '昵称长度不能少于2个字符'
    return result
  }

  if (nickname.length > 12) {
    result.valid = false
    result.message = '昵称长度不能超过12个字符'
    result.suggestions = generateMultipleNicknames(3)
    return result
  }

  // 简单的敏感词检查（实际项目中应该使用更完善的敏感词库）
  const sensitiveWords = ['admin', '管理员', '客服', '官方']
  for (const word of sensitiveWords) {
    if (nickname.toLowerCase().includes(word.toLowerCase())) {
      result.valid = false
      result.message = '昵称包含敏感词，请重新选择'
      result.suggestions = generateMultipleNicknames(3)
      return result
    }
  }

  return result
}

// 导出方法
export { generateRandomNickname, generateMultipleNicknames, validateNickname }

// 使用示例
console.log('=== 旅游搭子昵称生成器示例 ===')
console.log('可爱风格:', generateRandomNickname('cute'))
console.log('旅行风格:', generateRandomNickname('travel'))
console.log('目的地风格:', generateRandomNickname('destination'))
console.log('混合风格:', generateRandomNickname('mixed'))
console.log('带数字后缀:', generateRandomNickname('mixed', true))

console.log('\n批量生成5个昵称:')
generateMultipleNicknames(5).forEach((name, index) => {
  console.log(`${index + 1}. ${name}`)
})

// 在 uniapp 中的使用方法
/*
// 在你的页面中导入并使用
import { generateRandomNickname, generateMultipleNicknames, validateNickname } from '@/utils/nickname'

// 生成单个昵称
const nickname = generateRandomNickname('mixed', true)

// 为用户提供多个选择
const nicknameOptions = generateMultipleNicknames(6, 'cute')

// 验证用户输入的昵称
const validation = validateNickname(userInput)
if (!validation.valid) {
  // 显示错误信息和建议
  console.log(validation.message)
  console.log('建议昵称:', validation.suggestions)
}
*/
