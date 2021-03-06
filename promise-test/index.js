const fs = require('fs')
const path = require('path')



// callback 方式获取一个文件的内容
// function getFileContent(fileName, callback) {
//     const fullFileName = path.resolve(__dirname, 'files', fileName)
//     fs.readFile(fullFileName, (err, data) => {
//         if (err) {
//             console.log(err)
//             return
//         }
//         callback(JSON.parse(data.toString()))
//     })
// }

// // 测试 callback-hell
// getFileContent('a.json', aData => {
//     console.log('a data', aData)
//     getFileContent('b.json', bData => {
//         console.log('b data', bData)
//         getFileContent('c.json', cData => {
//             console.log('c data', cData)
//         })
//     })
// })

// 用promise获取文件内容
function getFileContent(fileName) {
    const promise = new Promise((resolve, reject) => {
        const fullFileName = path.resolve(__dirname, 'files', fileName)
        fs.readFile(fullFileName, (err, data) => {
            if (err) {
                reject(err)
                return
            }
            resolve(JSON.parse(data.toString()))
        })
    })

    return promise
}

getFileContent('a.json').then(aData => {
    console.log('a data', aData)
    return getFileContent(aData.next)
}).then(bData => {
    console.log('b data', bData)
    return getFileContent(bData.next)
}).then(cData => {
    console.log('c data', cData)

})