const fs = require('fs')
const path = require('path')

const filename = path.resolve(__dirname, 'data.txt')

// 读取文件内容
// fs.readFile(filename, (err, data) => {
//     if (err) {
//         console.error(err)
//         return
//     }
//     console.log(data)
//     console.log(data.toString()) // 读取出的文件是二进制类型的 需要变成字符串类型的
// })

// 写入文件
// const content = '这是写入的内容\n'
// const opt = {
//     flag: 'a'  // 追加写入。覆盖用 'w'
// }

// fs.writeFile(filename, content, opt, (err) => {
//     if (err) {
//         console.error(err)
//     }
// })


// 判断文件是否存在
fs.exists(filename + '1', (exist) => {
    console.log('exist', exist)
})
