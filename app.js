const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const path = require('path');
const methodOverride = require('method-override');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));



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
    await mongoose.connect(MONGO_URL);

}

// Index Route

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
});


//new Route

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs"); 
});



app.post("/listings",async (req,res)=>{
   let newListing =  new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
})

// Show route 
app.get("/listings/:id",async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});
})


//edit route

app.get("/listings/:id/edit",async (req,res)=>{
      const {id} = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/edit",{listing});
})


// update route

app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true });
    res.redirect(`/listings/${id}`);
});


//Delete Route

app.delete("/listings/:id",async (req,res)=>{
  const {id}=req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");  
})


// app.get("/pricelisting", async (req, res) => {
//     console.log("📌 /pricelisting route hit");
//     const sampleListing = new Listing({
//         title: "My new Villa",
//         description: "It is situated in Seoul, by the beach.",
//         price: 20000,
//         location: "Seoul",
//         country: "South Korea",
//     });

//     await sampleListing.save();
//     console.log("✅ Saved details successfully.");
//     res.send("success");
// });





app.get("/", (req, res) => {
    res.send("hii I'm root.")
})
app.listen(port, () => {
    console.log("app is listening on port 8080. ");

})