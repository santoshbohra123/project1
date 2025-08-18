const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');



router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup"
    ,saveRedirectUrl, async (req, res,next) => {
        try {
            const { username, email, password } = req.body;
            let newUser = User({
                username: username,
                email: email
            })
            const registeredUser = await User.register(newUser, password);
            // console.log(req.user);
            req.logIn(registeredUser, (err) => {    // as user will signup automatically login too. By req.login. on the basis og req.user request 
                if (err) {
                    next(err);
                } req.flash('success', "welcome to Wonderlust");
                // console.log(req.user);
                
                res.redirect("/listings");
            })
            console.log(registeredUser);

        } catch (err) {
            req.flash("error", err.message);
            res.redirect("/signup");
        }
    })

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
        {
            failureFlash: true,
            failureRedirect: "/login"
        }),
    (req, res) => {
        req.flash('success', "Welcome back to Wonderlust!")
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl)
    })

// logout 
router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        } req.flash('success', 'you are logged out now');
        res.redirect("/listings");
    })
})

module.exports = router;