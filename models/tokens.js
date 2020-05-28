const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    username: {type: String, unique:true, required: true},
    email: {type: String, unique:true},
    token: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now, expires: 86400}
});

module.exports = mongoose.model('Token', tokenSchema);
