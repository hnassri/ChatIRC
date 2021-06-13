import User from '../model/userModel.js'
import mongoose from 'mongoose'

const {ObjectId} = mongoose;
const privateSchema = mongoose.Schema({

    scender_id: [{
        type: ObjectId, 
        ref:'User',
        required: true,
    }],
    message: {
        type: String,
        required: true,
        unique: true
    },
        receiver_id:  [{
            type: ObjectId, 
            ref:'User',
            required: true,
        }],
}, {
    timestamps: true
})

const PrivateMsg = mongoose.model('PrivateMsg', privateSchema, 'privateMsg')

export default PrivateMsg