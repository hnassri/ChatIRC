import User from '../model/userModel.js'
import asyncHandler from 'express-async-handler'

export const registerUser = asyncHandler(async(req, res) => {
    const mot=req.body.password;
    const utilisateur = {
        username: req.body.username,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
    };
    if(req.body.password!==req.body.confirmpassword){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ greeting: `Vos mots de passes sont pas identiques` }));
    }
    else if(await User.findOne({ username:req.body.username}) !==null){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ greeting: `Username existe` }));
    }
    else if(mot.length <6){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ greeting: `ninimum 6 caractères pour valider le mot de passe` }));
    }
    else{
        const user = await User.create(utilisateur);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ greeting: `utilisateur ajouté avec succés` }));
    }
    
})