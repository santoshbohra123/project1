const { object, ref } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
   url:{
    type:String
   }
  },
  filename:{
    type:String
  },

  price: Number,
  location: String,
  country: String,
  reviews:[{
    type: Schema.Types.ObjectId,
    ref: "review",
  }]
  ,
  owner:{
    type:Schema.Types.ObjectId, 
    ref: "User",
  }
});


// for delet Review USE mongoose middleware

listingSchema.post("findOneAndDelete", async (listing)=>{
  await Review.deleteMany({_id:{$in:listing.reviews}});
});


const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
