const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    filename: {
      type: String,
      default: 'listingimage',
    },
    url: {
      type: String,
      default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQvHTRJu5Kdgnc6K0E5R9x0lLlVLvE36LPyQ&s',
      set: (v) =>
        v === ' '
          ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQvHTRJu5Kdgnc6K0E5R9x0lLlVLvE36LPyQ&s'
          : v,
    },
  },

  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
