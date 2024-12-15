const express=require("express");
const app = express();
const mongoose=require("mongoose");
const path =require("path");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/PackNGo"

main()
.then(()=>{
    console.log("Connected to Database");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Working");
});

// app.get("/testListing",async (req,res)=>{
//  let sampleListing=new Listing({
//     title:"leMonte Villa",
//     desc:"Most beatiful and sea-shore view with sunrise",
//     price:1200,
//     location:"Bandra ,Mumbai",
//     country:"India",
//  });

//  await sampleListing.save();
//  console.log("Data Inserted");

//  res.send("successful testing");
// });

//Index Route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});


//Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
});

//Create Route
app.post("/listings",async (req,res)=>{
    //let {title,decs,img,price,Location,country}=req.body;
    const newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findByIdAndUpdate(id);
    res.render("listings/edit.ejs",{listing});
});

//Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id" ,async(req,res)=>{
    let {id} =req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

app.listen("8080",()=>{
    console.log("App is listening on port 8080");
});
