const mongoose= require("mongoose");
const Schema=mongoose.Schema;

const listingSchema= new Schema({
    title:{ 
        type:String,
        required:true 
    },
    desc:String,
    img:
    { 
        type:String,
        default:"https://www.pexels.com/photo/concrete-road-between-trees-1563356/",
        set:(v)=> v===""? "https://www.pexels.com/photo/concrete-road-between-trees-1563356/": v
    },
    price:Number,
    location:String,
    country:String
});

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;