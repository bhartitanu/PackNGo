const express=require("express");
const app = express();
const mongoose=require("mongoose");
const path =require("path");
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema } =require("./schema.js");

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

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(404,errMsg);
        }else{
            next();
        }
}

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
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});


//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
}));

//Create Route
app.post("/listings", validateListing ,wrapAsync(async (req,res,next)=>{
        //let {title,decs,img,price,Location,country}=req.body;
        // if(!req.body.listing){
        //     throw new ExpressError(404,"Send a valid data ");
        // }
        
        const newlisting=new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");   
    }
));

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//Update Route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id" ,wrapAsync(async(req,res)=>{
    let {id} =req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

app.all("*",(req,res,next)=>{
    next((new ExpressError(404,"Page not Found")));
})


//Error handling Middleware
app.use((err,req,res,next)=>{
    let{ status=505, message="SOMETHING WENT WRONG" } = err;
    //res.status(status).send(msg);
res.status(status).render("error.ejs",{message});
});

app.listen("8080",()=>{
    console.log("App is listening on port 8080");
});
