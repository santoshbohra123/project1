const express = require('express');
const app = express();
const mongoose = require('mongoose');
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
    mongoose.connect(MONGO_URL);

}
app.get("/", (req, res) => {
    res.send("hii I'm root.")
})
app.listen(port, () => {
    console.log("app is listening on port 8080. ");

})