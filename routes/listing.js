const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require('../middleware.js');
const Listing = require("../models/listing.js");
const { isLoggedIn } = require('../middleware.js');
const { isOwner } = require('../middleware.js');
const listingController = require('../controlers/listing.js');

const multer = require('multer'); // use for form data parse. 
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });     // it finds files from form and save in uploads 


router.route("/")

    // Index Route
    .get(
        wrapAsync(listingController.index))


    // create listing
    .post(isLoggedIn,
        
         upload.single('listing[image]'),   // parses multipart form,
        wrapAsync(listingController.createListing))


//new Route
router.get("/new", isLoggedIn, listingController.rendernewForm);



router.route("/:id")

    //Delete Route
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing))

    // Show route     
    .get(
        wrapAsync(listingController.showListing))

    // update route
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        wrapAsync(listingController.updateListing));


//edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.editListing));


module.exports = router;