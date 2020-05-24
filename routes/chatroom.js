const path = require('path');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/chatroom/:roomid', (req, res, next) => {
    var roomid = req.params.roomid;
    res.render('../template/chatroom.ejs', {room: roomid, roomname: 'Chat Room '+roomid});
});

app.get('/chat/:chatid', (req, res, next) => {
    var chatid = req.params.chatid;
    res.render('../template/chat.ejs', {chat: chatid, friendName: 'Friend'});
});

module.exports = {
    socket: function(io) {
        io.of(/^\/chatroom\/\d+$/).on('connection', (socket) => {
            socket.on('msg', (socket) => {
                console.log(socket);
                io.of('/chatroom/'+socket.id).emit('msg', socket.msg);
            });
        });
        io.of(/^\/chat\/\d+$/).on('connection', (socket) => {
            console.log("fuck yeah");
        })
    },
    app: app
}