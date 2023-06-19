const express = require('express')
const mysql = require('mysql2')
const useComputer = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  database: 'computer_room_manage_system',
  user: 'root',
  password: 'admin123'
})

useComputer.use(bodyParser.json())
useComputer.use(express.urlencoded({ extended: false }))
useComputer.use(cors())

//开始上机
useComputer.post('/start', (req, res) => {
  //先查找可用台式机
  db.promise().query(`SELECT eId FROM equipments WHERE eStatus=1 AND eType='台式机'`)
    .then(([rows, fields]) => {
      const info = req.body
      if (!rows.length) {
        res.send({
          status: 1,
          message: '当前可用的台式机不足，请稍后再试！'
        })
      } else {
        //若有可用，在上机表登记
        db.promise().query(`INSERT INTO opPC(userId, eId, startTime) VALUE(${info.userId}, ${rows[0].eId}, '${info.startTime}') `)
          .then((result) => {
            res.send({
              statsu: 0,
              eId: rows[0].eId
            })
          }).catch((err) => {
            console.log(err);
            res.send({
              status: 1,
              errmessage: err,
              message: '上机登记失败！'
            })
          });
      }
    }).catch((err) => {
      console.log(err);
      res.send({
        status: 1,
        message: '系统错误'
      })
    });
  })

//结束上机
useComputer.post('/end', (req, res) => {
  const info = req.body
  //先拿到对应记录的上机开始时间，并计算价格
  let duration
  db.promise().query(`SELECT startTime FROM opPC WHERE userId=${info.userId} AND endTime IS NULL`)
    .then(([rows, fields]) => {
      console.log(new Date(info.endTime).getTime() - new Date(rows[0].startTime).getTime());
    }).catch((err) => {
      console.log(err);
    });
})

module.exports = useComputer