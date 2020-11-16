var express = require('express');
var router = express.Router();
var models = require('../models');
var Op = models.Sequelize.Op
var { jwtCheck } = require('../utils/jwt')

// 查询全部文章 Promise 写法
// router.get('/', function(req, res, next) {
// 	models.Files.findAll().then(articles => {
// 		res.json({ articles: articles });
// 	})
// })

// 查询全部文章  async/await
router.get('/', jwtCheck, async function (req, res, next) {
	// 搜索
	var where = {};

	// 模糊查询标题
	var title = req.query.title;
	if (title) {
		// http://localhost:3000/articles?title=天气
		where.title = {
			[Op.like]: '%' + title + '%'
		}
	}
	var currentPage = parseInt(req.query.currentPage) || 1;
	var pageSize = parseInt(req.query.pageSize) || 2;

	var result = await models.Files.findAndCountAll({
		// 排序
		order: [['id', 'DESC']],
		where: where,
    offset: (currentPage - 1) * pageSize,
    limit: pageSize
	});
	res.json({ 
		articles: result.rows,
		pagination: {
			currentPage: currentPage,
			pageSize: pageSize,
			// 一共有多少条记录
			total: result.count
		}
	});
});

// 插入数据，模拟请求记得使用post
router.post('/create', async function (req, res, next) {
	var article = await models.Files.create(req.body);
	res.json({ article: article });
});

// 查询接口， URL: articles/id
router.get('/:id', jwtCheck, async function (req, res, next) {
	var article = await models.Files.findOne({
		where: {id: req.params.id},
		include: [models.Comment],
	})
	res.json({article: article});
});

// 修改接口，需要注意的是这里是 put 请求
router.put('/:id', async function (req, res, next) {
	var article = await models.Files.findByPk(req.params.id);
	article.update(req.body);
	res.json({ article: article });
});

// 删除接口，请求方式是 delete
router.delete('/:id', async function (req, res, next) {
	var article = await models.Files.findByPk(req.params.id);
	article.destroy();
	res.json({msg: '删除成功！'});
});

module.exports = router;