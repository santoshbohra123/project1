const dbUrl = "mongodb+srv://santosh-bohra:EghzjuLyPoh9URcH@cluster0.h7vqkjr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/Expresserror.js");
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js")
const userRoute = require("./routes/user.js")
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { date } = require('joi');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");
app.use(express.urlencoded({ extended: true }));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 1 * 60 * 60,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// use static Authenticate method of model in LocalStrategy.
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


// middleware for flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;     // save current user details in session
    // console.log(res.locals.success);
    // console.log(req.user);
    next();
})


// demo user registered in database
// app.get("/demoUser",async (req,res)=>{
//     const demoUser = {
//         email:"santosh@gmail.com",
//         username:"@Santosh02"
//     }
//     let newUser = await User.register(demoUser,"@password");
//     res.send(newUser);
// })
//now mount routes

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute)
app.use("/", userRoute)

const port = 8080;
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(dbUrl);

}

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    // res.status(status).send(message);
    res.status(status).render("listings/error", { message });
    // res.send("somthing went wrong.");
})

app.listen(port, () => {
    console.log("app is listening on port 8080. ");

})