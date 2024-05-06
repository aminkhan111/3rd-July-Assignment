const userModel =require("../model/userSchema");

 
const emailValidator = require("email-validator");



   

const signup = async(req, res, next) => {
const { name ,email ,password ,confirmPassword } = req.body;

console.log(name ,email ,password ,confirmPassword);

if (!name || !email || !password || !confirmPassword){
    return res.status(400).json({
        sucess: false,
        message: "Every Field is required"
    })
}

//validate email using npm package "email-validator"
const validEmail = emailValidator.validate(email);
if (!validEmail) {
  return res.status(400).json({
    success: false,
    message: "Please provide a valid email address 📩"
  });
}

    /// send password not match err if password !== confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm Password does not match ❌"
      });
    }

try{
    const userInfo = userModel(req.body);

    const result =await userInfo.save();
    
    return res.status(200).json({
        succuess: true,
        data: result
    });
}
catch(e) {
    if(e.code === 11000) {
        return res.status(400).json({
            sucess:false,
            message: 'Account already exist with provided email id'
        })
    }
return res.status(400).json({
    sucess:false,
    message:  e.message
       });
}

};

// ------------###################SIGNIN_#####################-------



const signin = async (req, res) => {

    const { email, password } =req.body;

if (!email || !password) {
    return res.status(400).json({
        sucess:false,
        message:  "email and password are required"
           });
}
 try{
    const user = await userModel.findOne({email}).select("+password");

    if (!user || user.password !== password)
    {
        return res.status(400).json({
            sucess:false,
            message:  "Invalid credential"
               });
    }

    const token = user.jwtToken();
    user.password =undefined;
    
    const cookieOption = {
        maxAge: 24 * 60 * 60 *1000,
        httpOnly: true
    };

    res.cookie("token", token, cookieOption);
res.status(200).json({
    sucess: true,
    data: user
});
 }
 catch(e){
    res.status(400).json({
        sucess: false,
        message: e.message
    });
 }
};
 //------------###################GetUser_#####################-------

 const getUser = async (req, res, next) => {
    const userId = req.user.id;

try{
    const user = await userModel.findById(userId);
    return res.status(200).json({
      success: true,
      data: user
    });
   }

   catch(e) {
    return res.status(400).json({
        sucess:false,
        message: e.message
    });
   }
 }
//    ---------###########--LOGOUT----#########

const logout = (req, res, next) => {
try{
    const cookieOption = {
        expires: new Date(), // current expiry date
        httpOnly: true //  not able to modify  the cookie in client side
      };

// return response with cookie without token
res.cookie("token", null, cookieOption);
res.status(200).json({
  success: true,
  message: "Logged Out"
});

}
catch(e){
    res.stats(400).json({
        success: false,
        message: error.message
      });
}


}
module.exports = { signup,signin,getUser,logout};