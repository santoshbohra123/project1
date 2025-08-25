const { Query } = require('mongoose');
const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// index route 

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

// new route 

module.exports.rendernewForm = (req, res) => {

    res.render("listings/new.ejs");
}

// create route
module.exports.createListing = async (req, res, next) => {
    try {
        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.listing.location,
                limit: 1,
            })
            .send();

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.image = { url, filename };
        newListing.owner = req.user._id;
        newListing.geometry = response.body.features[0].geometry;
        let savedListing = await newListing.save();
        console.log(savedListing);

        req.flash("success", "New listing created successfully");
        res.redirect("/listings");
    } catch (error) {
        next(error);
    }
};


// show route

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    // console.log(listing.owner._id);
    // console.log(listing)
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings")
    }
    res.render("listings/show", { listing });
}

// edit route

module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_250");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings")

    }
    res.render("listings/edit.ejs", { listing, originalUrl });
}

// update route

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data for listing.")
    }
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });
    // is using JavaScript’s spread syntax (...) to take all the properties from req.body.listing and copy them into a new object.
    if (typeof req.file !== "undefined") {

        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated successfully.")

    res.redirect(`/listings/${id}`);
}

// destroy route

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", " Listing deleted successfully.")
    res.redirect("/listings");
}