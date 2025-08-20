const express = require('express');
const router = express.Router({mergeParams:true});
const { reviewSchema } = require('../schema');
const wrapAsync = require("../utils/wrapAsync.js");
const Reviews = require("../models/review.js");      // review model access
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

//reviews
// post review route

router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(
    async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(req.body);
    let newReview = new Reviews(req.body.review)
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review added successfully")
    res.redirect(`/listings/${listing._id}`)
    
    
}));

// Delete review route

router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor
    ,async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})  //delete reviewId from listing. from review array in listing. so use$pull method    
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully")
    res.redirect(`/listings/${id}`)
})

module.exports = router;