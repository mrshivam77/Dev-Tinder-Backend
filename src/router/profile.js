const express=require("express");
const {userAuth}=require("../middlewares/auth")
const{User, findByIdAndUpdate}=require("../models/user")
const profileRouter=express.Router();
const bcrypt=require("bcrypt")
const {validateProfileData,validatePassword}=require("../utils/validation")

// users profile
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{   
    const user=req.user;
    res.send(user);
    }
    catch(err){
        res.status(400).send(err.message);
    }
    
})

//update user by id
// profileRouter.patch("/user/:userId",userAuth,async(req,res)=>{ 
//     const userId=req.params.userId
//     const data=req.body;
//     try {
//         const allowed_updates=["photoUrl","skills","gender","about","age"]
//         const isUpdateAllowed=Object.keys(data).every((k)=> allowed_updates.includes(k))
//         if(!isUpdateAllowed){
//             throw new Error("Update not allowed")
//         }
//         await User.findByIdAndUpdate({_id:userId},data,{
//             returnDocument:"after",
//             runValidators:true

//             // returns the documnet after updating and by defualt its before
//         });
//         res.send("USER UPDATED SUCCESSFULLY")
//     } catch (err) {
//         res.status(400).send("Update not allowed"+err.message);   
//     }
// })

// Update profile
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try {
    const isUpdateAllowed=validateProfileData(req);
    if(!isUpdateAllowed){
        throw new Error("Invalid Update Request");    
    }
    const loggedInUser=req.user;
    Object.keys(req.body).forEach((key)=>req.user[key]=req.body[key])    
    await loggedInUser.save();
    res.json({
        message:`${loggedInUser.firstName}, YOUR PROFILE HAS BEEN UPDATED SUCCESSFULLY`,
        data:loggedInUser,
    })        
    } catch (error) {
        res.status(400).send("ERROR "+error.message);
    }
})

//update user password
profileRouter.patch("/profile/forgotPassword",userAuth,async(req,res)=>{
    try {
       const isnewPasswordValid= validatePassword(req);
       const {currentPassword,newPassword}=req.body;
       const isCurrentPasswordValid=await bcrypt.compare(currentPassword,req.user.password);
       if(!isCurrentPasswordValid){
        throw new Error("ENTER THE CORRECT CURRENT PASSWORD");
       }
    const loggedInUser=req.user;
       const hashedPassword=await bcrypt.hash(newPassword,10);
       loggedInUser.password=hashedPassword;
       await loggedInUser.save();
       res.send("password updated");

    } catch (error) {
        res.status(400).send("ERROR "+error);
    }

})


module.exports=profileRouter