const mongoose =  require('mongoose');

const User =  require('../models/user.js');


let createNewUser = async (req, res) => {
    let nonce = Math.floor(Math.random()* 100000000 * 10000000) ;
    let wallet = req.query.address.toLowerCase();
    
    try {
        User.findOne({wallet:  req.query.address.toLowerCase()})
        .then( async (user) => {
            console.log("Register controller: ", user)
            if (!user){
                const newUser = new User({ wallet, nonce })
                await newUser.save();
                return res.status(201).json({status: 'success', nonce} );
            }else{
                const updateUser = {
                    $set: {
                        nonce
                    },
                  };
                // const result = await User.replaceOne(query, updateUser );
                await User.findOneAndUpdate({wallet:  wallet}, { nonce: nonce });
                return res.status(201).json({status: 'success', nonce} );
            }
        });

    } catch (error) {
        console.log(error)
        res.status(409).json({status: 'error', msg: error.message});
    }
};



module.exports = {
    createNewUser: createNewUser
};
