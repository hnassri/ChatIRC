import User from '../model/userModel.js'
import asyncHandler from 'express-async-handler'

export const loginUser = asyncHandler(async(req, res) => {
console.log(req.body.username)
console.log(req.body.password)
    const login1=await User.findOne({ username:req.body.username,password:req.body.password });
    if (login1!==null) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ greeting: `Vous êtes connectés` }));
    }
    else{
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ greeting: `Vos données sont pas valides` }));
    }

})