const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./modles/listing.js");
const path =require("path");
const { escape } = require("querystring");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingschema}=require("./schema.js");

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
const validateListing=(req,res,next)=>{
let{ error}=listingschema.validate(req.body);
   //console.log(result);
   if(error){
    throw new ExpressError(400,error);
   }else{
    next();
   }
}
//INDEX ROUTE
app.get("/listings", validateListing,wrapAsync(async(req,res)=>{
   
   const alllistings= await Listing.find({});
   res.render("listings/index.ejs",{alllistings})
}));

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
//show route
app.get("/listings/:id", wrapAsync(async(req,res)=>{
   let{id}=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/show.ejs",{listing})
}));
//create route
app.post("/listings",
    wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data for listing");
    }
const newlisting= new Listing(req.body.listing);

   await newlisting.save();
   res.redirect("/listings");
    
    

      
}));
//EDIT Route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
let{id}=req.params;
   const listing= await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
}));
//update route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
let {id}=req.params;
let deletelist =await Listing.findByIdAndDelete(id);
console.log(deletelist);
res.redirect("/listings");
}));

app.get("/",(req,res)=>{
    res.send("its working");
});
app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let{statuscode=500,message="somthing Went Wrong!"}=err;
    res.status(statuscode).render("error.ejs",{message});
    //res.status(statuscode).send(message);
});
app.listen(8080,()=>{
    console.log("app is listening at port 8080");
});