const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true

    },
    userMessage: {
        type: String,
        required: true
    },
    requestCount: {
        type: 'Number',
        // required: true,
        default: 0
    },
    category: {
        type: String,
        required: true,
        validate(value) {
            if (value !== ('Direct' || 'Retried' || 'Failed')) {
                throw new Error('Invalid value for category')
            }
        }

    },
    createdTime: {
        type: Date,
        default: new Date()
    }

})
const User = mongoose.model('User', userSchema)

module.exports = User