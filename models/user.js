// This File Stores User details.

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
    username: {type:String, unique:true},
    fullname: {type:String, default:"Slabber User"},
    email: {type:String, unique:true},
    isVerified: {type: Boolean, default: false},
    password: {type:String, default:''},
    gender: {type:String, default:''},
    country: {type: String, default: ''},
    sentRequest: [{
        username: {type: String, default: ''}
    }],
    friendsList: [{
        friendId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        friendName: {type: String, default: ''}
    }],
    chatRoomList: [{
        roomId: {type: mongoose.Schema.Types.ObjectId, ref: 'Chatroom'},
        roomName: {type: String, default: ''}
    }],
    privateChats: [{
        chatId: {type: mongoose.Schema.Types.ObjectId, ref: 'PrivateChat'},
        friendName: {type: String, default: ''}
    }],
    //userImage: {type:String, default:'default.png'},
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