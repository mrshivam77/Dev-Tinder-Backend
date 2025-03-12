require("dotenv").config();
const jwt=require("jsonwebtoken")
const User=require("../models/user")

const userAuth=async(req,res,next)=>{
  try {
    const {token}=req.cookies;
    if(!token){
      return res.status(401).send("Unauthorised User");
    }
 const decodedMessage=await jwt.verify(token,process.env.JWT_SECRET);
    const {_id}=decodedMessage;
    const user=await User.findById(_id);
    if(!user){
      throw new Error("User not Found");
    }
    req.user=user;
    next();

  } catch (error) {
    res.status(400).send("error"+error.message)
  }
}

module.exports={userAuth}