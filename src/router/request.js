const express=require("express");
const {userAuth}=require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");
const { findById } = require("../models/user");
const requestRouter=express.Router();
const sendEmail=require("../utils/sendEmail")
//api to send connection request
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{

    try {
         const toUserId=req.params.toUserId;
        const status=req.params.status;
        const fromUserId=req.user._id;
        const allowedStatus=[
            "ignored",
            "interested"
        ] 
        if(!allowedStatus.includes(status)){
            return  res.status(400).json({message:"Invalid status type "+status})
        }
        const isUserPresent=await User.findById(toUserId);
        if(!isUserPresent){
            return res.status(400).send("THe User YOu are tring to send Does not exisst");
        }
        const existingConnection=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingConnection){
            return res.status(400).send("Connection already exists")
        }
        const connectionRequest=new ConnectionRequest({
            toUserId,
            fromUserId,
            status, 
        });
        const data=await connectionRequest.save();    
        // const emailres=await sendEmail.run();      
        // console.log(emailres);
        
        res.json({
            message:req.user.firstName+" is "+status+" in "+isUserPresent.firstName,
            data,
        })
    } catch (error) {
        res.status(400).send("ERROR "+error.message)
    }

})
//spi to accpet or reject a connection request
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try {
        const {status,requestId}=req.params;
        const loggedInUser=req.user;
        const allowedStatus=["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid connection status"});
        }
        const connectionRequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        if(!connectionRequest){
            return res.status(400).json({message:"Invalid connection Request"})
        }
         connectionRequest.status=status;
         const data=await connectionRequest.save();
         res.status(200).json({message:"Connection Request has been "+status,
            data
          })
    } catch (error) {
        res.status(400).send("ERROR "+error)
    }
})
module.exports=requestRouter; 