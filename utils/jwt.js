const jwt = require('jsonwebtoken')

const jwtKey = 'fsaklj342@313l@$!@$kjasi34' // token生成的密匙，根据自己需求定义

const jwtSign = (data) => { // token生成函数，有效时间为一个小时
  //   const token = jwt.sign(data, jwtKey, {expiresIn: 60 * 60})
  const token = jwt.sign(data, jwtKey, { expiresIn: 30 })
  return token
}

const jwtCheck = (req, res, next) => { // token验证函数
  console.log('req.headers:', req.headers)
  const token = req.headers.authorization
  jwt.verify(token, jwtKey, (err, data) => {
    if (err) {
      res.send({
        code: '999999',
        massage: 'token无效',
        success: false
      })
      console.error('token无效')
    } else {
      req.jwtInfo = data
      console.error('token有效')
      next()
    }
  })
}

module.exports = {
  jwtSign,
  jwtCheck
}