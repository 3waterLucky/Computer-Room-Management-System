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

//获取已有设备类型列表(不重复)
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

//获取已有设备编号及类型列表(重复)
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

//借用设备
equipmentManage.post('/borrow', (req, res) => {
  db.promise().query(`SELECT eId FROM equipments WHERE eType='${req.body.eType}' AND eStatus=1`)
    .then(([rows, fields]) => {
      if (rows.length) {
        db.query(`UPDATE equipments SET eStatus=0, occupiedId=${req.body.userId} WHERE eId=${rows[0].eId}`)
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

//获取userid所借用的设备列表
equipmentManage.get('/borrowedList', (req, res) => {
  db.promise().query(`SELECT eId, eType FROM equipments WHERE occupiedId=${req.query.id}`)
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

//归还设备
equipmentManage.post('/return', (req, res) => {
  db.promise().query(`UPDATE equipments SET eStatus=1, occupiedId=NULL WHERE eId=${req.body.eId}`)
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

//添加设备
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

//报废设备
equipmentManage.post('/scrap', (req, res) => {
  db.promise().query(`UPDATE equipments SET eStatus=2 WHERE eId=${req.body.eId}`)
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