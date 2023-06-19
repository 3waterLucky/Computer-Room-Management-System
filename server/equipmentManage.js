//设备管理相关接口
const express = require('express')
const mysql = require('mysql2')
const equipmentManage = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  database: 'computer_room_manage_system',
  user: 'root',
  password: 'admin123'
})

equipmentManage.use(bodyParser.json())
equipmentManage.use(express.urlencoded({ extended: false }))
equipmentManage.use(cors())

// 获取已有设备类型列表(不重复)
// 请求参数：无
// 返回参数：
equipmentManage.get('/equipList/distinct', (req, res) => {
  db.promise().query('SELECT DISTINCT eType FROM equipments')
    .then(([rows, fields]) => {
      res.send(rows)
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err.message
      })
    });
})

// 获取已有的【空闲】设备编号及类型
// 请求参数：无
// 返回参数：{eId, eType}对象数组rows
equipmentManage.get('/equipList', (req, res) => {
  db.promise().query('SELECT eId, eType FROM equipments WHERE eStatus=1')
    .then(([rows, fields]) => {
      res.send(rows)
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err.message
      })
    });
})

// 借用设备
// 请求参数：eType
// 返回参数：eId / message
equipmentManage.post('/borrow', (req, res) => {
  db.promise().query(`SELECT eId FROM equipments WHERE eType='${req.body.eType}' AND eStatus=1`)
    .then(([rows, fields]) => {
      if (rows.length) {
        db.query(`INSERT INTO borrow(userId, eId, borrowTime) VALUE(${req.body.userId}, ${rows[0].eId}, '${req.body.borrowTime}')`)
        res.send({
          status: 0,
          eId: rows[0].eId
        })
      } else {
        res.send({
          status: 1,
          message: '库存不足!'
        })
      }
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err.message
      })
    });
})

// 获取userid所借用的设备列表
// 请求参数：id
// 返回参数：{eId, eType}对象数组rows
equipmentManage.get('/borrowedList', (req, res) => {
  db.promise().query(`SELECT eId, eType FROM equipments WHERE occupiedId=${req.query.id} AND eStatus=0`)
    .then(([rows, fields]) => {
      res.send(rows)
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err.message
      })
    });
})

// 归还设备
// 请求参数：userId, eId, returnTime
// 返回参数：eId
equipmentManage.post('/return', (req, res) => {
  db.promise().query(`UPDATE borrow SET returnTime='${req.body.returnTime}' WHERE userId=${req.body.userId} AND eId=${req.body.eId} AND returnTime IS NULL`)
    .then((result) => {
      res.send({
        status: 0,
        eId: req.body.eId
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err.message
      })
    });
})

// 添加设备
// 请求参数：eType
// 返回参数：eId
equipmentManage.post('/add', (req, res) => {
  db.promise().query(`INSERT INTO equipments(eType, eStatus) VALUE('${req.body.eType}', 1)`)
    .then((result) => {
      console.log(result);
      res.send({
        status: 0,
        eId: result[0].insertId
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err.message
      })
    });
})

// 报废设备
// 请求参数：eId
// 返回参数：scrapId
equipmentManage.post('/scrap', (req, res) => {
  db.promise().query(`UPDATE equipments SET eStatus=2 WHERE eId=${req.body.eId} AND (eStatus!=0 OR eStatus!=3)`)
    .then((result) => {
      res.send({
        status: 0,
        scrapId: req.body.eId
      })
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: err.message
      })
    });
})

module.exports = equipmentManage