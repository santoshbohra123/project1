const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/Expresserror.js");
const { listingSchema, reviewSchema } = require('../schema');
const Listing = require("../models/listing.js");  


const validateListing = ((req, res, next) => {
    const {error} = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
        const errorMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
})
// Index Route

router.get("/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    }));


//new Route

router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});



router.post("/",
    validateListing,
    wrapAsync(async (req, res, next) => {

        let newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");

    }))

// Show route 
router.get("/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show", { listing });
    }));


//edit route

router.get("/:id/edit",
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit", { listing });
    }));


// update route

router.put("/:id",
    wrapAsync(async (req, res) => {
        if (!req.body.listing) {
            throw new ExpressError(400, "send valid data for listing.")
        }
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });
        // is using JavaScript’s spread syntax (...) to take all the properties from req.body.listing and copy them into a new object.

        res.redirect(`/listings/${id}`);
    }));


//Delete Route

router.delete("/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/listings");
    }));

module.exports = router;