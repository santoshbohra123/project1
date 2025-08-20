const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);

}

const initDB = async () => {
    await Listing.deleteMany({});
    // map function returns new array.
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "68a06ff20c3331c471629466" }))     // by the ...obj se hum us obj ka sara data copy krenge and usme owner ko bhi add krenge.
    await Listing.insertMany(initData.data);
    console.log("Data was initialized.");
};

initDB();