/**
 * 身份证号码校验位验证
 * @param {string} idCard - 身份证号码
 * @returns {boolean} - 校验是否通过
 */
export function validateIdCardChecksum(idCard) {
  if (!idCard || idCard.length !== 18) {
    return false
  }

  // 身份证前17位
  const front17 = idCard.substring(0, 17)
  // 校验码
  const checkCode = idCard.substring(17, 18).toUpperCase()

  // 加权因子
  const weightFactors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]

  // 校验码对照表
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

  // 计算校验位
  let sum = 0
  for (let i = 0; i < 17; i++) {
    const digit = parseInt(front17.charAt(i), 10)
    if (isNaN(digit)) {
      return false
    }
    sum += digit * weightFactors[i]
  }

  // 取模运算得到校验位索引
  const checkIndex = sum % 11
  const expectedCheckCode = checkCodes[checkIndex]

  return checkCode === expectedCheckCode
}

/**
 * 完整的身份证号码验证
 * @param {string} idCard - 身份证号码
 * @returns {object} - 验证结果对象
 */
export function validateIdCard(idCard) {
  const result = {
    valid: false,
    message: '',
  }

  if (!idCard) {
    result.message = '请输入身份证号码'
    return result
  }

  // 移除空格并转换为大写
  const cleanIdCard = String(idCard).replace(/\s/g, '').toUpperCase()

  // 基本格式验证
  const basicPattern =
    /^[1-9]\d{5}(18|19|20|21)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
  if (!basicPattern.test(cleanIdCard)) {
    result.message = '身份证号码格式不正确'
    return result
  }

  // 提取日期部分进行验证
  const year = parseInt(cleanIdCard.substring(6, 10), 10)
  const month = parseInt(cleanIdCard.substring(10, 12), 10)
  const day = parseInt(cleanIdCard.substring(12, 14), 10)

  // 验证日期的有效性
  const birthDate = new Date(year, month - 1, day)
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    result.message = '身份证号码中的出生日期无效'
    return result
  }

  // 验证年龄范围（假设有效范围是1900-当前年份）
  const currentYear = new Date().getFullYear()
  if (year < 1900 || year > currentYear) {
    result.message = '身份证号码中的出生年份不在有效范围内'
    return result
  }

  // 校验位验证
  if (!validateIdCardChecksum(cleanIdCard)) {
    result.message = '身份证号码校验位错误'
    return result
  }

  result.valid = true
  result.message = '身份证号码验证通过'
  return result
}

/**
 * 用于表单验证的身份证校验函数
 * @param {any} rule - 验证规则
 * @param {string} value - 输入值
 * @param {Function} callback - 回调函数
 */
export function idCardValidator(rule, value, callback) {
  if (!value) {
    callback(new Error('请输入身份证号码'))
    return
  }

  const result = validateIdCard(value)
  if (result.valid) {
    callback()
  } else {
    callback(new Error(result.message))
  }
}

/**
 * 从身份证号码中提取个人信息
 * @param {string} idCard - 身份证号码
 * @returns {object} - 个人信息对象
 */
export function extractInfoFromIdCard(idCard) {
  const result = validateIdCard(idCard)

  if (!result.valid) {
    return null
  }

  const cleanIdCard = idCard.replace(/\s/g, '').toUpperCase()

  // 提取出生日期
  const year = parseInt(cleanIdCard.substring(6, 10), 10)
  const month = parseInt(cleanIdCard.substring(10, 12), 10)
  const day = parseInt(cleanIdCard.substring(12, 14), 10)
  const birthDate = new Date(year, month - 1, day)

  // 计算年龄
  const now = new Date()
  let age = now.getFullYear() - year
  if (now.getMonth() < month - 1 || (now.getMonth() === month - 1 && now.getDate() < day)) {
    age--
  }

  // 提取性别（倒数第二位数字，奇数为男性，偶数为女性）
  const genderCode = parseInt(cleanIdCard.substring(16, 17), 10)
  const gender = genderCode % 2 === 1 ? '男' : '女'

  // 提取地区代码（前6位）
  const regionCode = cleanIdCard.substring(0, 6)

  return {
    birthDate,
    age,
    gender,
    regionCode,
    year,
    month,
    day,
  }
}
