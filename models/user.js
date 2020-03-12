// This File Stores User details.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    username: {type:String, unique:true},
    fullname: {type:String, default:"Slabber User"},
    email: {type:String, unique:true},
    password: {type:String, default:''},
    userImage: {type:String, default:'default.png'},
    facebook: {type:String, default:''},
    fbtokens: Array,
    google: {type:String, default:''},
    googleTokens: Array
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null)
};
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password,this.password);
}


module.exports = mongoose.model('User', userSchema);