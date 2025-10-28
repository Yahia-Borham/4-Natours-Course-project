const mongoose = require("mongoose");
const Users = require("./usersmodule");

mongoose.set('strictQuery', true);

const tourschema = new mongoose.Schema({
name:{
  type:String,
  required:[true , "a tour must have a name"],
  unique:true,
  trim:true,
  maxlength:[40 , "MAX LENGHT EXCEEDS"],
  minlength:[10 , "MIN LENGHT BELOW"]
},
duration:{
  type:Number,
  required:[true , "a tour must have a duration"]
},
maxGroupSize:{
  type:Number,
  required:[true , "a tour must have a maxGroupSize"]
},
difficulty:{
    type:String,
  required:[true , "a tour must have a difficulty"],
  enum:{
    values:["easy" , "medium" , "difficult"],
    message:["easy or normal or hard"]
  },
  
},
ratingsAverage:{
    type:Number,
    default:4.5,
    min:[1 , "1 is the minimum"],
    max:[5,"5 is the maximum"],
    set: val => Math.round(val  *10) / 10
},
ratingsQuantity:{
    type:Number,
    default:0
},
summary:{
     type:String,
    trim:true,
     required :[true , "a tour must have a summary"]
},
description:{
  type:String,
    trim:true
},
imageCover:{
  type:String,
   required :[true , "a tour must have an imageCover"]
},
images:[String],
price:{
    type:Number,
  required :[true , "a tour must have a price"],
},
createdAt:{
  type:Date,
  default:Date.now(),
},
startDates:[Date],

rating:{
    type:Number,
      default:0.0
},
secrettours:{
  type:Boolean,
  default:false
},
startLocation:{
type:{
 type:String,
 defaultL:"Point",
},
coordinates:[Number],
address:String,
description:String
},
locations:[{
type:{
  type:String,
  default:"Point",
},
coordinates:[Number],
address:String,
description:String
}],
guides:[{
type:mongoose.Schema.ObjectId,
ref:"Users"
}]


});

tourschema.index({ startLocation: '2dsphere' });
tourschema.index({price:1 , ratingsAverage:-1});

tourschema.pre( /^find/  ,   function(  next){

this.find( {secrettours : { $ne : true}} );
this.start = Date.now();
next();

})

tourschema.pre(/^find/ , function(){
  this.populate({
    path:"guides",
    select:"-__v"
  })
})

tourschema.virtual("reviews" , {
ref:"Reviews",
foreignField:"tour",
localField:"_id"
})
/*tourschema.pre("save" , async function(){
const userGuides =  this.guides.map( async id => await Users.findOne({_id : id}));
const guidesSchema = await Promise.all(userGuides);
this.guides = guidesSchema;
})
*/

tourschema.pre( "aggregate" ,  function(  next){

this.pipeline().unshift(
  {
    $match:
    {
      secrettours:{ $ne : true}
    }
  }
)

next();

})

tourschema.post( /^find/  ,   function( doc ,  next){

console.log(doc)
console.log(` time now after post middleware is ${Date.now() - this.start }   `)
next();

})




const Tour = mongoose.model( "Tour", tourschema);
module.exports = Tour;