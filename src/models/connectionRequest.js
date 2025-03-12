const mongoose=require("mongoose")
const connectionRequestSchema=new mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.SchemaTypes.ObjectId,
            ref:"User",
            required:true,
        },
        toUserId:{
            type:mongoose.SchemaTypes.ObjectId,
            required:true,
            ref:"User",
        },
        status:{
            type:String,
            required:true,
            enum:{
                values:["ignored","accepted","rejected","interested"],
                message:`{VALUE} is incorrect status type`
            },
        }

},
{
    timestamps:true,
}
);

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId)){
        throw new Error("Cannot send connection request to YOurself")
    }
    next();
})

connectionRequestSchema.index({fromUserId:1,toUserId:1});
const connectionRequestModel=new mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports=connectionRequestModel;