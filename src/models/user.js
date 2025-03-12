    const mongoose=require("mongoose")

    const jwt=require("jsonwebtoken")
    const validator=require("validator")
    const bcrypt=require("bcrypt")
    const userSchema=new mongoose.Schema({
        firstName:{
            type:String,
            required:true,
            maxLength:50,
            trim:true,
        },
        lastName:{
            type:String,
            minLength:2,
            maxLength:50,
            trim:true,
        },
        emailId:{
            type:String,
            unique:true,
            index:true,
            required:true,
            trim:true,
            lowercase:true, 
            validate(v){
                if(!validator.isEmail(v)){
                    throw new Error("Invalid Email"+value);
                }
            }
        },
        password:{
            type:String,
            required:true,
            trim:true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Enter a Strong Password");
                    
                }
            }
        },
        age:{
            type:Number ,
            min:18,
            max:70,
        },
        gender:{
            type:String,
            validate(value){
                if(!["male","female","others"].includes(value)){
                    throw new Error("Gender data is not valid")
                }
            }
        },
        photoUrl:{
            type:String,
            default:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid  url");  
                }
            }
            
        },
        about:{
            type:String,
            default:"This is default information about user",
            maxLength:100,
        },
        skills:{
            type:[String],
            validate(v){
                if(v.length>10){
                    throw new Error("SKILLS CAN HAVE ATMOST 10")
                }
            }
        },
        isPremium:{
            type:Boolean,
            default:false,
            
        },
        membershipType:{
            type:String
        },
        membershipValidity:{
            type:Date
        }
    },{
        timestamps:true
    });

    userSchema.index({firstName:1,lastName:1})
    userSchema.methods.getJWT=async function(){
        const user=this;
        const token=await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:"1d",
        })
        return token;
    }

    userSchema.methods.validatePassword=async function(passwordinputbyuser){
        const user=this;
        const passwordHash=user.password
        const isPasswordValid=await bcrypt.compare(
            passwordinputbyuser,
            passwordHash
        )
        return isPasswordValid;
    }

    module.exports=mongoose.model("User",userSchema);