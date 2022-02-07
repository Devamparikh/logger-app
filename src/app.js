const express = require('express')
const app = express()

require('./db/mongoose')
require('./db/redis')
const userRouter = require('./routers/user')

app.use(express.json())
app.use(userRouter)

module.exports = app