import { formdataToJson } from "./formdataToJson.js"
import { refreshOptions } from "./refreshOptions.js"
import { rowsToTable } from "./rowsToTable.js"
import { dateToStr } from "./dateToStr.js"

const nav = document.querySelector('.nav')  //左侧导航栏
const header = document.querySelector('header')
const content = document.querySelector('.content')  //右侧内容区
nav.style.height = window.innerHeight - header.offsetHeight + 'px'
content.style.height = window.innerHeight - header.offsetHeight + 'px'
const user = document.querySelector('.user')
const urlParams = {}

if (location.search) {
  const paramsArr = location.search.slice(1).split('&')
  for (const item of paramsArr) {
    for (let i = 0; i < item.length; i++) {
      if (item[i] === '=') {
        let key = item.slice(0, i)
        let value = item.slice(i + 1)
        urlParams[key] = value
      }
    }
  }
  const username = decodeURI(urlParams.username);
  user.innerHTML = user.innerHTML.replace('用户名', username)
}

//请求用户权限，根据用户权限显示导航栏和标题
const authNavs = document.getElementsByClassName('authorizedNav')
const title = document.querySelector('title')
axios.get('http://127.0.0.1:8000/userInfo/auth', {
  params: {
    userId: urlParams.id
  }
}).then((result) => {
  if (result.data.auth) {
    title.innerHTML = '管理员页-计算机机房管理系统'
    for (const item of authNavs) {
      item.style.display = 'block'
    }
  }
}).catch((err) => {
  alert(err.message);
});

const userNav = document.querySelector('.userNav')
//左侧导航栏tag的切换
const tags = nav.children[0].getElementsByTagName('li')
const contentBox = content.children
for (let i = 0; i < tags.length; i++) {
  tags[i].addEventListener('click', () => {
    for (let j = 0; j < tags.length; j++) {
      tags[j].style.backgroundColor = '#c88f4d'
      tags[j].style.color = "#ddd"
      contentBox[j].style.display = 'none'
      userNav.style.display = 'none'
    }
    tags[i].style.backgroundColor = '#f7a64b'
    tags[i].style.color = "#fff"
    if (tags[i].innerHTML === '用户管理') {
      userNav.style.display = 'block'
    }
    contentBox[i].style.display = 'block'
  })
}

/*
******************
*                *
*   个人信息页    *
*                *
******************
*/
const userInfo = document.querySelector('.userInfo')
const userInfo_userId = userInfo.querySelector('.userId')
const userInfo_username = userInfo.querySelector('.username')
const userInfo_dep = userInfo.querySelector('.dep')
userInfo_userId.innerHTML = urlParams.id  //显示学号/工号
userInfo_username.value = decodeURI(urlParams.username) //显示姓名
const saveUserInfo = userInfo.querySelector('.save')
const updateUserInfo = userInfo.querySelector('#updateUserInfo')

//获取所在部门信息,使下拉菜单默认选中该部门
axios.get('http://127.0.0.1:8000/userInfo/dep', {
  params: {
    userId: urlParams.id
  }
}).then((result) => {
  for (const item of userInfo_dep.children) {
    if (item.value === result.data.dep) {
      item.selected = true
    }
  }
}).catch((err) => {
  console.log(err.message);
});

saveUserInfo.addEventListener('click', () => {
  const form = formdataToJson(new FormData(updateUserInfo))
  console.log(form);
  if (!form.password.length) {
    delete form.password
  }
  form.userId = urlParams.id
  if (!form.username.length) {
    alert('姓名不能为空!')
  } else {
    axios.post('http://127.0.0.1:8000/userInfo/update', form)
      .then((result) => {
        console.log(result);
      }).catch((err) => {
        console.log(err);
      });
  }
})

/*
******************
*                *
*   上机登记页    *
*                *
******************
*/
const oppc = document.querySelector('.oppc')
const start = oppc.querySelector('.start')
const using = oppc.querySelector('.using')
const startTimeBox = using.querySelector('.startTime')
const startTimeTitle = startTimeBox.querySelector('.title')
const startTime = startTimeBox.querySelector('.time')
const duration = using.querySelector('.duration')
const durationTitle = duration.querySelector('.title')
const hour = duration.querySelector('.hour')
const hourTitle = duration.querySelector('.hourTitle')
const min = duration.querySelector('.min')
const minTitle = duration.querySelector('.minTitle')
const sec = duration.querySelector('.sec')
const secTitle = duration.querySelector('.secTitle')
const currentCost = using.querySelector('.currentCost')
const costTitle = currentCost.querySelector('.title')
const cost = currentCost.querySelector('.cost')
const settle = using.querySelector('.settle')

// 正计时函数
let counter
const countTime = (startTime) => {
  let start = startTime.getTime()
  counter = setInterval(() => {
    let now = Date.now()
    let duration = Math.floor((now - start) / 1000)
    let h = Math.floor(duration / 3600)
    let m = Math.floor(duration / 60) % 60
    let s = duration % 60
    hour.innerHTML = h
    min.innerHTML = m
    sec.innerHTML = s
    cost.innerHTML = h + 1
  }, 1000)
}

const opBtn = nav.getElementsByTagName('li')[1]
opBtn.addEventListener('click', () => {
  axios.get('http://127.0.0.1:8000/op/notend', {
    params: {
      userId: urlParams.id
    }
  })
  .then((result) => {
    if (!result.data.status) {
      if (result.data.startTime) {
        using.style.display = 'block'
        start.style.display = 'none'
        startTime.innerHTML = dateToStr(new Date(result.data.startTime))
        countTime(new Date(result.data.startTime))
      }
    }
  }).catch((err) => {
    alert('系统错误！')
  });
})

//开始上机
start.addEventListener('click', () => {
  const curTime = new Date()
  using.style.display = 'block'
  start.style.display = 'none'
  axios.post('http://127.0.0.1:8000/op/start', {
    userId: urlParams.id,
    startTime: curTime
  })
    .then((result) => {
      if (!result.data.status) {
        alert(`登记成功！请使用编号为【${result.data.eId}】的台式机。`)
      } else {
        alert(result.data.message)
      }
    }).catch((err) => {
      console.log(err);
    });
  startTime.innerHTML = dateToStr(curTime)
  countTime(curTime)
})

//结束上机并结算
settle.addEventListener('click', () => {
  const curTime = new Date()
  clearInterval(counter)
  using.style.display = 'none'
  start.style.display = 'block'
  axios.post('http://127.0.0.1:8000/op/end', {
    userId: urlParams.id,
    endTime: curTime
  })
    .then((result) => {
      if (!result.data.status) {
        alert(`您本次上机时间为${result.data.h}小时${result.data.m}分钟${result.data.s}秒，共计消费${result.data.cost}元。`)
      } else {
        alert(result.data.message)
      }
    }).catch((err) => {
      console.log(err);
    });
})

/*
******************
*                *
*   设备领用页    *
*                *
******************
*/
const borrow = document.querySelector('.borrow')
const getButton = borrow.querySelector('.get')
const returnButton = borrow.querySelector('.return')
const getBox = borrow.querySelector('.getBox')
const returnBox = borrow.querySelector('.returnBox')
const getEquipList = getBox.querySelector('select')
const returnEquipList = returnBox.querySelector('select')
const getSubmit = getBox.querySelector('.getSubmit')
const returnSubmit = returnBox.querySelector('.returnSubmit')

//点击我要借用按钮
getButton.addEventListener('click', () => {
  getButton.style.backgroundColor = '#2f2b9a'
  returnButton.style.backgroundColor = '#002a44'
  getBox.style.display = 'block'
  returnBox.style.display = 'none'
  //刷新下拉菜单
  refreshOptions(getEquipList, null, 'http://127.0.0.1:8000/equipmentManage/equipList/distinct' )
})

//提交借用
getSubmit.addEventListener('click', () => {
  const borrowType = getEquipList.value
  const curTime = new Date()
  const borrowObj = {
    userId: urlParams.id,
    eType: borrowType,
    borrowTime: curTime
  }
  if (!borrowType.length) {
    alert('请选择要借用的设备！')
  } else{
    axios.post('http://127.0.0.1:8000/equipmentManage/borrow', borrowObj)
    .then((result) => {
      if (!result.data.status) {
        alert('您已成功借用设备编号为【' + result.data.eId + '】的【' + borrowObj.eType +'】！')
      } else {
        alert(result.data.message)
      }
    }).catch((err) => {
      console.log(err);
    });
  }
})

//点击我要归还按钮
returnButton.addEventListener('click', () => {
  getButton.style.backgroundColor = '#002a44'
  returnButton.style.backgroundColor = '#2f2b9a'
  returnBox.style.display = 'block'
  getBox.style.display = 'none'
  refreshOptions(returnEquipList, {
    id: urlParams.id
  }, 'http://127.0.0.1:8000/equipmentManage/borrowedList', 'get', true)
})

//提交归还
returnSubmit.addEventListener('click', () => {
  const returnEquipId = returnEquipList.value
  const curTime = new Date()
  const returnObj = {
    userId: urlParams.id,
    eId: returnEquipId,
    returnTime: curTime
  }
  if (!returnEquipId.length) {
    alert('请选择要归还的设备！')
  } else {
    axios.post('http://127.0.0.1:8000/equipmentManage/return', returnObj)
    .then((result) => {
      alert(`您已归还编号为【${result.data.eId}】的设备！`)
      refreshOptions(returnEquipList, {
        id: urlParams.id
      }, 'http://127.0.0.1:8000/equipmentManage/borrowedList', 'get', true)
    }).catch((err) => {
      console.log(err);
    });
  }
})

/*
******************
*                *
*   用户管理页    *
*                *
******************
*/
const addUser = document.querySelector('.addUser')
const setAdmin = document.querySelector('.setAdmin')
const deleteUser = document.querySelector('.deleteUser')
const addUserBox = document.querySelector('.addUserBox')
const setAdminBox = document.querySelector('.setAdminBox')
const deleteUserBox = document.querySelector('.deleteUserBox')
const saveButton = addUserBox.querySelector('.save')
const setAdminSubmit = setAdminBox.querySelector('.setAdminSubmit')
const deleteSubmit = deleteUserBox.querySelector('.deleteSubmit')

//添加用户
addUser.addEventListener('click', () => {
  addUserBox.style.display = 'block'
  setAdminBox.style.display = 'none'
  deleteUserBox.style.display = 'none'
})

saveButton.addEventListener('click', () => {
  const addUserInfo = document.getElementById('addUserInfo')
  const form = formdataToJson(new FormData(addUserInfo))
  axios.post('http://127.0.0.1:8000/userInfo/add', form)
    .then((result) => {
      if (!result.data.status) {
        alert(`成功添加用户【${result.data.userId}  ${result.data.username}】！`)
      } else {
        alert('添加用户失败！')
      }
    }).catch((err) => {
      console.log(err);
    });
})

//设置管理员
const searchResultName = setAdminBox.querySelector('.searchResultName')
const searchId = setAdminBox.querySelector('.searchId')
setAdmin.addEventListener('click', () => {
  addUserBox.style.display = 'none'
  setAdminBox.style.display = 'block'
  deleteUserBox.style.display = 'none'
})
//根据学号/工号获取姓名进行显示
searchId.addEventListener('blur', () => {
  axios.get('http://127.0.0.1:8000/userInfo/username', {
    params: {
      userId: searchId.value
    }
  })
    .then((result) => {
      if (!result.data.status) {
        searchResultName.innerHTML = result.data.username
      }
    }).catch((err) => {
      console.log(err);
    });
})
//提交设置为管理员
setAdminSubmit.addEventListener('click', () => {
  const userObj = {}
  userObj.userId = setAdminBox.querySelector('.searchId').value
  let confirmSubmit = confirm(`您确定要将【${userObj.userId}  ${searchResultName.innerHTML}】设置为管理员吗？`)
  if (confirmSubmit) {
    axios.post('http://127.0.0.1:8000/userInfo/setAdmin', userObj)
    .then((result) => {
      if (!result.data.status) {
        alert(`已成功将【${userObj.userId}  ${searchResultName.innerHTML}】设置为管理员！`)
      } else {
        alert('设置管理员失败！')
      }
    }).catch((err) => {
      console.log(err);
    });
  }
})

//删除用户
const deleteSearchResultName = deleteUserBox.querySelector('.searchResultName')
const deleteSearchId = deleteUserBox.querySelector('.searchId')
deleteUser.addEventListener('click', () => {
  addUserBox.style.display = 'none'
  setAdminBox.style.display = 'none'
  deleteUserBox.style.display = 'block'
})
//根据学号/工号获取姓名进行显示
deleteSearchId.addEventListener('blur', () => {
  axios.get('http://127.0.0.1:8000/userInfo/username', {
    params: {
      userId: deleteSearchId.value
    }
  })
    .then((result) => {
      if (!result.data.status) {
        deleteSearchResultName.innerHTML = result.data.username
      }
    }).catch((err) => {
      console.log(err);
    });
})
//提交设置为管理员
deleteSubmit.addEventListener('click', () => {
  const userObj = {}
  userObj.userId = deleteUserBox.querySelector('.searchId').value
  let confirmSubmit = confirm(`您确定要将用户【${userObj.userId}  ${deleteSearchResultName.innerHTML}】删除吗？`)
  if (confirmSubmit) {
    axios.post('http://127.0.0.1:8000/userInfo/deleteUser', userObj)
    .then((result) => {
      if (!result.data.status) {
        alert(`已成功将用户【${result.data.userId}  ${deleteSearchResultName.innerHTML}】删除！`)
      } else {
        alert('删除用户失败！')
      }
    }).catch((err) => {
      console.log(err);
    });
  }
})

/*
******************
*                *
*   设备管理页    *
*                *
******************
*/
const equipmentManage = document.querySelector('.equipmentManage')
const add = equipmentManage.querySelector('.add')
const scrap = equipmentManage.querySelector('.scrap')
const addBox = equipmentManage.querySelector('.addBox')
const addEquipType = addBox.querySelector('.addEquipType')
const scrapBox = equipmentManage.querySelector('.scrapBox')
const chooseScrap = scrapBox.querySelector('.chooseScrap')
const addSubmit = addBox.querySelector('.addSubmit')
const scrapSubmit = scrapBox.querySelector('.scrapSubmit')

//我要添加
add.addEventListener('click', () => {
  addBox.style.display = 'block'
  scrapBox.style.display = 'none'
  scrap.style.backgroundColor = '#002a44'
  add.style.backgroundColor = '#2f2b9a'
})

//添加设备
addSubmit.addEventListener('click', () => {
  const addType = addEquipType.value
  const addObj = {
    eType: addType
  }
  if (!addEquipType.value.length) {
    alert('设备类型不能为空！')
  } else {
    axios.post('http://127.0.0.1:8000/equipmentManage/add', addObj)
    .then((result) => {
      alert('您已成功添加【' + addType + '】设备,该设备编号为【' + result.data.eId + '】')
    }).catch((err) => {
      console.log(err);
    });
  }
})

//获取已有设备列表
scrap.addEventListener('click', () => {
  addBox.style.display = 'none'
  scrapBox.style.display = 'block'
  add.style.backgroundColor = '#002a44'
  scrap.style.backgroundColor = '#2f2b9a'
  refreshOptions(chooseScrap, null, 'http://127.0.0.1:8000/equipmentManage/equipList', 'get', true)
})

//报废设备
scrapSubmit.addEventListener('click', () => {
  const scrapId = chooseScrap.value
  if (!chooseScrap.value.length) {
    alert('请选择要报废的设备！')
  } else {
    axios.post('http://127.0.0.1:8000/equipmentManage/scrap', {
      eId: scrapId
    })
      .then((result) => {
        if (!result.data.status) {
          alert('编号为【' + scrapId + '】的设备已成功标记报废！')
          refreshOptions(chooseScrap, null, 'http://127.0.0.1:8000/equipmentManage/equipList', 'get', true)
        } else {
          alert('操作失败!')
        }
      }).catch((err) => {
        console.log(err);
      });
  }
})

/*
******************
*                *
*   信息统计页    *
*                *
******************
*/
const statistics = document.querySelector('.statistics')
const staNav = statistics.querySelector('.staNav')
const equipStaBtn = staNav.children[0]
const scrapStaBtn = staNav.children[1]
const borrowStaBtn = staNav.children[2]
const chargeStaBtn = staNav.children[3]
const equipSta = statistics.querySelector('.equipSta')
const scrapSta = statistics.querySelector('.scrapSta')
const borrowSta = statistics.querySelector('.borrowSta')
const chargeSta = statistics.querySelector('.chargeSta')

// 标题栏
for (const item of staNav.children) {
  item.addEventListener('click', () => {
    for (const item of staNav.children) {
      item.style.backgroundColor = '#c88f4d'
    }
    item.style.backgroundColor = '#f7a64b'
  })
}

//获取并展示设备列表
equipStaBtn.addEventListener('click', () => {
  while (equipSta.children.length) {
    equipSta.removeChild(equipSta.children[equipSta.children.length - 1])
  }
  for (let i = 1; i < 5; i++) {
    statistics.children[i].innerHTML = ''
  }
  axios.get('http://127.0.0.1:8000/data/equip')
    .then((result) => {
      if (!result.data.status) {
        const table = rowsToTable(result.data.sta)
        equipSta.appendChild(table)
      } else {
        alert('获取数据失败！')
      }
    }).catch((err) => {
      alert('获取数据失败！')
    });
})


//获取并展示已报废设备列表
scrapStaBtn.addEventListener('click', () => {
  while (scrapSta.children.length) {
    scrapSta.removeChild(scrapSta.children[scrapSta.children.length - 1])
  }
  for (let i = 1; i < 5; i++) {
    statistics.children[i].innerHTML = ''
  }
  axios.get('http://127.0.0.1:8000/data/scrap')
    .then((result) => {
      if (!result.data.status) {
        const table = rowsToTable(result.data.sta)
        scrapSta.appendChild(table)
      } else {
        alert('获取数据失败！')
      }
    }).catch((err) => {
      alert('获取数据失败！')
    });
})

//获取并展示领用表
borrowStaBtn.addEventListener('click', () => {
  while (borrowSta.children.length) {
    borrowSta.removeChild(borrowSta.children[borrowSta.children.length - 1])
  }
  for (let i = 1; i < 5; i++) {
    statistics.children[i].innerHTML = ''
  }
  axios.get('http://127.0.0.1:8000/data/borrow')
  .then((result) => {
    if (!result.data.status) {
      const table = rowsToTable(result.data.sta)
      borrowSta.appendChild(table)
    } else {
      alert('获取数据失败！')
    }
  }).catch((err) => {
    alert('获取数据失败！')
  });
})

//获取并展示收费表
chargeStaBtn.addEventListener('click', () => {
  while (chargeSta.children.length) {
    chargeSta.removeChild(chargeSta.children[chargeSta.children.length - 1])
  }
  for (let i = 1; i < 5; i++) {
    statistics.children[i].innerHTML = ''
  }
  axios.get('http://127.0.0.1:8000/data/charge')
  .then((result) => {
    if (!result.data.status) {
      const table = rowsToTable(result.data.sta)
      chargeSta.appendChild(table)
    } else {
      alert('获取数据失败！')
    }
  }).catch((err) => {
    alert('获取数据失败！')
  });
})