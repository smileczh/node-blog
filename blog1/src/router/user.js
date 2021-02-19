const { login } = require('../controller/user')
const { SuccessModel, ErrorModel} = require('../model/resModel')
const { set } = require('../db/redis')

// 获取cookie的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log('d.toGMTString() is', d.toGMTString())
  return d.toGMTString()
}


const handleUserRouter = (req, res) => {
  const method = req.method

  // 登录
  if (method === 'POST' && req.path === '/api/user/login') {
    const { username, password } = req.body
    // const { username, password } = req.query
    const result = login(username,password)
    return result.then(data => {
      if (data.username) {
        // 设置session
        req.session.username = data.username
        req.session.realname = data.realname
        // 同步到redis
        set(req.sessionId, req.session)
        console.log('req.session is', req.session)

        return new SuccessModel()
      } else {
        return new ErrorModel('登录失败')
      }
    })
  }

  // 登录验证测试 
  if (method === 'GET' && req.path === '/api/user/login-test') {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({
        session: req.session
      })) // Promise.resolve 可以直接作为一个resolve返回
    }
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}


module.exports = handleUserRouter