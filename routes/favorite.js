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

/* Post favorite listing. */
router.post('/list', jwtCheck, async function(req, res, next) {
  console.log('#########', req.body)
  const params = req.body
  const list = await models.Favorite.findAll({
    where: { userId: params.userId},
    order: [['id', 'DESC']],
    include: { model: models.Bangumi, foreignKey: 'fanId', as:'BangumiData' }
  })
  res.json(list)
})

// 新增追番
router.post('/set', jwtCheck, async function (req, res, next) {
  console.log(req.body)
  const base = req.body.base
  const params = {
    fanId: req.body.fanId,
    userId: req.body.userId
  }

  const bar = await models.Favorite.findOne({
    where: { fanId: req.body.fanId, userId: req.body.userId }
  })

  if (bar) {
    const favorite = await models.Favorite.update(params, { where: { id: bar.id }})
  } else {
    // 追番
    const favorite = await models.Favorite.create(params)

    if (favorite) {
      res.json({ result: true })
    } else {
      res.json({ result: false })
    }
  }

  // 查找番
  const foo = await models.Bangumi.findOne({
    where: { fanId: base.fanId }
  })

  if (foo) {
    // 更新番剧条目
    const bangumi = await models.Bangumi.update(base, { where: { id: foo.id }})
  } else {
    // 创建番剧条目
    const bangumi = await models.Bangumi.create(base)
  }
})


// 更新追番数据
router.post('/update', jwtCheck, async function (req, res, next) {
  let favorite
  const params = req.body
  const bar = await models.Favorite.findOne({
    where: { fanId: params.fanId, userId: params.userId }
  })

  if (bar) {
    favorite = await models.Favorite.update(params, { where: { id: bar.id }}).then(res => {
      console.log('已更新追番')
    })
  }
  if (favorite) {
    res.send({ success: true, message: '已更新追番'})
  } else {
    res.send({ success: true, message: '还没追番！'})
  }
})

// 查询是否已追番
router.post('/check', jwtCheck, async function (req, res, next) {
  const params = req.body
  const bar = await models.Favorite.findOne({
    where: { fanId: params.fanId, userId: params.userId }
  })

  if (bar) {
    res.json({ result: true })
  } else {
    res.json({ result: false })
  }
})

// 取消追番
router.post('/cancle', jwtCheck, async function (req, res, next) {
  const params = req.body
  const bar = await models.Favorite.findOne({
    where: { fanId: params.fanId, userId: params.userId }
  })

  const foo = await models.Favorite.destroy({
    where: { id: bar.id }
  })

  if (foo) {
    res.json({ result: true })
  } else {
    res.json({ result: false })
  }
})

module.exports = router