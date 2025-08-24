const User = require('../models/user');


module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup =  async (req, res,next) => {
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
                
              let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
            })
            // console.log(registeredUser);

        } catch (err) {
            req.flash("error", err.message);
            res.redirect("/signup");
        }
    }

    module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

  module.exports.login = (req, res) => {
        req.flash('success', "Welcome back to Wonderlust!")
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl)
    }

    module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        } req.flash('success', 'you are logged out now');
        res.redirect("/listings");
    })
}