/**
 * 控制台输出好看的打印信息
 * log.print(text, type = 'default', isBack = false, content)
 * log.pretty(title, text, type = 'primary', content)
 */

// 定义 log 对象
const log = {}

/**
 * 打印方法
 * @param text 输出文本
 * @param type 输出样式，可以是6个状态值，也可以是自定义颜色
 * @param back 是否将色值应用于背景色
 */
log.print = function(text, type = 'default', back = false, content) {
  if (typeof text === 'object') { // 如果是对象则调用打印对象方式
    console.dir(text)
    return
  }
  if (back) { // 如果是打印带背景图的
    console.log(
      `%c ${text} `,
      `background:${typeColor(type)}; padding: 2px; border-radius: 4px;color: #fff;`,
      content
    )
  } else {
    console.log(
      `%c ${text} `,
      `color: ${typeColor(type)};`,
      content
    )
  }
}

/**
 * 漂亮的输出, 前面背景，后面边框
 * @param title 前面的标题
 * @param text 输出文本
 * @param type 输出样式，可以是6个状态值，也可以是自定义颜色
 */
log.pretty = function(title, text, type = 'primary', content) {
  console.log(
    `%c ${title} %c ${text} %c`,
    `background:${typeColor(type)};border:1px solid ${typeColor(type)}; padding: 1px; border-radius: 4px 0 0 4px; color: #fff;`,
    `border:1px solid ${typeColor(type)}; padding: 1px; border-radius: 0 4px 4px 0; color: ${typeColor(type)};`,
    'background:transparent',
    content
  )
}

/**
 * @description 返回这个样式的颜色值
 * @param {String} type 样式名称 [ primary | success | warning | danger | info ]
 */
function typeColor(type = 'default') {
  let color = ''
  switch (type) {
    case 'primary':
      color = '#2d8cf0'
      break
    case 'success':
      color = '#19be6b'
      break
    case 'info':
      color = '#909399'
      break
    case 'warning':
      color = '#ff9900'
      break
    case 'danger':
      color = '#f03f14'
      break
    case 'default':
      color = '#35495E'
      break
    default:
      color = type
      break
  }
  return color
}

export default log
