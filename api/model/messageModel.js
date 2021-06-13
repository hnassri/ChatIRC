import User from '../model/userModel.js'
import Channel from '../model/channelModel.js'
import mongoose from 'mongoose'

const {ObjectId} = mongoose;
const messageSchema = mongoose.Schema({

    user_id: [{
        type: ObjectId, 
        ref:'User',
        required: true,
    }],
    channel_id: {
        type: ObjectId, 
        ref:'Channel',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema, 'message')

export default Message