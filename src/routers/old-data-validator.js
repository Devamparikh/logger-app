//consumer
const express = require('express')
const axios = require('axios')
const amqp = require('amqplib')
const router = new express.Router()
const User = require('../models/user')
const Message = require('../models/message')
const auth = require('../middleware/auth')


let input = ''

input = consumeInput(input)

async function consumeInput(input) {
    const connection = await amqp.connect('amqp://localhost:5672')
    const channel = await connection.createChannel()
    QUEUE = 'dataValidator'

    const result = await channel.assertQueue(QUEUE)
    const unknown = await channel.consume(QUEUE, message => {
        console.log(message);
    input = JSON.parse(message.content.toString())
    // if((input.randomNumber % 10) == 0)
    console.log(`i recieved dataValidator with input ${input.randomNumber}`)
})
// console.log(unknown)
return unknown
}
async function findCategory(input, messageId) {
    const message = await Message.findById(messageId)
    if(!message) {
        return null
    }
    return message.category
}

async function apiCall(input, category) {
console.log(input.id);
    const user = await User.findById(input.id)
    // console.log(user);
    axios.post('/data-tracker', {
        headers: { Authorization: `Bearer ${user.tokens.token[0]}` },
        body: [{userId: input.id, userMessage: input.message, category: category}]
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
}


dataPusher(input)


async function dataPusher(input) {
    if (findCategory() == 'Retried') {
        await apiCall(input, 'Failed')
    }
    if ((input.randomNumber % 10) == 0) {
        apiCall(input, 'Retried')
        input.randomNumber = Math.floor(Math.random() * (60 - 1 + 1) + 1)
        setTimeout(dataPusher(input), 5000)
    }else{
        await apiCall(input, 'Direct')
    }
}

        // console.log(input.message)
    