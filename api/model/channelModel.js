import User from '../model/userModel.js'
import mongoose from 'mongoose'

const {ObjectId} = mongoose;
const channelSchema = mongoose.Schema({

    user_id: [{
        type: ObjectId, 
        ref:'User',
        required: true,
    }],
    name: {
        type: String,
        required: true,
        unique: true
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