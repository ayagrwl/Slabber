const mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    name: {type: String},
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now},
    memberList: [{
        memberId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        memberName: {type: String, default: ''}
    }],
    messages: [{
        message: {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
    }]
});

module.exports = mongoose.model('Chatroom', groupSchema);