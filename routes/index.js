var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var responseText = 'Hello World!<br>'
  responseText += '<small>Requested at: ' + req.requestTime + '</small>'
  console.log('responseText:', responseText)
  res.render('index', { title: 'HooooHaaaa' });
});

module.exports = router;