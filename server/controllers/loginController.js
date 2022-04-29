const jwt = require('jsonwebtoken');
const { ethers } = require("ethers");
const {promisify} = require('util')
const mongoose =  require('mongoose');

const User =  require('../models/user.js');
const DonationLink =  require('../models/donationLink.js');


let handleLogin = async (req, res) => {
    let wallet = req.body.publicAddress.toLowerCase();
    try {
        //aca pedir a la DB el nonce del usuario y la address
        User.findOne({wallet:  req.body.publicAddress.toLowerCase()})
        .then( async (user) => {
            console.log("Login controller: ",user);

            if(!user){return res.json({status: 'error', msg: 'Error finding user'});}

            const digest = ethers.utils.hashMessage("Some custom message + nonce: " + user.nonce);
            if( wallet == (await ethers.utils.recoverAddress(digest,req.body.signature)).toLowerCase() ){

                //inicio de sesión OK
                const id = user._id
                const token = jwt.sign(
                    {
                        id: id,
                        wallet: user.wallet,
                    }, 
                    'un dia vi una vaca menos flaca vestida de uniforme', 
                    {expiresIn: '1d'}
                    )
            
                const cookiesOptions = {
                    expires: new Date(Date.now()+ 3600 * 24 * 60 * 60 * 1000),
                    httpOnly: false
                }
        
                return res.json({status: 'success', msg: 'User log in successfully', cookie: {jwt: token, cookiesOptions} });
            }else{
                console.log('Invalid');
                return res.json({status: 'error', msg: 'User invalid signature'});
            }
        });
    } catch (error) {
        console.log(error)
        return res.json({status: 'error', msg: 'Error finding user'});
    }
};
let handleUserInfo = async (req, res) => {
    console.log(req.body)
    jwt.verify(req.body.token, 'un dia vi una vaca menos flaca vestida de uniforme', function (err, decoded) {
        if (err) {
            console.log(err);
          res.json({ status: "failure" })
        } else {
          res.json({ status: "success", user: decoded.wallet })
        }
      })
};

let handleUserDonationsInfo = async (req, res) => {
    console.log(req.body)
    if(!req.user) return res.json({status: 'error', msg: 'User invalid signature'}); 
    try{
        const donationsInfo = await DonationLink.find({
            wallet: req.user});
        console.log("User info: ",donationsInfo)
        return res.json({status: 'success', msg: 'User donations info', donationsInfo});
    }catch(error){
        console.log(error)
        return res.json({status: 'error', msg: 'Error finding user'});
    }
};

let postLogOut = (req, res) => {
    return res.clearCookie('jwt')   
};

module.exports = {
    handleLogin: handleLogin,
    // checkLoggedIn: checkLoggedIn,
    postLogOut: postLogOut,
    handleUserInfo: handleUserInfo,
    handleUserDonationsInfo: handleUserDonationsInfo
};
