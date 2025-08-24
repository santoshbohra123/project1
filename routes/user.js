const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controlers/user.js')



router.route("/signup")
.get(userController.renderSignupForm)

.post(
    saveRedirectUrl
    ,saveRedirectUrl,
userController.signup)

router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",
        {
            failureFlash: true,
            failureRedirect: "/login"
        }),
   userController.login)

// logout 
router.route("/logout")
.get(userController.logout)

module.exports = router;