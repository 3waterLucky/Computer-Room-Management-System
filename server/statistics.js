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
// 请求参数：无
// 返回参数：所有设备组成的对象数组{eId, eType, eStatus, occupiedId}
statistics.get('/equip', (req, res) => {
  db.promise().query(`SELECT * FROM equipments`)
    .then(([rows, fields]) => {
      res.send({
        status: 0,
        sta: rows
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err
      })
    });
})

// 报废统计
// 请求参数：无
// 返回参数：所有已报废设备的{eId, eType}组成的对象数组
statistics.get('/scrap', (req, res) => {
  db.promise().query('SELECT eId, eType FROM equipments WHERE eStatus=2')
    .then(([rows, fields]) => {
      res.send({
        status: 0,
        sta: rows
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err
      })
    });
})

// 领用统计
// 请求参数：无
// 返回参数：领用表每一行{userId, eId, borrowTime, returnTime}组成的对象数组
statistics.get('/borrow', (req, res) => {
  db.promise().query('SELECT * FROM borrow')
    .then(([rows, fields]) => {
      res.send({
        status: 0,
        sta: rows
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err
      })
    });
})

// 收费统计
// 请求参数：无
// 返回参数：上机表每一行{userId, eId, startTime, endTime, cost}组成的对象数组
statistics.get('/charge', (req, res) => {
  db.promise().query('SELECT * FROM opPC')
    .then(([rows, fields]) => {
      res.send({
        status: 0,
        sta: rows
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err
      })
    });
})

module.exports = statistics