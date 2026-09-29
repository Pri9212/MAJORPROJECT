const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./modles/listing.js");
const path =require("path");
const { escape } = require("querystring");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");




app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.set("views",path.join(__dirname,"views"));
app.set("view enjine","ejs");
app.engine("ejs",ejsmate);
main().then(()=>{
    console.log("connection successful")})

.catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

  
}

//INDEX ROUTE
app.get("/listings", async(req,res)=>{
   
   const alllistings= await Listing.find({});
   res.render("listings/index.ejs",{alllistings})
});

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
//show route
app.get("/listings/:id", async(req,res)=>{
   let{id}=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/show.ejs",{listing})
});
//create route
app.post("/listings",async(req,res)=>{
    const newlisting= new Listing(req.body.listing);
   await newlisting.save();
   res.redirect("/listings");
});
//EDIT Route
app.get("/listings/:id/edit", async (req,res)=>{
let{id}=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
});
//update route
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});
//DELETE ROUTE
app.delete("/listings/:id",async (req,res)=>{
let {id}=req.params;
let deletelist =await Listing.findByIdAndDelete(id);
console.log(deletelist);
res.redirect("/listings");
});

app.get("/",(req,res)=>{
    res.send("its working");
});

app.listen(8080,()=>{
    console.log("app is listening at port 8080");
});