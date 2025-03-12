const Razorpay=require("razorpay");

var instance=new Razorpay({
    key_id:process.env.RZR_KEY_ID,
    key_secret:process.env.RZR_SECRET_KEY,
})

module.exports=instance; 