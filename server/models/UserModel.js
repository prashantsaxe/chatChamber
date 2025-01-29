
import bcrypt from "bcryptjs";
// const salt = await bcrypt.genSalt(10);
// const hashedPassword = await bcrypt.hash(password, salt);
// const isMatch = await bcrypt.compare(password, hashedPassword);

import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : [true ,"Email is required"],
        unique:true
    },
    password:{
        type : String,
        required : [true ,"Password is required"],
        unique:false
    },
    username:{
        type:String,
        required : [true, "userName is required"],
        unique : true,
    },
    firstname:{
        type : String,
        required : false,
        unique:false
    },
    lastname:{
        type : String,
        required : false ,
        unique:false
    },
    image : {
        type:String,
        required : false,
    },
    color : {
        type:Number,
        required : false,
    },
    profileSetup : {
        type:Boolean,
        required : false,
    }
});
userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

const User = mongoose.model("Users",userSchema);

export default User;
