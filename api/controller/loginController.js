import User from '../model/userModel.js'
import asyncHandler from 'express-async-handler'

export const loginUser = asyncHandler(async(req, res) => {
console.log(req.body.username)
    const login1=await User.findOne({ username: req.body.username });
    if (login1.username===req.body.username , login1.password===req.body.password) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ greeting: `Vous êtes connectés` }));
    }
    else{
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ greeting: `Vos données sont pas valides` }));
    }

    books.push(utilisateur);
    const user = await User.create(books)
    console.log(books);
})