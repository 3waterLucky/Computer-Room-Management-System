/**
 * 刷新下拉菜单中的设备
 * @param {HTMLSelectElement} selectTag  select节点
 * @param {object} reqParams 请求参数对象
 * @param {string} url  请求下拉菜单内容的URL地址
 * @param {string} method post/get，默认为get
 * @param {boolean} withNumber  选项中是否带设备编号，默认false
 */
export function refreshOptions(selectTag, reqParams, url, method='get', withNumber=false) {
  while (selectTag.children.length) {
    selectTag.removeChild(selectTag.children[selectTag.children.length - 1])
  }
  if (method === 'get') {
    axios.get(url, {
      params: reqParams
    })
      .then((result) => {
        for (const item of result.data) {
          const option = document.createElement('option')
          option.value = item.eType
          if (withNumber) {
            option.value = item.eId
            option.innerHTML = item.eId + ' ' + item.eType
          } else {
            option.value = item.eType
            option.innerHTML = item.eType
          }
          selectTag.appendChild(option)
        }
      }).catch((err) => {
        console.log(err);
      });
  }
  if (method === 'post') {
    axios.post(url, reqParams)
      .then((result) => {
        for (const item of result.data) {
          const option = document.createElement('option')
          if (withNumber) {
            option.value = item.eId
            option.innerHTML = item.eId + ' ' + item.eType
          } else {
            option.value = item.eType
            option.innerHTML = item.eType
          }
          selectTag.appendChild(option)
        }
      }).catch((err) => {
        console.log(err);
      });
  }
}