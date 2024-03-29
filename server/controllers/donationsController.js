const jwt = require('jsonwebtoken');
const { ethers } = require("ethers");
const {promisify} = require('util')
const mongoose =  require('mongoose');
const { v4: uuidv4 } = require('uuid');

const User =  require('../models/user.js');
const DonationLink =  require('../models/donationLink.js');

const createLinks = async (req, res) => {
    let wallet = req.body.wallet.toLowerCase();
    DonationLink.findOne({wallet:  wallet})
    .then( async (user) => {
        if (user){
            console.log("donations controller: ", user)
            return res.json({status: 'error', msg: 'Donation setting already exists'});
        }
    });


    console.log(req.body)
    if(!req.user) return res.json({status: 'error', msg: 'User invalid signature'});


    let newDonationSetting = {
        wallet: req.body.wallet,
        name: req.body.name,
        shareLink: uuidv4(),
        alertsLink: uuidv4(),
        description: req.body.description,
        imageURL: req.body.imageURL,
        minimumAmount: req.body.minimumAmount,
        twitch: req.body.twitch,
        youtube: req.body.youtube,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
    }

    try{
        const newDonation = new DonationLink( {...newDonationSetting} )
        await newDonation.save();
        return res.status(201).json({status: 'success', msg: 'User donations info', newDonationSetting});
    }catch(error){
        console.log(error)
        return res.json({status: 'error', msg: 'Error creating links'});
    }
}
const updateLinks = async (req, res) => {
    let wallet = req.body.wallet.toLowerCase();

    console.log("donation settings update: ",req.body)
    if(!req.user) return res.json({status: 'error', msg: 'User invalid signature'});


    let updatedDonationSetting = {
        wallet: req.body.wallet,
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.imageURL,
        minimumAmount: req.body.minimumAmount,
        twitch: req.body.twitch,
        youtube: req.body.youtube,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
    }

    try{
        const doc = await DonationLink.findOne({wallet:  wallet});
        doc.name = req.body.name,
        doc.description = req.body.description,
        doc.imageURL = req.body.imageURL,
        doc.minimumAmount = req.body.minimumAmount,
        doc.twitch = req.body.twitch,
        doc.youtube = req.body.youtube,
        doc.twitter = req.body.twitter,
        doc.instagram = req.body.instagram,
        await doc.save();
        // await User.findOneAndUpdate({wallet:  wallet}, {$set: {
        //     name: req.body.name,
        //     description: req.body.description,
        //     imageURL: req.body.imageURL,
        //     minimumAmount: req.body.minimumAmount,
        //     twitch: req.body.twitch,
        //     youtube: req.body.youtube,
        //     twitter: req.body.twitter,
        //     instagram: req.body.instagram,
        // }});
        return res.status(201).json({status: 'success', msg: 'User donations info', updatedDonationSetting});
    }catch(error){
        console.log(error)
        return res.json({status: 'error', msg: 'Error creating links'});
    }
}

const getDonationInfo = async (req, res) => {
    console.log(req.params)
    let uuid = req.params.uuid;
    DonationLink.findOne({shareLink: uuid})
    .then( async (donation) => {
        if (donation){
            let donationSettings = {
                name: donation.name,
                wallet: donation.wallet,
                shareLink: donation.shareLink,
                description: donation.description,
                imageURL: donation.imageURL,
                minimumAmount: donation.minimumAmount,
                twitch: donation.twitch,
                youtube: donation.youtube,
                twitter: donation.twitter,
                instagram: donation.instagram,
            }
            console.log("donations controller: ", donationSettings)
            return res.json({status: 'success', donationSettings});
        }else{
            return res.json({status: 'error', msg: 'Donation setting not found'});
        }
    });
}

const getAlertsInfo = async (req, res) => {
    console.log(req.params)
    let uuid = req.params.uuid;
    DonationLink.findOne({alertsLink: uuid})
    .then( async (donationSettings) => {
        if (donationSettings){
            console.log("donations controller: ", donationSettings)
            return res.json({status: 'success', donationSettings});
        }else{
            return res.json({status: 'error', msg: 'Donation setting not found'});
        }
    });
}

const getStreamers = async (req, res) => {
    try{
        const streamers = await DonationLink.find({}, 'twitch');
        streamers.forEach( async (streamer) => {
            streamer.connected = false;
        });
        return res.json({status: 'success', streamers});
    }
    catch(error){
        console.log(error)
        return res.json({status: 'error', msg: 'Error getting streamers'});
    }
}


module.exports = {
    createLinks: createLinks,
    updateLinks:updateLinks,
    getDonationInfo: getDonationInfo,
    getAlertsInfo: getAlertsInfo,
    getStreamers: getStreamers
};