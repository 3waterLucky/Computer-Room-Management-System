const express = require('express')
const mysql = require('mysql2')
const statistics = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  database: 'computer_room_manage_system',
  user: 'root',
  password: 'admin123'
})

statistics.use(bodyParser.json())
statistics.use(express.urlencoded({ extended: false }))
statistics.use(cors())

// 设备统计
// 请求参数：
// 返回参数：
statistics.get('/equip', (req, res) => {
  
})

module.exports = statistics