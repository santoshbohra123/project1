const express = require('express');
const router = express.Router({mergeParams:true});
const { reviewSchema } = require('../schema');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/Expresserror.js");
const Reviews = require("../models/review.js");      // review model access
const Listing = require("../models/listing.js");


const validateReview = ((req,res,next)=>{
    const {error}= reviewSchema.validate(req.body);
    if(error){
        const errorMsg = error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400 , errorMsg)
    }
    next();
})

//reviews
// post review route

router.post("/",
    validateReview,
    wrapAsync(
    async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    console.log(req.body);
    let newReview = new Reviews(req.body.review)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review added successfully")
    res.redirect(`/listings/${listing._id}`)
    
    
}));

// Delete review route

router.delete("/:reviewId",async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})  //delete reviewId from listing. from review array in listing. so use$pull method
    
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully")
    res.redirect(`/listings/${id}`)
})

module.exports = router;