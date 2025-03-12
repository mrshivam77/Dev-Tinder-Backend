const cron=require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const {subDays, startOfDay, endOfDay}=require("date-fns");
const sendEmail=require("../utils/sendEmail");
cron.schedule("16 1 * * *",async ()=>{

    try {
        const yesterday=subDays(new Date(),1);
        const yesterdayStart=startOfDay(yesterday);
        const yesterdayEnd=endOfDay(yesterday);

        const pendingRequestyesterday=await ConnectionRequest.find({
            status:"interested",
            createdAt:{
                $gte:yesterdayStart,
                $lt:yesterdayEnd,
            }
        }).populate("fromUserId toUserId"); 
        const listOfEmails=[...new Set(pendingRequestyesterday.map(req=> req.toUserId.emailId))];
        console.log(listOfEmails);
        
        for(const email of listOfEmails){
            //send emails
            try{
                const body="I hope you’re doing well! I just wanted to gently follow up on the connection request I sent recently. I’d love to connect and stay in touch Looking forward to hearing from you!"
                const res=await sendEmail.run("NEW FRIEND REQUESTS ARE PENDING please accept "+email,body);
                console.log(res);
                
            } 
            catch(error){
                console.log(error);
                
            }
        }

    } catch (error) {
        console.log(error);
        
    }
})