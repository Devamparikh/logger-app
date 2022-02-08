const express = require('express')
const app = express()

require('./db/mongoose')
const client = require('./db/redis')
client()
const userRouter = require('./routers/user')
const messageRouter = require('./routers/message')


app.use(express.json())
app.use(userRouter)
app.use(messageRouter)


module.exports = app