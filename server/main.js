const express = require('express')
const mysql = require('mysql2')
const login = require('./login')
const register = require('./register')
const cors = require('cors')
const userInfo = require('./userInfo')
const equipmentManage = require('./equipmentManage')
const useComputer = require('./useCompuer')
const statistics = require('./statistics')
const app = express()

//连接数据库
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  database: 'computer_room_manage_system',
  user: 'root',
  password: 'admin123'
})

//配置解析表单数据的中间件
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(login)
app.use(register)
app.use('/userInfo', userInfo)
app.use('/equipmentManage', equipmentManage)
app.use('/op', useComputer)
app.use('/statistics', statistics)

app.listen(8000, () => {
  console.log('Express server running at http://127.0.0.1:8000');
})