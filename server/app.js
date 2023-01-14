const qs = require('querystring')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const fs = require('fs')
const https = require('https')

const options = {
  ca: fs.readFileSync('./server/footballcoin.ru_le2.ca'),
  crta: fs.readFileSync('./server/footballcoin.ru_le2.crtca'),
  key: fs.readFileSync('./server/footballcoin.ru_le2.key'),
  cert: fs.readFileSync('./server/footballcoin.ru_le2.crt'),
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const server = https.createServer(options, app)

const urlencoded = (req) => {
  return qs.parse(
    JSON.stringify(req.body.url.replace(/(\?)/gi, '&').replace(/(")/gi, ''))
  )
}

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, '../client', 'build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  })
}

server.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))

module.exports = { app, urlencoded }
