const mongoose = require('mongoose');

var privateChatSchema = mongoose.Schema({
    person1 = {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    person2 = {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('PrivateChat', privateChatSchema);