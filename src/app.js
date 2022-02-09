const express = require('express')
const app = express()

require('./db/mongoose')
const client = require('./db/redis')
client()
const userRouter = require('./routers/user-authentication')
const messageRouter = require('./routers/data-pusher')
const dataTracker = require('./routers/data-tracker')
require('./routers/data-validator')

app.use(express.json())
app.use(userRouter)
app.use(messageRouter)
app.use(dataTracker)



module.exports = app