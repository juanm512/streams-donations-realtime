const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
    wallet: String,
    name: String,
    shareLink: String,
    alertsLink: String,
    description: String,
    imageURL: String,
    minimumAmount: Number,
    twitch: String,
    youtube: String,
    twitter: String,
    instagram: String,
})

module.exports = DonationLink = mongoose.model("DonationLink", donationSchema);
// https://c.tenor.com/PK_ln6GnJksAAAAC/tenor.gif