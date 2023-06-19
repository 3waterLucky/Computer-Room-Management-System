import { dateToStr } from "./dateToStr.js"

/**
 * 将接收到的对象数组转换为HTML表格
 * @param {Array} rows 
 * @return {HTMLTableElement}
 */
export function rowsToTable(rows) {
  const len = rows.length
  const map = {
    userId: '学号/工号',
    username: '姓名',
    dep: '所在部门',
    eId: '设备编号',
    eType: '设备名',
    eStatus: '设备状态',
    occupiedId: '占用者学号/工号',
    startTime: '开始时间',
    endTime: '结束时间',
    borrowTime: '借用时间',
    returnTime: '归还时间',
    cost: '收费（元）'
  }
  const eStatusMap = {
    0: '借出',
    1: '空闲',
    2: '报废',
    3: '占用'
  }
  const table = document.createElement('table')
  for (let i = 0; i <= len; i++) {
    const tr = document.createElement('tr')
    table.appendChild(tr)
  }
  for (const key in rows[0]) {
    const th = document.createElement('th')
    th.innerHTML = map[key]
    table.children[0].appendChild(th)
  }
  for (let i = 1; i <= len; i++) {
    for (const key in rows[i - 1]) {
      const td = document.createElement('td')
      if (key === 'eStatus') {
        td.innerHTML = eStatusMap[rows[i - 1][key]]
      } else if (key === 'startTime' || key === 'endTime' || key === 'borrowTime' || key === 'returnTime') {
        td.innerHTML = dateToStr(new Date(rows[i - 1][key]))
        if (!rows[i - 1][key] && key === 'endTime') {
          td.innerHTML = '未结束'
          table.children[i].style.backgroundColor = 'yellow'
        }
        if (!rows[i - 1][key] && key === 'returnTime') {
          td.innerHTML = '未归还'
          table.children[i].style.backgroundColor = 'yellow'
        }
      } else {
        td.innerHTML = rows[i - 1][key]
      }
      table.children[i].appendChild(td)
    }
  }
  return table
}