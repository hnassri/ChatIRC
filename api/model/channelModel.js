import mongoose from 'mongoose'

const channelSchema = mongoose.Schema({

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
        type: Boolean,
        required: true
    },
}, {
    timestamps: true
})

const Channel = mongoose.model('Channel', channelSchema, 'channel')

export default Channel