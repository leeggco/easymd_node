var express = require('express');
var router = express.Router();
var models = require('../models');
var moment = require('moment');
var md5 = require("md5")
var Op = models.Sequelize.Op
var { jwtCheck } = require('../utils/jwt')

var pushDomain = 'push.leeggco.com'
var playDomain = 'play.leeggco.com'
var secretKey = '69e0daf7234b01f257a7adb9f807ae9f'
var streamName = 123456
var time = '2019年12月28日 15:45:33'
// 插入数据，模拟请求记得使用post
router.post('/getPushUrl', jwtCheck, async function (req, res, next) {
	streamName = req.body.username;
	var flowUrl = printUrls(pushDomain, streamName, secretKey, time);
	res.json({ data: flowUrl });
});

// 生成推流URL
function printUrls(domain, streamName, key, time){
	if(key && time){
		// 转时间戳
		time = moment(time, 'YYYY-MM-DD HH:mm:ss').valueOf()
		// 转16进制
		txTime = ((time)/1000).toString(16).toLocaleUpperCase()
		// md5加密
		txSecret = md5(`${key}${streamName}${txTime}`)
		// RTMP播流
		var playUrlRTMP = `rtmp://${playDomain}/live/${streamName}`
		// FLV 播流
		var playUrlFLV = `http://${playDomain}/live/${streamName}.flv`
		// HLS 播流
		var playUrlHLS = `http://${playDomain}/live/${streamName}.m3u8`
	}
	return {
		pushUrl: `rtmp://${domain}/live/${streamName}?txSecret=${txSecret}&txTime=${txTime}`,
		playUrlRTMP: playUrlRTMP,
		playUrlFLV: playUrlFLV,
    playUrlHLS: playUrlHLS,
    success: true
	}
}


module.exports = router;