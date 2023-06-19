const express = require('express')
const mysql = require('mysql2')
const register = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
// const formidable = require('formidable')
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  database: 'computer_room_manage_system',
  user: 'root',
  password: 'admin123'
})

register.use(bodyParser.json())
register.use(express.urlencoded())
register.use(cors())

register.post('/register', (req, res) => {
  const formObj = req.body
  console.log(formObj);
  db.promise().query(`INSERT INTO users (userId, username, dep, password) VALUE (${Number(formObj.userId)}, '${formObj.username}', '${formObj.dep}', '${formObj.password}')`)
    .then((result) => {
      res.send({
        status: 0,
        username: formObj.username,
        userId: formObj.userId
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: '注册失败：' + req.body.userId,
        data: err.message
      })
    });
})

module.exports = register