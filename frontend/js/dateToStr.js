/**
 * 日期字符串转换函数
 * @param {Date} dateObj
 * @return {string}
 */
export function dateToStr(dateObj) {
  let y = dateObj.getFullYear()
  let m = dateObj.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = dateObj.getDate()
  d = d < 10 ? '0' + d : d
  let h = dateObj.getHours()
  h = h < 10 ? '0' + h : h
  let min = dateObj.getMinutes()
  min = min < 10 ? '0' + min : min
  let s = dateObj.getSeconds()
  s = s < 10 ? '0' + s : s
  return `${y}-${m}-${d}&nbsp;&nbsp;${h}:${min}:${s}`
}