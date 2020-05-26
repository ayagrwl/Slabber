const mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    message: {type: String},
    name: {type: String},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', messageSchema);