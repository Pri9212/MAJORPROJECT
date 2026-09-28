const mongoose=require("mongoose");
const Listing = require("../modles/listing.js");
const initialdata=require("./data.js");


main().then(()=>{
    console.log("connection successful")})

.catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

  
}
const initDB=async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initialdata.data);
    console.log("data was intialize");
}
initDB();