const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    username: {type: String, unique: true, default: ''},
    fullname: {type: String, default: ''},
    email: {type: String, unique: true},
    password: {type: String, default: ''},
    gender: {type: String, default: ''},
    country: {type: String, default: ''},
    sentRequest: [{
        username: {type: String, default: ''},
        sentAt: {type: Date, default: Date.now}
    }],
    receivedRequest: [{
        username: {type: String, default: ''},
        receivedAt: {type: Date, default: Date.now}
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
    }]
});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);