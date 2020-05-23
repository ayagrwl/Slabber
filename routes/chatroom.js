const path = require('path');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/admin/:adminID', (req, res, next) => {
    var adminId = req.params.adminID;
    res.render('../template/admin.ejs', {admin: adminId});
});

module.exports = {
    socket: function(io) {
        io.of(/^\/admin\/\d+$/).on('connection', (socket) => {
            console.log('fuck! admin is here!');
            socket.emit('hemlo', 'fuck you');
            socket.on('hemlo', socket => {
                console.log(socket);
            });
            socket.on('msg', (socket) => {
                console.log(socket);
            })
        });
    },
    app: app
}