import mongoose from 'mongoose'

const userSchema = mongoose.Schema({

    user_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    is_deleted: {
        required: true
    },
}, {
    timestamps: true
})

const Channel = mongoose.model('Channel', userSchema, 'channel')

export default User