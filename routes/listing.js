const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require('../middleware.js');
const Listing = require("../models/listing.js");
const { isLoggedIn } = require('../middleware.js');
const {isOwner} = require('../middleware.js');


// Index Route

router.get("/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    }));


//new Route

router.get("/new", isLoggedIn, (req, res) => {

    res.render("listings/new.ejs");
});



router.post("/",
    validateListing,
    wrapAsync(async (req, res, next) => {

        req.flash("success", "New listing created successfully")
        let newListing = new Listing(req.body.listing);
        // console.log(req.user);
        newListing.owner = req.user._id;
        await newListing.save();
        res.redirect("/listings");
    }))

// Show route 
router.get("/:id",

    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate : {
                path:"author",
            },
        })
        .populate("owner");
        // console.log(listing.owner._id);
        // console.log(listing)
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!")
            return res.redirect("/listings")

        }
          res.render("listings/show", { listing });
    }));


//edit route

router.get("/:id/edit",
    isLoggedIn,
 isOwner, 
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!")
            return res.redirect("/listings")

        }
        res.render("listings/edit", { listing });
    }));


// update route

router.put("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
        if (!req.body.listing) {
            throw new ExpressError(400, "send valid data for listing.")
        }
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });
        // is using JavaScript’s spread syntax (...) to take all the properties from req.body.listing and copy them into a new object.
        req.flash("success", "Listing updated successfully.")

        res.redirect(`/listings/${id}`);
    }));


//Delete Route

router.delete("/:id",
    isLoggedIn,
    isOwner,
     wrapAsync(async (req, res) => {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        // console.log(deletedListing);
        req.flash("success", " Listing deleted successfully.")
        res.redirect("/listings");
    }));

module.exports = router;