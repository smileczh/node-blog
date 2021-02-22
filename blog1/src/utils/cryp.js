const crypto = require('crypto')

// 密钥
const SECRET_KEY = 'Ddjk_234#'

// md5加密
function md5 (content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}

// 加密函数
function ganPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

module.exports = {
    ganPassword
}
// const result = ganPassword('123')
// console.log(result)