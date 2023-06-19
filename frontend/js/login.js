import { formdataToJson } from "./formdataToJson.js"

const loginUserId = document.getElementById('loginUserId')  //登录用户id
const loginPsw = document.getElementById('loginPsw')        //登录密码
const loginButton = document.getElementById('loginButton')  //登录按钮
const info = document.querySelector('.info')    //登陆界面
const register = document.querySelector('.register')  //注册界面
const regTitle = document.querySelector('.regTitle')  //注册页小标题
const registerButton = document.getElementById('registerButton')  //注册按钮

// 点击登录按钮
loginButton.addEventListener('click', () => {
  const loginData = {
    'userId': loginUserId.value,
    'password': loginPsw.value
  }
  axios.post('http://127.0.0.1:8000/login', loginData)
    .then(result => {
      console.log(result);
      if (!result.data.status) {
        location.replace(`index.html?username=${result.data.username}&id=${result.data.userId}`)
      } else if (result.data.message === 'psw Error') {
        alert('用户名或密码错误！')
      } else {
        regTitle.style.display = 'block'
        info.style.display = 'none'
        register.style.display = 'block'
      }
    })
    .catch(err => {
      alert('系统错误，请稍后再试')
    })
})

//点击注册按钮
const registerForm = document.getElementById('registerFrom')
registerButton.addEventListener('click', () => {
  const registerFormData = formdataToJson(new FormData(registerForm))
  console.log(registerFormData);
  axios.post('http://127.0.0.1:8000/register', registerFormData)
    .then(result => {
      console.log(result);
      if (!result.data.status) {
        location.replace(`index.html?username=${result.data.username}&id=${result.data.userId}`)
      } else {
        alert('注册失败，请检查后重试！')
      }
    })
    .catch(err => {
      alert('注册失败，请检查后再试')
    })
})