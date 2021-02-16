// 抽离的原因是 www中都是和server相关的功能代码 而app中会写专门处理业务逻辑的代码

const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

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
      const key = arr[0]
      const val = arr[1]
      req.cookie[key] = val
    })
    console.log('req.cookie is', req.cookie)

    getPostData(req).then(postData => {
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
          res.end(JSON.stringify(blogData))
        })
        return
      }
      
      

      // 处理 user 路由
      const userResult = handleUserRouter(req, res)

      if (userResult) {
        userResult.then(userData => {
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