const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type : 'string',
        required : [true,'Please tell us your name'],
    },
    email:{
        type: 'string',
        required: [true,'Please tell us your Email address'],
        unique : true,
        lowercase : true,
        validate:[validator.isEmail, ' Please provide a valid email']

    },
    photo:String,
    password:{
        type:String,
        required: [true,'Provide Password'],
        minlength: [8,'Password must be greater than 8']

    },
    passwordConfirm:{
        type:String,
        required: [true,'Please Confirm your Password'],
        validate: {
            //This only works on SAVE and CREATE
            validator: function(el){
                return el===this.password;
            },
            message: "Password are not same !!"
        }

    }
});

userSchema.pre('save', async function(next){
    // if it is not modified in DATABASE
    if(!this.isModified('password')) return next();
    
    // Hash the password with the cost of 12
    this.password=await bcrypt.hash(this.password,12);
    
    //Delete the passwordconfirm
    this.passwordConfirm= undefined;
    next();
});


const User =mongoose.model('User',userSchema);

module.exports=User;
