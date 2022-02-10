const express = require('express')
const amqp = require('amqplib')
const router = new express.Router()
const Message = require('../models/message')
const auth = require('../middleware/auth')



router.post('/data-pusher', auth, async (req, res) => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')
        const channel = await connection.createChannel()
        const QUEUE = 'dataValidator'
        const randomNumber = Math.floor(Math.random() * (60 - 1 + 1) + 1)
        const msg = {id: req.user._id, username: req.user.username, message: req.body.message, randomNumber: randomNumber}
        const result = await channel.assertQueue(QUEUE)
        const sendToQueueResult = await channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)))
        // console.log("send" ,sendToQueueResult)
        if (sendToQueueResult) {
            res.status(200).send({message: 'data send to queue successful.', ok: true})
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({error: error, ok: false})
    }
})





module.exports = router