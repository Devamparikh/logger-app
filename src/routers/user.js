const express = require('express')
const {createClient} = require('redis')
const amqp = require('amqplib')
const auth = require('../middleware/auth')
const client = require('../db/redis')
const User = require('../models/user')
// const client = require('../db/redis')
const router = new express.Router()




router.post('/users/register', async (req, res) => {

    if(req.body.password.length > 12){
        throw new Error('Password cant be of length 12+')
    }
    const user = new User(req.body)
    // console.log(user)

    try {
        const userAfterSave = await user.save()
        console.log(userAfterSave)
        const client = createClient({
            url: process.env.REDIS_URL
          })
        
        client.on('error', (err) => console.log('Redis Client Error', err))
        await client.connect()
        

        // const TEST_KEY = 'user_6200dc6ba0fb7ed26adc9383'
        const userKey = 'user_' + userAfterSave.username
        // console.log(userKey)
        await client.json.set(userKey, '.', { id:userAfterSave._id, username: userAfterSave.username, password: userAfterSave.password });
        // const value = await client.json.mget()
        // const value = await client.sendCommand(['keys', '*'])

        // console.log(value);


        const token = await user.generateAuthToken()
        res.status(201).send({user, token, 'ok':true})
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token, 'ok':true})
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


router.post('/users/publish', auth, async (req, res) => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')
        const channel = await connection.createChannel()
        QUEUE = 'dataValidator'
        const randomNumber = Math.floor(Math.random() * (60 - 1 + 1) + 1)
        msg = {id: req.user._id, message: req.body.message, randomNumber: randomNumber}
        const result = await channel.assertQueue(QUEUE)
        channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(msg)))
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.get('/users/consume', auth, async (req, res) => {
    try {
        const connection = await amqp.connect('amqp://localhost:5672')
        const channel = await connection.createChannel()
        QUEUE = 'dataValidator'
        const result = await channel.assertQueue(QUEUE)
        channel.consume(QUEUE, message => {
            const input = JSON.parse(message.content.toString())
            if((input.randomNumber % 10) == 0)
            console.log(`recieved dataValidator with input ${input.randomNumber}`)
        })

        // console.log(input.message)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

module.exports = router