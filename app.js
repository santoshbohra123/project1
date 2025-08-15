const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/Expresserror.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js")
const session = require('express-session');
const { date } = require('joi');
const flash = require('connect-flash');

const sessionOptions = {
    secret:"mysuperSecreCode",
    resave :false,
    saveUninitialized :true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

// middleware for flash
app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
// console.log(res.locals.success);
next();
})

//now mount routes
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)

const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(MONGO_URL);

}

// app.get("/pricelisting", async (req, res) => {
//     console.log("📌 /pricelisting route hit");
//     const sampleListing = new Listing({
//         title: "My new Villa",
//         description: "It is situated in Seoul, by the beach.",
//         price: 20000,
//         location: "Seoul",
//         country: "South Korea",
//     });

//     await sampleListing.save();
//     console.log("✅ Saved details successfully.");
//     res.send("success");
// });



app.get("/", (req, res) => {
    res.send("hii I'm root.")
})

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