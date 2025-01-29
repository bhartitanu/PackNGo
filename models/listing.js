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
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8tstiGqc3KpvMpaHIm01QZuohVnmixq97EQ&s",
        set:(v)=> v===""? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8tstiGqc3KpvMpaHIm01QZuohVnmixq97EQ&s": v
    },
    price:Number,
    location:String,
    country:String
});

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;