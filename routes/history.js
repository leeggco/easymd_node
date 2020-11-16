var express = require('express')
var bcrypt = require('bcryptjs')
var models = require('../models')
var router = express.Router()
var { jwtCheck } = require('../utils/jwt')

// 此中间件只作用于此路由内，不会影响其他路由
// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.post('/list', jwtCheck, async function(req, res, next) {
  console.log('####2222', req.body)
  const params = req.body
  const list = await models.History.findAll({
    where: { userId: params.userId},
    order: [['updatedAt', 'DESC']],
    limit: 6,
    include: { model: models.Bangumi, foreignKey: 'fanId', as:'fanData' }
  })
  res.json(list)
})

router.post('/create', jwtCheck, async function (req, res, next) {
  console.log(777, req.body)
  const params = req.body
  let history

  const bar = await models.History.findOne({
    where: { fanId: req.body.fanId, userId: req.body.userId }
  })

  if (bar) {
    console.log('更新历史', params)
    history = await models.History.update(params, { where: { id: bar.id }})
  } else {
    console.log('新增历史', params)
    history = await models.History.create(params)
  }
  res.send({ success: true })
})

module.exports = router
