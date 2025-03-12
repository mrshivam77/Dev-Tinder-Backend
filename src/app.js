 const express=require("express");
 const cookieparser=require("cookie-parser")
const connectDb=require("./config/database")
const cors=require("cors")
const app=express();
 require("dotenv").config();

 require("./utils/cronjobs");

const User=require("./models/user")


app.use(cors({
    origin: "https://dev-tinder-frontend-xi.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(cookieparser());


const authRouter=require("./router/auth")
const profileRouter=require("./router/profile")
const requestRouter=require("./router/request")
const userRouter=require("./router/user")
const paymentRouter=require("./router/payment");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter);

//calling the function of database connection
connectDb()
.then(async ()=>{ 
    await User.createIndexes();
    console.log("Database Connected");
    app.listen(7777,()=>{
        console.log(`Server is running on PORT ${process.env.PORT}`);
        
    })
    
})
.catch((err)=>{
    console.log("Database is not connected",err);
    
})
 










