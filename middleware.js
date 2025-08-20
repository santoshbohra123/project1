const { listingSchema, reviewSchema } = require('./schema.js');
const ExpressError = require("./utils/Expresserror.js");
const Listing = require('./models/listing');
const Review = require('./models/review.js');


module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req) 
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', "You must be login to create listings.")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing = ((req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    // console.log(result);
    if (error) {
        const errorMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
})

module.exports.validateReview = ((req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errorMsg)
    }
    next();
})

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
        const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing.")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,reviewId } = req.params;
        const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the Author of this review.")
        return res.redirect(`/listings/${id}`);
    }
    next();
}