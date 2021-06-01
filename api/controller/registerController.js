import User from '../model/userModel.js'
import asyncHandler from 'express-async-handler'

export const registerUser = asyncHandler(async(req, res) => {

    const utilisateur = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
    };
    console.log(utilisateur)
    const user = await User.create(utilisateur)
 
})