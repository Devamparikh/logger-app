const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {createClient} = require('redis')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 15,
        trim: true,
        dropDups: true
    },
    password: {
        type: 'string',
        required: true,
        trim: true,
        minlength: 6,
        // maxlength: 12,
        // validate(value) {
        //     if(value.toLowerCase().includes('password')){
        //         throw new Error('Password cant be password')
        //     }
        // }
    },
    tokens: [{
        token: {
            type: 'string',
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


userSchema.statics.findByCredentials = async (username, password) => {

    const client = createClient({
        url: process.env.REDIS_URL
      })
    
    client.on('error', (err) => console.log('Redis Client Error', err))
    
    await client.connect()
    const value = await client.sendCommand(['keys', '*'])

    
    const userID = value.map(async (element) => {
        console.log("element: ", element)
        const jsonObject = await client.json.get(element)
        console.log("json: ",jsonObject)
        if (jsonObject.username === username) {
            const isMatch = await bcrypt.compare(password, jsonObject.password)
            if(!isMatch) {
                throw new Error('Invalid password')
            }
            return jsonObject.id
        }
    })
    const IDS = await userID
    console.log(userID.toString)
    console.log(IDS)
    const user = await User.findOne({userID})
    if(!user) {
        throw new Error('Unable to login.') 
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = mongoose.model('User', userSchema )

module.exports = User