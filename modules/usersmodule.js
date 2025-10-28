
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
mongoose.set('strictQuery', true);
const Usersschema = new mongoose.Schema({
name : {
type : String,
required : [true , "plz enter your name"],
unique : [true , "this name was used before, enter another one"],
},
email : {
type : String,
unique:true,
required : [true , "plz enter your email"],
validate : [validator.isEmail , "plz enter a valid email"]
},
password : {
type : String,
required : [true , "plz enetr your password"],
minLenght : 8,
select: false
},
passconfirmation : {
type : String,
required : [true , "plz confirm your password"],
validate : {
    validator : function (passconfirmation) {
        return passconfirmation === this.password ; 
    },
    message : "confirmation password are not the same as the password"
}
},
passdate:{
 type: Date
},
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  passwordtokens:{
    type:String
  },
  passworddate:{
    type:Date
  },
photo:String,
active:{
  type:Boolean,
  default:true
}


});


Usersschema.pre("save" , async function(next){

 if(!this.isModified("password")) 
 return next();
 this.password = await bcrypt.hash(this.password , 12)
this.passconfirmation = undefined;

})

Usersschema.pre("save" , function(next){
  
if(this.isModified("password") )
return next();
this.passdate = Date.now() - 1000 ; 
  next();
});

Usersschema.pre(/^find/ , function(next){

this.find({active:true})
next()
})

Usersschema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
    
Usersschema.methods.createrresetpasstokens = function(){

const resetTokens = crypto.randomBytes(32).toString("hex");
  this.passwordtokens = crypto
    .createHash('sha256')
    .update(resetTokens)
    .digest('hex');
this.passworddate = Date.now() + 10 * 60 * 1000;


}


const Users = mongoose.model("Users" , Usersschema);

module.exports = Users;