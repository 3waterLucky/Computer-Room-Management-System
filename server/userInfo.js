//用户管理相关接口
const express = require('express')
const mysql = require('mysql2')
const userInfo = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  database: 'computer_room_manage_system',
  user: 'root',
  password: 'admin123'
})

userInfo.use(bodyParser.json())
userInfo.use(express.urlencoded({ extended: false }))
userInfo.use(cors())

// 获取用户姓名
// 请求参数：userId
// 返回参数：username
userInfo.get('/username', (req, res) => {
  let ret = {
    status: 0,
  }
  db.promise().query(`SELECT username FROM users WHERE userId=${Number(req.query.userId)}`)
    .then(([rows, fields]) => {
      ret.username = rows[0].username
      res.send(ret)
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: '获取用户姓名失败!',
        data: err.message
      })
    })
})

// 获取用户所在部门
// 请求参数：userId
// 返回参数：dep
userInfo.get('/dep', (req, res) => {
  let ret = {
    status: 0,
  }
  db.promise().query(`SELECT dep FROM users WHERE userId=${Number(req.query.userId)}`)
    .then(([rows, fields]) => {
      ret.dep = rows[0].dep
      res.send(ret)
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: '获取用户部门失败!',
        data: err.message
      })
    })
})

// 获取用户权限
// 请求参数：userId
// 返回参数：auth
userInfo.get('/auth', (req, res) => {
  let ret = {
    status: 0,
    auth: 0
  }
  db.promise().query(`SELECT auth FROM users WHERE userId=${Number(req.query.userId)}`)
    .then(([rows, fields]) => {
      if (rows[0].auth) {
        ret.auth = 1
      }
      res.send(ret)
    })
    .catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: '获取用户权限失败!',
        data: err.message
      })
    })
})

// 更新信息
// 请求参数：userId, username, dep, [password]
userInfo.post('/update', (req, res) => {
  const form = req.body
  if (form.password) {
    db.promise().query(`UPDATE users SET username='${form.username}', dep='${form.dep}', password='${form.password}' WHERE userId=${Number(form.userId)}`)
      .then((result) => {
        res.send({
          status: 0,
          data: result
        })
      }).catch((err) => {
        console.log(err);
        res.send({
          status: 1,
          data: err
        })
      });
  } else {
    db.promise().query(`UPDATE users SET username='${form.username}', dep='${form.dep}' WHERE userId=${Number(form.userId)}`)
    .then((result) => {
      res.send({
        status: 0,
        data: result
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        data: err
      })
    });
  }
})

// 添加用户
// 请求参数：userId, username, dep, password, [auth]
// 返回参数：userId, username
userInfo.post('/add', (req, res) => {
  const info = req.body
  if (!info.password.length) {
    info.password = '123456'
  }
  if (info.auth) {
    info.auth = 1
  } else {
    info.auth = 0
  }
  db.promise().query(`INSERT INTO users(userId, username, dep, password, auth) VALUE(${info.userId}, '${info.username}', '${info.dep}', '${info.password}', ${info.auth})`)
    .then((result) => {
      res.send({
        status: 0,
        userId: info.userId,
        username: info.username
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err
      })
    });
})

// 设置管理员权限
// 请求参数：userId
userInfo.post('/setAdmin', (req, res) => {
  db.promise().query(`UPDATE users SET auth=1 WHERE userId=${req.body.userId}`)
    .then((result) => {
      res.send({
        status: 0
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err.message
      })
    });
})

// 删除用户
// 请求参数：userId
// 返回参数：userId
userInfo.post('/deleteUser', (req, res) => {
  db.promise().query(`DELETE FROM users WHERE userId=${req.body.userId}`)
    .then((result) => {
      res.send({
        status: 0,
        userId: req.body.userId
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err.message
      })
    });
})

module.exports = userInfo