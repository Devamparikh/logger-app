const express = require('express')
const router = new express.Router()
const Message = require('../models/message')
const auth = require('../middleware/auth')




// router.post('users/register')


router.post('/messages', auth, async (req, res) => {
    let type = typeof(req.body)
    console.log(type)
    console.log(req.body)
    // const array = req.body.toArray()
    // const user = new User(req.body)

    try {
        const message = await Message.insertMany({
            ...req.body,
            userId: req.user._id
        }, (error, result) => {
            if (error) {
                console.log(error)
                return res.status(400).send({error: error._message, ok: false})
                
            }
            res.status(201).send(result)
        })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


router.get('/messages', auth, async (req, res) => {
    searchMsg = req.query.searchMsg
    console.log("seachmsg: ", searchMsg)
    try {
        const message = await Message.find({ "userMessage" : { $regex: searchMsg } }, {userMessage: 1})
        console.log("message: ", message)
        res.send(message)

    } catch (e) {
        console.log("e: ", e)
        res.status(400).send(e)
    }
})


router.get('/message', auth, async (req, res) => {
    category = req.query.category
    date = req.query.date
    date = new Date(date)
    const last = new Date(date.getTime() + 86400000)
    console.log("date: ", date)
    console.log("last: ", last)

    // console.log("seachmsg: ", searchMsg)
    try {
        const message = await Message.find({ "category" : category, "createdTime": {$gte: date, $lt: last } }).count()
        console.log("message: ", message)
        // res.send(user)

    } catch (e) {
        console.log("e: ", e)
        res.status(400).send(e)
    }
})


module.exports = router