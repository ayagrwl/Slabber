const path = require('path');
const express = require('express');
const app = express();

app.get('/admin', (req, res, next) => {
    res.sendFile(path.join(__dirname+'/../template/admin.html'));
});

module.exports = {
    socket: function(io) {
        io.of(/^\/admin\/\d+$/).on('connection', (socket) => {
            console.log('fuck! admin is here!');
        });
    },
    app: app
}