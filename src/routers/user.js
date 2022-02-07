const express = require('express')
const {createClient} = require('redis')
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
        const userKey = 'user_' + userAfterSave._id
        // console.log(userKey)
        await client.json.set(userKey, '.', { id:userAfterSave._id, username: userAfterSave.username, password: userAfterSave.password });
        // const value = await client.json.mget()
        // const value = await client.sendCommand(['keys', '*'])

        // console.log(value);


        const token = await user.generateAuthToken()
        res.status(201).send({user, token, 'ok':true})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {

    try {
        
        

        // console.log(value);


        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user, token, 'ok':true})
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})



module.exports = router