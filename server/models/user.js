const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    wallet: String,
    nonce: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

module.exports = User = mongoose.model("User", UserSchema);