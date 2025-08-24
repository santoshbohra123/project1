const express = require('express');
const router = express.Router({mergeParams:true});
const { reviewSchema } = require('../schema');
const wrapAsync = require("../utils/wrapAsync.js");
const Reviews = require("../models/review.js");      // review model access
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controlers/review.js')

//reviews
// post review route

router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

// Delete review route

router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    reviewController.destroyReview
    )

module.exports = router;