const express = require('express')
const router = new express.Router()
const User = require('../models/user')


router.post('/users', async (req, res) => {
    let type = typeof(req.body)
    console.log(type)
    console.log(req.body)
    // const array = req.body.toArray()
    // const user = new User(req.body)

    try {
        const user = await User.insertMany(req.body, (error, result) => {
            if (error) {
                return res.status(400).send({error: error._message, ok: false})
                
            }
            res.status(201).send(result)
        })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


router.get('/users', async (req, res) => {
    searchMsg = req.query.searchMsg
    console.log("seachmsg: ", searchMsg)
    try {
        const user = await User.find({ "userMessage" : { $regex: searchMsg } }, {userMessage: 1})
        console.log("user: ", user)
        res.send(user)

    } catch (e) {
        console.log("e: ", e)
        res.status(400).send(e)
    }
})


router.get('/user', async (req, res) => {
    category = req.query.category
    date = req.query.date
    date = new Date(date)
    const last = new Date(date.getTime() + 86400000)
    console.log("date: ", date)
    console.log("last: ", last)

    // console.log("seachmsg: ", searchMsg)
    try {
        const user = await User.find({ "category" : category, "createdTime": {$gte: date, $lt: last } }).count()
        console.log("user: ", user)
        // res.send(user)

    } catch (e) {
        console.log("e: ", e)
        res.status(400).send(e)
    }
})


module.exports = router