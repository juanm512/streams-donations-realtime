const express = require( 'express');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const registerController = require("../controllers/registerController");
const loginController = require("../controllers/loginController");
const donationsController = require("../controllers/donationsController");

let router = express.Router();

const checkJWT = async (req, res, next) => {
    console.log(req.body.token)
    if (req.body.token) {
        try {
            const decodificada = await promisify(jwt.verify)(req.body.token, 'un dia vi una vaca menos flaca vestida de uniforme')
                req.user = decodificada.wallet;
                return next();
        } catch (error) {
            console.error(error);
            res.clearCookie('jwt');
            return next();
        }
    }else{
        console.error('no jwt found checkJWT');
        res.clearCookie('jwt');
        return next();
    }
};



let initWebRoutes = (app) => {

    router.post('/user', loginController.handleUserInfo);
    router.post('/profile', checkJWT, loginController.handleUserDonationsInfo);
    router.post('/profile-settings', checkJWT, donationsController.createLinks);
    router.put('/profile-settings', checkJWT, donationsController.updateLinks);
    router.get('/donations/:uuid', donationsController.getDonationInfo);
    router.get('/alerts/:uuid', donationsController.getAlertsInfo);
    
    router.get('/streamers', donationsController.getStreamers);

    //parte del login-registro-account-logout
    //log in
    router.post("/login", loginController.handleLogin);
    //register
    router.get("/api/getNonce", registerController.createNewUser);
    //log out
    router.get("/logout", loginController.postLogOut);

    return app.use("/", router);
};
module.exports = initWebRoutes;