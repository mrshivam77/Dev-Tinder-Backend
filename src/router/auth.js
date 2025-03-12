const express=require("express");
const {validateLoginData,validateSignUpData}=require("../utils/validation");
const bcrypt=require("bcrypt");
const User=require("../models/user");
const authRouter=express.Router();

// signup api
authRouter.post("/signup",async(req,res)=>{
    
    try {  
        validateSignUpData(req);
        const {emailId,firstName,lastName,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10);        
        const user = new User({
            emailId,
            firstName,
            lastName,
            password:hashedPassword

        });
        const savedUser=await user.save();
         const token=await savedUser.getJWT();
         res.cookie("token",token,{
            expires:new Date(Date.now()+    24*3600000),
         })

        res.status(200).json({message:"User added successfully",data:savedUser})     
    } catch (error) {
        // res.status(400).send("Error saving the User"+error.message);
        res.status(400).send("Error " + error.message);
    }
})

// login api
authRouter.post("/login",async(req,res)=>{
    try{
        validateLoginData(req);
        const {emailId,password}=req.body;
        const user=await User.findOne({emailId});
        if(!user){
            throw new Error("Invalid credentials"); 
        }
        const isPasswordValid=await user.validatePassword(password);
        if( isPasswordValid){
           const token=await user.getJWT();
            res.cookie("token",token,{
                expires:new Date(Date.now()+    24*3600000)
            });
            res.send(user);
        }
        else{ 
            throw new Error("Invalid credentials");
            
        }
    }
    catch(err){
        res.status(400).send("ERROR"+err.message)
    }
})

//logout api
authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{   
        expires:new Date(Date.now())
    });
    res.send("Logout Successful");
})
module.exports=authRouter
