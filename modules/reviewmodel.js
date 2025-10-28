


const mongoose = require("mongoose");
const Tour = require("./tourmodule");
const reviewsSchema = new mongoose.Schema({

    review:{
        type:String,
        required:[true,"plz enter a review"]
    },
    rating:{
        type:Number,
        max:[10,"plz enter a number between 0 to 10"],
        min:[0 ,"plz enter a number between 0 to 10"]
    },
    createdAt:{
        type:Date
    },
    tour:{
     type:mongoose.Schema.ObjectId,
     ref:"Tour"
    },
    user:{
  type:mongoose.Schema.ObjectId,
     ref:"Users"
    }



});


reviewsSchema.statics.averageRatings = async function(tourId){

 const groupedData = await this.aggregate([
{
    $match:{
        tour:tourId
    }
},
{
    $group:{
_id:"$tour",
ratingsNumber:{$sum:1},
ratingsAverage:{$avg:"$rating"}
    }
}
]);

if(groupedData.lenght > 0){
await Tour.findByIdAndUpdate(tourId , {
    ratingsQuantity:groupedData[0].ratingsNumber
}) 
await Tour.findByIdAndUpdate(tourId , {
    ratingsAverage:groupedData[0].ratingsAverage
}) 
}else{
  await Tour.findByIdAndUpdate(tourId , {
    ratingsQuantity:0
}) 
await Tour.findByIdAndUpdate(tourId , {
    ratingsAverage:0  
})
}
}

 reviewsSchema.index({tour:1 , user:1} , {unique:true})
 reviewsSchema.pre("find" , function(){

this.populate({
 path:"user",
 select:"name photo"
});
/*
this.populate({
 path:"tour",
  select:"name"
});
*/

})

reviewsSchema.pre("save" , function(next){
    this.createdAt = Date.now();
    next();
})

reviewsSchema.post("save" , function(){
    this.constructor.averageRatings(this.tour)
})

reviewsSchema.post(/^findOneAnd/ , function(doc){
    doc.constructor.averageRatings(doc.tour);
})


const Reviews = mongoose.model('Reviews' , reviewsSchema);
module.exports = Reviews;