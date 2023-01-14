const md5 = require('md5')
const { urlencoded } = require('./app')

const securityKey = (req) => {
  const urlParams = urlencoded(req)

  let paramsHash = md5(urlParams.api_id + '_' + urlParams.viewer_id + '_' + process.env.SECRET_KEY)
    
  return paramsHash === urlParams.auth_key.replace(/(")/gi, '')
}

module.exports = securityKey
