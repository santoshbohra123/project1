const Listing = require('../models/listing')
const Review = require('../models/review')

module.exports.createReview=
    async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    // console.log(req.body);
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review added successfully")
    res.redirect(`/listings/${listing._id}`)    
}

module.exports.destroyReview = async (req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})  //delete reviewId from listing. from review array in listing. so use$pull method    
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully")
    res.redirect(`/listings/${id}`)
}