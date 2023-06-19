//登录相关接口
const express = require('express')
const mysql = require('mysql2')
const login = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  database: 'computer_room_manage_system',
  user: 'root',
  password: 'admin123'
})

login.use(bodyParser.json())
login.use(express.urlencoded({ extended: false }))
login.use(cors())

// 请求参数：userId, password
// 返回参数：username, userId
login.post('/login', (req, res) => {
  console.log(req.body);
  db.promise().query(`SELECT * FROM users WHERE userId=${Number(req.body.userId)}`)
    .then(([rows, fields]) => {
      console.log(rows[0].username);
      if (rows[0].userId == req.body.userId && rows[0].password === req.body.password) {
        res.send({
          status: 0,
          username: rows[0].username,
          userId: rows[0].userId
        })
      } else {
        res.send({
          status: 1,
          message: 'psw Error'
        })
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: '查无此人' + req.body.userId,
        data: err.message
      })
    })
})

module.exports = login