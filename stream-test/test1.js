// 标准输入输出 
// process.stdin.pipe(process.stdout)

// const http = require('http')
// const server = http.createServer((req, res) => {
//     if (req.method === 'POST') {
//         req.pipe(res)
//     }
// })

// server.listen(8000)

// 复制文件
// const fs = require('fs')
// const path = require('path')

// const fileName1 = path.resolve(__dirname, 'data.txt')
// const fileName2 = path.resolve(__dirname, 'data-bak.txt')

// const readStreasm = fs.createReadStream(fileName1)
// const writeStreasm = fs.createWriteStream(fileName2)

// readStreasm.pipe(writeStreasm)
// readStreasm.on('data', chunk => {
//     console.log(chunk.toString())
// })
// readStreasm.on('end', () => {
//     console.log('copy done')
// })


const http = require('http')
const fs = require('fs')
const path = require('path')
const fileName1 = path.resolve(__dirname, 'data.txt')


const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        const readStreasm = fs.createReadStream(fileName1)
        readStreasm.pipe(res)
    }
})

server.listen(8000)