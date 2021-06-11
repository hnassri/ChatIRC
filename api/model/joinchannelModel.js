import User from '../model/userModel.js'
import Channel from '../model/channelModel.js'
import mongoose from 'mongoose'

const {ObjectId} = mongoose;
const channelSchema = mongoose.Schema({

    user_id: [{
        type: ObjectId, 
        ref:'User',
        required: true,
    }],
    channel_id: {
        type: ObjectId, 
        ref:'Channel',
        required: true,
    }
}, {
    timestamps: true
})

const JoinChannel = mongoose.model('JoinChannel', channelSchema, 'joinChannel')

export default JoinChannel