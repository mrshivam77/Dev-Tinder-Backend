const express=require("express")
const {userAuth}=require("../middlewares/auth")
const paymentRouter=express.Router();
const instance=require("../utils/razopay")
const Payment=require("../models/payments")
const {membershipAmount}=require("../utils/constants");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");
paymentRouter.post("/payment/create",userAuth,async (req,res)=>{
try {
    const {membershiptype}=req.body;
    const order= await instance.orders.create({
       amount:membershipAmount[membershiptype]*100, 
       currency:"INR",
       receipt:"rec#1",
       notes:{
           firstName:req.user.firstName,
           lastName:req.user.lastName,

           emailId:req.user.emailId,
           membershipType:membershiptype,
       },
    })
    const payment= new Payment({
        userId:req.user._id,
        orderId:order.id,
        status:order.status,
        amount:order.amount,
        currency:order.currency,
        receipt:order.receipt,
        notes:order.notes,
    })
    const savedPayment=await payment.save();
    
    res.json({...savedPayment.toJSON(),keyId:process.env.RZR_KEY_ID});
    
} catch (error) {
    return res.status(500).json({msg:error.message});
    
}


});

paymentRouter.post("/payment/webhook",async(req,res)=>{
    try{
        console.log("reached webhook");
        
        const webhookSignature=req.get("X-Razorpay-Signature");
        const isWebHookValid =validateWebhookSignature(
            JSON.stringify(req.body),
            webhookSignature,
            process.env.RZR_WEBHOOK_SECRET
        );

        if(!isWebHookValid){
            return res.status(400).send("WEBHOOK IS NOT VALID");
        }
        //if webhook is valid update payment status in Db
        // update the user as premium
        //return sucess response to razorpay
        
        const paymentDetails=req.body.payload.payment.entity;

        const payment=await Payment.findOne({
            orderId:paymentDetails.order_id
        })
        payment.status=paymentDetails.status;
        await payment.save();

    const user=await User.findOne({
    _id: payment.userId
    })
    user.isPremium=true;
    user.membershipType=payment.notes.membershipType;
    await user.save();
        // if(req.body.event==="payment.captured"){

        // }
        // if(req.body.event==="payment.failed"){

        // }

        res.status(200).json({msg:"Webhook received successfully"})

    }
    catch(error){
        console.log(error);
        
    }
})



module.exports=paymentRouter;