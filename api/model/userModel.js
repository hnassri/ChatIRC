import mongoose from 'mongoose'

const userSchema = mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema, 'user')

export default User