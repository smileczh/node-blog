// 抽离的原因是 www中都是和server相关的功能代码 而app中会写专门处理业务逻辑的代码

const { request } = require('http')
const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 获取cookie的过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log('d.toGMTString() is', d.toGMTString())
  return d.toGMTString()
}

// // session数据
// const SESSION_DATA = {}

// 用于处理post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }

    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }

    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })

    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(JSON.parse(postData))
    })
  })
  return promise
}
  
const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')
    
    // 获取path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析query
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookiestr = req.headers.cookie || '' // k1=v1;k2=v2
    cookiestr.split(';').forEach(item => {
      if (!item) {
        return
      }
      const arr = item.split('=')
      const key = arr[0].trim()
      const val = arr[1].trim()
      req.cookie[key] = val
    })
    console.log('req.cookie is', req.cookie)
    

    // // 解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (userId) {
    //   if (!SESSION_DATA[userId]) {
    //     SESSION_DATA[userId] = {}
    //   }
    // } else {
    //   needSetCookie = true
    //   userId = `${Date.now()}_${Math.random()}`
    //   SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    // 解析 session (使用redis)
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
      needSetCookie = true
      userId = `${Date.now()}_${Math.random()}`
      // 初始化 redis中的 session 值
      set(userId, {})
    }
    // 获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
      if (sessionData == null) {
        // 初始化 redis中的 session 值
        set(req.sessionId, null)
        // 设置session
        req.session = {}
      } else {
        // 设置session
        req.session = sessionData
      }
      console.log('req.session', req.session)

      // 处理post data
      return getPostData(req)
    })
    .then(postData => {
      req.body = postData
      // 处理 blog 路由
      // const blogData = handleBlogRouter(req, res)

      // if (blogData) {
      //   res.end(JSON.stringify(blogData))
      //   return
      // }
      
      const blogresult = handleBlogRouter(req, res)
      if (blogresult) {
        blogresult.then(blogData => {
          if (needSetCookie) {
            res.setHeader('Set-cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
          }
          res.end(JSON.stringify(blogData))
        })
        return
      }
      
      

      // 处理 user 路由
      const userResult = handleUserRouter(req, res)

      if (userResult) {
        userResult.then(userData => {
          if (needSetCookie) {
            res.setHeader('Set-cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
          }
          res.end(JSON.stringify(userData))
        })
        return
      }

      // 未命中路由 返回404
      res.writeHead(404, {"Content-type": "text/plain"})
      res.write("404 Not Found\n")
      res.end()
    })

    
}

module.exports = serverHandle

// process.env.NODE_ENV