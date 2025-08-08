const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");



const port = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
  await  mongoose.connect(MONGO_URL);

}

app.get("/pricelisting", async (req, res) => {
    console.log("📌 /pricelisting route hit");
    const sampleListing = new Listing({
        title: "My new Villa",
        description: "It is situated in Seoul, by the beach.",
        price: 20000,
        location: "Seoul",
        country: "South Korea",
    });

    await sampleListing.save();
    console.log("✅ Saved details successfully.");
    res.send("success");
});


app.get("/", (req, res) => {
    res.send("hii I'm root.")
})
app.listen(port, () => {
    console.log("app is listening on port 8080. ");

})