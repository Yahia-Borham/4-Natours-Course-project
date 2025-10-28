
const jwt = require("jsonwebtoken");
const Users = require("./../modules/usersmodule");
const catchasync = require("./../utilities/catchAsync");
const Upgradederror = require("./../utilities/apperror");
const sendEmail = require("./../utilities/sendMail");
const {promisify} = require("util");
const crypto = require("crypto");

const generate_signature = id =>{

   return jwt.sign({id:id} , process.env.JWT_SECRET , {expiresIn:process.env.JWT_EXPIRES_IN});

}



const signup = async (req , res , next) =>{

   const signupdata = await Users.create(req.body);
  

   const signature =generate_signature(signupdata._id);

res.status(201).json({
  status:"Signup successfully",
  signature:signature,
  data:signupdata
})

    

   

}

const login = catchasync( async (req , res , next) =>{

const {email , password}  = req.body;
if(email && password){
const currentuser =  await Users.findOne({email:email}).select("+password");
if(currentuser){
const result =  await currentuser.correctPassword(password , currentuser.password);
if(result){
  const signature = generate_signature(currentuser._id);


res.status(200).json({
  status:"loged successfully",
  signature:signature,
  data:currentuser
})
}else
  return next(new Upgradederror("wrong Password" , 404));
}else
  return next(new Upgradederror("wrong email" , 404));
}else
return next(new Upgradederror("Email or Password are undefined" , 404));

})



const autho =   async(req , res , next) =>{

let usersignature ;

if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
 usersignature = req.headers.authorization.split(" ")[1];
}
 if (!usersignature) {
    return next(
      new Upgradederror('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(usersignature, process.env.JWT_SECRET );
let currentuser;
if(decoded){
 currentuser =  await Users.findOne({_id:decoded.id});
if(!currentuser)
return next(new Upgradederror("This account was deleted"));
}else{
return next(new Upgradederror("plz sign up or login frist"));s
}
req.user = currentuser;
next();

}


  const verifyRole = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new Upgradederror('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

   const forgetPass = async (req , res , next) =>{

  const unsignedUser = await Users.findOne({email:req.body.email});
  if(!unsignedUser)
  return next(new Upgradederror("plz enter a valied email" , 404));

  unsignedUser.createrresetpasstokens();
  await unsignedUser.save({ validateBeforeSave: false });
 res.status(200).json({
      status: 'success',
      message: `your Token ${unsignedUser.passwordtokens} sent to email!, plz update your pass before 10 minutes`
    });
    /*
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${ unsignedUser.passwordtokens}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: unsignedUser.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    unsignedUser.passwordtokens = undefined;
    unsignedUser.passworddate = undefined;
    await unsignedUser.save({ validateBeforeSave: false });

    return next(
      new Upgradederror('There was an error sending the email. Try again later!'),
      500
    );
  }
*/
}


const resetpass = async (req , res , next) =>{

 const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.passtoken)
    .digest('hex');
console.log(hashedToken);
const currentUser = await Users.findOne({
    passwordtokens: req.params.passtoken,
    passworddate: { $gt: Date.now() }
  });  if(!currentUser){
  return next(new Upgradederror("your current token is not valied or expired , plz reset password again" , 400));
  }
 currentUser.passwordtokens = undefined;
  currentUser.passworddate = undefined;
  currentUser.password = req.body.password;
  currentUser.passconfirmation = req.body.passconfirmation;
 await currentUser.save();
const signature  = generate_signature(currentUser._id);


res.status(200).json({
  status:"succesful password reset",
  signature : signature
});

}





   module.exports = {
  signup : signup,
  login:login,
  autho:autho,
  verifyRole:verifyRole,
  forgetPass:forgetPass,
  resetpass:resetpass,
   }
