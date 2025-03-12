const validator=require("validator")

const validateSignUpData=(req)=>{
    const {emailId,firstName,lastName,password}=req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a Strong Password")
    }
}

const validateLoginData=(req)=>{
    const{emailId}=req.body
    if(!validator.isEmail(emailId)){
        throw new Error(":Enter Valid email");
        
    }
}

const validateProfileData=(req)=>{
    const allowedFields=["firstName","lastName","photoUrl","about","gender","skills","age"];
    const isUpdateAllowed=Object.keys(req.body).every((field)=>allowedFields.includes(field));
    return isUpdateAllowed;
}

const validatePassword=(req)=>{
    const{currentPassword,newPassword}=req.body;
    if(!currentPassword || !newPassword){
        throw new Error("Enter Both Passwords");    
    }
    if(!validator.isStrongPassword(newPassword)){
        throw new Error("New Password is Not strong enough"); 
    }
    return true;
}

module.exports={
    validateSignUpData,validateLoginData,validateProfileData,validatePassword
}