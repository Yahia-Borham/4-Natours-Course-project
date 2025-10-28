
const fs = require("fs");
const { json } = require("stream/consumers");
const Upgradederror = require("../utilities/apperror");
const catchasync = require("./../utilities/catchAsync");
const factoryFunctions = require("./factoryFunctions");
const Users = require("./../modules/usersmodule");
const jwt = require("jsonwebtoken");



  



const generate_signature = id =>{

   return jwt.sign({id:id} , process.env.JWT_SECRET , {expiresIn:process.env.JWT_EXPIRES_IN});

}


 const updateUserPass = async (req , res , next) =>{

const user = await Users.findOne({name:req.user.name}).select("+password");
const currentPass = req.body.currentpass ; 
const userPassword = user.password; 
 if (!(await user.correctPassword(currentPass, userPassword))) {
    return next(new Upgradederror('Your current password is wrong.', 401));
  }
user.password = req.body.password;
user.passconfirmation = req.body.passconfirmation ; 
user.save();

const signature = generate_signature(user._id);

     res.status(200).json({
     message : "successful Signup",
    signature:signature,
    Data : user
})

}

const updateUserData = async (req , res , next) =>{

  if(req.body.password || req.body.passconfirmation)
    return next( new Upgradederror(" this section for name and email update only" , 400));
const updateduser = await Users.findByIdAndUpdate(req.user.id , {
  name:req.body.name,
  email: req.body.email ,
} , {
  new: true,
  runValidators: true
});

res.status(200).json({
  status:"succes",
  data:updateduser
})

}



const deleteUserCompletely = factoryFunctions.deleteOneThing(Users);
const updateUser = factoryFunctions.updateOneThing(Users);
const deleteUser = async (req , res , next) => {

const deleteduser = await Users.findOneAndUpdate({_id:req.user.id} , {
  active:false
});
res.status(204).json({
  status:"succes",
})

}

const getOneUser =  factoryFunctions.getOneThing(Users);
const getAllUsers = factoryFunctions.getManyThings(Users);





const post_tour = (req , res) =>{

 const incomdata =  req.body;
const idv = (tourdata[tourdata.length -1].id) + 1
const newtour = Object.assign({id :idv },incomdata);
tourdata.push(newtour);

fs.writeFile("./dev-data/data/tours-simple.json" , JSON.stringify(tourdata) , err =>{

res.status(201).json({
staus:"succes",
updatedtours:tourdata
});

})

}

const patch_tour = (req , res) =>{

const idnum =  parseInt(req.params.id);
if(idnum <= tourdata.length - 1){
res.status(201).json({
  status:"succes",
  data:{tour:"tour" +` ${idnum} `+ "updated successfully"}
})
}

}

const delete_tour = (req , res) =>{

const idnum =  parseInt(req.params.id);
if(idnum <= tourdata.length - 1){
res.status(204).json({
  status:"succes",
  data:null
})
}

}

module.exports = {
post_tour:post_tour,
patch_tour:patch_tour,
delete_tour:delete_tour,
updateUserPass:updateUserPass,
updateUserData:updateUserData,
deleteUser:deleteUser,
deleteUserCompletely:deleteUserCompletely,
updateUser:updateUser,
getOneUser:getOneUser,
getAllUsers:getAllUsers
}
