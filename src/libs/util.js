import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'
const { title, cookieExpires } = config

export const TOKEN_KEY = 'token'

export const setToken = token => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getToken = () => {
  const token = localStorage[TOKEN_KEY]
  if (token) return token
  else return false
}

export const hasChild = item => {
  return item.children && item.children.length !== 0
}

/**
 * @param {Number} n 把数字转化成数组
 * @returns {Array}
 */
export const splitToDigit = n => [...(n + '')].map(String)

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}

/**
 * 找出两个数组中重复的元素，仅限简单类型
 * @param {Array} arr 一个数组
 * @param {Array} brr 另一个数组
 * @returns {Array} newArr
 * var arr = [1, 2, 3, 4]
   var brr = [3, 4, 5, 6]
   console.log(repetition(arr, brr))  // 输出 [3, 4]
 */
export const repetition = (arr, brr) => {
  // 定义一个新的数组，存入重复的数组
  var newArr = []
  // 循环两个数组，外循环循环一圈，内循环一轮，用外循环的一个去和内循环的每一个作比较
  // 如果相等说明就是重复的，然后再新数组里查找一下，这个数是否存在，如果两个条件都满足，则存入新数组

  // 循环第一个数组
  for (var i = 0; i < arr.length; i++) {
    // 循环第二个数组
    for (var j = 0; j < brr.length; j++) {
      // 避免新数组中出现重复的数
      if (arr[i] === brr[j] && newArr.indexOf(arr[i]) === -1) {
        newArr.push(arr[i])
      }
    }
  }
  // 返回新数组
  return newArr
}

/**
 * @param {Function} fn 传入数组
 * @param {Number} delay 传入延迟时间,默认为 500 毫秒
 * @returns {Array}
 * @description 防抖函数
 * 用法：不能使用箭头函数，否则this指向会有问题
 * methods: {
 *   functionName: debounce(function (val) {
 *     xxxxxx
 *   }, delay)
 * }
 */
export const debounce = function (fn, delay = 500) {
  let timer = null
  return function () {
    let content = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(content, args)
    }, delay)
  }
}

/**
 * @param {Function} fn 传入数组
 * @param {Number} delay 传入延迟时间,默认为 500 毫秒
 * @returns {Array}
 * @description 节流函数
 * 用法：不能使用箭头函数，否则this指向会有问题
 * methods: {
 *   functionName: throttle(function (val) {
 *     xxxxxx
 *   }, delay)
 * }
 */
export const throttle = function (fn, delay = 500) {
  let open = true
  return function () {
    if (open === true) {
      open = false
      let content = this
      let args = arguments
      setTimeout(() => {
        fn.apply(content, args)
        open = true
      }, delay)
    }
  }
}

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if (
        (hasChild(item) || (item.meta && item.meta.showAlways)) &&
        showThisMenuEle(item, access)
      ) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched
    .filter(item => {
      return item.meta === undefined || !item.meta.hideInBread
    })
    .map(item => {
      let meta = { ...item.meta }
      if (meta.title && typeof meta.title === 'function') {
        meta.__titleIsFunction__ = true
        meta.title = meta.title(route)
      }
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: meta
      }
      return obj
    })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

export const getRouteTitleHandled = route => {
  let router = { ...route }
  let meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let { title } = item.meta
  if (!title) return
  title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * 判断传入的参数为什么类型
 * @param obj  参数
 * @returns {String} 对应的类型
 */
export const typeOf = obj => {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

// 简单性，判断是否是某某类型
export const isNumber = obj => {
  return obj === +obj
}

export const isNull = arg1 => {
  return !!(!arg1 && arg1 !== 0 && typeof arg1 !== 'boolean')
}

export const isString = obj => {
  return obj === obj + ''
}
export const isBoolean = obj => {
  return obj === !!obj
}

export const isObject = obj => {
  return typeof obj === 'object'
}

/**
 * @param {String} source 原字符串
 * @param {String} chars 原字符串
 * @returns {String} 结果字符串
 * @description 删除字符串中特定的字符
 */
export const removeChars = (source, chars) => {
  let reg = new RegExp(chars, 'gi')
  let result = source.replace(reg, '')
  return result
}

/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */
export const uniqueArray = (array, key) => {
  var result = [array[0]]
  for (var i = 1; i < array.length; i++) {
    var item = array[i]
    var repeat = false
    for (var j = 0; j < result.length; j++) {
      if (item[key] === result[j][key]) {
        repeat = true
        break
      }
    }
    if (!repeat) {
      result.push(item)
    }
  }
  return result
}

/**
 * 两个数组去重
 * @param {Array} originList 原始数组
 * @param {Array} currentList 当前数组
 * @param {String} sortKey 去重字段
 * @return {Array} 返回新数组中不重复的部分
 */
export const Duplicate = (originList, currentList, sortKey = 'id') => {
  const map = {}
  originList.forEach(e => {
    map[e[sortKey]] = true
  })
  return currentList.filter(e => !map[e[sortKey]])
}

// 数组包数组去重
export const unique = arr => {
  arr = arr.filter(item => item.every(item => item)) // 去除[0,0]
  for (let i = 0, len = arr.length; i < len; i++) {
    for (let j = i + 1, len = arr.length; j < len; j++) {
      if (JSON.stringify(arr[i]) === JSON.stringify(arr[j])) {
        arr.splice(j, 1)
        j-- // 每删除一个数j的值就减1
        len-- // j值减小时len也要相应减1（减少循环次数，节省性能）
        // console.log(j,len)
      }
    }
  }
  return arr
}

/**
 * 数组元素为对象的去重方法 ES5方法
 * @param arr  原数组
 * @param type  根据元素的某个属性进行去重
 * @returns {Array} 返回去重后的新的数组
 */
export const Es5duplicate = (arr, type) => {
  var newArr = []
  var tArr = []
  if (arr.length === 0) {
    return arr
  } else {
    if (type) {
      for (var i = 0; i < arr.length; i++) {
        if (!tArr[arr[i][type]]) {
          newArr.push(arr[i])
          tArr[arr[i][type]] = true
        }
      }
      return newArr
    } else {
      for (var j = 0; j < arr.length; j++) {
        if (!tArr[arr[j]]) {
          newArr.push(arr[j])
          tArr[arr[j]] = true
        }
      }
      return newArr
    }
  }
}

/**
 * 数组元素为对象的去重方法 ES6方法
 * @param arr  原数组
 * @param type  根据元素的某个属性进行去重
 * @returns {Array} 返回去重后的新的数组
 */
export const Es6duplicate = (arr, type) => {
  var hash = {}
  return arr.reduce(function (item, next) {
    // eslint-disable-next-line no-unused-expressions
    hash[next[type]] ? '' : (hash[next[type]] = true && item.push(next))
    return item
  }, [])
}

/**
 * 合并两个map ,仅支持一层
 * @param {*} map1
 * @param {*} map2
 */
export const mergeMap = (map1, map2) => {
  for (const key in map2) {
    if (map1.hasOwnProperty(key)) {
      Object.assign(map1[key], map2[key])
    } else {
      map1[key] = map2[key]
    }
  }
  return map1
}

/**
 * 保留任意位小数
 * @param {*} num 实际数字
 * @param {*} decimal 保留位数
 */
export const keepAnyDecimal = (num, decimal = 2) => {
  const level = Math.pow(10, decimal)
  var result = parseFloat(num)
  if (isNaN(result)) {
    return ''
  }
  result = Math.round(num * level) / level
  return result
}

/**
 *判断字节长度
 * @param {String} val
 * @return {Number}  字符串长度
 */
export const getByteLen = val => {
  // 传入一个字符串
  if (!val) return false
  let len = 0
  for (var i = 0; i < val.length; i++) {
    // eslint-disable-next-line no-control-regex
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      // 全角
      len += 2
    } else {
      len += 1
    } // 如果是全角，占用两个字节
  }
  return len
}

/**
 * 名称校验规则
 * @param {String} str 获取输入的名称
 * @return {Boolean} 返回是否校验通过  true为通过， false为不通过
 */
export const nameRexp = (str, required = true) => {
  if (!required) {
    return {
      status: true
    }
  }
  if (!str) {
    return {
      message: '用户名不能为空',
      status: false
    }
  }
  str = str.trim()
  // 校验特殊字符
  // let special = /[^~!@#$%\^&*+|}{"：:<>?\/;''\[\]\\=`]$/;
  // let special = partyPersonNameNewReg;
  // if (!special.test(str)) {
  //   return {
  //     message: "录入结果应不包含特殊字符，请重新录入。",
  //     status: false
  //   };
  // }
  str = str.replace(/[\r\n]/g, '')
  if (getByteLen(str) < 3) {
    return {
      message: '请输入3个字节以上的长度',
      status: false
    }
  }
  // 判断是否含有数字,有数字  校验拦截
  const Num = /[0-9]/
  if (Num.test(str)) {
    return {
      message: '名称不允许含有数字',
      status: false
    }
  }
  // 校验是否为全中文
  const ZH = new RegExp('[\\u4E00-\\u9FFF]+$', 'g')
  if (ZH.test(str)) {
    // 当输入值为全中文时，校验是否有空格
    if (str.indexOf(' ') !== -1) {
      return {
        message: '名称为全中文时中间不允许含有空格',
        status: false
      }
    } // 有空格
  }
  return {
    status: true
  }
}

/**
 * 身份证检验规则
 * @param {String} IDCard 获取输入的身份证号码
 * @return {Boolean} 返回是否校验通过  true为通过， false为不通过
 */
export const idCard = IDCard => {
  // 身份证地区
  const areaID = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  }
  // 41072119780706355X
  // var iSum = 0
  if (!/^\d{17}(\d|x)$/i.test(IDCard)) {
    return {
      status: false,
      message: '你输入的身份证长度或格式错误!'
    }
  }
  IDCard = IDCard.replace(/x$/i, 'a')
  if (areaID[parseInt(IDCard.substr(0, 2))] == null) {
    return {
      status: false,
      message: '你的身份证地区非法!'
    }
  }
  var sBirthday =
    IDCard.substr(6, 4) + '-' + Number(IDCard.substr(10, 2)) + '-' + Number(IDCard.substr(12, 2))
  var d = new Date(sBirthday.replace(/-/g, '/'))
  if (sBirthday !== d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()) {
    return {
      status: false,
      message: '身份证上的出生日期非法!'
    }
  }
  // for (var i = 17; i >= 0; i--)
  //   iSum += (Math.pow(2, i) % 11) * parseInt(IDCard.charAt(17 - i), 11)
  // if (iSum % 11 != 1)
  //   return {
  //     status: false,
  //     message: '你输入的身份证号非法!'
  //   }
  // aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
  return {
    status: true,
    message: '校验成功！'
  }
}

/**
 * 根据身份证获取性别
 * @param {String} idCard 获取输入的身份证号码
 * @return {String} 返回性别 {男， 女}
 */
export const IDCardSex = idCard => {
  var sexMap = {
    0: '女',
    1: '男'
  }
  if (idCard && idCard.length === 15) {
    return sexMap[idCard.substring(14, 15) % 2]
  } else if (idCard && idCard.length === 18) {
    return sexMap[idCard.substring(16, 17) % 2]
  } else {
    // 不是15或者18,null
    return 'error'
  }
}

/**
 * 校验比例输入  (输入为数字且在0-100之内)
 * @param {String Number} num 输入的比例值
 * @return {Boolean}  校验是否通过  true：通过 / false：未通过
 */
export const propNum = num => {
  const regExp = /^(?:[1-9]?\d|100)$/
  if (regExp.test(num)) {
    return true
  } else {
    return false
  }
}

/**
 * 校验输入的年龄  （输入为数字且在0-120之内）
 * @param {String Number} num  输入的年龄
 * @return {Boolean}  校验是否通过  true：通过 / false：未通过
 */
export const ageRexp = num => {
  const rexp = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/
  if (rexp.test(num)) {
    return true
  } else {
    return false
  }
}

/**
 * 联系电话校验
 * @param {String Number} num 录入的号码（手机号或者固定电话）
 * @return {Boolean} 校验是否通过  true：通过 / false：未通过
 */
export const TelphoneNumber = num => {
  const str = num.toString()
  // 手机号校验正则
  const tel = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
  // 固定电话校验正则  （不含区号）
  const rexp = /\d{3}-\d{8}|\d{4}-\d{7}/
  if (!str.length) return false
  // //console.log(str.includes('-'))
  if (str.includes('-')) {
    const bool = rexp.test(str)
    return bool
  } else {
    const bool = tel.test(str)
    return bool
  }
}

// 检查特殊字符
export const specialCharactersCheck = str => {
  const pattern = new RegExp("[`%~!@#$^&=|{}':'\\[\\].<>/?~！@#￥\\\\……&——|{}【】‘：”“'。、？]")
  if (!str) return false
  const flag = Array.from(str).some(item => pattern.test(item))
  if (flag) return false
  return true
}

// 下划线转换驼峰
export const toHump = name => {
  // eslint-disable-next-line no-useless-escape
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}

// 驼峰转换下划线
export const toLine = name => {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase()
}

// 判断两个对象的值是否相等
export const diffObject = (obj1, obj2) => {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  // console.log(JSON.stringify(keys1), "keys1");
  // console.log(JSON.stringify(keys2), "keys2");
  if (keys1.length !== keys2.length) {
    // //console.log(keys1.length);
    // //console.log(keys2.length);
    // //
    return false
  } else {
    for (const key in obj1) {
      if (!obj2.hasOwnProperty(key)) {
        return false
      }
      // 类型相同
      if (typeof obj1[key] === typeof obj2[key]) {
        // 同为引用类型
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
          if (obj1[key] !== null && obj2[key] !== null) {
            const equal = diffObject(obj1[key], obj2[key])
            if (!equal) {
              // console.log(key, obj1[key], obj2[key]);
              // //
              return false
            }
          }
        }
        // 同为基础数据类型
        if (
          typeof obj1[key] !== 'object' &&
          typeof obj2[key] !== 'object' &&
          obj1[key] !== obj2[key]
        ) {
          // console.log(key, obj1[key], obj2[key]);
          // //
          return false
        }
      } else {
        // console.log(key, obj1[key], obj2[key]);
        if (
          (obj1[key] === null && obj2[key] === undefined) ||
          (obj2[key] === null && obj1[key] === undefined)
        ) {
          // 如果值为null和undefind则认为是相等的
          return true
        }
        // //
        return false
      }
    }
  }
  return true
}

/**
 *
 * 数据字典接口返回的是对象
 * 将对象转为数组[{code: '', value: []}] 结构
 */
export const objTransArray = obj => {
  const arr = []
  if (typeOf(obj) !== 'object') {
    return false
  } else {
    for (const [key, value] of Object.entries(obj)) {
      arr.push({ code: key, name: value })
    }
    return arr
  }
}

/**
 * @desc 深拷贝，结构化拷贝，支持string,number,date,reg等格式，不支持function拷贝
 * @param {Any} obj
 * @param {WeakMap} hash
 * @return {Any}
 */
export const deepClone = (obj, hash = new WeakMap()) => {
  if (obj == null || typeof obj !== 'object') return obj
  let cloneObj
  const Constructor = obj.constructor
  switch (Constructor) {
    case RegExp:
      cloneObj = new Constructor(obj)
      break
    case Date:
      cloneObj = new Constructor(obj.getTime())
      break
    default:
      if (obj._isAMomentObject) {
        cloneObj = new Constructor(obj)
      }
      if (hash.has(obj)) return hash.get(obj)
      cloneObj = new Constructor()
      hash.set(obj, cloneObj)
    // //console.log(2, hash.get(obj))
  }
  for (const key in obj) {
    // //console.log(3, key, cloneObj)
    cloneObj[key] = isObject(obj[key]) ? deepClone(obj[key], hash) : obj[key]
    // //console.log(4, key, cloneObj[key])
  }
  return cloneObj
}

/**
 * 判断检测的字符是否为数字或者是数字类型的字符串，比如123，123.45,'123','123.45', -123,-123.45,'-123','-123.45'均返回true
 * @param val  检测的字符
 * @returns {Boolean} 如果是返回true，不是返回false
 */
export const ifTurnToNumber = val => {
  var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true
  } else {
    return false
  }
}

/**
 * @param {Array} arr 数组
 * @param {Function | String} generateKey 函数或者字符串，如果是函数则需要返回一个分组条件
 * @description 根据某某东西进行分组
 */
export const groupBy = (arr, generateKey) => {
  if (typeof generateKey === 'string') {
    const propName = generateKey
    generateKey = item => item[propName]
  }

  let result = {}

  for (const item of arr) {
    const key = generateKey(item)
    // const key = item[propName]
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(item)
  }

  return result
}

/**
 *获取当前日期
 * @param {*} type 返回数据的类型 是否包含 具体哪一天
 */
export const currentDate = type => {
  var myDate = new Date()
  var tYear = myDate.getFullYear()
  var tMonth = myDate.getMonth()
  var m = tMonth + 1
  if (m.toString().length === 1) {
    m = '0' + m
  }
  if (type === 'yearMonth') {
    return tYear + '-' + m
  }
  if (type === 'yearMonthDay') {
    var tDay = myDate.getDate()
    if (tDay.toString().length === 1) {
      tDay = '0' + tDay
    }
    return tYear + '-' + m + '-' + tDay
  }
}

/**
 *获取几个月前的输入日期
 *@param {*} date 输入日期(YYYY-MM-DD)
 *@param {*} monthNum 需要获取传入日期之前的月数
 *@param {*} type 返回数据的类型 是否包含 具体哪一天
 *@return {string} string
 */
export const getPreMonthDay = (date, monthNum, type) => {
  var dateArr = date.split('-')
  var year = dateArr[0] // 获取当前日期的年份
  var month = dateArr[1] // 获取当前日期的月份
  var day = dateArr[2] // 获取当前日期的日
  // var days = new Date(year, month, 0)
  // days = days.getDate() // 获取当前日期中月的天数
  var year2 = year
  var month2 = parseInt(month) - monthNum
  if (month2 <= 0) {
    var absM = Math.abs(month2)
    year2 = parseInt(year2) - Math.ceil(absM / 12 === 0 ? 1 : parseInt(absM) / 12)
    month2 = 12 - (absM % 12)
  }
  var day2 = day // 传入的date的日
  var days2 = new Date(year2, month2, 0).getDate() // 获取到的月份的最后一天日
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }
  if (type) {
    return year2 + '-' + month2
  }
  return year2 + '-' + month2 + '-' + day2
}

/**
 *获取下几个月的输入日期
 *@param {*} date 输入日期(YYYY-MM-DD)
 *@param {*} monthNum 需要获取传入日期下几个月的月数
 *@return {string} string
 */
export const getNextMonthDay = (date, monthNum, type) => {
  var dateArr = date.split('-')
  var year = dateArr[0] // 获取当前日期的年份
  var month = dateArr[1] // 获取当前日期的月份
  var day = dateArr[2] // 获取当前日期的日
  // var days = new Date(year, month, 0)
  // days = days.getDate() // 获取当前日期中的月的天数
  var year2 = year
  var month2 = parseInt(month) + parseInt(monthNum)
  if (month2 > 12) {
    year2 = parseInt(year2) + parseInt(parseInt(month2) / 12 === 0 ? 1 : parseInt(month2) / 12)
    month2 = parseInt(month2) % 12
  }
  var day2 = day // 传入的date的日
  var days2 = new Date(year2, month2, 0).getDate() // 获取到的月份的最后一天日
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }
  if (type) {
    return year2 + '-' + month2
  }
  return year2 + '-' + month2 + '-' + day2
}

/**
 * 获取当前旬的前pre旬和后next旬
 * @param {*} pre 当前旬的前pre旬
 * @param {*} next 当前旬的后next旬
 * @param {*} currentXun 当前旬
 * @returns {Array} 当前pre旬和当前旬，加上当前旬的后next旬的数组
 */
export const getFrontAndBackXun = (pre, next, currentXun) => {
  //  获取echart的x轴时间范围，当前月份的前三个月和后两个月时间
  const preTimeRange = []
  let currentTimeRange = []
  const nextTimeRange = []
  const allDateArr = []
  currentTimeRange = [1, 2, 3].map(item => {
    return currentDate('yearMonth') + '-' + item
  })
  for (let i = Math.ceil(pre / 3); i > 0; i--) {
    preTimeRange.push(
      [1, 2, 3].map(item => getPreMonthDay(currentDate('yearMonth'), i, 'yearMonth') + '-' + item)
    )
  }
  for (let i = 1; i < Math.ceil(next / 3) + 1; i++) {
    nextTimeRange.push(
      [1, 2, 3].map(item => getNextMonthDay(currentDate('yearMonth'), i, 'yearMonth') + '-' + item)
    )
  }
  ;[...preTimeRange, ...currentTimeRange, ...nextTimeRange].forEach(item => {
    if (typeOf(item) === 'array') {
      item.forEach(e => {
        allDateArr.push(e)
      })
    } else {
      allDateArr.push(item)
    }
  })
  let checkedMonthRange = []
  const index = allDateArr.findIndex(item => item === currentXun)
  // 始终保持当前旬的前pre旬和后next旬
  checkedMonthRange = allDateArr.slice(index - pre, index + next + 1)
  return checkedMonthRange
}

/**
 * 计算两个日期之间的天数
 * @param dateString1  开始日期 yyyy-MM-dd
 * @param dateString2  结束日期 yyyy-MM-dd
 * @returns {number} 如果日期相同 返回一天 开始日期大于结束日期，返回0
 */
export const getDaysBetween = (dateString1, dateString2) => {
  var startDate = Date.parse(dateString1)
  var endDate = Date.parse(dateString2)
  if (startDate > endDate) {
    return 0
  }
  if (startDate === endDate) {
    return 1
  }
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
  return days
}

/**
 * 时间控件按月份统计 开始日期为当月的第一天 结束日期为当月的最后一天
 * @param date  日期区间 [yyyy-MM, yyyy-MM]
 * @returns {Array} 返回 [yyyy-MM-dd, yyyy-MM-dd]
 */
export const exportDateRange = date => {
  const datertArr = date[0].split('-')
  const start = datertArr[0] + '-' + datertArr[1] + '-' + '01'
  const endArr = date[1].split('-')
  const end = endArr[0] + '-' + endArr[1] + '-' + new Date(endArr[0], endArr[1], 0).getDate()
  return [start, end]
}

/**
 * 获取两个时间日期之间所有的日期
 * @param stime  开始日期
 * @param etime  结束日期
 * @returns {Array} 返回所有时间组成的数组
 */
export const getdiffdate = (stime, etime) => {
  // 初始化日期列表，数组
  const diffdate = []
  let i = 0
  // 开始日期小于等于结束日期,并循环
  while (stime <= etime) {
    diffdate[i] = stime
    // 获取开始日期时间戳
    const stime_ts = new Date(stime).getTime()
    // console.log('当前日期：' + stime + '当前时间戳：' + stime_ts)
    // 增加一天时间戳后的日期
    const next_date = stime_ts + 24 * 60 * 60 * 1000
    // 拼接年月日，这里的月份会返回（0-11），所以要+1
    const next_dates_y = new Date(next_date).getFullYear() + '-'
    const next_dates_m =
      new Date(next_date).getMonth() + 1 < 10
        ? '0' + (new Date(next_date).getMonth() + 1) + '-'
        : new Date(next_date).getMonth() + 1 + '-'
    const next_dates_d =
      new Date(next_date).getDate() < 10
        ? '0' + new Date(next_date).getDate()
        : new Date(next_date).getDate()
    stime = next_dates_y + next_dates_m + next_dates_d
    // 增加数组key
    i++
  }
  return diffdate
}

/**
 * 获取该日期在当年第几周
 * @param date  测算时间
 * @returns {Number} 返回当年的第几周
 */
export const weekOfYear = date => {
  const year = date.split('-')[0]
  const month = date.split('-')[1]
  const day = date.split('-')[2]
  let date1 = new Date(year, 0, 1)
  let date2 = new Date(year, month - 1, day, 1)
  const dayMS = 24 * 60 * 60 * 1000
  // 每周从周一开始 8
  const firstDay = (8 - date1.getDay()) * dayMS
  const weekMS = 7 * dayMS
  date1 = date1.getTime()
  date2 = date2.getTime()
  return Math.ceil((date2 - date1 - firstDay) / weekMS) + 1
}

/**
 * 获取当前日期前后N天的日期
 * @param dayCount  前后的天数
 * @returns {String} 返回具体的日期
 */
export const getDateStr = dayCount => {
  var today = new Date()
  today.setDate(today.getDate() + dayCount) // 获取AddDayCount天后的日期
  var y = today.getFullYear()
  var m = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1 // 获取当前月份的日期，不足10补0
  var d = today.getDate() < 10 ? '0' + today.getDate() : today.getDate() // 获取当前几号，不足10补0
  return y + '-' + m + '-' + d
}

/**
 * 普通日期时间格式转换
 * @param val  原日期时间
 * @param type  转换成的类型
 * @returns {String} 换换成对应的日期格式
 */
export const changeMonth = (val, type) => {
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  if (val) {
    if (!type) {
      // 不传类型 默认转换成 日-月
      const arr = parseTime(val, '{m}-{d}').split('-')
      return `${arr[1]}-${month[+arr[0] - 1]}`
    }
    if (type === 'mdhi') {
      // 转换成 月-日 时：分
      const arr = parseTime(val, '{m}-{d} {h}:{i}').split(' ') // 月 天 时 分
      const dateArr = arr[0].split('-')
      return `${dateArr[1]}-${month[+dateArr[0] - 1]} ${arr[1]}`
    }
    if (type === 'm') {
      // 转换成 月
      const arr = val.split('-')
      return `${month[+arr[1] - 1]}`
    }
    if (/^sem/.test(type)) {
      const arr = val.split('-')
      const y = arr[0] // 年
      const m = arr[1] // 月
      const x = arr[2] // 旬
      // eslint-disable-next-line eqeqeq
      if (x == 1) {
        return '01-10/' + month[+m - 1] + (type.includes('y') ? '/' + y : '')
        // eslint-disable-next-line eqeqeq
      } else if (x == 2) {
        return '11-20/' + month[+m - 1] + (type.includes('y') ? '/' + y : '')
      } else {
        return (
          '21-' +
          new Date(y, m, 0).getDate() +
          '/' +
          month[+m - 1] +
          (type.includes('y') ? '/' + y : '')
        )
      }
    }
  }
  return ''
}

/**
 * 月份转换 数字<=>英文缩写
 * @param val  需要转换的月份值
 * @param type  转换成的类型
 * @returns {String} 转换成对应的月份格式
 */
export const translateMonth = (val, type) => {
  const enMonth = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const numMonth = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12'
  }
  switch (type) {
    case 'toEn': // 转换成英文缩写
      return `${enMonth[+val - 1]}`
    case 'toNum': // 转换成数字月份
      return `${numMonth[val]}`
  }
}

/**
 * 根据当年当月第几旬获取的日期范围 2021-07-3 => {startDate: 2021-07-21, endDate: 2021-07-31}
 * @param year  年份
 * @param month  月份
 * @param decade  旬
 * @returns {String} 返回补0后的结果或者直接返回
 */
export const decadeToDate = (year, month, decade) => {
  switch (decade) {
    case 1:
      return {
        startDate: year + '-' + month + '-' + '01',
        endDate: year + '-' + month + '-' + '10'
      }
    case 2:
      return {
        startDate: year + '-' + month + '-' + '11',
        endDate: year + '-' + month + '-' + '20'
      }
    case 3:
      return {
        startDate: year + '-' + month + '-' + '21',
        endDate: year + '-' + month + '-' + new Date(year, month, 0).getDate()
      }
  }
}

/**
 * 根据当前日期中的‘日’翻译成处于第几旬
 * @param day  日
 * @returns {Number} 返回第几旬
 */
export const getDecade = day => {
  if (day < 11) {
    return 1
  } else if (day < 21) {
    return 2
  } else {
    return 3
  }
}

/**
 * 根据传入的日期范围获取所有的日期 按旬 或者按月
 * @param range  日期范围
 * @param type  返回的类型 按旬 还是按月
 * @returns {Array} 返回所有的传入日期范围之内的日期
 */
export const getDateRange = (range, type) => {
  const formatManthRange = []
  let arr = []
  // 拿到时间日期的所有值，对月份不是两位数的月份进行前面补'0'操作
  const monthRange = getMonthBetween(range).map(item => {
    if (item.split('-')[1].length < 2) {
      return item.split('-')[0] + '-' + '0' + item.split('-')[1]
    } else {
      return item
    }
  })
  // eslint-disable-next-line eqeqeq
  if (type == 0) {
    // 每个月按三旬组合而成的数组当成另一个数组的元素
    arr = monthRange.map(item => {
      return [1, 2, 3].map(sonItem => item + '-' + sonItem)
    })
    arr.forEach(item => {
      if (typeOf(item) === 'array') {
        item.forEach(e => {
          formatManthRange.push(e)
        })
      } else {
        formatManthRange.push(item)
      }
    })
    return formatManthRange
  } else {
    return monthRange
  }
}

/**
 * 根据传入的日期范围获取所有的日期 处理年份是否同一年或者跨度是否大于一年
 * @param dateRange  日期范围
 * @returns {Array} 返回所有的传入日期范围之内的日期
 */
// 根据时间日期控件的时间设置好横坐标时间日期范围区间
export const getMonthBetween = dateRange => {
  const result1 = []
  const result2 = []
  const result3 = []
  let result = []
  const start = dateRange[0].split('-')
  const end = dateRange[1].split('-')
  if (start[0] < end[0]) {
    // 如果开始时间日期的年份和结束时间日期的年份 不是 同一年
    for (let i = start[1]; i < 13; i++) {
      result1.push(start[0] + '-' + i)
    }
    for (let i = 1; i <= end[1]; i++) {
      result2.push(end[0] + '-' + i)
    }
    if (+end[0] - start[0] > 1) {
      // 证明相差不只一年
      for (let i = start[0] + 1; i < end[0] - start[0]; i++) {
        for (let j = 1; j < 13; j++) {
          result3.push(i + '-' + j)
        }
      }
    }
    result = [...result1, ...result3, ...result2]
  } else {
    // 如果开始时间日期的年份和结束时间日期的年份 是 同一年
    for (let i = start[1]; i <= end[1]; i++) {
      result.push(start[0] + '-' + i)
    }
  }
  return result
}

/**
 * 获取当前月份的前后几个月的日期
 * @param before  前几个月
 * @param after  后几个月
 * @returns {Array} 返回所有的日期范围
 */
export const getMonthBeAfRange = (before, after) => {
  const arr = []
  let recentTimeRange = []
  const preTimeRange = []
  const nextTimeRange = []
  //  获取echart的x轴时间范围，当前月份的前三个月和后两个月时间
  recentTimeRange = [1, 2, 3].map(item => {
    return currentDate('yearMonth') + '-' + item
  })
  for (let i = before; i > 0; i--) {
    preTimeRange.push(
      [1, 2, 3].map(item => getPreMonthDay(currentDate('yearMonth'), i, 'yearMonth') + '-' + item)
    )
  }
  for (let i = 1; i < after + 1; i++) {
    nextTimeRange.push(
      [1, 2, 3].map(item => getNextMonthDay(currentDate('yearMonth'), i, 'yearMonth') + '-' + item)
    )
  }
  ;[...preTimeRange, ...recentTimeRange, ...nextTimeRange].forEach(item => {
    if (typeOf(item) === 'array') {
      item.forEach(e => {
        arr.push(e)
      })
    } else {
      arr.push(item)
    }
  })
  return arr
}

/**
 * 元素为对象的数组根据元素对象某个属性排序
 * @param arr  原数组
 * @param prop  原数组的元素的某个属性
 * @param orderByType  按倒序还是顺序
 * @returns {Array} 返回排好序的数组
 */
export const arrayObjSort = (arr, prop, orderByType) => {
  return arr.sort(compare(prop, orderByType))
}
function compare (prop, orderByType) {
  return function (obj1, obj2) {
    var val1 = obj1[prop]
    var val2 = obj2[prop]
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1)
      val2 = Number(val2)
    }
    switch (orderByType) {
      // 倒序
      case 'desc':
        if (val1 > val2) {
          return -1
        } else if (val1 < val2) {
          return 1
        } else {
          return 0
        }
      // 升序
      case 'asc':
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
    }
  }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  if (!time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, routes) => {
  if (name === 'error_404' || name === 'error_401') {
    return true
  }

  if (name === 'patient') {
    if (localStorage.hasMenuList) {
      let findIndex = JSON.parse(localStorage.hasMenuList).findIndex(item => {
        return item.tag === 'appoint'
      })
      if (findIndex !== -1) return true
    }
  }

  if (name === 'detail') {
    if (localStorage.hasMenuList) {
      let findIndex = JSON.parse(localStorage.hasMenuList).findIndex(item => {
        return item.tag === 'patient'
      })
      if (findIndex !== -1) return true
    }
  }

  if (name === 'print') {
    if (localStorage.hasMenuList) {
      let findIndex = JSON.parse(localStorage.hasMenuList).findIndex(item => {
        return item.tag === 'phy'
      })
      if (findIndex !== -1) return true
    }
  }

  let showMenuList = JSON.parse(localStorage.showMenuList)
  let obj = routes.find(item => {
    return item.meta.show
  })

  // console.log('obj:', obj)

  if (obj === undefined) {
    showMenuList.forEach(item => {
      routes.forEach(itemRouter => {
        if (item.meta.tag === itemRouter.meta.tag) {
          itemRouter.meta.show = item.meta.show
          if (item.children.length === 1) {
            // 一层菜单直接赋值
            item.children[0].meta.show = true
            itemRouter.children[0].meta.show = true
          } else if (item.children.length > 1) {
            // 二层菜单
            item.children.forEach(itemChild => {
              // 无权限直接跳过
              if (!itemChild.meta.show) return
              itemRouter.children.forEach(itemRouterChild => {
                if (itemChild.meta.tag === itemRouterChild.meta.tag) {
                  itemRouterChild.meta.show = itemChild.meta.show
                }
              })
            })
          }
        }
      })
    })
    const routePermissionJudge = list => {
      return list.some(item => {
        if (item.children && item.children.length) {
          return routePermissionJudge(item.children)
        } else if (item.name === name) {
          return item.meta.show
        }
      })
    }

    return routePermissionJudge(routes)
  } else {
    const routePermissionJudge = list => {
      return list.some(item => {
        if (item.children && item.children.length > 1) {
          return routePermissionJudge(item.children)
        } else if (item.name === name) {
          return item.meta.show
        }
      })
    }

    return routePermissionJudge(routes)
  }
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {String} url url
 * @param {Object} obj 要加入url的对象
 * @description 往URL中添加参数
 */
export const urlSplicing = (url, obj) => {
  if (url.indexOf('?') === -1) {
    url += '?'
  }
  Object.keys(obj).map(key => {
    url += key + '=' + obj[key] + '&'
  })
  url = url.slice(0, url.length - 1)
  return url
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @static 时间戳转完整时间
 * @param {Number} timestamp 时间戳
 * @param {Number} n 组合选择
 */
export const formatFullTime = (timestamp, n = 1) => {
  if (String(timestamp).length === 10) {
    timestamp *= 1000
  }
  let date = new Date(timestamp)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  if (n === 1) {
    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
  }
  if (n === 2) {
    return [month, day].join('-') + ' ' + [hour, minute].join(':')
  }
}

/**
 * @static 时间戳转时间
 * @param {*} timestamp 时间戳
 */
export const formatTime = timestamp => {
  if (String(timestamp).length === 10) {
    timestamp *= 1000
  }
  let date = new Date(timestamp)
  let hour = date.getHours()
  console.log(hour)
  let minute = date.getMinutes()
  if (hour >= 0 && hour < 6) {
    return '凌晨 ' + [hour, minute].join(':')
  }
  if (hour >= 6 && hour < 12) {
    return '早上 ' + [hour, minute].join(':')
  }
  if (hour === 12) {
    return '中午 ' + [hour, minute].join(':')
  }
  if (hour > 12 && hour < 18) {
    return '下午 ' + [hour, minute].join(':')
  }
  if (hour >= 18 < hour < 24) {
    return '晚上' + [hour, minute].join(':')
  }
  var timeStamp = new Date().getTime() / 1000 // 这里用不用除一千看后端给的时间戳长度
  if (Math.abs(msg.msgTime - timeStamp) < 300) {
    // 小于5分钟不显示
    msg.msgTime = ''
  } else if (timeStamp - msg.msgTime < 86400) {
    // 是否为当天
    timeStamp = msg.msgTime
    msg.msgTime = tools.formatTime(msg.msgTime)
  } else {
    timeStamp = msg.msgTime
    msg.msgTime = tools.formatFullTime(msg.msgTime)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = file => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData
        .split(/[\n\u0085\u2028\u2029]|\r\n?/g)
        .map(row => {
          return row.split('\t')
        })
        .map(item => {
          return item[0].split(',')
        })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = array => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return route1.name === route2.name && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, index => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = key => {
  return localStorage.getItem(key) || ''
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = start + step > end ? end : start + step
    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}
